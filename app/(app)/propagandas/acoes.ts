'use server'
import { revalidatePath } from 'next/cache'
import { templatePorId } from '@/components/templates'
import { limparValores, txt } from '@/components/templates/motor'
import { tipoPelosBytes } from '@/lib/imagens'
import { BALDE_DAS_PROPAGANDAS, LIMITE_DA_PROPAGANDA, extensaoDaPropaganda } from '@/lib/propagandas'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import type { Retorno } from '../acoes'

export type RetornoSalvar = { ok: true; id: string } | { ok: false; erro: string }

const medida = (v: FormDataEntryValue | null) => {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 && n < 100_000 ? n : null
}

/**
 * Salva a arte gerada no editor na galeria de propagandas, junto com os valores do formulário (já
 * limpos pelo template, para reabrir como cópia). Se o registro falhar, o arquivo sai do Storage.
 */
export async function salvarPropaganda(dados: FormData): Promise<RetornoSalvar> {
  const supabase = await clienteDoServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, erro: 'Sessão expirada. Entre de novo.' }

  const t = templatePorId(String(dados.get('template') ?? ''))
  if (!t) return { ok: false, erro: 'Template desconhecido.' }

  const arquivo = dados.get('arquivo')
  if (!(arquivo instanceof File) || arquivo.size === 0) return { ok: false, erro: 'A arte não chegou. Tente de novo.' }
  if (arquivo.size > LIMITE_DA_PROPAGANDA) return { ok: false, erro: 'A arte passou de 5 MB. Tente fotos menores.' }
  const bytes = new Uint8Array(await arquivo.arrayBuffer())
  const tipo = tipoPelosBytes(bytes)
  if (tipo !== 'image/png' && tipo !== 'image/jpeg') return { ok: false, erro: 'A arte precisa ser PNG ou JPG.' }

  let bruto: unknown = null
  try { bruto = JSON.parse(String(dados.get('valores') ?? '{}')) } catch {}
  const valores = limparValores(t, bruto)
  const titulo = txt(valores, 'titulo').replace(/\s+/g, ' ').trim()
  const nome = `${t.nome}${titulo ? ` · ${titulo}` : ''}`.slice(0, 120)

  const id = crypto.randomUUID()
  const caminho = `${user.id}/${id}.${extensaoDaPropaganda(tipo)}`
  const envio = await supabase.storage.from(BALDE_DAS_PROPAGANDAS)
    .upload(caminho, bytes, { contentType: tipo, cacheControl: '31536000', upsert: false })
  if (envio.error) {
    console.error('propagandas: não subiu o arquivo', envio.error)
    return { ok: false, erro: 'Não consegui salvar a arte. Tente de novo.' }
  }

  const { error } = await supabase.from('propagandas').insert({
    id, usuario_id: user.id, template: t.id, nome, caminho, tipo, tamanho: bytes.length,
    largura: medida(dados.get('largura')) ?? t.largura * 2, altura: medida(dados.get('altura')) ?? t.altura * 2,
    valores,
  })
  if (error) {
    console.error('propagandas: não gravou o registro', error)
    await supabase.storage.from(BALDE_DAS_PROPAGANDAS).remove([caminho])
    return { ok: false, erro: 'Não consegui registrar a arte. Tente de novo.' }
  }

  revalidatePath('/propagandas')
  return { ok: true, id }
}

/** Só quem salvou apaga (a policy confere); o registro sai primeiro, depois o arquivo. */
export async function excluirPropaganda(id: string): Promise<Retorno> {
  const supabase = await clienteDoServidor()
  const { data, error } = await supabase.from('propagandas').delete().eq('id', id).select('caminho')
  if (error) {
    console.error('propagandas: não excluiu', error)
    return { ok: false, erro: 'Não consegui excluir a propaganda. Tente de novo.' }
  }
  if (!data?.length) return { ok: false, erro: 'Só quem salvou a propaganda pode excluí-la.' }
  const { error: erroArquivo } = await supabase.storage.from(BALDE_DAS_PROPAGANDAS).remove(data.map((d) => d.caminho))
  if (erroArquivo) console.error('propagandas: o registro saiu, mas o arquivo ficou', erroArquivo)
  revalidatePath('/propagandas')
  return { ok: true }
}
