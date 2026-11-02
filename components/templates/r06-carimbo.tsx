import { DM_SERIF, POPPINS } from './fontes'
import { dataBarra, horaComAs, itensEmFrase } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 06 · Carimbo" do canvas Chamadas do Clube: fundo claro, carimbo redondo girado, título serifado,
// frase, duas fotos lado a lado e a faixa de baixo com data, hora e local.

const vazioFoto = { border: '2px dashed #8A93A6', borderRadius: 14, background: 'transparent', fontWeight: 600, fontSize: 14, color: '#555E70' }

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: POPPINS, color: '#2A2A2A' }}>
      <Logo src={txt(v, 'logo')} lado={84} estilo={{ left: 32, top: 32 }} />

      <div style={{ position: 'absolute', right: 32, top: 30, width: 128, height: 128, boxSizing: 'border-box', border: `3px solid ${cor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)' }}>
        <div style={{ width: 108, height: 108, boxSizing: 'border-box', border: `1.5px dashed ${cor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700, fontSize: 13, lineHeight: 1.2, letterSpacing: '0.06em', color: cor, whiteSpace: 'pre-line' }}>
          {txt(v, 'selo')}
        </div>
      </div>

      <h1 style={{ margin: 0, position: 'absolute', left: 32, right: 32, top: 176, fontFamily: DM_SERIF, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 80), lineHeight: 0.95, whiteSpace: 'pre-line', color: cor }}>
        {txt(v, 'titulo')}
      </h1>
      <p style={{ margin: 0, position: 'absolute', left: 32, right: 32, top: 374, fontWeight: 500, fontSize: 18, lineHeight: 1.4 }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 32, right: 32, top: 450, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {[1, 2].map((n) => (
          <div key={n} style={{ height: 220, borderRadius: 14, overflow: 'hidden', background: '#E2E6EE' }}>
            <Foto src={txt(v, `foto${n}`)} rotulo={`Foto ${n}`} estiloVazio={vazioFoto} />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 32, right: 32, top: 696, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', color: cor }}>ITENS ESSENCIAIS</span>
        <span style={{ fontWeight: 500, fontSize: 16, lineHeight: 1.45 }}>{txt(v, 'itens')}</span>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, background: cor, color: '#FFFFFF', boxSizing: 'border-box', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: DM_SERIF, fontSize: 42, lineHeight: 1 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ maxWidth: 250, textAlign: 'right', fontWeight: 600, fontSize: 15, lineHeight: 1.35 }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const r06Carimbo: DefinicaoDeTemplate = {
  id: 'rr-carimbo',
  nome: 'Carimbo',
  descricao: 'Fundo claro, carimbo redondo, título serifado e duas fotos lado a lado.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    selo: seTiver(i.chamada), titulo: i.titulo, frase: seTiver(i.frase), itens: seTiver(itensEmFrase(i)),
    data: dataBarra(i), hora: horaComAs(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'selo', rotulo: 'Carimbo', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 24 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Sábado é\ndia de clube.', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 80, min: 44, max: 100, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Classes, unidades e muita aventura esperando por você.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Bíblia, caderno de classe, garrafa de água, lenço e blusa do clube ou unidade', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: 'às 15H00', maximo: 16 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#F2F1EE', opcoes: [
      { valor: '#F2F1EE', nome: 'Gelo' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#FBF3E6', nome: 'Creme' },
    ] },
    { tipo: 'cor', chave: 'cor', rotulo: 'Cor principal', secao: 'Cores', padrao: '#0B47B5', opcoes: [
      { valor: '#0B47B5', nome: 'Azul' }, { valor: '#B4232A', nome: 'Vermelho' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
  ],
}
