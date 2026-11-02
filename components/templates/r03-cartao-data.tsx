import { BEBAS, POPPINS } from './fontes'
import { dia, hora, itensEmFrase, mesCurto, temItens } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 03 · Cartão de data" do canvas Chamadas do Clube: foto no topo com cantos de baixo
// arredondados, cartão com dia e mês, título grande condensado, pílula de chamada e foto redonda.

function Arte({ v }: PropsDaArte) {
  const fundo = txt(v, 'fundo')
  const destaque = txt(v, 'destaque')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: fundo, fontFamily: POPPINS, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 450, borderRadius: '0 0 48px 48px', overflow: 'hidden', background: 'rgba(0,0,0,0.15)' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1" estiloVazio={{
          position: 'absolute', left: 16, top: 16, right: 16, bottom: 16, width: 'auto', height: 'auto', border: '2px dashed rgba(255,255,255,0.7)',
          borderRadius: '0 0 36px 36px', background: 'transparent', fontWeight: 600, fontSize: 16, color: '#FFFFFF',
        }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={90} estilo={{ right: 28, top: 28 }} />

      <div style={{ position: 'absolute', left: 36, top: 390, width: 130, height: 150, borderRadius: 18, background: destaque, color: fundo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.2)' }}>
        <span style={{ fontFamily: BEBAS, fontSize: 80, lineHeight: 0.9 }}>{txt(v, 'dia')}</span>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '0.12em' }}>{txt(v, 'mes')}</span>
      </div>
      <div style={{ position: 'absolute', left: 190, top: 466, right: 36, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 36, lineHeight: 1, color: destaque }}>{txt(v, 'hora')}</span>
        <span style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.35 }}>{txt(v, 'local')}</span>
      </div>

      <h1 style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 566, fontFamily: BEBAS, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 112), lineHeight: 0.88, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 36, width: 280, top: 784, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '4px 12px', border: `2px solid ${destaque}`, borderRadius: 999, fontWeight: 700, fontSize: 14, color: destaque }}>{txt(v, 'chamada')}</span>
        <span style={{ fontWeight: 500, fontSize: 14, lineHeight: 1.4 }}>{txt(v, 'itens')}</span>
      </div>

      <div style={{ position: 'absolute', right: 30, top: 760, width: 160, height: 160, borderRadius: '50%', border: `6px solid ${destaque}`, overflow: 'hidden', boxSizing: 'border-box', background: 'rgba(0,0,0,0.15)' }}>
        <Foto src={txt(v, 'foto2')} rotulo="Foto 2" estiloVazio={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: 14, color: '#FFFFFF' }} />
      </div>
    </div>
  )
}

export const r03CartaoData: DefinicaoDeTemplate = {
  id: 'rr-cartao-data',
  nome: 'Cartão de data',
  descricao: 'Foto no topo, cartão com dia e mês e título grande condensado.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    chamada: seTiver(i.chamada), titulo: i.titulo, itens: temItens(i) ? `Traga ${itensEmFrase(i)}.` : undefined,
    dia: dia(i), mes: mesCurto(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 112, min: 60, max: 140, passo: 2 },
    { tipo: 'texto', chave: 'chamada', rotulo: 'Chamada', secao: 'Texto', padrao: 'O CLUBE VOLTOU!', maximo: 30 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Traga Bíblia, caderno de classe, garrafa de água, lenço e a blusa do clube ou unidade.', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'dia', rotulo: 'Dia', secao: 'Quando e onde', padrao: '01', maximo: 2 },
    { tipo: 'texto', chave: 'mes', rotulo: 'Mês', secao: 'Quando e onde', padrao: 'AGO', maximo: 4 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Espaço Verde Chico Mendes', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0B47B5', opcoes: [
      { valor: '#0B47B5', nome: 'Azul' }, { valor: '#D9531E', nome: 'Laranja' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Destaque', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#7CCB6B', nome: 'Verde claro' },
    ] },
  ],
}
