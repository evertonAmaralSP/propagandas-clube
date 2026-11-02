'use server'
import { revalidatePath } from 'next/cache'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import {
  BALDE_DAS_IMAGENS, LIMITE_DA_IMAGEM, LIMITE_DO_NOME, extensaoDoTipo, lerEtiquetas, nomeDoArquivo, tipoPelosBytes,
} from '@/lib/imagens'

export type RetornoEnvio = { ok: true; id: string } | { ok: false; erro: string }
export type Retorno = { ok: true } | { ok: false; erro: string }

const medida = (v: FormDataEntryValue | null) => {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 && n < 100_000 ? n : null
}

/**
 * Uma foto por chamada: a tela de envio chama em sequência, e cada pedido fica abaixo dos 6 MB
 * da função do Netlify. O arquivo vai para <usuario_id>/<id>.<ext>; se o registro falhar, o
 * arquivo sai do Storage para não sobrar órfão.
 */
export async function enviarImagem(dados: FormData): Promise<RetornoEnvio> {
  const supabase = await clienteDoServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, erro: 'Sessão expirada. Entre de novo.' }

  const arquivo = dados.get('arquivo')
  if (!(arquivo instanceof File) || arquivo.size === 0) return { ok: false, erro: 'Escolha uma imagem.' }
  if (arquivo.size > LIMITE_DA_IMAGEM) return { ok: false, erro: 'A imagem passa de 5 MB. Reduza e tente de novo.' }
  const bytes = new Uint8Array(await arquivo.arrayBuffer())
  const tipo = tipoPelosBytes(bytes)
  if (!tipo) return { ok: false, erro: 'Use uma imagem PNG, JPG ou WebP.' }

  const nome = String(dados.get('nome') ?? '').trim().replace(/\s+/g, ' ').slice(0, LIMITE_DO_NOME) || nomeDoArquivo(arquivo.name)
  const etiquetas = lerEtiquetas(String(dados.get('etiquetas') ?? ''))
  const id = crypto.randomUUID()
  const caminho = `${user.id}/${id}.${extensaoDoTipo(tipo)}`

  const envio = await supabase.storage.from(BALDE_DAS_IMAGENS)
    .upload(caminho, bytes, { contentType: tipo, cacheControl: '31536000', upsert: false })
  if (envio.error) {
    console.error('imagens: não subiu o arquivo', envio.error)
    return { ok: false, erro: 'Não consegui enviar a imagem. Tente de novo.' }
  }

  const { error } = await supabase.from('imagens').insert({
    id, usuario_id: user.id, caminho, nome, etiquetas, tipo, tamanho: bytes.length,
    largura: medida(dados.get('largura')), altura: medida(dados.get('altura')),
  })
  if (error) {
    console.error('imagens: não gravou o registro', error)
    await supabase.storage.from(BALDE_DAS_IMAGENS).remove([caminho])
    return { ok: false, erro: 'Não consegui registrar a imagem. Tente de novo.' }
  }

  revalidatePath('/galeria')
  return { ok: true, id }
}

/** Só quem enviou apaga (a policy confere); o registro sai primeiro, depois o arquivo. */
export async function excluirImagem(id: string): Promise<Retorno> {
  const supabase = await clienteDoServidor()
  const { data, error } = await supabase.from('imagens').delete().eq('id', id).select('caminho')
  if (error) {
    console.error('imagens: não excluiu', error)
    return { ok: false, erro: 'Não consegui excluir a imagem. Tente de novo.' }
  }
  if (!data?.length) return { ok: false, erro: 'Só quem enviou a imagem pode excluí-la.' }
  const { error: erroArquivo } = await supabase.storage.from(BALDE_DAS_IMAGENS).remove(data.map((d) => d.caminho))
  if (erroArquivo) console.error('imagens: o registro saiu, mas o arquivo ficou', erroArquivo)
  revalidatePath('/galeria')
  return { ok: true }
}
