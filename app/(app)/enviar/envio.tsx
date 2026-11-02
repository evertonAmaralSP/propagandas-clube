'use client'
import { useEffect, useRef, useState } from 'react'
import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { LIMITE_DA_IMAGEM, LIMITE_DO_NOME, TIPOS_ACEITOS, lerEtiquetas, nomeDoArquivo, tamanhoLegivel } from '@/lib/imagens'
import { enviarImagem } from '../acoes'
import e from './envio.module.css'

type Estado = 'pronta' | 'enviando' | 'enviada' | 'erro'
type Item = {
  chave: string
  arquivo: File
  previa: string
  nome: string
  largura: number | null
  altura: number | null
  estado: Estado
  erro?: string
}

const ACEITAS = TIPOS_ACEITOS.join(',')
const ROTULO: Record<Estado, string> = { pronta: 'Pronta', enviando: 'Enviando…', enviada: 'Enviada', erro: 'Falhou' }

/** As medidas da foto, lidas no navegador (o servidor não decodifica a imagem). */
function medir(url: string): Promise<{ largura: number; altura: number } | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ largura: img.naturalWidth, altura: img.naturalHeight })
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export function Envio() {
  const [itens, setItens] = useState<Item[]>([])
  const [etiquetas, setEtiquetas] = useState('')
  const [recusadas, setRecusadas] = useState<string[]>([])
  const [arrastando, setArrastando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const entrada = useRef<HTMLInputElement>(null)
  const previas = useRef(new Set<string>())

  // as prévias são URLs de objeto: saem da memória quando a tela fecha
  useEffect(() => {
    const todas = previas.current
    return () => todas.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  function adicionar(lista: FileList | File[]) {
    const novas: Item[] = []
    const fora: string[] = []
    for (const arquivo of Array.from(lista)) {
      if (!(TIPOS_ACEITOS as readonly string[]).includes(arquivo.type)) { fora.push(`${arquivo.name}: use PNG, JPG ou WebP.`); continue }
      if (arquivo.size > LIMITE_DA_IMAGEM) { fora.push(`${arquivo.name}: passa de 5 MB (${tamanhoLegivel(arquivo.size)}).`); continue }
      const previa = URL.createObjectURL(arquivo)
      previas.current.add(previa)
      novas.push({ chave: crypto.randomUUID(), arquivo, previa, nome: nomeDoArquivo(arquivo.name), largura: null, altura: null, estado: 'pronta' })
    }
    setRecusadas(fora)
    if (!novas.length) return
    setItens((atuais) => [...atuais, ...novas])
    for (const n of novas) {
      medir(n.previa).then((m) => m && setItens((atuais) => atuais.map((i) => (i.chave === n.chave ? { ...i, ...m } : i))))
    }
  }

  function remover(chave: string) {
    setItens((atuais) => {
      const item = atuais.find((i) => i.chave === chave)
      if (item) { URL.revokeObjectURL(item.previa); previas.current.delete(item.previa) }
      return atuais.filter((i) => i.chave !== chave)
    })
  }

  const mudar = (chave: string, parte: Partial<Item>) =>
    setItens((atuais) => atuais.map((i) => (i.chave === chave ? { ...i, ...parte } : i)))

  function limparEnviadas() {
    itens.filter((i) => i.estado === 'enviada').forEach((i) => remover(i.chave))
  }

  // Uma por vez: cada foto é um pedido próprio, abaixo do limite da função.
  async function enviarTodas() {
    setEnviando(true)
    for (const item of itens) {
      if (item.estado === 'enviada' || item.estado === 'enviando') continue
      mudar(item.chave, { estado: 'enviando', erro: undefined })
      const dados = new FormData()
      dados.set('arquivo', item.arquivo)
      dados.set('nome', item.nome)
      dados.set('etiquetas', etiquetas)
      if (item.largura) dados.set('largura', String(item.largura))
      if (item.altura) dados.set('altura', String(item.altura))
      try {
        const r = await enviarImagem(dados)
        mudar(item.chave, r.ok ? { estado: 'enviada' } : { estado: 'erro', erro: r.erro })
      } catch {
        mudar(item.chave, { estado: 'erro', erro: 'A conexão caiu. Tente de novo.' })
      }
    }
    setEnviando(false)
  }

  const pendentes = itens.filter((i) => i.estado !== 'enviada').length
  const enviadas = itens.length - pendentes
  const etiquetasLidas = lerEtiquetas(etiquetas)

  return (
    <div className={e.grade}>
      <section>
        <label
          className={`${e.zona} ${arrastando ? e.zonaAtiva : ''}`}
          onDragOver={(ev) => { ev.preventDefault(); setArrastando(true) }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(ev) => { ev.preventDefault(); setArrastando(false); adicionar(ev.dataTransfer.files) }}
        >
          <input ref={entrada} className={e.oculto} type="file" accept={ACEITAS} multiple disabled={enviando}
            onChange={(ev) => { if (ev.target.files) adicionar(ev.target.files); ev.target.value = '' }} />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
          </svg>
          <span className={e.zonaTitulo}>Arraste as fotos para cá</span>
          <span className={e.zonaSub}>ou <span className={p.link}>escolha no computador</span>, várias de uma vez</span>
        </label>

        {recusadas.length > 0 && (
          <ul className={e.recusadas} role="alert">
            {recusadas.map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}

        {itens.length > 0 && (
          <ul className={e.lista} aria-label="Imagens escolhidas">
            {itens.map((i) => (
              <li key={i.chave} className={`${p.card} ${e.item}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- prévia local (URL de objeto) */}
                <img className={e.miniatura} src={i.previa} alt="" />
                <div className={e.dados}>
                  <label className={p.rotulo} htmlFor={`nome-${i.chave}`}>Nome</label>
                  <input id={`nome-${i.chave}`} className={p.campo} value={i.nome} maxLength={LIMITE_DO_NOME}
                    disabled={i.estado === 'enviando' || i.estado === 'enviada'}
                    onChange={(ev) => mudar(i.chave, { nome: ev.target.value })} />
                  <p className={p.ajuda}>
                    {tamanhoLegivel(i.arquivo.size)}{i.largura && i.altura ? ` · ${i.largura} × ${i.altura} px` : ''}
                  </p>
                  {i.erro && <p className={p.erro}>{i.erro}</p>}
                </div>
                <div className={e.lado}>
                  <span className={`${p.chip} ${i.estado === 'enviada' ? p.chipOk : i.estado === 'erro' ? p.chipEspera : p.chipNeutro}`}>
                    {ROTULO[i.estado]}
                  </span>
                  {i.estado !== 'enviando' && i.estado !== 'enviada' && (
                    <button type="button" className={`${p.btnFino} ${p.btnPerigo}`} onClick={() => remover(i.chave)} disabled={enviando}
                      aria-label={`Tirar ${i.nome} da lista`}>
                      Tirar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className={`${p.card} ${e.painel}`}>
        <div>
          <label className={p.rotulo} htmlFor="etiquetas">Etiquetas</label>
          <input id="etiquetas" className={p.campo} placeholder="acampamento, investidura, 2026"
            value={etiquetas} onChange={(ev) => setEtiquetas(ev.target.value)} disabled={enviando} />
          <p className={p.ajuda}>Separe por vírgula. Valem para todas as fotos desta leva e ajudam a achar na galeria.</p>
          {etiquetasLidas.length > 0 && (
            <div className={e.etiquetas}>
              {etiquetasLidas.map((t) => <span key={t} className={`${p.chip} ${p.chipOk}`}>{t}</span>)}
            </div>
          )}
        </div>

        <div className={e.resumo}>
          <span>{itens.length === 0 ? 'Nenhuma foto escolhida.' : `${itens.length} ${itens.length === 1 ? 'foto' : 'fotos'}`}</span>
          {enviadas > 0 && <span>{enviadas} {enviadas === 1 ? 'enviada' : 'enviadas'}</span>}
        </div>

        <button type="button" className={`${p.btnGold} ${p.btnLargo}`} onClick={enviarTodas} disabled={enviando || pendentes === 0}>
          {enviando ? 'Enviando…' : pendentes > 0 ? `Enviar ${pendentes} ${pendentes === 1 ? 'imagem' : 'imagens'}` : 'Enviar imagens'}
        </button>
        {enviadas > 0 && !enviando && (
          <div className={e.depois}>
            <LinkDeRota href="/galeria" className={p.btnPine}>Ver na galeria</LinkDeRota>
            <button type="button" className={p.btnFino} onClick={limparEnviadas}>Limpar enviadas</button>
          </div>
        )}
      </aside>
    </div>
  )
}
