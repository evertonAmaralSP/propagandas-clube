'use client'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { AvisoDoEnvio, useEnvioWhatsapp } from '@/components/templates/envio-whatsapp'
import { semAcento, tamanhoLegivel } from '@/lib/imagens'
import { extensaoDaPropaganda, type Propaganda } from '@/lib/propagandas'
import { excluirPropaganda } from './acoes'
import g from '../galeria/galeria.module.css'
import pr from './propagandas.module.css'

const data = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export function Propagandas({ propagandas, templates }: { propagandas: Propaganda[]; templates: { id: string; nome: string }[] }) {
  const [busca, setBusca] = useState('')
  const [template, setTemplate] = useState<string | null>(null)
  const [soMinhas, setSoMinhas] = useState(false)
  const [aberta, setAberta] = useState<Propaganda | null>(null)

  // só os templates que já têm propaganda salva viram filtro
  const usados = useMemo(() => templates.filter((t) => propagandas.some((x) => x.template === t.id)), [templates, propagandas])

  const visiveis = useMemo(() => {
    const termo = semAcento(busca.trim())
    return propagandas.filter((x) =>
      (!template || x.template === template) &&
      (!soMinhas || x.minha) &&
      (!termo || semAcento(`${x.nome} ${x.nomeDoTemplate}`).includes(termo)))
  }, [propagandas, busca, template, soMinhas])

  if (propagandas.length === 0) {
    return (
      <div className={`${p.card} ${g.vazia}`}>
        <h2>Nenhuma propaganda salva ainda</h2>
        <p>Monte uma arte num template e toque em <strong>Salvar na galeria</strong>.</p>
        <LinkDeRota href="/templates" className={p.btnPine}>Escolher um template</LinkDeRota>
      </div>
    )
  }

  return (
    <>
      <div className={g.filtros}>
        <input className={`${p.campo} ${g.busca}`} type="search" placeholder="Buscar pelo nome"
          aria-label="Buscar propagandas" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className={g.chips} role="group" aria-label="Filtrar">
          <button type="button" className={`${g.chip} ${!template && !soMinhas ? g.chipAtivo : ''}`}
            aria-pressed={!template && !soMinhas} onClick={() => { setTemplate(null); setSoMinhas(false) }}>
            Todas
          </button>
          <button type="button" className={`${g.chip} ${soMinhas ? g.chipAtivo : ''}`}
            aria-pressed={soMinhas} onClick={() => setSoMinhas((v) => !v)}>
            Salvas por mim
          </button>
          {usados.map((t) => (
            <button key={t.id} type="button" className={`${g.chip} ${template === t.id ? g.chipAtivo : ''}`}
              aria-pressed={template === t.id} onClick={() => setTemplate((atual) => (atual === t.id ? null : t.id))}>
              {t.nome}
            </button>
          ))}
        </div>
      </div>

      <p className={g.contagem} aria-live="polite">
        {visiveis.length === propagandas.length
          ? `${propagandas.length} ${propagandas.length === 1 ? 'propaganda' : 'propagandas'}`
          : `${visiveis.length} de ${propagandas.length} propagandas`}
      </p>

      {visiveis.length === 0 ? (
        <p className={g.nada}>Nenhuma propaganda com esse filtro.</p>
      ) : (
        <ul className={pr.grade}>
          {visiveis.map((x) => (
            <li key={x.id}>
              <button type="button" className={`${g.cartao} ${pr.cartao}`} onClick={() => setAberta(x)} aria-label={`Abrir ${x.nome}`}>
                {x.url
                  // eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage, sem otimizador
                  ? <img src={x.url} alt="" loading="lazy" decoding="async" />
                  : <span className={g.semPrevia}>Sem prévia</span>}
                <span className={g.legenda}>{x.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {aberta && <Detalhe propaganda={aberta} fechar={() => setAberta(null)} />}
    </>
  )
}

function Detalhe({ propaganda: x, fechar }: { propaganda: Propaganda; fechar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const envio = useEnvioWhatsapp()
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [preparando, setPreparando] = useState(false)
  const [excluindo, iniciar] = useTransition()

  useEffect(() => { dialogo.current?.showModal() }, [])

  async function enviar() {
    if (!x.url) return
    setErro(null)
    setPreparando(true)
    try {
      const resposta = await fetch(x.url)
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
      const nome = `${x.nome.replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'propaganda'}.${extensaoDaPropaganda(x.tipo)}`
      await envio.enviar(await resposta.blob(), nome)
    } catch (e) {
      console.error('propagandas: não baixou a arte para enviar', e)
      setErro('Não consegui preparar a imagem. Recarregue a página e tente de novo.')
    } finally {
      setPreparando(false)
    }
  }

  function excluir() {
    setErro(null)
    iniciar(async () => {
      const r = await excluirPropaganda(x.id)
      if (!r.ok) { setErro(r.erro); return }
      fechar()
      router.refresh()
    })
  }

  return (
    <dialog ref={dialogo} className={`${p.tokens} ${g.dialogo}`} onClose={fechar} aria-labelledby="titulo-propaganda"
      onClick={(e) => { if (e.target === e.currentTarget) dialogo.current?.close() }}>
      <div className={g.dialogoCorpo}>
        <div className={g.palco}>
          {x.url
            // eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage, sem otimizador
            ? <img src={x.url} alt={x.nome} />
            : <span className={g.semPrevia}>Sem prévia</span>}
        </div>
        <div className={g.ficha}>
          <div className={g.fichaTopo}>
            <h2 id="titulo-propaganda">{x.nome}</h2>
            <button type="button" className={g.fechar} onClick={() => dialogo.current?.close()} aria-label="Fechar">×</button>
          </div>
          <dl className={g.dados}>
            <dt>Template</dt><dd>{x.nomeDoTemplate}</dd>
            <dt>Medidas</dt><dd>{x.largura} × {x.altura} px</dd>
            <dt>Arquivo</dt><dd>{x.tipo === 'image/jpeg' ? 'JPG' : 'PNG'} · {tamanhoLegivel(x.tamanho)}</dd>
            <dt>Salva em</dt><dd>{data(x.criadoEm)}{x.minha ? ' · por você' : ''}</dd>
          </dl>
          <div className={pr.acoes}>
            <a className={p.btnGold} href={`/api/propagandas/${x.id}/baixar`}>Baixar</a>
            <button type="button" className={p.btnPine} onClick={enviar} disabled={preparando || !x.url}>
              {preparando ? 'Preparando…' : 'Enviar no WhatsApp'}
            </button>
            <LinkDeRota href={`/templates/${x.template}?de=${x.id}`} className={p.btnFino}>Editar uma cópia</LinkDeRota>
          </div>
          <AvisoDoEnvio envio={envio} classe={pr.aviso} />
          {x.minha && !confirmando && (
            <div>
              <button type="button" className={`${p.btnFino} ${p.btnPerigo}`} onClick={() => setConfirmando(true)}>Excluir</button>
            </div>
          )}
          {confirmando && (
            <div className={g.confirmar} role="alert">
              <p>Excluir esta propaganda da galeria? Não dá para desfazer.</p>
              <div className={g.acoes}>
                <button type="button" className={`${p.btnFino} ${p.btnPerigo}`} onClick={excluir} disabled={excluindo}>
                  {excluindo ? 'Excluindo…' : 'Sim, excluir'}
                </button>
                <button type="button" className={p.btnFino} onClick={() => setConfirmando(false)} disabled={excluindo}>Cancelar</button>
              </div>
            </div>
          )}
          {erro && <p className={p.erro} role="alert">{erro}</p>}
        </div>
      </div>
    </dialog>
  )
}
