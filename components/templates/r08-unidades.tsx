import { ARCHIVO, ARCHIVO_BLACK } from './fontes'
import { dataBarra, hora, itensEmFrase, temItens } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 08 · Unidades" do canvas Chamadas do Clube: fundo branco, faixa de três cores no topo, título
// pesado com sombra chapada, quatro fotos com bordas coloridas e três blocos de data, hora e local.

const vazioQuadro = { border: 'none', background: '#EEEEEE', color: '#555', fontWeight: 700, fontSize: 14 }
const rotuloBloco = { fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }

function Arte({ v }: PropsDaArte) {
  const cor1 = txt(v, 'cor1')
  const cor2 = txt(v, 'cor2')
  const cor3 = txt(v, 'cor3')
  const bordas = [cor1, cor2, cor3, cor1]
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#FFFFFF', fontFamily: ARCHIVO, color: '#141414' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 18, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <div style={{ background: cor1 }} /><div style={{ background: cor2 }} /><div style={{ background: cor3 }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={84} estilo={{ right: 30, top: 42 }} />

      {txt(v, 'antes') && (
        <p style={{ margin: 0, position: 'absolute', left: 32, top: 56, padding: '6px 12px', background: cor2, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em' }}>{txt(v, 'antes')}</p>
      )}
      <h1 style={{ margin: 0, position: 'absolute', left: 30, right: 30, top: 104, fontFamily: ARCHIVO_BLACK, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 90), lineHeight: 0.95, letterSpacing: '-0.02em', whiteSpace: 'pre-line', color: cor1, textShadow: `5px 5px 0 ${cor2}` }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 32, right: 32, top: 320, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {bordas.map((cor, k) => (
          <div key={k} style={{ height: 180, border: `4px solid ${cor}`, boxSizing: 'border-box', background: '#EEEEEE' }}>
            <Foto src={txt(v, `foto${k + 1}`)} rotulo={`Foto ${k + 1}`} estiloVazio={vazioQuadro} />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 32, right: 32, top: 716, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', color: cor1 }}>ITENS ESSENCIAIS</span>
        <span style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.35 }}>{txt(v, 'itens')}</span>
      </div>

      <div style={{ position: 'absolute', left: 32, right: 32, bottom: 40, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: cor1, color: '#FFFFFF' }}>
          <span style={rotuloBloco}>DATA</span>
          <span style={{ fontFamily: ARCHIVO_BLACK, fontSize: 24 }}>{txt(v, 'data')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: cor2 }}>
          <span style={rotuloBloco}>HORA</span>
          <span style={{ fontFamily: ARCHIVO_BLACK, fontSize: 24 }}>{txt(v, 'hora')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: cor3, color: '#FFFFFF' }}>
          <span style={rotuloBloco}>LOCAL</span>
          <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25 }}>{txt(v, 'local')}</span>
        </div>
      </div>
    </div>
  )
}

export const r08Unidades: DefinicaoDeTemplate = {
  id: 'rr-unidades',
  nome: 'Unidades',
  descricao: 'Fundo branco, faixa tricolor, título com sombra chapada e quatro fotos em grade.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  // itens em frase com ponto final, como o padrão
  deInformacoes: (i) => ({
    antes: seTiver(i.chamada), titulo: i.titulo, itens: temItens(i) ? `${itensEmFrase(i)}.` : undefined,
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'CLASSES E UNIDADES', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 90, min: 50, max: 116, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Bíblia, caderno de classe, garrafa de água, lenço e blusa do clube ou unidade.', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto4', rotulo: 'Foto 4', secao: 'Imagens' },
    { tipo: 'cor', chave: 'cor1', rotulo: 'Cor 1', secao: 'Cores', padrao: '#0B47B5', opcoes: [{ valor: '#0B47B5', nome: 'Azul' }] },
    { tipo: 'cor', chave: 'cor2', rotulo: 'Cor 2', secao: 'Cores', padrao: '#F5C518', opcoes: [{ valor: '#F5C518', nome: 'Amarelo ouro' }] },
    { tipo: 'cor', chave: 'cor3', rotulo: 'Cor 3', secao: 'Cores', padrao: '#2E9E48', opcoes: [{ valor: '#2E9E48', nome: 'Verde' }] },
  ],
}
