import type { CSSProperties } from 'react'
import { ANTON, GOCHI, RALEWAY } from './fontes'
import { diaDeMes, hora, itensComMarcadores, temItens } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "Template · Traga um amigo" do canvas Chamadas do Clube: seis fotos como polaroides tortas em
// volta do título, data e local no alto, um destaque circulado e a lista escrita à mão.

const vazioPolaroide: CSSProperties = { border: '2px dashed #9A9A9A', background: '#ECEBE8', fontWeight: 700 }

function Polaroide({ src, n, estilo }: { src: string; n: number; estilo: CSSProperties }) {
  return (
    <div style={{ position: 'absolute', boxSizing: 'border-box', padding: '10px 10px 30px', background: '#FFFFFF', boxShadow: '0 6px 18px rgba(0,0,0,0.25)', ...estilo }}>
      <Foto src={src} rotulo={`Foto ${n}`} estiloVazio={vazioPolaroide} />
    </div>
  )
}

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  const foto = (n: number) => txt(v, `foto${n}`)
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: RALEWAY, color: cor }}>
      <Polaroide n={1} src={foto(1)} estilo={{ left: -20, top: -14, width: 190, height: 210, transform: 'rotate(-6deg)' }} />
      <Polaroide n={2} src={foto(2)} estilo={{ left: 168, top: 10, width: 210, height: 170, transform: 'rotate(3deg)' }} />
      <Polaroide n={3} src={foto(3)} estilo={{ left: 372, top: -10, width: 190, height: 200, transform: 'rotate(7deg)' }} />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 222, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 50, height: 2, background: '#FFFFFF' }} />
          <span style={{ fontFamily: ANTON, fontSize: 34, letterSpacing: '0.01em' }}>{txt(v, 'data')} · {txt(v, 'hora')}</span>
          <span style={{ width: 50, height: 2, background: '#FFFFFF' }} />
        </div>
        <span style={{ fontWeight: 500, fontSize: 18, color: '#FFFFFF', textAlign: 'center', maxWidth: 440 }}>{txt(v, 'local')}</span>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ margin: 0, fontFamily: ANTON, fontSize: 62, lineHeight: 1, textAlign: 'center', color: '#FFFFFF', textShadow: '3px 3px 0 rgba(11,63,168,0.35)' }}>{txt(v, 'subtitulo')}</p>
        <h1 style={{ margin: 0, fontFamily: ANTON, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 104), lineHeight: 0.95, textAlign: 'center', whiteSpace: 'pre-line', textShadow: '4px 4px 0 rgba(255,255,255,0.55)' }}>
          {txt(v, 'titulo')}
        </h1>
      </div>

      {txt(v, 'destaque') && <div style={{ position: 'absolute', left: 86, top: 530, width: 368, height: 66, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${cor}`, borderRadius: '50%', transform: 'rotate(-3deg)' }}>
        <span style={{ fontFamily: ANTON, fontSize: 26, color: '#FFFFFF', textShadow: '2px 2px 0 rgba(11,63,168,0.45)' }}>{txt(v, 'destaque')}</span>
      </div>}

      <div style={{ position: 'absolute', left: 150, top: 616, width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ margin: 0, fontFamily: GOCHI, fontSize: 22, lineHeight: 1.15, whiteSpace: 'pre-line' }}>{txt(v, 'itens')}</p>
      </div>

      <Polaroide n={4} src={foto(4)} estilo={{ left: -16, top: 600, width: 168, height: 196, transform: 'rotate(-5deg)' }} />
      <Polaroide n={5} src={foto(5)} estilo={{ left: 396, top: 590, width: 168, height: 200, transform: 'rotate(6deg)' }} />
      <Polaroide n={6} src={foto(6)} estilo={{ left: 110, top: 790, width: 320, height: 200, transform: 'rotate(-2deg)' }} />

      <Logo src={txt(v, 'logo')} lado={96} estilo={{ right: 26, top: 808 }} />
    </div>
  )
}

export const tragaUmAmigo: DefinicaoDeTemplate = {
  id: 'traga-um-amigo',
  nome: 'Traga um amigo',
  descricao: 'Reunião especial com convidados: seis fotos em polaroide, destaque circulado e lista à mão.',
  largura: 540,
  categoria: 'eventos',
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    titulo: i.titulo, subtitulo: i.chamada, destaque: i.frase,
    itens: temItens(i) ? `NÃO ESQUEÇA:\n${itensComMarcadores(i)}` : '',
    data: diaDeMes(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'TRAGA UM\nAMIGO!', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 104, min: 56, max: 130, passo: 2 },
    { tipo: 'texto', chave: 'subtitulo', rotulo: 'Subtítulo', secao: 'Texto', padrao: 'REUNIÃO ESPECIAL', maximo: 24 },
    { tipo: 'texto', chave: 'destaque', rotulo: 'Destaque circulado', secao: 'Texto', padrao: 'QUEM VEM GANHA LENÇO!', maximo: 26 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Lista à mão', secao: 'Texto', padrao: 'NÃO ESQUEÇA:\n• garrafinha de água\n• Bíblia e lenço\n• roupa confortável\n• seu convidado!', multilinha: true, maximo: 160 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '10 DE OUT', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H', maximo: 8 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Espaço Verde Chico Mendes', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    ...[1, 2, 3, 4, 5, 6].map((n) => ({ tipo: 'foto' as const, chave: `foto${n}`, rotulo: `Foto ${n}`, secao: 'Imagens' as const })),
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#AEB9CC', opcoes: [
      { valor: '#AEB9CC', nome: 'Azul acinzentado' }, { valor: '#F2C14E', nome: 'Amarelo' }, { valor: '#9FD3A8', nome: 'Verde claro' },
    ] },
    { tipo: 'cor', chave: 'cor', rotulo: 'Cor do texto', secao: 'Cores', padrao: '#0B3FA8', opcoes: [
      { valor: '#0B3FA8', nome: 'Azul' }, { valor: '#1F5E30', nome: 'Verde' }, { valor: '#8A2E0B', nome: 'Marrom' },
    ] },
  ],
}
