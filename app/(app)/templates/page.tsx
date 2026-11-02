import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { TEMPLATES } from '@/components/templates'
import { classeFontesDasArtes } from '@/components/templates/fontes'
import { CATEGORIAS } from '@/components/templates/informacoes'
import { valoresPadrao } from '@/components/templates/motor'
import { carregarFotosELogos } from './carregar'
import { Wizard } from './wizard'
import tl from './templates.module.css'

export const metadata = { title: 'Nova propaganda' }
export const dynamic = 'force-dynamic'

/** A miniatura do modo manual é a própria arte com os textos padrão, reduzida. */
const LARGURA_DA_MINIATURA = 180

/**
 * Dois modos: automático (o wizard: informações uma vez, opções sorteadas, publica as melhores) e
 * manual (a lista de modelos; tocar abre o editor e a arte é montada à mão). O modo fica na URL.
 */
export default async function PaginaTemplates({ searchParams }: { searchParams: Promise<{ modo?: string }> }) {
  const manual = (await searchParams).modo === 'manual'

  return (
    <>
      <div className={tl.cabeca}>
        <p className={p.eyebrow}>Propagandas</p>
        <h1 className={p.tituloTela}>Nova propaganda</h1>
        <p className={p.ledeTela}>
          {manual
            ? 'Escolha um modelo e monte a arte à mão: textos, fotos da galeria, cores e logo. Depois baixe, envie no WhatsApp ou salve na galeria.'
            : 'Escolha a categoria, preencha as informações uma vez e escolha os modelos. As opções saem com fotos, cores e logo sorteados; marque as melhores e publique na galeria.'}
        </p>
      </div>

      <nav className={tl.modos} aria-label="Modo">
        <LinkDeRota href="/templates" className={`${tl.modo} ${manual ? '' : tl.modoAtual}`} aria-current={manual ? undefined : 'page'}>
          <span className={tl.modoNome}>Automático</span>
          <span className={tl.modoTexto}>Preenche uma vez e escolhe entre opções sorteadas</span>
        </LinkDeRota>
        <LinkDeRota href="/templates?modo=manual" className={`${tl.modo} ${manual ? tl.modoAtual : ''}`} aria-current={manual ? 'page' : undefined}>
          <span className={tl.modoNome}>Manual</span>
          <span className={tl.modoTexto}>Escolhe um modelo e monta a arte no editor</span>
        </LinkDeRota>
      </nav>

      {manual ? <Manual /> : <Automatico />}
    </>
  )
}

async function Automatico() {
  const { fotos, logos, erro } = await carregarFotosELogos()
  return erro
    ? <p className={p.erro} role="alert">Não consegui carregar as fotos e os logos. Recarregue a página.</p>
    : <Wizard fotos={fotos} logos={logos} />
}

function Manual() {
  return (
    <div className={tl.categorias}>
      {CATEGORIAS.map((c) => {
        const modelos = TEMPLATES.filter((t) => t.categoria === c.id)
        return (
          <section key={c.id} aria-labelledby={`cat-${c.id}`}>
            <div className={tl.categoriaTopo}>
              <h2 id={`cat-${c.id}`}>{c.nome}</h2>
              <span className={tl.qtd}>{modelos.length} modelos</span>
            </div>
            <ul className={tl.lista}>
              {modelos.map((t) => {
                const escala = LARGURA_DA_MINIATURA / t.largura
                const Arte = t.Arte
                return (
                  <li key={t.id}>
                    <LinkDeRota href={`/templates/${t.id}?modo=manual`} className={`${p.card} ${tl.cartao}`}>
                      <div className={tl.miniatura} style={{ width: LARGURA_DA_MINIATURA, height: t.altura * escala }} aria-hidden="true">
                        <div className={classeFontesDasArtes} style={{ width: t.largura, height: t.altura, transform: `scale(${escala})`, transformOrigin: '0 0' }}>
                          <Arte v={valoresPadrao(t, null)} />
                        </div>
                      </div>
                      <div className={tl.texto}>
                        <h3>{t.nome}</h3>
                        <p>{t.descricao}</p>
                        <span className={tl.usar}>Usar este modelo →</span>
                      </div>
                    </LinkDeRota>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
