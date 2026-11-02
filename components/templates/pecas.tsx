import type { CSSProperties } from 'react'

// Peças que os templates dividem: foto com espaço marcado quando falta, logo e o ícone de local.

/** A foto ocupa a caixa inteira; sem foto, aparece o espaço tracejado (só na prévia: sem todas as fotos o editor não gera). */
export function Foto({ src, rotulo, estiloVazio }: { src: string; rotulo: string; estiloVazio?: CSSProperties }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage; o PNG sai do DOM
    return <img src={src} alt="" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  }
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box', border: '2px dashed #8A8A8A', background: '#E4E2DD',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, color: '#5C5C5C',
      ...estiloVazio,
    }}>
      {rotulo}
    </div>
  )
}

/** O logo cabe na caixa sem cortar. Sem logo escolhido, a arte sai sem ele. */
export function Logo({ src, lado, estilo }: { src: string; lado: number; estilo: CSSProperties }) {
  if (!src) return null
  return (
    <div style={{ position: 'absolute', width: lado, height: lado, display: 'flex', alignItems: 'center', justifyContent: 'center', ...estilo }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage; o PNG sai do DOM */}
      <img src={src} alt="" crossOrigin="anonymous" style={{ maxWidth: lado, maxHeight: lado, objectFit: 'contain', display: 'block' }} />
    </div>
  )
}

export function IconeLocal({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
