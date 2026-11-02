'use client'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { semAcento, tamanhoLegivel, type Imagem } from '@/lib/imagens'
import { excluirImagem } from '../acoes'
import g from './galeria.module.css'

const data = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export function Galeria({ imagens }: { imagens: Imagem[] }) {
  const [busca, setBusca] = useState('')
  const [etiqueta, setEtiqueta] = useState<string | null>(null)
  const [soMinhas, setSoMinhas] = useState(false)
  const [aberta, setAberta] = useState<Imagem | null>(null)

  // as etiquetas mais usadas primeiro
  const etiquetas = useMemo(() => {
    const contagem = new Map<string, number>()
    imagens.forEach((i) => i.etiquetas.forEach((e) => contagem.set(e, (contagem.get(e) ?? 0) + 1)))
    return [...contagem.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR')).map(([e]) => e)
  }, [imagens])

  const visiveis = useMemo(() => {
    const termo = semAcento(busca.trim())
    return imagens.filter((i) =>
      (!etiqueta || i.etiquetas.includes(etiqueta)) &&
      (!soMinhas || i.minha) &&
      (!termo || semAcento([i.nome, ...i.etiquetas].join(' ')).includes(termo)))
  }, [imagens, busca, etiqueta, soMinhas])

  if (imagens.length === 0) {
    return (
      <div className={`${p.card} ${g.vazia}`}>
        <h2>A galeria ainda está vazia</h2>
        <p>Envie as primeiras fotos do clube para usar nas propagandas.</p>
        <LinkDeRota href="/enviar" className={p.btnPine}>Enviar imagens</LinkDeRota>
      </div>
    )
  }

  return (
    <>
      <div className={g.filtros}>
        <input className={`${p.campo} ${g.busca}`} type="search" placeholder="Buscar por nome ou etiqueta"
          aria-label="Buscar imagens" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className={g.chips} role="group" aria-label="Filtrar">
          <button type="button" className={`${g.chip} ${!etiqueta && !soMinhas ? g.chipAtivo : ''}`}
            aria-pressed={!etiqueta && !soMinhas} onClick={() => { setEtiqueta(null); setSoMinhas(false) }}>
            Todas
          </button>
          <button type="button" className={`${g.chip} ${soMinhas ? g.chipAtivo : ''}`}
            aria-pressed={soMinhas} onClick={() => setSoMinhas((v) => !v)}>
            Enviadas por mim
          </button>
          {etiquetas.slice(0, 20).map((e) => (
            <button key={e} type="button" className={`${g.chip} ${etiqueta === e ? g.chipAtivo : ''}`}
              aria-pressed={etiqueta === e} onClick={() => setEtiqueta((atual) => (atual === e ? null : e))}>
              #{e}
            </button>
          ))}
        </div>
      </div>

      <p className={g.contagem} aria-live="polite">
        {visiveis.length === imagens.length
          ? `${imagens.length} ${imagens.length === 1 ? 'imagem' : 'imagens'}`
          : `${visiveis.length} de ${imagens.length} imagens`}
      </p>

      {visiveis.length === 0 ? (
        <p className={g.nada}>Nenhuma imagem com esse filtro.</p>
      ) : (
        <ul className={g.grade}>
          {visiveis.map((i) => (
            <li key={i.id}>
              <button type="button" className={g.cartao} onClick={() => setAberta(i)} aria-label={`Abrir ${i.nome}`}>
                {i.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage, sem otimizador
                  <img src={i.url} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className={g.semPrevia}>Sem prévia</span>
                )}
                <span className={g.legenda}>{i.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {aberta && <Detalhe imagem={aberta} fechar={() => setAberta(null)} />}
    </>
  )
}

function Detalhe({ imagem, fechar }: { imagem: Imagem; fechar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [excluindo, iniciar] = useTransition()

  useEffect(() => { dialogo.current?.showModal() }, [])

  function excluir() {
    setErro(null)
    iniciar(async () => {
      const r = await excluirImagem(imagem.id)
      if (!r.ok) { setErro(r.erro); return }
      fechar()
      router.refresh()
    })
  }

  return (
    <dialog ref={dialogo} className={`${p.tokens} ${g.dialogo}`} onClose={fechar} aria-labelledby="titulo-imagem"
      onClick={(e) => { if (e.target === e.currentTarget) dialogo.current?.close() }}>
      <div className={g.dialogoCorpo}>
        <div className={g.palco}>
          {imagem.url
            // eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage, sem otimizador
            ? <img src={imagem.url} alt={imagem.nome} />
            : <span className={g.semPrevia}>Sem prévia</span>}
        </div>
        <div className={g.ficha}>
          <div className={g.fichaTopo}>
            <h2 id="titulo-imagem">{imagem.nome}</h2>
            <button type="button" className={g.fechar} onClick={() => dialogo.current?.close()} aria-label="Fechar">×</button>
          </div>
          {imagem.etiquetas.length > 0 && (
            <div className={g.etiquetas}>
              {imagem.etiquetas.map((e) => <span key={e} className={`${p.chip} ${p.chipOk}`}>{e}</span>)}
            </div>
          )}
          <dl className={g.dados}>
            {imagem.largura && imagem.altura ? (<><dt>Medidas</dt><dd>{imagem.largura} × {imagem.altura} px</dd></>) : null}
            <dt>Arquivo</dt><dd>{imagem.tipo.replace('image/', '').toUpperCase()} · {tamanhoLegivel(imagem.tamanho)}</dd>
            <dt>Enviada em</dt><dd>{data(imagem.criadoEm)}{imagem.minha ? ' · por você' : ''}</dd>
          </dl>
          <div className={g.acoes}>
            <a className={p.btnPine} href={`/api/imagens/${imagem.id}/baixar`}>Baixar original</a>
            {imagem.minha && !confirmando && (
              <button type="button" className={`${p.btnFino} ${p.btnPerigo}`} onClick={() => setConfirmando(true)}>Excluir</button>
            )}
          </div>
          {confirmando && (
            <div className={g.confirmar} role="alert">
              <p>Excluir esta imagem da galeria? Não dá para desfazer.</p>
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
