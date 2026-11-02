import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { TEMPLATES } from '@/components/templates'
import { BALDE_DAS_PROPAGANDAS, type Propaganda } from '@/lib/propagandas'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import { Propagandas } from './propagandas'
import g from '../galeria/galeria.module.css'

export const metadata = { title: 'Propagandas' }
export const dynamic = 'force-dynamic'

/** Como na galeria de fotos: URLs assinadas de 1 hora, uma chamada só para todas. */
const VALIDADE_DA_URL = 60 * 60
const LIMITE_DA_LISTA = 500

export default async function PaginaPropagandas() {
  const supabase = await clienteDoServidor()
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('propagandas')
    .select('id, usuario_id, template, nome, caminho, tipo, tamanho, largura, altura, criado_em')
    .order('criado_em', { ascending: false })
    .limit(LIMITE_DA_LISTA)
  if (error) console.error('propagandas: não leu a galeria', error)
  const linhas = data ?? []

  const urls = new Map<string, string>()
  if (linhas.length) {
    const { data: assinadas } = await supabase.storage.from(BALDE_DAS_PROPAGANDAS)
      .createSignedUrls(linhas.map((l) => l.caminho), VALIDADE_DA_URL)
    assinadas?.forEach((a) => { if (a.path && a.signedUrl) urls.set(a.path, a.signedUrl) })
  }

  const nomes = new Map(TEMPLATES.map((t) => [t.id, t.nome]))
  const propagandas: Propaganda[] = linhas.map((l) => ({
    id: l.id, template: l.template, nomeDoTemplate: nomes.get(l.template) ?? l.template, nome: l.nome,
    tipo: l.tipo as Propaganda['tipo'], tamanho: l.tamanho, largura: l.largura, altura: l.altura,
    criadoEm: l.criado_em, minha: l.usuario_id === user?.id, url: urls.get(l.caminho) ?? null,
  }))

  return (
    <>
      <div className={g.cabeca}>
        <div>
          <p className={p.eyebrow}>Propagandas</p>
          <h1 className={p.tituloTela}>Propagandas salvas</h1>
          <p className={p.ledeTela}>As artes feitas nos templates e salvas pelo clube. Baixe, envie de novo ou faça uma cópia para a próxima chamada.</p>
        </div>
        <LinkDeRota href="/templates" className={p.btnGold}>Nova propaganda</LinkDeRota>
      </div>
      {error
        ? <p className={p.erro} role="alert">Não consegui carregar as propagandas. Recarregue a página.</p>
        : <Propagandas propagandas={propagandas} templates={TEMPLATES.map((t) => ({ id: t.id, nome: t.nome }))} />}
    </>
  )
}
