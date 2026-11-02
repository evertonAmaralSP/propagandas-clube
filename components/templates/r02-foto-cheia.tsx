import { ARCHIVO, ARCHIVO_BLACK } from './fontes'
import { dataBarra, hora, itensComMarcadores } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, IconeLocal, Logo } from './pecas'

// "RR 02 · Foto cheia" do canvas Chamadas do Clube: foto de fundo na tela inteira, degradê azul
// embaixo, selo redondo girado, faixa inclinada com o título e o rodapé com o local.

// sem foto: o espaço tracejado ocupa só a parte de cima, como no canvas
const vazioFundo = {
  position: 'absolute' as const, left: 16, top: 16, right: 16, width: 'auto', height: 440, borderRadius: 12,
  border: '2px dashed rgba(255,255,255,0.55)', background: 'transparent', fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.85)',
}

function Arte({ v }: PropsDaArte) {
  const faixa = txt(v, 'faixa')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#0B2A6B', fontFamily: ARCHIVO, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 960 }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto de fundo (tela inteira)" estiloVazio={vazioFundo} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 440, width: 540, height: 520, background: 'linear-gradient(180deg, rgba(11,42,107,0) 0%, rgba(11,42,107,0.94) 40%)' }} />

      <Logo src={txt(v, 'logo')} lado={88} estilo={{ left: 32, top: 32 }} />
      <div style={{ position: 'absolute', right: 32, top: 40, width: 100, height: 100, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transform: 'rotate(10deg)', fontFamily: ARCHIVO_BLACK, fontSize: 16, lineHeight: 1.05, whiteSpace: 'pre-line', color: '#0B2A6B' }}>
        {txt(v, 'selo')}
      </div>

      <div style={{ position: 'absolute', left: -30, top: 470, width: 600, padding: '14px 0 12px', background: faixa, transform: 'rotate(-4deg)', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontFamily: ARCHIVO_BLACK, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 84), lineHeight: 0.95, whiteSpace: 'pre-line', color: '#0B2A6B' }}>{txt(v, 'titulo')}</h1>
      </div>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 700, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', color: faixa }}>QUANDO</span>
          <span style={{ fontFamily: ARCHIVO_BLACK, fontSize: 34, lineHeight: 1.05 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>{txt(v, 'hora')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', color: faixa }}>LEVE</span>
          <span style={{ fontWeight: 500, fontSize: 14, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{txt(v, 'itens')}</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 36, display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '2px solid rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 16 }}>
        <IconeLocal cor={faixa} />
        <span>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const r02FotoCheia: DefinicaoDeTemplate = {
  id: 'rr-foto-cheia',
  nome: 'Foto cheia',
  descricao: 'Foto na tela inteira, faixa inclinada com o título e selo redondo.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    selo: seTiver(i.chamada), titulo: i.titulo, itens: seTiver(itensComMarcadores(i)),
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 84, min: 48, max: 110, passo: 2 },
    { tipo: 'texto', chave: 'selo', rotulo: 'Selo', secao: 'Texto', padrao: 'TODO\nSÁBADO', multilinha: true, maximo: 24 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: '• Bíblia\n• caderno de classe\n• garrafa de água\n• lenço\n• blusa do clube', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto de fundo', secao: 'Imagens' },
    { tipo: 'cor', chave: 'faixa', rotulo: 'Faixa', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#7CCB6B', nome: 'Verde' },
    ] },
  ],
}
