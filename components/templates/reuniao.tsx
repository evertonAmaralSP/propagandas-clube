import { ANTON, MONTSERRAT } from './fontes'
import { dataBarra, hora, itensComMarcadores } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, IconeLocal, Logo } from './pecas'

// "Template (variáveis)" do canvas Chamadas do Clube: título em bloco, lista de itens, três fotos
// lado a lado, data e hora grandes e o local numa pílula.

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#F2F1EE', fontFamily: MONTSERRAT, color: cor }}>
      <div style={{ position: 'absolute', left: 0, top: 112, width: 32, height: 10, background: cor }} />
      <div style={{ position: 'absolute', left: 186, top: 112, width: 10, height: 330, background: cor }} />

      <h1 style={{ margin: 0, position: 'absolute', left: 40, top: 74, width: 360, fontFamily: ANTON, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 104), lineHeight: 0.92, whiteSpace: 'pre-line', color: cor }}>
        {txt(v, 'titulo')}
      </h1>

      <Logo src={txt(v, 'logo')} lado={104} estilo={{ right: 28, top: 28 }} />

      <div style={{ position: 'absolute', left: 214, top: 300, width: 300, display: 'flex', flexDirection: 'column', gap: 2, color: '#B5760A' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, fontStyle: 'italic', fontSize: 19 }}>{txt(v, 'rotuloItens')}</p>
        <p style={{ margin: 0, fontWeight: 600, fontStyle: 'italic', fontSize: 16, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{txt(v, 'itens')}</p>
      </div>

      <div style={{ position: 'absolute', left: 40, top: 470, width: 460, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ height: 260 }}><Foto src={txt(v, `foto${n}`)} rotulo={`Foto ${n}`} /></div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontWeight: 800, fontSize: 52, letterSpacing: '-0.01em' }}>{txt(v, 'data')}</span>
        <span style={{ fontWeight: 500, fontSize: 46 }}>{txt(v, 'hora')}</span>
      </div>

      <div style={{ position: 'absolute', left: 50, right: 50, bottom: 40, minHeight: 52, boxSizing: 'border-box', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, border: '2px solid #F5B82E', borderRadius: 999, fontWeight: 600, fontSize: 16, textAlign: 'center' }}>
        <IconeLocal cor="#141414" />
        <span>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const reuniao: DefinicaoDeTemplate = {
  id: 'reuniao',
  nome: 'Reunião',
  descricao: 'Chamada para reunião ou atividade: título grande, itens para levar e três fotos.',
  largura: 540,
  categoria: 'reuniao-regular',
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    titulo: i.titulo, data: dataBarra(i), hora: hora(i), local: i.local, itens: seTiver(itensComMarcadores(i)),
  }),
  campos: [
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 104, min: 56, max: 130, passo: 2 },
    { tipo: 'texto', chave: 'rotuloItens', rotulo: 'Chamada da lista', secao: 'Texto', padrao: 'Itens essenciais:', maximo: 40 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: '• Bíblia\n• caderno de classe\n• garrafa de água\n• lenço', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 10 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'cor', chave: 'cor', rotulo: 'Cor principal', secao: 'Cores', padrao: '#0B47B5', opcoes: [
      { valor: '#0B47B5', nome: 'Azul' }, { valor: '#1F7A3A', nome: 'Verde' }, { valor: '#B4410B', nome: 'Laranja queimado' },
    ] },
  ],
}
