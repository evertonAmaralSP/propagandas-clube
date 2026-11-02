import type { CSSProperties } from 'react'
import { ANTON, CAVEAT, MONTSERRAT } from './fontes'
import { dataBarra, hora } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "11 · Aniversário do clube" do canvas Chamadas do Clube: círculo de destaque com os anos do clube,
// chamada manuscrita, título pesado, fileira de quatro fotos arredondadas e data + hora embaixo.

const caixaDaFoto: CSSProperties = { height: 120, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.12)' }
const vazioDaFoto: CSSProperties = { border: '2px dashed rgba(255,255,255,0.5)', borderRadius: 10, background: 'transparent', color: '#FFFFFF', fontSize: 13 }

function Arte({ v }: PropsDaArte) {
  const fundo = txt(v, 'fundo')
  const destaque = txt(v, 'destaque')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: fundo, fontFamily: MONTSERRAT, color: '#FFFFFF' }}>
      <Logo src={txt(v, 'logo')} lado={84} estilo={{ left: 30, top: 30 }} />

      {/* o círculo dos anos só aparece com número ou rótulo (o "10 ANOS" do padrão não vale para outro clube) */}
      {(txt(v, 'numero') || txt(v, 'numeroRotulo')) && (
        <div style={{ position: 'absolute', left: 120, top: 90, width: 300, height: 300, borderRadius: '50%', background: destaque, color: fundo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: ANTON, fontSize: 170, lineHeight: 0.95 }}>{txt(v, 'numero')}</span>
          <span style={{ fontFamily: ANTON, fontSize: 40, lineHeight: 1, letterSpacing: '0.12em' }}>{txt(v, 'numeroRotulo')}</span>
        </div>
      )}

      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', fontFamily: CAVEAT, fontWeight: 700, fontSize: 38, color: destaque }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 24, right: 24, top: 456, textAlign: 'center', fontFamily: ANTON, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 70), lineHeight: 0.95, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>
      <p style={{ margin: 0, position: 'absolute', left: 50, right: 50, top: 610, textAlign: 'center', fontWeight: 500, fontSize: 17, lineHeight: 1.4, color: '#E3E8F3' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 20, right: 20, top: 680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={caixaDaFoto}>
            <Foto src={txt(v, `foto${n}`)} rotulo={`Foto ${n}`} estiloVazio={vazioDaFoto} />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: ANTON, fontSize: 44, lineHeight: 1, color: destaque }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 700, fontSize: 24 }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const t11Aniversario: DefinicaoDeTemplate = {
  id: 'ev-aniversario',
  nome: 'Aniversário do clube',
  descricao: 'Festa: círculo com os anos do clube, chamada manuscrita e quatro fotos em fileira.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: os anos do clube não estão nas informações, então número e rótulo ficam vazios (e o
  // círculo some até a pessoa preencher); chamada e frase vazias ficam vazias
  deInformacoes: (i) => ({
    numero: '', numeroRotulo: '', antes: i.chamada, titulo: i.titulo, frase: i.frase, data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'numero', rotulo: 'Número', secao: 'Texto', padrao: '10', maximo: 3, ajuda: 'Quantos anos o clube faz.' },
    { tipo: 'texto', chave: 'numeroRotulo', rotulo: 'Rótulo do número', secao: 'Texto', padrao: 'ANOS', maximo: 10 },
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'Vem comemorar com a gente!', maximo: 32 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'ANIVERSÁRIO\nDO CLUBE', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 70, min: 44, max: 96, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Culto de gratidão, bolo e muitas histórias para contar.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '18|10', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '16H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto4', rotulo: 'Foto 4', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0B3FA8', opcoes: [
      { valor: '#0B3FA8', nome: 'Azul' }, { valor: '#1F5E30', nome: 'Verde' }, { valor: '#5A1E6B', nome: 'Roxo' },
    ] },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Destaque', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#FF8A3D', nome: 'Laranja' },
    ] },
  ],
}
