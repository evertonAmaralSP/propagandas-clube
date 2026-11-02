'use server'
import { revalidatePath } from 'next/cache'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import { LIMITE_DA_IMAGEM, LIMITE_DO_NOME, nomeDoArquivo } from '@/lib/imagens'
import { BALDE_DOS_LOGOS, conferirPng } from '@/lib/logos'
import type { Retorno } from '../acoes'

const medida = (v: FormDataEntryValue | null) => {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 && n < 100_000 ? n : null
}

/**
 * Um logo por chamada, em <id>.png. O primeiro logo do clube já entra como principal. Se o
 * registro falhar, o arquivo sai do Storage para não sobrar órfão.
 */
export async function enviarLogo(dados: FormData): Promise<Retorno> {
  const supabase = await clienteDoServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, erro: 'Sessão expirada. Entre de novo.' }

  const arquivo = dados.get('arquivo')
  if (!(arquivo instanceof File) || arquivo.size === 0) return { ok: false, erro: 'Escolha um PNG.' }
  if (arquivo.size > LIMITE_DA_IMAGEM) return { ok: false, erro: 'O logo passa de 5 MB. Reduza e tente de novo.' }
  const bytes = new Uint8Array(await arquivo.arrayBuffer())
  const conferencia = conferirPng(bytes)
  if (!conferencia.ok) {
    return {
      ok: false,
      erro: conferencia.motivo === 'nao-png'
        ? 'O logo precisa ser um arquivo PNG.'
        : 'Esse PNG não tem fundo transparente. Exporte de novo com transparência.',
    }
  }

  const nome = String(dados.get('nome') ?? '').trim().replace(/\s+/g, ' ').slice(0, LIMITE_DO_NOME) || nomeDoArquivo(arquivo.name)
  const id = crypto.randomUUID()
  const caminho = `${id}.png`

  const envio = await supabase.storage.from(BALDE_DOS_LOGOS)
    .upload(caminho, bytes, { contentType: 'image/png', cacheControl: '31536000', upsert: false })
  if (envio.error) {
    console.error('logos: não subiu o arquivo', envio.error)
    return { ok: false, erro: 'Não consegui enviar o logo. Tente de novo.' }
  }

  const { count } = await supabase.from('logos').select('id', { count: 'exact', head: true }).eq('principal', true)
  const registro = {
    id, usuario_id: user.id, caminho, nome, tamanho: bytes.length,
    largura: medida(dados.get('largura')), altura: medida(dados.get('altura')),
  }
  let { error } = await supabase.from('logos').insert({ ...registro, principal: !count })
  // dois envios ao mesmo tempo num clube sem logo: o segundo entra sem a marca de principal
  if (error?.code === '23505') ({ error } = await supabase.from('logos').insert({ ...registro, principal: false }))
  if (error) {
    console.error('logos: não gravou o registro', error)
    await supabase.storage.from(BALDE_DOS_LOGOS).remove([caminho])
    return { ok: false, erro: 'Não consegui registrar o logo. Tente de novo.' }
  }

  revalidatePath('/logo')
  return { ok: true }
}

export async function tornarPrincipal(id: string): Promise<Retorno> {
  const supabase = await clienteDoServidor()
  const { error } = await supabase.rpc('definir_logo_principal', { alvo: id })
  if (error) {
    console.error('logos: não trocou a principal', error)
    return { ok: false, erro: 'Não consegui marcar como principal. Tente de novo.' }
  }
  revalidatePath('/logo')
  return { ok: true }
}

/** O registro sai primeiro, depois o arquivo. Se era a principal, a versão mais nova assume. */
export async function excluirLogo(id: string): Promise<Retorno> {
  const supabase = await clienteDoServidor()
  const { data, error } = await supabase.from('logos').delete().eq('id', id).select('caminho, principal')
  if (error) {
    console.error('logos: não excluiu', error)
    return { ok: false, erro: 'Não consegui excluir o logo. Tente de novo.' }
  }
  if (!data?.length) return { ok: false, erro: 'Esse logo já tinha sido excluído.' }

  const { error: erroArquivo } = await supabase.storage.from(BALDE_DOS_LOGOS).remove(data.map((d) => d.caminho))
  if (erroArquivo) console.error('logos: o registro saiu, mas o arquivo ficou', erroArquivo)

  if (data[0].principal) {
    const { data: proximo } = await supabase.from('logos').select('id')
      .order('criado_em', { ascending: false }).limit(1).maybeSingle()
    if (proximo) {
      const { error: erroPrincipal } = await supabase.rpc('definir_logo_principal', { alvo: proximo.id })
      if (erroPrincipal) console.error('logos: não passou a principal adiante', erroPrincipal)
    }
  }

  revalidatePath('/logo')
  return { ok: true }
}
