import type { CSSProperties } from 'react'
import { ANTON, MONTSERRAT } from './fontes'
import { dataBarra, dia, hora } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "04 · Dia do Desbravador" do canvas Chamadas do Clube: número gigante vazado ao fundo, título em
// Anton, três fotos tipo polaroide inclinadas e a faixa de baixo com data, hora e local.

const polaroide: CSSProperties = {
  position: 'absolute', width: 160, height: 210, boxSizing: 'border-box', padding: 8, background: '#FFFFFF', boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
}
const vazio: CSSProperties = { border: '2px dashed #8A8A8A', background: '#EEEDE9', fontWeight: 700, fontSize: 14, color: '#555' }

function Arte({ v }: PropsDaArte) {
  const fundo = txt(v, 'fundo')
  const cor = txt(v, 'cor')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: fundo, fontFamily: MONTSERRAT, color: cor }}>
      <p style={{ margin: 0, position: 'absolute', left: -10, top: -40, fontFamily: ANTON, fontSize: 360, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${cor}`, opacity: 0.35 }}>{txt(v, 'numero')}</p>

      <Logo src={txt(v, 'logo')} lado={92} estilo={{ right: 30, top: 30 }} />

      {/* evento sem chamada: o espaço fica vazio, sem texto de outro evento */}
      <p style={{ margin: 0, position: 'absolute', left: 36, top: 250, fontWeight: 800, fontSize: 16, letterSpacing: '0.2em' }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 32, right: 32, top: 276, fontFamily: ANTON, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 92), lineHeight: 0.92, whiteSpace: 'pre-line', color: cor }}>{txt(v, 'titulo')}</h1>

      <div style={{ ...polaroide, left: 22, top: 480, transform: 'rotate(-5deg)' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1" estiloVazio={vazio} />
      </div>
      <div style={{ ...polaroide, left: 190, top: 468, transform: 'rotate(3deg)' }}>
        <Foto src={txt(v, 'foto2')} rotulo="Foto 2" estiloVazio={vazio} />
      </div>
      <div style={{ ...polaroide, left: 358, top: 484, transform: 'rotate(-2deg)' }}>
        <Foto src={txt(v, 'foto3')} rotulo="Foto 3" estiloVazio={vazio} />
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 724, textAlign: 'center', fontWeight: 700, fontSize: 19, lineHeight: 1.35 }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: cor, color: fundo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: ANTON, fontSize: 46, lineHeight: 1 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 700, fontSize: 26, color: '#FFFFFF' }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#FFFFFF' }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const t04DiaDesbravador: DefinicaoDeTemplate = {
  id: 'ev-dia-desbravador',
  nome: 'Dia do Desbravador',
  descricao: 'Número gigante vazado, título em Anton e três fotos tipo polaroide.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: o número gigante é o dia do evento; chamada e frase vazias ficam vazias
  deInformacoes: (i) => ({
    numero: dia(i), antes: i.chamada, titulo: i.titulo, frase: i.frase, data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'numero', rotulo: 'Número de fundo', secao: 'Texto', padrao: '20', maximo: 3 },
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'VEM AÍ O', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'DIA DO\nDESBRAVADOR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 92, min: 50, max: 120, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Venha de uniforme completo e traga a família!', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '20|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '9H00', maximo: 20 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#9FD3A8', nome: 'Verde claro' },
    ] },
    { tipo: 'cor', chave: 'cor', rotulo: 'Destaque', secao: 'Cores', padrao: '#0B3FA8', opcoes: [
      { valor: '#0B3FA8', nome: 'Azul' }, { valor: '#1F5E30', nome: 'Verde' }, { valor: '#8A2E0B', nome: 'Terracota' },
    ] },
  ],
}
