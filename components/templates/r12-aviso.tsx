import { FRAUNCES, INTER } from './fontes'
import { dataBarra, hora, itensComMarcadores } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 12 · Aviso" do canvas Chamadas do Clube: fundo branco, faixa de cabeçalho com logo e nome do
// clube, título serifado, frase com foto arredondada ao lado, quadro de itens e três cartões no rodapé.

const rotuloCartao = (cor: string) => ({ fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: cor })

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  const cartao = { display: 'flex', flexDirection: 'column' as const, gap: 2, padding: 12, border: `2px solid ${cor}`, borderRadius: 14 }
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#FFFFFF', fontFamily: INTER, color: '#18233A' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 120, background: cor, boxSizing: 'border-box', padding: '0 30px', display: 'flex', alignItems: 'center', gap: 16, color: '#FFFFFF' }}>
        {/* o logo entra no fluxo do cabeçalho; sem logo, o nome do clube encosta na margem */}
        <Logo src={txt(v, 'logo')} lado={76} estilo={{ position: 'relative', flex: 'none' }} />
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '0.04em', lineHeight: 1.3 }}>{txt(v, 'clube')}</span>
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 30, top: 160, fontWeight: 700, fontSize: 14, letterSpacing: '0.2em', color: cor }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 30, right: 30, top: 186, fontFamily: FRAUNCES, fontWeight: 700, fontSize: num(v, 'tamanhoTitulo', 72), lineHeight: 1, whiteSpace: 'pre-line', color: '#18233A' }}>
        {txt(v, 'titulo')}
      </h1>
      <p style={{ margin: 0, position: 'absolute', left: 30, width: 280, top: 350, fontWeight: 500, fontSize: 17, lineHeight: 1.45, color: '#3D4760' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', right: 30, top: 340, width: 170, height: 170, borderRadius: 20, overflow: 'hidden', background: '#E6EAF2' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ border: '2px dashed #8A93A6', borderRadius: 20, background: 'transparent', color: '#555E70', fontSize: 14 }} />
      </div>

      {txt(v, 'itens') && (
        <div style={{ position: 'absolute', left: 30, right: 30, top: 548, padding: '20px 22px', borderRadius: 18, background: txt(v, 'claro'), display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: cor }}>ITENS ESSENCIAIS</span>
          <span style={{ fontWeight: 500, fontSize: 16, lineHeight: 1.55, whiteSpace: 'pre-line' }}>{txt(v, 'itens')}</span>
        </div>
      )}

      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 40, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <div style={cartao}>
          <span style={rotuloCartao(cor)}>DATA</span>
          <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: 26 }}>{txt(v, 'data')}</span>
        </div>
        <div style={cartao}>
          <span style={rotuloCartao(cor)}>HORA</span>
          <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: 26 }}>{txt(v, 'hora')}</span>
        </div>
        <div style={cartao}>
          <span style={rotuloCartao(cor)}>LOCAL</span>
          <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{txt(v, 'local')}</span>
        </div>
      </div>
    </div>
  )
}

export const r12Aviso: DefinicaoDeTemplate = {
  id: 'rr-aviso',
  nome: 'Aviso',
  descricao: 'Cabeçalho colorido com o nome do clube, título serifado e quadro de itens.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    clube: i.nomeDoClube, antes: seTiver(i.chamada), titulo: i.titulo, frase: seTiver(i.frase),
    itens: seTiver(itensComMarcadores(i)), data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'clube', rotulo: 'Nome do clube', secao: 'Texto', padrao: 'Clube de Desbravadores [Nome]', maximo: 60 },
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'AVISO AOS DESBRAVADORES', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Reunião\nRegular', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 72, min: 44, max: 96, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Abertura, classes regulares, unidades e encerramento. Contamos com você!', multilinha: true, maximo: 110 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: '• Bíblia\n• caderno de classe\n• garrafa de água\n• lenço\n• blusa do clube ou unidade', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'cor', chave: 'cor', rotulo: 'Principal', secao: 'Cores', padrao: '#0B47B5', opcoes: [
      { valor: '#0B47B5', nome: 'Azul' }, { valor: '#1E6B5C', nome: 'Verde petróleo' }, { valor: '#7A3B12', nome: 'Marrom' },
    ] },
    { tipo: 'cor', chave: 'claro', rotulo: 'Quadro de itens', secao: 'Cores', padrao: '#FFF6D6', opcoes: [
      { valor: '#FFF6D6', nome: 'Amarelo claro' }, { valor: '#EEF3FB', nome: 'Azul claro' }, { valor: '#EAF3F0', nome: 'Verde claro' },
    ] },
  ],
}
