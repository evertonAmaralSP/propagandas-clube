'use client'
import type { Ref } from 'react'
import { classeFontesDasArtes } from './fontes'
import type { DefinicaoDeTemplate, Valores } from './motor'

/**
 * A arte em tamanho real (ex.: 540×960), só reduzida na tela. O `noRef` aponta para o nó sem
 * escala, de onde o PNG sai em tamanho cheio, como no editor.
 */
export function MiniArte({ t, v, largura, noRef, rotulo }: {
  t: DefinicaoDeTemplate; v: Valores; largura: number; noRef?: Ref<HTMLDivElement>; rotulo?: string
}) {
  const escala = largura / t.largura
  const Arte = t.Arte
  return (
    <div style={{ width: largura, height: t.altura * escala, overflow: 'hidden', position: 'relative', flex: 'none' }}
      role={rotulo ? 'img' : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: t.largura, height: t.altura, transform: `scale(${escala})`, transformOrigin: '0 0', pointerEvents: 'none' }}>
        <div ref={noRef} className={classeFontesDasArtes}><Arte v={v} /></div>
      </div>
    </div>
  )
}
