import { ARCHIVO, ARCHIVO_BLACK } from './fontes'
import { dataBarra, hora, itensComMarcadores, tamanhoQueCabe, tituloEmUmaLinha } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, IconeLocal, Logo } from './pecas'

// "02 · Trilha" do canvas Chamadas do Clube: foto de fundo na tela inteira, degradê verde embaixo,
// selo redondo com a distância, faixa inclinada com o título, quando/leve em duas colunas e o local.

function Arte({ v }: PropsDaArte) {
  const faixa = txt(v, 'faixa')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#1E3A24', fontFamily: ARCHIVO, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 960 }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto de fundo (tela inteira)"
          estiloVazio={{ position: 'absolute', left: 16, top: 16, width: 508, height: 440, border: '2px dashed rgba(255,255,255,0.55)', borderRadius: 12, background: 'transparent', fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.85)' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 480, width: 540, height: 480, background: 'linear-gradient(180deg, rgba(20,40,24,0) 0%, rgba(20,40,24,0.92) 45%)' }} />

      <Logo src={txt(v, 'logo')} lado={88} estilo={{ left: 32, top: 32 }} />
      {/* a distância é própria de cada trilha: sem ela, o selo some */}
      {txt(v, 'distancia') && (
        <div style={{ position: 'absolute', right: 32, top: 40, width: 96, height: 96, borderRadius: '50%', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(10deg)', color: '#1E3A24' }}>
          <span style={{ fontFamily: ARCHIVO_BLACK, fontSize: 30, lineHeight: 1 }}>{txt(v, 'distancia')}</span>
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>{txt(v, 'distanciaRotulo')}</span>
        </div>
      )}

      <div style={{ position: 'absolute', left: -30, top: 500, width: 600, padding: '14px 0 10px', background: faixa, transform: 'rotate(-5deg)', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontFamily: ARCHIVO_BLACK, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 96), lineHeight: 1, letterSpacing: '-0.01em', color: '#142818' }}>{txt(v, 'titulo')}</h1>
      </div>
      <p style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 640, fontWeight: 700, fontSize: 22, lineHeight: 1.3, color: '#FFFFFF' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 720, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', color: faixa }}>QUANDO</span>
          <span style={{ fontFamily: ARCHIVO_BLACK, fontSize: 30, lineHeight: 1.05 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{txt(v, 'hora')}</span>
        </div>
        {txt(v, 'itens') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', color: faixa }}>LEVE</span>
            <span style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{txt(v, 'itens')}</span>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 36, display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '2px solid rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 16 }}>
        <IconeLocal cor={faixa} />
        <span>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const t02Trilha: DefinicaoDeTemplate = {
  id: 'ev-trilha',
  nome: 'Trilha',
  descricao: 'Foto de fundo inteira, faixa inclinada com o título e selo da distância.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: a distância é desta trilha e fica vazia (o selo some); "Saída 7H00" vira só a hora
  deInformacoes: (i) => ({
    // a faixa tem uma linha só: o título vai inteiro nela, no tamanho que cabe
    titulo: tituloEmUmaLinha(i), tamanhoTitulo: tamanhoQueCabe(tituloEmUmaLinha(i), 520, 96, 0.72),
    frase: i.frase, itens: itensComMarcadores(i), distancia: '', distanciaRotulo: '',
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'TRILHA', maximo: 20 },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 96, min: 48, max: 120, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Pé na estrada, Bíblia na mochila e muita natureza pela frente.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'distancia', rotulo: 'Distância', secao: 'Texto', padrao: '8 KM', maximo: 6 },
    { tipo: 'texto', chave: 'distanciaRotulo', rotulo: 'Rótulo da distância', secao: 'Texto', padrao: 'DE TRILHA', maximo: 12 },
    { tipo: 'texto', chave: 'itens', rotulo: 'O que levar', secao: 'Texto', padrao: '• tênis fechado\n• água e lanche\n• boné e protetor', multilinha: true, maximo: 120 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '15|11', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: 'Saída 7H00', maximo: 20 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: '[Ponto de encontro]', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto de fundo', secao: 'Imagens' },
    { tipo: 'cor', chave: 'faixa', rotulo: 'Faixa', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo' }, { valor: '#7CCB6B', nome: 'Verde' }, { valor: '#FF8A3D', nome: 'Laranja' },
    ] },
  ],
}
