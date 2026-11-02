'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { semAcento } from '@/lib/imagens'
import type { FotoDaGaleria } from '@/components/templates/tipos-do-editor'
import ed from './editor.module.css'

/** Escolher uma foto da galeria para um espaço do template, com a mesma busca sem acento da galeria. */
export function SeletorDeFoto({ titulo, fotos, atual, escolher, fechar }: {
  titulo: string
  fotos: FotoDaGaleria[]
  atual: string
  escolher: (id: string) => void
  fechar: () => void
}) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const [busca, setBusca] = useState('')
  useEffect(() => { dialogo.current?.showModal() }, [])

  const visiveis = useMemo(() => {
    const termo = semAcento(busca.trim())
    return termo ? fotos.filter((f) => semAcento([f.nome, ...f.etiquetas].join(' ')).includes(termo)) : fotos
  }, [fotos, busca])

  const fecharDialogo = () => dialogo.current?.close()

  return (
    <dialog ref={dialogo} className={`${p.tokens} ${ed.dialogo}`} onClose={fechar} aria-labelledby="titulo-seletor"
      onClick={(e) => { if (e.target === e.currentTarget) fecharDialogo() }}>
      <div className={ed.dialogoCorpo}>
        <div className={ed.dialogoTopo}>
          <h2 id="titulo-seletor">{titulo}</h2>
          <button type="button" className={ed.fechar} onClick={fecharDialogo} aria-label="Fechar">×</button>
        </div>
        <input className={p.campo} type="search" placeholder="Buscar por nome ou etiqueta" aria-label="Buscar fotos"
          value={busca} onChange={(e) => setBusca(e.target.value)} autoFocus />
        {fotos.length === 0 ? (
          <p className={ed.nada}>A galeria está vazia. <LinkDeRota href="/enviar" className={p.link}>Envie fotos</LinkDeRota> primeiro.</p>
        ) : visiveis.length === 0 ? (
          <p className={ed.nada}>Nenhuma foto com essa busca.</p>
        ) : (
          <ul className={ed.opcoes}>
            {visiveis.map((f) => (
              <li key={f.id}>
                <button type="button" className={`${ed.opcao} ${f.id === atual ? ed.opcaoAtual : ''}`} aria-pressed={f.id === atual}
                  onClick={() => { escolher(f.id); fecharDialogo() }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage */}
                  <img src={f.url} alt="" loading="lazy" decoding="async" />
                  <span>{f.nome}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {atual && (
          <button type="button" className={`${p.btnFino} ${p.btnPerigo}`} onClick={() => { escolher(''); fecharDialogo() }}>
            Tirar a foto deste espaço
          </button>
        )}
      </div>
    </dialog>
  )
}
