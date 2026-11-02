import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { BALDE_DAS_IMAGENS, type Imagem, type TipoDaImagem } from '@/lib/imagens'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import { Galeria } from './galeria'
import g from './galeria.module.css'

export const metadata = { title: 'Galeria' }
export const dynamic = 'force-dynamic'

/** As URLs assinadas valem 1 hora: quem deixa a aba aberta mais que isso recarrega a página. */
const VALIDADE_DA_URL = 60 * 60
const LIMITE_DA_LISTA = 500

export default async function PaginaGaleria() {
  const supabase = await clienteDoServidor()
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('imagens')
    .select('id, usuario_id, caminho, nome, etiquetas, tipo, tamanho, largura, altura, criado_em')
    .order('criado_em', { ascending: false })
    .limit(LIMITE_DA_LISTA)
  if (error) console.error('galeria: não leu as imagens', error)
  const linhas = data ?? []

  // uma chamada só para todas as URLs; o navegador baixa direto do Storage, sem passar pela função
  const urls = new Map<string, string>()
  if (linhas.length) {
    const { data: assinadas } = await supabase.storage.from(BALDE_DAS_IMAGENS)
      .createSignedUrls(linhas.map((l) => l.caminho), VALIDADE_DA_URL)
    assinadas?.forEach((a) => { if (a.path && a.signedUrl) urls.set(a.path, a.signedUrl) })
  }

  const imagens: Imagem[] = linhas.map((l) => ({
    id: l.id, nome: l.nome, etiquetas: l.etiquetas ?? [], tipo: l.tipo as TipoDaImagem, tamanho: l.tamanho,
    largura: l.largura, altura: l.altura, criadoEm: l.criado_em, minha: l.usuario_id === user?.id,
    url: urls.get(l.caminho) ?? null,
  }))

  return (
    <>
      <div className={g.cabeca}>
        <div>
          <p className={p.eyebrow}>Banco de imagens</p>
          <h1 className={p.tituloTela}>Galeria</h1>
          <p className={p.ledeTela}>As fotos do clube para as propagandas. Em breve, cada uma poderá ir direto para um template.</p>
        </div>
        <LinkDeRota href="/enviar" className={p.btnGold}>Enviar imagens</LinkDeRota>
      </div>
      {error ? (
        <p className={p.erro} role="alert">Não consegui carregar a galeria. Recarregue a página.</p>
      ) : (
        <Galeria imagens={imagens} />
      )}
    </>
  )
}
