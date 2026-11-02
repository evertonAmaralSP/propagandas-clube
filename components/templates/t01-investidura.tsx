import { MONTSERRAT, PLAYFAIR } from './fontes'
import { dataBarra, hora } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "01 · Investidura" do canvas Chamadas do Clube: moldura dupla dourada, logo centralizado, título
// em itálico serifado, uma foto redonda com aro, frase e data | hora.

function Arte({ v }: PropsDaArte) {
  const dourado = txt(v, 'dourado')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: MONTSERRAT, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 24, top: 24, right: 24, bottom: 24, border: `1px solid ${dourado}` }} />
      <div style={{ position: 'absolute', left: 32, top: 32, right: 32, bottom: 32, border: `1px solid ${dourado}`, opacity: 0.5 }} />

      <Logo src={txt(v, 'logo')} lado={96} estilo={{ left: 222, top: 60 }} />

      {/* evento sem chamada: o espaço fica vazio, sem texto de outro evento */}
      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 182, textAlign: 'center', fontWeight: 600, fontSize: 14, letterSpacing: '0.32em', color: dourado }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 40, right: 40, top: 206, textAlign: 'center', fontFamily: PLAYFAIR, fontStyle: 'italic', fontWeight: 600, fontSize: num(v, 'tamanhoTitulo', 84), lineHeight: 1, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 120, top: 340, width: 300, height: 300, boxSizing: 'border-box', padding: 8, border: `3px solid ${dourado}`, borderRadius: '50%' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
          <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
            estiloVazio={{ border: '2px dashed rgba(255,255,255,0.5)', borderRadius: '50%', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: 15 }} />
        </div>
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 60, right: 60, top: 672, textAlign: 'center', fontFamily: PLAYFAIR, fontStyle: 'italic', fontWeight: 500, fontSize: 22, lineHeight: 1.35, color: '#E9E3D3' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 60, right: 60, top: 752, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 38, color: dourado }}>{txt(v, 'data')}</span>
        <span style={{ width: 2, height: 40, background: dourado }} />
        <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 38, color: '#FFFFFF' }}>{txt(v, 'hora')}</span>
      </div>
      <p style={{ margin: 0, position: 'absolute', left: 60, right: 60, top: 830, textAlign: 'center', fontWeight: 600, fontSize: 15, letterSpacing: '0.06em', color: '#FFFFFF' }}>{txt(v, 'local')}</p>
    </div>
  )
}

export const t01Investidura: DefinicaoDeTemplate = {
  id: 'ev-investidura',
  nome: 'Investidura',
  descricao: 'Cerimônia: moldura dupla dourada, foto redonda e título em itálico.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: chamada e frase vazias ficam vazias (o padrão "CERIMÔNIA DE" só serve para investidura)
  deInformacoes: (i) => ({
    antes: i.chamada, titulo: i.titulo, frase: i.frase, data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'CERIMÔNIA DE', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Investidura', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 84, min: 48, max: 110, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Venha celebrar cada lenço e cada conquista.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '30|11', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '19H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0E1F4D', opcoes: [
      { valor: '#0E1F4D', nome: 'Azul marinho' }, { valor: '#1C1C1C', nome: 'Preto' }, { valor: '#3A0F1E', nome: 'Vinho' },
    ] },
    { tipo: 'cor', chave: 'dourado', rotulo: 'Detalhes', secao: 'Cores', padrao: '#D4A73A', opcoes: [
      { valor: '#D4A73A', nome: 'Dourado' }, { valor: '#C0C0C0', nome: 'Prata' }, { valor: '#E8C98A', nome: 'Champanhe' },
    ] },
  ],
}
