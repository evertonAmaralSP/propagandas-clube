import { INTER, OSWALD } from './fontes'
import { dataBarra, hora } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "10 · Desfile cívico" do canvas Chamadas do Clube: faixas listradas em cima e embaixo, logo
// centralizado, título em caixa alta, foto com moldura branca e quadro de data, hora e local.

function Arte({ v }: PropsDaArte) {
  const faixa1 = txt(v, 'faixa1')
  const faixa2 = txt(v, 'faixa2')
  const listras = `repeating-linear-gradient(-45deg, ${faixa1} 0 22px, ${faixa2} 22px 44px)`
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: INTER, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 36, background: listras }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 540, height: 36, background: listras }} />

      <Logo src={txt(v, 'logo')} lado={92} estilo={{ left: 224, top: 64 }} />

      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '0.3em', color: faixa2 }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 24, right: 24, top: 204, textAlign: 'center', fontFamily: OSWALD, fontWeight: 700, fontSize: num(v, 'tamanhoTitulo', 92), lineHeight: 0.98, textTransform: 'uppercase', whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 410, height: 270, boxSizing: 'border-box', border: '8px solid #FFFFFF', background: '#23345F' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ border: '2px dashed rgba(255,255,255,0.5)', background: 'transparent', color: 'rgba(255,255,255,0.85)', fontSize: 15 }} />
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 48, right: 48, top: 704, textAlign: 'center', fontWeight: 500, fontSize: 17, lineHeight: 1.45, color: '#E3E8F3' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 790, display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 0, border: `2px solid ${faixa2}` }}>
        <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: `2px solid ${faixa2}` }}>
          <span style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 34, lineHeight: 1, color: faixa2 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{txt(v, 'hora')}</span>
        </div>
        <div style={{ flex: 1.4, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 600, fontSize: 14, lineHeight: 1.35 }}>{txt(v, 'local')}</div>
      </div>
    </div>
  )
}

export const t10Desfile: DefinicaoDeTemplate = {
  id: 'ev-desfile',
  nome: 'Desfile cívico',
  descricao: 'Cívico: faixas listradas, título em caixa alta e foto com moldura branca.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: chamada e frase vazias ficam vazias ("7 DE SETEMBRO" só serve para o desfile); a hora
  // sai pura ("7H00"), sem o "Concentração" do padrão
  deInformacoes: (i) => ({
    antes: i.chamada, titulo: i.titulo, frase: i.frase, data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: '7 DE SETEMBRO', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Desfile\nCívico', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 92, min: 50, max: 120, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Uniforme de gala completo, sapato engraxado e postura de desbravador!', multilinha: true, maximo: 110 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '07|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: 'Concentração 7H', maximo: 24 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: '[Local da concentração]', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0E1F4D', opcoes: [
      { valor: '#0E1F4D', nome: 'Azul marinho' }, { valor: '#12321E', nome: 'Verde escuro' }, { valor: '#1C1C1C', nome: 'Preto' },
    ] },
    { tipo: 'cor', chave: 'faixa1', rotulo: 'Faixa 1', secao: 'Cores', padrao: '#1E8C45', opcoes: [
      { valor: '#1E8C45', nome: 'Verde' }, { valor: '#C62828', nome: 'Vermelho' }, { valor: '#0B47B5', nome: 'Azul' },
    ] },
    { tipo: 'cor', chave: 'faixa2', rotulo: 'Faixa 2', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#FF8A3D', nome: 'Laranja' },
    ] },
  ],
}
