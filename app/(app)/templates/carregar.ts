import 'server-only'
import type { FotoDaGaleria, LogoDoClube } from '@/components/templates/tipos-do-editor'
import { BALDE_DAS_IMAGENS } from '@/lib/imagens'
import { BALDE_DOS_LOGOS } from '@/lib/logos'
import { clienteDoServidor } from '@/lib/supabase/servidor'

/** 1 hora, como na galeria: dá tempo de montar e publicar; quem passar disso recarrega a página. */
const VALIDADE_DA_URL = 60 * 60
const LIMITE_DE_FOTOS = 500

/** As fotos da galeria e as versões do logo, com URL assinada, para o wizard e o editor. */
export async function carregarFotosELogos(): Promise<{ fotos: FotoDaGaleria[]; logos: LogoDoClube[]; erro: boolean }> {
  const supabase = await clienteDoServidor()
  const [imagens, logos] = await Promise.all([
    supabase.from('imagens').select('id, caminho, nome, etiquetas').order('criado_em', { ascending: false }).limit(LIMITE_DE_FOTOS),
    supabase.from('logos').select('id, caminho, nome, principal').order('principal', { ascending: false }).order('criado_em', { ascending: false }),
  ])
  if (imagens.error) console.error('templates: não leu as imagens', imagens.error)
  if (logos.error) console.error('templates: não leu os logos', logos.error)

  // uma chamada de assinatura por balde; o navegador baixa direto do Storage
  async function assinar(balde: string, caminhos: string[]) {
    const urls = new Map<string, string>()
    if (!caminhos.length) return urls
    const { data } = await supabase.storage.from(balde).createSignedUrls(caminhos, VALIDADE_DA_URL)
    data?.forEach((a) => { if (a.path && a.signedUrl) urls.set(a.path, a.signedUrl) })
    return urls
  }
  const [urlsDasFotos, urlsDosLogos] = await Promise.all([
    assinar(BALDE_DAS_IMAGENS, (imagens.data ?? []).map((i) => i.caminho)),
    assinar(BALDE_DOS_LOGOS, (logos.data ?? []).map((l) => l.caminho)),
  ])

  return {
    erro: Boolean(imagens.error || logos.error),
    fotos: (imagens.data ?? []).flatMap((i) => {
      const url = urlsDasFotos.get(i.caminho)
      return url ? [{ id: i.id, nome: i.nome, etiquetas: i.etiquetas ?? [], url }] : []
    }),
    logos: (logos.data ?? []).flatMap((l) => {
      const url = urlsDosLogos.get(l.caminho)
      return url ? [{ id: l.id, nome: l.nome, principal: l.principal, url }] : []
    }),
  }
}
