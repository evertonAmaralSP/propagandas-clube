import { BEBAS, OUTFIT } from './fontes'
import { dataBarra, hora, itensEmFrase, temItens } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 07 · Holofote" do canvas Chamadas do Clube: fundo escuro, círculo colorido atrás da foto
// redonda, ícone de barraca, título condensado centralizado e data • hora embaixo.

function Arte({ v }: PropsDaArte) {
  const destaque = txt(v, 'destaque')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: OUTFIT, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 70, top: 110, width: 400, height: 400, borderRadius: '50%', background: destaque }} />
      <div style={{ position: 'absolute', left: 110, top: 150, width: 320, height: 320, borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.12)' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1" estiloVazio={{ border: '2px dashed rgba(255,255,255,0.6)', borderRadius: '50%', background: 'transparent', fontWeight: 600, fontSize: 15, color: '#FFFFFF' }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={80} estilo={{ left: 28, top: 28 }} />
      <svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke={destaque} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: 'absolute', right: 36, top: 40 }}>
        <path d="M3 20L12 4l9 16H3z" /><path d="M12 4v16M9 20l3-6 3 6" />
      </svg>

      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', fontWeight: 600, fontSize: 16, letterSpacing: '0.32em', color: destaque }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 24, right: 24, top: 566, textAlign: 'center', fontFamily: BEBAS, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 96), lineHeight: 0.9, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>
      <p style={{ margin: 0, position: 'absolute', left: 50, right: 50, top: 738, textAlign: 'center', fontSize: 16, lineHeight: 1.45, color: '#DCE3F2' }}>{txt(v, 'itens')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: BEBAS, fontSize: 48, lineHeight: 1, color: destaque }}>{txt(v, 'data')}</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} />
          <span style={{ fontFamily: BEBAS, fontSize: 48, lineHeight: 1 }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const r07Holofote: DefinicaoDeTemplate = {
  id: 'rr-holofote',
  nome: 'Holofote',
  descricao: 'Fundo escuro, foto redonda sobre um círculo colorido e título centralizado.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    antes: seTiver(i.chamada), titulo: i.titulo, itens: temItens(i) ? `Não esqueça: ${itensEmFrase(i)}.` : undefined,
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'TE ESPERAMOS NA', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 96, min: 50, max: 120, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Não esqueça: Bíblia, caderno de classe, garrafa de água, lenço e blusa do clube.', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0A1A44', opcoes: [
      { valor: '#0A1A44', nome: 'Azul noite' }, { valor: '#111111', nome: 'Preto' }, { valor: '#12321E', nome: 'Verde mata' },
    ] },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Destaque', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#7CCB6B', nome: 'Verde claro' }, { valor: '#4FC3F7', nome: 'Azul céu' },
    ] },
  ],
}
