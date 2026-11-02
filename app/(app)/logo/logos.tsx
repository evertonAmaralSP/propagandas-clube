'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import p from '@/app/estilo/portal.module.css'
import { LIMITE_DA_IMAGEM, LIMITE_DO_NOME, nomeDoArquivo, tamanhoLegivel } from '@/lib/imagens'
import { LADO_MINIMO_RECOMENDADO, type Logo } from '@/lib/logos'
import { enviarLogo, excluirLogo, tornarPrincipal } from './acoes'
import l from './logo.module.css'

type Fundo = 'xadrez' | 'claro' | 'escuro'
const FUNDOS: { valor: Fundo; rotulo: string }[] = [
  { valor: 'xadrez', rotulo: 'Transparente' },
  { valor: 'claro', rotulo: 'Fundo claro' },
  { valor: 'escuro', rotulo: 'Fundo escuro' },
]
const classeDoFundo: Record<Fundo, string> = { xadrez: l.xadrez, claro: l.claro, escuro: l.escuro }

type Escolhido = { arquivo: File; previa: string; largura: number; altura: number }

/**
 * Lê o PNG no navegador: as medidas e se algum pixel é de fato transparente. O servidor só
 * confere se o arquivo tem canal de transparência; um PNG com alfa mas todo opaco para aqui.
 * Imagens grandes são reduzidas para 1024 px antes de varrer, o que basta para achar o fundo.
 */
async function analisar(arquivo: File): Promise<{ largura: number; altura: number; transparente: boolean } | null> {
  try {
    const bitmap = await createImageBitmap(arquivo)
    const { width: largura, height: altura } = bitmap
    const escala = Math.min(1, 1024 / Math.max(largura, altura))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(largura * escala))
    canvas.height = Math.max(1, Math.round(altura * escala))
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return { largura, altura, transparente: true }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparente = false
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 255) { transparente = true; break }
    return { largura, altura, transparente }
  } catch {
    return null
  }
}

export function Logos({ logos }: { logos: Logo[] }) {
  const [fundo, setFundo] = useState<Fundo>('xadrez')

  return (
    <div className={l.grade}>
      <section aria-labelledby="titulo-versoes">
        <div className={l.barra}>
          <h2 id="titulo-versoes" className={l.subtitulo}>
            {logos.length === 0 ? 'Versões' : `${logos.length} ${logos.length === 1 ? 'versão' : 'versões'}`}
          </h2>
          {logos.length > 0 && (
            <div className={l.fundos} role="group" aria-label="Fundo da prévia">
              {FUNDOS.map((f) => (
                <button key={f.valor} type="button" className={`${l.fundo} ${fundo === f.valor ? l.fundoAtivo : ''}`}
                  aria-pressed={fundo === f.valor} onClick={() => setFundo(f.valor)}>
                  {f.rotulo}
                </button>
              ))}
            </div>
          )}
        </div>

        {logos.length === 0 ? (
          <div className={`${p.card} ${l.vazia}`}>
            <h3>O clube ainda não tem logo</h3>
            <p>Envie o primeiro ao lado. Ele já entra como a versão principal.</p>
          </div>
        ) : (
          <ul className={l.lista}>
            {logos.map((logo) => <Cartao key={logo.id} logo={logo} fundo={fundo} />)}
          </ul>
        )}
      </section>

      <Envio primeiro={logos.length === 0} />
    </div>
  )
}

function Cartao({ logo, fundo }: { logo: Logo; fundo: Fundo }) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [ocupado, iniciar] = useTransition()

  function agir(acao: () => Promise<{ ok: true } | { ok: false; erro: string }>) {
    setErro(null)
    iniciar(async () => {
      const r = await acao()
      if (!r.ok) { setErro(r.erro); return }
      setConfirmando(false)
      router.refresh()
    })
  }

  return (
    <li className={`${p.card} ${l.cartao}`}>
      <div className={`${l.palco} ${classeDoFundo[fundo]}`}>
        {logo.url
          // eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage, sem otimizador
          ? <img src={logo.url} alt={logo.nome} loading="lazy" decoding="async" />
          : <span className={l.semPrevia}>Sem prévia</span>}
      </div>
      <div className={l.ficha}>
        <div className={l.fichaTopo}>
          <h3 className={l.nome}>{logo.nome}</h3>
          {logo.principal && <span className={`${p.chip} ${p.chipNeutro}`}>Principal</span>}
        </div>
        <p className={p.ajuda}>
          {logo.largura && logo.altura ? `${logo.largura} × ${logo.altura} px · ` : ''}{tamanhoLegivel(logo.tamanho)}
          {logo.meu ? ' · enviado por você' : ''}
        </p>
        <div className={l.acoes}>
          {!logo.principal && (
            <button type="button" className={p.btnFino} disabled={ocupado} onClick={() => agir(() => tornarPrincipal(logo.id))}>
              Tornar principal
            </button>
          )}
          <a className={p.btnFino} href={`/api/logos/${logo.id}/baixar`}>Baixar</a>
          {!confirmando && (
            <button type="button" className={`${p.btnFino} ${p.btnPerigo}`} disabled={ocupado} onClick={() => setConfirmando(true)}>
              Excluir
            </button>
          )}
        </div>
        {confirmando && (
          <div className={l.confirmar} role="alert">
            <p>
              Excluir esta versão do logo? Ela some para todo o clube e não dá para desfazer.
              {logo.principal ? ' A versão mais nova passa a ser a principal.' : ''}
            </p>
            <div className={l.acoes}>
              <button type="button" className={`${p.btnFino} ${p.btnPerigo}`} disabled={ocupado} onClick={() => agir(() => excluirLogo(logo.id))}>
                {ocupado ? 'Excluindo…' : 'Sim, excluir'}
              </button>
              <button type="button" className={p.btnFino} disabled={ocupado} onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        )}
        {erro && <p className={p.erro} role="alert">{erro}</p>}
      </div>
    </li>
  )
}

