'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { TEMPLATES, templatePorId } from '@/components/templates'
import { arquivoParaSalvar, gerarPng, nomeDoPng } from '@/components/templates/exportar'
import {
  CATEGORIAS, faltandoNasInformacoes, informacoesIniciais, type Categoria, type Informacoes,
} from '@/components/templates/informacoes'
import { MiniArte } from '@/components/templates/mini-arte'
import { pendencias, resolverImagens, txt, type Valores } from '@/components/templates/motor'
import {
  CONFIG_INICIAL, comInformacoes, fotosDoSorteio, logosDoSorteio, quantasFotos, sortearVariacao, type ConfigDoSorteio,
} from '@/components/templates/sorteio'
import type { FotoDaGaleria, LogoDoClube } from '@/components/templates/tipos-do-editor'
import { semAcento } from '@/lib/imagens'
import { LIMITE_DA_PROPAGANDA } from '@/lib/propagandas'
import { salvarPropaganda } from '../propagandas/acoes'
import w from './wizard.module.css'

// O wizard das propagandas: 1) categoria, 2) informações + fotos e logo do sorteio, 3) modelos,
// 4) opções sorteadas, das quais se escolhe uma ou mais para publicar na galeria. O estado fica no
// sessionStorage, para o "Ajustar" (que abre o editor) poder voltar sem perder nada.

type Opcao = { chave: string; templateId: string; valores: Valores; escolhida: boolean; publicada: boolean }
type Estado = {
  passo: 1 | 2 | 3 | 4
  categoria: Categoria | null
  info: Informacoes
  config: ConfigDoSorteio
  modelos: string[]
  porModelo: number
  opcoes: Opcao[]
}

const CHAVE = 'wizard:propagandas'
const CHAVE_DO_CLUBE = 'wizard:nome-do-clube'
const MAXIMO_DE_OPCOES = 24
const PASSOS = ['Categoria', 'Informações', 'Modelos', 'Opções'] as const

const estadoInicial = (): Estado => ({
  passo: 1, categoria: null, info: informacoesIniciais('reuniao-regular'), config: CONFIG_INICIAL,
  modelos: [], porModelo: 2, opcoes: [],
})

