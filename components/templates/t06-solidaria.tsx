import { DM_SERIF, POPPINS } from './fontes'
import { dataBarra, horaFaixa, itensEmFrase } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "06 · Ação solidária" do canvas Chamadas do Clube: fundo creme, selo carimbado girado, título em
// DM Serif, duas fotos lado a lado, o que se arrecada e a faixa de baixo com data, hora e local.

const fotoVazia = { border: '2px dashed #A08F78', borderRadius: 14, background: 'transparent', fontWeight: 600, fontSize: 14, color: '#6B5D4A' } as const

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: POPPINS, color: '#2A2A2A' }}>
      <Logo src={txt(v, 'logo')} lado={84} estilo={{ left: 32, top: 32 }} />

      {/* o selo é o nome do evento: sem chamada, o carimbo some */}
      {txt(v, 'selo') && (
        <div style={{ position: 'absolute', right: 32, top: 30, width: 128, height: 128, boxSizing: 'border-box', border: `3px solid ${cor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)' }}>
          <div style={{ width: 108, height: 108, boxSizing: 'border-box', border: `1.5px dashed ${cor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700, fontSize: 13, lineHeight: 1.2, letterSpacing: '0.06em', color: cor, whiteSpace: 'pre-line' }}>{txt(v, 'selo')}</div>
        </div>
      )}

      <h1 style={{ margin: 0, position: 'absolute', left: 32, right: 32, top: 176, fontFamily: DM_SERIF, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 78), lineHeight: 0.95, whiteSpace: 'pre-line', color: cor }}>{txt(v, 'titulo')}</h1>
      <p style={{ margin: 0, position: 'absolute', left: 32, right: 32, top: 374, fontWeight: 500, fontSize: 18, lineHeight: 1.4 }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 32, right: 32, top: 450, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        <div style={{ height: 220, borderRadius: 14, overflow: 'hidden', background: '#EADFCF' }}>
          <Foto src={txt(v, 'foto1')} rotulo="Foto 1" estiloVazio={fotoVazia} />
        </div>
        <div style={{ height: 220, borderRadius: 14, overflow: 'hidden', background: '#EADFCF' }}>
          <Foto src={txt(v, 'foto2')} rotulo="Foto 2" estiloVazio={fotoVazia} />
        </div>
      </div>

      {/* rótulo e lista só aparecem quando têm texto */}
      {(txt(v, 'itensTitulo') || txt(v, 'itens')) && (
        <div style={{ position: 'absolute', left: 32, right: 32, top: 696, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {txt(v, 'itensTitulo') && <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', color: cor }}>{txt(v, 'itensTitulo')}</span>}
          <span style={{ fontWeight: 500, fontSize: 16, lineHeight: 1.45 }}>{txt(v, 'itens')}</span>
        </div>
      )}

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, background: cor, color: '#FFFFFF', boxSizing: 'border-box', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: DM_SERIF, fontSize: 40, lineHeight: 1 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ maxWidth: 250, textAlign: 'right', fontWeight: 600, fontSize: 15, lineHeight: 1.35 }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const t06Solidaria: DefinicaoDeTemplate = {
  id: 'ev-solidaria',
  nome: 'Ação solidária',
  descricao: 'Fundo creme, selo carimbado, título serifado e duas fotos lado a lado.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: o selo vem da chamada (vazio some); "ARRECADAMOS" é desta ação e fica vazio; itens em frase
  deInformacoes: (i) => ({
    selo: i.chamada, titulo: i.titulo, frase: i.frase, itensTitulo: '', itens: itensEmFrase(i),
    data: dataBarra(i), hora: horaFaixa(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'selo', rotulo: 'Selo', secao: 'Texto', padrao: 'AÇÃO\nSOLIDÁRIA', multilinha: true, maximo: 24 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Doe alimentos,\nespalhe amor.', multilinha: true, maximo: 50, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 78, min: 44, max: 100, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'O clube vai às ruas arrecadar para famílias da comunidade.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'itensTitulo', rotulo: 'Rótulo da lista', secao: 'Texto', padrao: 'ARRECADAMOS', maximo: 24 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'arroz, feijão, óleo, macarrão, leite e itens de higiene', multilinha: true, maximo: 120 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '22|11', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: 'das 9H às 12H', maximo: 24 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#FBF3E6', opcoes: [
      { valor: '#FBF3E6', nome: 'Creme' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#EEF3F8', nome: 'Azul claro' },
    ] },
    { tipo: 'cor', chave: 'cor', rotulo: 'Cor principal', secao: 'Cores', padrao: '#B4232A', opcoes: [
      { valor: '#B4232A', nome: 'Vermelho' }, { valor: '#0B47B5', nome: 'Azul' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
  ],
}