function Envio({ primeiro }: { primeiro: boolean }) {
  const router = useRouter()
  const [escolhido, setEscolhido] = useState<Escolhido | null>(null)
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [arrastando, setArrastando] = useState(false)
  const [enviando, iniciar] = useTransition()
  const previa = useRef<string | null>(null)

  const trocarPrevia = (nova: string | null) => {
    if (previa.current) URL.revokeObjectURL(previa.current)
    previa.current = nova
  }
  useEffect(() => () => trocarPrevia(null), [])

  async function escolher(lista: FileList | null) {
    const arquivo = lista?.[0]
    if (!arquivo) return
    setErro(null); setAviso(null)
    if (arquivo.type !== 'image/png') { setErro(`${arquivo.name}: o logo precisa ser PNG.`); return }
    if (arquivo.size > LIMITE_DA_IMAGEM) { setErro(`${arquivo.name}: passa de 5 MB (${tamanhoLegivel(arquivo.size)}).`); return }
    const analise = await analisar(arquivo)
    if (!analise) { setErro(`${arquivo.name}: não consegui abrir esse PNG.`); return }
    if (!analise.transparente) {
      setErro(`${arquivo.name}: esse PNG não tem fundo transparente. Exporte de novo com transparência.`)
      return
    }
    if (Math.max(analise.largura, analise.altura) < LADO_MINIMO_RECOMENDADO) {
      setAviso(`Logo pequeno (${analise.largura} × ${analise.altura} px): pode ficar serrilhado nas artes. Se tiver, use um de pelo menos ${LADO_MINIMO_RECOMENDADO} px.`)
    }
    const url = URL.createObjectURL(arquivo)
    trocarPrevia(url)
    setEscolhido({ arquivo, previa: url, largura: analise.largura, altura: analise.altura })
    setNome(nomeDoArquivo(arquivo.name))
  }

  function limpar() {
    trocarPrevia(null)
    setEscolhido(null); setNome(''); setAviso(null)
  }

  function enviar() {
    if (!escolhido) return
    setErro(null)
    const dados = new FormData()
    dados.set('arquivo', escolhido.arquivo)
    dados.set('nome', nome)
    dados.set('largura', String(escolhido.largura))
    dados.set('altura', String(escolhido.altura))
    iniciar(async () => {
      try {
        const r = await enviarLogo(dados)
        if (!r.ok) { setErro(r.erro); return }
        limpar()
        router.refresh()
      } catch {
        setErro('A conexão caiu. Tente de novo.')
      }
    })
  }

  return (
    <aside className={`${p.card} ${l.painel}`} aria-labelledby="titulo-envio">
      <h2 id="titulo-envio" className={l.subtitulo}>{primeiro ? 'Enviar o logo' : 'Enviar outra versão'}</h2>

      {escolhido ? (
        <div className={`${l.palco} ${l.palcoEnvio} ${l.xadrez}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- prévia local (URL de objeto) */}
          <img src={escolhido.previa} alt="Prévia do logo escolhido" />
        </div>
      ) : (
        <label
          className={`${l.zona} ${arrastando ? l.zonaAtiva : ''}`}
          onDragOver={(ev) => { ev.preventDefault(); setArrastando(true) }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(ev) => { ev.preventDefault(); setArrastando(false); escolher(ev.dataTransfer.files) }}
        >
          <input className={l.oculto} type="file" accept="image/png"
            onChange={(ev) => { escolher(ev.target.files); ev.target.value = '' }} />
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3 4 7v6c0 4.4 3.4 7.6 8 8 4.6-.4 8-3.6 8-8V7z" /><path d="m9 12 2 2 4-4" />
          </svg>
          <span className={l.zonaTitulo}>Arraste o PNG para cá</span>
          <span className={l.zonaSub}>ou <span className={p.link}>escolha no computador</span></span>
        </label>
      )}

      {escolhido && (
        <div>
          <label className={p.rotulo} htmlFor="nome-logo">Nome da versão</label>
          <input id="nome-logo" className={p.campo} value={nome} maxLength={LIMITE_DO_NOME} disabled={enviando}
            placeholder="Colorido, Branco, Só o símbolo…" onChange={(ev) => setNome(ev.target.value)} />
          <p className={p.ajuda}>
            {escolhido.largura} × {escolhido.altura} px · {tamanhoLegivel(escolhido.arquivo.size)}
          </p>
        </div>
      )}

      {aviso && <p className={l.aviso}>{aviso}</p>}
      {erro && <p className={p.erro} role="alert">{erro}</p>}

      {escolhido ? (
        <div className={l.acoes}>
          <button type="button" className={p.btnGold} onClick={enviar} disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar logo'}
          </button>
          <button type="button" className={p.btnFino} onClick={limpar} disabled={enviando}>Trocar arquivo</button>
        </div>
      ) : (
        <p className={p.ajuda}>
          Só PNG com fundo transparente, até 5 MB. Para os templates, o ideal é ter pelo menos {LADO_MINIMO_RECOMENDADO} px
          no lado maior, uma versão colorida e uma branca para fundos escuros.
        </p>
      )}
    </aside>
  )
}
