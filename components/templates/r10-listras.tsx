import { INTER, OSWALD } from './fontes'
import { dataBarra, hora, itensEmFrase, temItens } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 10 · Listras" do canvas Chamadas do Clube: faixas listradas em diagonal no topo e no rodapé,
// logo centralizado, título condensado, duas fotos com moldura branca e quadro de data, hora e local.

const vazioMoldura = { border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.85)', fontSize: 14 }

function Arte({ v }: PropsDaArte) {
  const faixa2 = txt(v, 'faixa2')
  const listras = `repeating-linear-gradient(-45deg, ${txt(v, 'faixa1')} 0 22px, ${faixa2} 22px 44px)`
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: INTER, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 36, background: listras }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 540, height: 36, background: listras }} />

      <Logo src={txt(v, 'logo')} lado={92} estilo={{ left: 224, top: 64 }} />

      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '0.3em', color: faixa2 }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 24, right: 24, top: 204, textAlign: 'center', fontFamily: OSWALD, fontWeight: 700, fontSize: num(v, 'tamanhoTitulo', 92), lineHeight: 0.98, textTransform: 'uppercase', whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 410, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {[1, 2].map((n) => (
          <div key={n} style={{ height: 250, boxSizing: 'border-box', border: '6px solid #FFFFFF', background: '#23345F' }}>
            <Foto src={txt(v, `foto${n}`)} rotulo={`Foto ${n}`} estiloVazio={vazioMoldura} />
          </div>
        ))}
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 48, right: 48, top: 690, textAlign: 'center', fontWeight: 500, fontSize: 16, lineHeight: 1.45, color: '#E3E8F3' }}>{txt(v, 'itens')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 790, display: 'flex', alignItems: 'stretch', border: `2px solid ${faixa2}` }}>
        <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: `2px solid ${faixa2}` }}>
          <span style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 34, lineHeight: 1, color: faixa2 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{txt(v, 'hora')}</span>
        </div>
        <div style={{ flex: 1.4, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 600, fontSize: 14, lineHeight: 1.35 }}>{txt(v, 'local')}</div>
      </div>
    </div>
  )
}

export const r10Listras: DefinicaoDeTemplate = {
  id: 'rr-listras',
  nome: 'Listras',
  descricao: 'Faixas listradas em diagonal, título condensado e duas fotos com moldura branca.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  // itens em frase ("Traga ..."); o "Chegue 10 minutos antes!" do padrão fica só no padrão
  deInformacoes: (i) => ({
    antes: seTiver(i.chamada), titulo: i.titulo, itens: temItens(i) ? `Traga ${itensEmFrase(i)}.` : undefined,
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'ATENÇÃO, DESBRAVADORES', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Reunião\nRegular', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 92, min: 50, max: 120, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Traga Bíblia, caderno de classe, garrafa de água, lenço e a blusa do clube ou unidade. Chegue 10 minutos antes!', multilinha: true, maximo: 220 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0B2A6B', opcoes: [
      { valor: '#0B2A6B', nome: 'Azul marinho' }, { valor: '#12321E', nome: 'Verde mata' }, { valor: '#1C1C1C', nome: 'Preto' },
    ] },
    { tipo: 'cor', chave: 'faixa1', rotulo: 'Listra 1', secao: 'Cores', padrao: '#0B47B5', opcoes: [
      { valor: '#0B47B5', nome: 'Azul' }, { valor: '#1E8C45', nome: 'Verde' }, { valor: '#C62828', nome: 'Vermelho' },
    ] },
    { tipo: 'cor', chave: 'faixa2', rotulo: 'Listra 2 e detalhes', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#FF8A3D', nome: 'Laranja' },
    ] },
  ],
}
