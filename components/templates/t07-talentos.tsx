import { BEBAS, OUTFIT } from './fontes'
import { dataBarra, hora } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "07 · Noite de talentos" do canvas Chamadas do Clube: fundo preto, holofote redondo na cor de
// destaque com a foto no meio, microfone no canto, título condensado e data · hora embaixo.

function Arte({ v }: PropsDaArte) {
  const destaque = txt(v, 'destaque')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#111111', fontFamily: OUTFIT, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 70, top: 120, width: 400, height: 400, borderRadius: '50%', background: destaque }} />
      <div style={{ position: 'absolute', left: 110, top: 160, width: 320, height: 320, borderRadius: '50%', overflow: 'hidden', background: '#2A2A2A' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ border: '2px dashed rgba(255,255,255,0.5)', borderRadius: '50%', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: 15 }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={80} estilo={{ left: 28, top: 28 }} />
      <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke={destaque} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: 'absolute', right: 36, top: 40 }}>
        <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
      </svg>

      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 548, textAlign: 'center', fontWeight: 600, fontSize: 16, letterSpacing: '0.32em', color: destaque }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 24, right: 24, top: 574, textAlign: 'center', fontFamily: BEBAS, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 92), lineHeight: 0.9, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>
      <p style={{ margin: 0, position: 'absolute', left: 50, right: 50, top: 740, textAlign: 'center', fontWeight: 400, fontSize: 18, lineHeight: 1.4, color: '#D8D8D8' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: BEBAS, fontSize: 46, lineHeight: 1, color: destaque }}>{txt(v, 'data')}</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} />
          <span style={{ fontFamily: BEBAS, fontSize: 46, lineHeight: 1 }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#FFFFFF' }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const t07Talentos: DefinicaoDeTemplate = {
  id: 'ev-talentos',
  nome: 'Noite de talentos',
  descricao: 'Palco escuro: foto redonda num holofote colorido e título condensado.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: chamada e frase vazias ficam vazias (o padrão só serve para a noite de talentos)
  deInformacoes: (i) => ({
    antes: i.chamada, titulo: i.titulo, frase: i.frase, data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'PALCO ABERTO', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'NOITE DE\nTALENTOS', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 92, min: 50, max: 120, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Canto, música, poesia, mágica… inscreva sua apresentação com a diretoria!', multilinha: true, maximo: 110 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '06|12', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '19H30', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto', secao: 'Imagens' },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Destaque', secao: 'Cores', padrao: '#FFD23F', opcoes: [
      { valor: '#FFD23F', nome: 'Amarelo' }, { valor: '#FF6B9A', nome: 'Rosa' }, { valor: '#4FC3F7', nome: 'Azul claro' },
    ] },
  ],
}