export function Wizard({ fotos, logos }: { fotos: FotoDaGaleria[]; logos: LogoDoClube[] }) {
  const router = useRouter()
  const [e, setE] = useState<Estado>(estadoInicial)
  const [carregado, setCarregado] = useState(false)
  const [publicando, setPublicando] = useState<{ feitas: number; total: number } | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const nos = useRef(new Map<string, HTMLDivElement>())

  // volta do editor ("Ajustar") ou de um recarregar: retoma de onde parou
  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem(CHAVE)
      if (salvo) setE({ ...estadoInicial(), ...JSON.parse(salvo) })
    } catch {}
    setCarregado(true)
  }, [])
  useEffect(() => {
    if (!carregado) return
    try { sessionStorage.setItem(CHAVE, JSON.stringify(e)) } catch {}
  }, [e, carregado])

  const mudar = (parte: Partial<Estado>) => setE((atual) => ({ ...atual, ...parte }))
  const irPara = (passo: Estado['passo']) => { setErro(null); mudar({ passo }); window.scrollTo({ top: 0 }) }

  const enderecos = useMemo(() => {
    const m = new Map<string, string>()
    fotos.forEach((f) => m.set(f.id, f.url))
    logos.forEach((l) => m.set(l.id, l.url))
    return m
  }, [fotos, logos])

  const doSorteio = useMemo(() => fotosDoSorteio(fotos, e.config.fotos), [fotos, e.config.fotos])
  const logosSorteio = logosDoSorteio(logos, e.config.logo)
  const modelosDaCategoria = TEMPLATES.filter((t) => t.categoria === e.categoria)

  function escolherCategoria(c: Categoria) {
    // trocar de categoria recomeça as informações (os padrões são outros) e os modelos; o nome do
    // clube vem do que foi digitado da última vez neste navegador
    if (c !== e.categoria) {
      let nomeDoClube = ''
      try { nomeDoClube = localStorage.getItem(CHAVE_DO_CLUBE) ?? '' } catch {}
      mudar({ categoria: c, info: { ...informacoesIniciais(c), nomeDoClube }, modelos: [], opcoes: [], passo: 2 })
    } else irPara(2)
  }

  useEffect(() => {
    if (!carregado || !e.info.nomeDoClube.trim()) return
    try { localStorage.setItem(CHAVE_DO_CLUBE, e.info.nomeDoClube.trim()) } catch {}
  }, [e.info.nomeDoClube, carregado])

  function gerar() {
    const ids = doSorteio.map((f) => f.id)
    const opcoes: Opcao[] = []
    for (const id of e.modelos) {
      const t = templatePorId(id)
      if (!t) continue
      for (let n = 0; n < e.porModelo && opcoes.length < MAXIMO_DE_OPCOES; n++) {
        opcoes.push({ chave: crypto.randomUUID(), templateId: id, valores: sortearVariacao(t, e.info, ids, logosSorteio), escolhida: false, publicada: false })
      }
    }
    mudar({ opcoes, passo: 4 })
    window.scrollTo({ top: 0 })
  }

  function sortearDeNovo(chaves: Set<string>) {
    const ids = doSorteio.map((f) => f.id)
    setE((atual) => ({
      ...atual,
      opcoes: atual.opcoes.map((o) => {
        const t = templatePorId(o.templateId)
        return chaves.has(o.chave) && t && !o.publicada ? { ...o, valores: sortearVariacao(t, atual.info, ids, logosSorteio) } : o
      }),
    }))
  }

  const marcar = (chave: string) =>
    setE((atual) => ({ ...atual, opcoes: atual.opcoes.map((o) => (o.chave === chave ? { ...o, escolhida: !o.escolhida } : o)) }))

  function ajustar(o: Opcao) {
    try { sessionStorage.setItem(`rascunho:${o.chave}`, JSON.stringify(o.valores)) } catch {}
    router.push(`/templates/${o.templateId}?rascunho=${o.chave}`)
  }

  // Uma por vez, como as fotos no envio: cada arte é um pedido próprio, abaixo do limite da função.
  async function publicar() {
    const fila = e.opcoes.filter((o) => o.escolhida && !o.publicada)
    setErro(null)
    setPublicando({ feitas: 0, total: fila.length })
    let feitas = 0
    for (const o of fila) {
      const t = templatePorId(o.templateId)
      const no = nos.current.get(o.chave)
      if (!t || !no) continue
      try {
        const png = await gerarPng(no, t.largura, t.altura)
        const arquivo = await arquivoParaSalvar(no, t.largura, t.altura, png, LIMITE_DA_PROPAGANDA)
        const dados = new FormData()
        dados.set('arquivo', new File([arquivo], nomeDoPng(t.nome, txt(o.valores, 'titulo')), { type: arquivo.type }))
        dados.set('template', t.id)
        dados.set('valores', JSON.stringify(o.valores))
        dados.set('largura', String(t.largura * 2))
        dados.set('altura', String(t.altura * 2))
        const r = await salvarPropaganda(dados)
        if (!r.ok) { setErro(r.erro); break }
        feitas++
        setPublicando({ feitas, total: fila.length })
        setE((atual) => ({ ...atual, opcoes: atual.opcoes.map((x) => (x.chave === o.chave ? { ...x, publicada: true } : x)) }))
      } catch (err) {
        console.error('wizard: não publicou a opção', err)
        setErro('Não consegui gerar uma das artes. Tente publicar de novo.')
        break
      }
    }
    setPublicando(null)
  }

  function recomecar() {
    try { sessionStorage.removeItem(CHAVE) } catch {}
    setE(estadoInicial())
    setErro(null)
  }

  if (!carregado) return null

  const faltaInfo = faltandoNasInformacoes(e.info)
  const precisaDeFotos = e.modelos.some((id) => quantasFotos(templatePorId(id)!) > 0)
  const escolhidas = e.opcoes.filter((o) => o.escolhida && !o.publicada).length
  const publicadas = e.opcoes.filter((o) => o.publicada).length

  return (
    <div className={w.wizard}>
      <ol className={w.passos} aria-label="Passos">
        {PASSOS.map((nome, i) => {
          const n = (i + 1) as Estado['passo']
          const liberado = n === 1 || (n === 2 && e.categoria) || (n === 3 && e.categoria && !faltaInfo.length) || (n === 4 && e.opcoes.length > 0)
          return (
            <li key={nome}>
              <button type="button" className={`${w.passo} ${e.passo === n ? w.passoAtual : ''}`} disabled={!liberado || !!publicando}
                aria-current={e.passo === n ? 'step' : undefined} onClick={() => irPara(n)}>
                <span className={w.numero}>{n}</span>{nome}
              </button>
            </li>
          )
        })}
      </ol>

      {e.passo === 1 && (
        <section aria-labelledby="t-categoria">
          <h2 id="t-categoria" className={w.titulo}>Que chamada vamos fazer?</h2>
          <div className={w.categorias}>
            {CATEGORIAS.map((c) => {
              const qtd = TEMPLATES.filter((t) => t.categoria === c.id).length
              return (
                <button key={c.id} type="button" className={`${p.card} ${w.categoria} ${e.categoria === c.id ? w.categoriaAtual : ''}`}
                  onClick={() => escolherCategoria(c.id)}>
                  <span className={w.categoriaNome}>{c.nome}</span>
                  <span className={w.categoriaTexto}>{c.descricao}</span>
                  <span className={w.categoriaQtd}>{qtd} {qtd === 1 ? 'modelo' : 'modelos'}</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {e.passo === 2 && e.categoria && (
        <section aria-labelledby="t-info" className={w.colunas}>
          <div className={`${p.card} ${w.bloco}`}>
            <h2 id="t-info" className={w.titulo}>Informações</h2>
            <CamposDasInformacoes categoria={e.categoria} info={e.info} mudar={(info) => mudar({ info: { ...e.info, ...info } })} />
          </div>
          <div className={`${p.card} ${w.bloco}`}>
            <h2 className={w.titulo}>Fotos e logo do sorteio</h2>
            <ConfigDoSorteioCampos fotos={fotos} logos={logos} config={e.config} mudar={(config) => mudar({ config })} noSorteio={doSorteio.length} />
          </div>
          <div className={w.rodape}>
            {faltaInfo.length > 0 && <p className={w.falta} role="status">Falta preencher: {faltaInfo.join(', ')}.</p>}
            <button type="button" className={p.btnFino} onClick={() => irPara(1)}>Voltar</button>
            <button type="button" className={p.btnGold} disabled={faltaInfo.length > 0} onClick={() => irPara(3)}>Escolher modelos</button>
          </div>
        </section>
      )}

      {e.passo === 3 && e.categoria && (
        <section aria-labelledby="t-modelos">
          <div className={w.cabecalhoPasso}>
            <h2 id="t-modelos" className={w.titulo}>Modelos de {CATEGORIAS.find((c) => c.id === e.categoria)?.nome}</h2>
            <div className={w.acoesTopo}>
              <button type="button" className={p.btnFino} onClick={() => mudar({ modelos: modelosDaCategoria.map((t) => t.id) })}>Marcar todos</button>
              <button type="button" className={p.btnFino} onClick={() => mudar({ modelos: [] })} disabled={!e.modelos.length}>Desmarcar</button>
            </div>
          </div>
          <ul className={w.gradeModelos}>
            {modelosDaCategoria.map((t) => {
              const marcado = e.modelos.includes(t.id)
              return (
                <li key={t.id}>
                  <button type="button" className={`${w.modelo} ${marcado ? w.modeloMarcado : ''}`} aria-pressed={marcado}
                    onClick={() => mudar({ modelos: marcado ? e.modelos.filter((x) => x !== t.id) : [...e.modelos, t.id] })}>
                    <MiniArte t={t} v={comInformacoes(t, e.info)} largura={168} />
                    <span className={w.modeloNome}><span className={w.caixa} aria-hidden="true">{marcado ? '✓' : ''}</span>{t.nome}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className={w.rodape}>
            <label className={w.quantidade}>
              Opções por modelo
              <select className={p.campo} value={e.porModelo} onChange={(ev) => mudar({ porModelo: Number(ev.target.value) })}>
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            {e.modelos.length * e.porModelo > MAXIMO_DE_OPCOES && (
              <p className={w.falta} role="status">Vou gerar só {MAXIMO_DE_OPCOES} opções de uma vez.</p>
            )}
            {precisaDeFotos && doSorteio.length === 0 && (
              <p className={w.falta} role="status">Nenhuma foto no sorteio. Volte e escolha as fotos.</p>
            )}
            <button type="button" className={p.btnFino} onClick={() => irPara(2)}>Voltar</button>
            <button type="button" className={p.btnGold} disabled={!e.modelos.length || (precisaDeFotos && doSorteio.length === 0)} onClick={gerar}>
              Gerar {Math.min(MAXIMO_DE_OPCOES, e.modelos.length * e.porModelo) || ''} opções
            </button>
          </div>
        </section>
      )}

      {e.passo === 4 && (
        <section aria-labelledby="t-opcoes">
          <div className={w.cabecalhoPasso}>
            <div>
              <h2 id="t-opcoes" className={w.titulo}>Escolha as que vão para a galeria</h2>
              <p className={p.ajuda}>Toque numa opção para marcar. “Sortear” troca fotos, cores e logo; “Ajustar” abre no editor.</p>
            </div>
            <div className={w.acoesTopo}>
              <button type="button" className={p.btnFino} disabled={!!publicando}
                onClick={() => sortearDeNovo(new Set(e.opcoes.filter((o) => !o.escolhida).map((o) => o.chave)))}>
                Sortear as não marcadas
              </button>
            </div>
          </div>
          <ul className={w.gradeOpcoes}>
            {e.opcoes.map((o) => {
              const t = templatePorId(o.templateId)
              if (!t) return null
              const v = resolverImagens(t, o.valores, enderecos)
              const incompleta = pendencias(t, v).length > 0
              return (
                <li key={o.chave} className={`${w.opcao} ${o.escolhida ? w.opcaoMarcada : ''} ${o.publicada ? w.opcaoPublicada : ''}`}>
                  <button type="button" className={w.opcaoArte} onClick={() => !o.publicada && marcar(o.chave)} aria-pressed={o.escolhida}
                    disabled={o.publicada || !!publicando} aria-label={`${t.nome}: ${o.escolhida ? 'marcada' : 'marcar'}`}>
                    <MiniArte t={t} v={v} largura={216}
                      noRef={(no) => { if (no) nos.current.set(o.chave, no); else nos.current.delete(o.chave) }} />
                    {(o.escolhida || o.publicada) && <span className={w.selo}>{o.publicada ? 'Publicada' : '✓'}</span>}
                  </button>
                  <span className={w.opcaoNome}>{t.nome}</span>
                  {!o.publicada && (
                    <div className={w.opcaoAcoes}>
                      <button type="button" className={p.btnFino} disabled={!!publicando} onClick={() => sortearDeNovo(new Set([o.chave]))}>Sortear</button>
                      <button type="button" className={p.btnFino} disabled={!!publicando} onClick={() => ajustar(o)}>Ajustar</button>
                    </div>
                  )}
                  {incompleta && !o.publicada && <p className={w.falta}>Faltou foto para este modelo.</p>}
                </li>
              )
            })}
          </ul>
          <div className={`${w.rodape} ${w.rodapeFixo}`}>
            {erro && <p className={p.erro} role="alert">{erro}</p>}
            {publicadas > 0 && !publicando && (
              <p className={w.ok} role="status">
                {publicadas} {publicadas === 1 ? 'publicada' : 'publicadas'} na galeria. <LinkDeRota href="/propagandas" className={p.link}>Ver em Propagandas</LinkDeRota>
              </p>
            )}
            <button type="button" className={p.btnFino} disabled={!!publicando} onClick={() => irPara(3)}>Voltar</button>
            <button type="button" className={p.btnFino} disabled={!!publicando} onClick={recomecar}>Nova propaganda</button>
            <button type="button" className={p.btnGold} disabled={!escolhidas || !!publicando} onClick={publicar}>
              {publicando ? `Publicando ${publicando.feitas + 1} de ${publicando.total}…` : `Publicar ${escolhidas || ''} na galeria`}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function CamposDasInformacoes({ categoria, info, mudar }: { categoria: Categoria; info: Informacoes; mudar: (i: Partial<Informacoes>) => void }) {
  const evento = categoria === 'eventos'
  const campo = (chave: keyof Informacoes, rotulo: string, extra: { area?: boolean; tipo?: string; ajuda?: string; dica?: string; obrigatorio?: boolean; max?: number } = {}) => (
    <div>
      <label className={p.rotulo} htmlFor={`info-${chave}`}>{rotulo}{extra.obrigatorio ? ' *' : ''}</label>
      {extra.area ? (
        <textarea id={`info-${chave}`} className={`${p.campo} ${w.area}`} value={info[chave]} placeholder={extra.dica} maxLength={extra.max}
          rows={Math.min(6, info[chave].split('\n').length + 1)} onChange={(ev) => mudar({ [chave]: ev.target.value })} />
      ) : (
        <input id={`info-${chave}`} className={p.campo} type={extra.tipo ?? 'text'} value={info[chave]} placeholder={extra.dica} maxLength={extra.max}
          onChange={(ev) => mudar({ [chave]: ev.target.value })} />
      )}
      {extra.ajuda && <p className={p.ajuda}>{extra.ajuda}</p>}
    </div>
  )
  return (
    <div className={w.campos}>
      {campo('titulo', evento ? 'Nome do evento' : 'Título', { area: true, obrigatorio: true, max: 40, dica: evento ? 'Grande\nGincana' : undefined, ajuda: 'Enter quebra a linha na arte.' })}
      {campo('chamada', 'Chamada curta', { max: 30, dica: evento ? 'VEM AÍ' : 'Em branco: cada modelo usa a sua', ajuda: evento ? 'Aparece acima do título. Em branco, o espaço fica vazio.' : undefined })}
      <div className={w.linha}>
        {campo('data', 'Data', { tipo: 'date', obrigatorio: true })}
        {campo('horaInicio', 'Hora', { tipo: 'time', obrigatorio: true })}
        {campo('horaFim', 'Até', { tipo: 'time' })}
      </div>
      {campo('local', 'Local', { obrigatorio: true, max: 70, dica: 'Rua Engenheiro Rebouças, 520' })}
      {campo('itens', 'O que levar', { area: true, max: 240, ajuda: 'Um item por linha. Cada modelo arruma do seu jeito (lista, “·” ou frase).' })}
      {campo('frase', 'Frase', { area: true, max: 120, dica: evento ? 'Provas, desafios e muita diversão!' : 'Em branco: cada modelo usa a sua' })}
      <details className={w.mais}>
        <summary>Versículo e nome do clube</summary>
        <div className={w.campos}>
          {campo('versiculo', 'Versículo', { area: true, max: 140, dica: 'Tudo posso naquele que me fortalece.' })}
          {campo('referencia', 'Referência', { max: 30, dica: 'FILIPENSES 4:13' })}
          {campo('nomeDoClube', 'Nome do clube', { max: 60, dica: 'Clube de Desbravadores …' })}
        </div>
      </details>
    </div>
  )
}

function ConfigDoSorteioCampos({ fotos, logos, config, mudar, noSorteio }: {
  fotos: FotoDaGaleria[]; logos: LogoDoClube[]; config: ConfigDoSorteio; mudar: (c: ConfigDoSorteio) => void; noSorteio: number
}) {
  const [busca, setBusca] = useState('')
  const etiquetas = useMemo(() => {
    const contagem = new Map<string, number>()
    fotos.forEach((f) => f.etiquetas.forEach((x) => contagem.set(x, (contagem.get(x) ?? 0) + 1)))
    return [...contagem.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
  }, [fotos])
  const visiveis = useMemo(() => {
    const termo = semAcento(busca.trim())
    return termo ? fotos.filter((f) => semAcento([f.nome, ...f.etiquetas].join(' ')).includes(termo)) : fotos
  }, [fotos, busca])

  const cf = config.fotos
  const cl = config.logo
  const setFotos = (fotosCfg: ConfigDoSorteio['fotos']) => mudar({ ...config, fotos: fotosCfg })
  const setLogo = (logoCfg: ConfigDoSorteio['logo']) => mudar({ ...config, logo: logoCfg })
  const marcadas = new Set(cf.modo === 'escolhidas' ? cf.ids : [])
  const etiquetasMarcadas = new Set(cf.modo === 'etiquetas' ? cf.etiquetas : [])

  return (
    <div className={w.campos}>
      <fieldset className={w.grupo}>
        <legend className={p.rotulo}>Fotos que entram no sorteio</legend>
        <div className={w.opcoesRadio}>
          <label><input type="radio" name="fotos" checked={cf.modo === 'todas'} onChange={() => setFotos({ modo: 'todas' })} /> Galeria toda</label>
          <label><input type="radio" name="fotos" checked={cf.modo === 'etiquetas'} onChange={() => setFotos({ modo: 'etiquetas', etiquetas: [] })} disabled={!etiquetas.length} /> Por etiqueta</label>
          <label><input type="radio" name="fotos" checked={cf.modo === 'escolhidas'} onChange={() => setFotos({ modo: 'escolhidas', ids: [] })} /> Escolher as fotos</label>
        </div>

        {cf.modo === 'etiquetas' && (
          <div className={w.chips} role="group" aria-label="Etiquetas">
            {etiquetas.map(([x, n]) => {
              const ativa = etiquetasMarcadas.has(x)
              return (
                <button key={x} type="button" className={`${w.chip} ${ativa ? w.chipAtivo : ''}`} aria-pressed={ativa}
                  onClick={() => setFotos({ modo: 'etiquetas', etiquetas: ativa ? cf.etiquetas.filter((y) => y !== x) : [...cf.etiquetas, x] })}>
                  #{x} <span className={w.chipQtd}>{n}</span>
                </button>
              )
            })}
          </div>
        )}

        {cf.modo === 'escolhidas' && (
          <>
            <input className={p.campo} type="search" placeholder="Buscar por nome ou etiqueta" aria-label="Buscar fotos"
              value={busca} onChange={(ev) => setBusca(ev.target.value)} />
            <ul className={w.fotos}>
              {visiveis.map((f) => {
                const ativa = marcadas.has(f.id)
                return (
                  <li key={f.id}>
                    <button type="button" className={`${w.foto} ${ativa ? w.fotoAtiva : ''}`} aria-pressed={ativa} title={f.nome}
                      onClick={() => setFotos({ modo: 'escolhidas', ids: ativa ? cf.ids.filter((y) => y !== f.id) : [...cf.ids, f.id] })}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage */}
                      <img src={f.url} alt={f.nome} loading="lazy" decoding="async" />
                      {ativa && <span className={w.fotoMarca} aria-hidden="true">✓</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
        <p className={noSorteio ? p.ajuda : w.falta}>
          {noSorteio ? `${noSorteio} ${noSorteio === 1 ? 'foto entra' : 'fotos entram'} no sorteio.` : 'Nenhuma foto no sorteio ainda.'}
          {fotos.length === 0 && <> A galeria está vazia: <LinkDeRota href="/enviar" className={p.link}>envie fotos</LinkDeRota>.</>}
        </p>
      </fieldset>

      <fieldset className={w.grupo}>
        <legend className={p.rotulo}>Logo</legend>
        {logos.length === 0 ? (
          <p className={p.ajuda}>O clube ainda não tem logo. <LinkDeRota href="/logo" className={p.link}>Envie o logo</LinkDeRota> ou siga sem ele.</p>
        ) : (
          <>
            <div className={w.opcoesRadio}>
              <label><input type="radio" name="logo" checked={cl.modo === 'sortear'} onChange={() => setLogo({ modo: 'sortear' })} /> Sortear entre as versões</label>
              <label><input type="radio" name="logo" checked={cl.modo === 'fixo'} onChange={() => setLogo({ modo: 'fixo', id: (logos.find((l) => l.principal) ?? logos[0]).id })} /> Usar sempre uma versão</label>
              <label><input type="radio" name="logo" checked={cl.modo === 'sem'} onChange={() => setLogo({ modo: 'sem' })} /> Sem logo</label>
            </div>
            {cl.modo === 'fixo' && (
              <div className={w.logos}>
                {logos.map((l) => (
                  <button key={l.id} type="button" className={`${w.logo} ${cl.id === l.id ? w.logoAtivo : ''}`} aria-pressed={cl.id === l.id}
                    onClick={() => setLogo({ modo: 'fixo', id: l.id })} title={l.nome}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage */}
                    <img src={l.url} alt="" />
                    <span>{l.nome}</span>
                  </button>
                ))}
              </div>
            )}
            {cl.modo === 'sortear' && <p className={p.ajuda}>Cada opção pega uma das {logos.length} versões. Uma versão escura pode cair num fundo escuro: aí é só sortear de novo.</p>}
          </>
        )}
      </fieldset>
    </div>
  )
}
