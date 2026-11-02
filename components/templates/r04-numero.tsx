import { ANTON, MONTSERRAT } from './fontes'
import { dataBarra, dia, hora, itensComPontos } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 04 · Número gigante" do canvas Chamadas do Clube: o dia em contorno gigante ao fundo, título
// condensado, três polaroides tortas e a faixa de baixo com data, hora e local.

const vazioPolaroide = { border: '2px dashed #8A8A8A', background: '#EEEDE9', fontWeight: 700, fontSize: 14, color: '#555' }
const POLAROIDES = [
  { n: 1, left: 22, top: 490, giro: -5 },
  { n: 2, left: 190, top: 478, giro: 3 },
  { n: 3, left: 358, top: 494, giro: -2 },
]

function Arte({ v }: PropsDaArte) {
  const fundo = txt(v, 'fundo')
  const cor = txt(v, 'cor')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: fundo, fontFamily: MONTSERRAT, color: cor }}>
      <p style={{ margin: 0, position: 'absolute', right: -20, top: -50, fontFamily: ANTON, fontSize: 380, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${cor}`, opacity: 0.3 }}>{txt(v, 'numero')}</p>

      <Logo src={txt(v, 'logo')} lado={92} estilo={{ left: 30, top: 30 }} />

      <p style={{ margin: 0, position: 'absolute', left: 36, top: 250, fontWeight: 800, fontSize: 16, letterSpacing: '0.2em' }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 32, right: 32, top: 276, fontFamily: ANTON, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 100), lineHeight: 0.92, whiteSpace: 'pre-line', color: cor }}>
        {txt(v, 'titulo')}
      </h1>

      {POLAROIDES.map((p) => (
        <div key={p.n} style={{ position: 'absolute', left: p.left, top: p.top, width: 160, height: 200, boxSizing: 'border-box', padding: 8, background: '#FFFFFF', transform: `rotate(${p.giro}deg)`, boxShadow: '0 8px 18px rgba(0,0,0,0.18)' }}>
          <Foto src={txt(v, `foto${p.n}`)} rotulo={`Foto ${p.n}`} estiloVazio={vazioPolaroide} />
        </div>
      ))}

      <div style={{ position: 'absolute', left: 36, right: 36, top: 718, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.18em' }}>ITENS ESSENCIAIS</span>
        <span style={{ fontWeight: 600, fontStyle: 'italic', fontSize: 16, lineHeight: 1.4 }}>{txt(v, 'itens')}</span>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, background: cor, color: fundo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: ANTON, fontSize: 46, lineHeight: 1 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 700, fontSize: 26, color: '#FFFFFF' }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#FFFFFF' }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const r04Numero: DefinicaoDeTemplate = {
  id: 'rr-numero',
  nome: 'Número gigante',
  descricao: 'O dia em contorno gigante ao fundo, título condensado e três polaroides.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    numero: dia(i), antes: seTiver(i.chamada), titulo: i.titulo, itens: seTiver(itensComPontos(i)),
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'numero', rotulo: 'Número', secao: 'Texto', padrao: '05', maximo: 3 },
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'ESTE SÁBADO TEM', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 100, min: 50, max: 124, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Bíblia · caderno de classe · garrafa de água · lenço · blusa do clube', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#9FD3A8', nome: 'Verde claro' },
    ] },
    { tipo: 'cor', chave: 'cor', rotulo: 'Texto e faixa', secao: 'Cores', padrao: '#0B3FA8', opcoes: [
      { valor: '#0B3FA8', nome: 'Azul' }, { valor: '#1F5E30', nome: 'Verde mata' }, { valor: '#8A2E0B', nome: 'Terracota' },
    ] },
  ],
}
