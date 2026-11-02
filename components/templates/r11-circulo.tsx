import { ANTON, CAVEAT, MONTSERRAT } from './fontes'
import { dia, hora, itensComPontos, mesCurto } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 11 · Círculo" do canvas Chamadas do Clube: círculo grande com dia e mês, chamada manuscrita,
// título em Anton, itens, faixa de quatro fotos arredondadas e hora e local no rodapé.

const vazioFoto = { border: '2px dashed rgba(255,255,255,0.5)', borderRadius: 10, background: 'transparent', color: '#FFFFFF', fontSize: 13 }

function Arte({ v }: PropsDaArte) {
  const fundo = txt(v, 'fundo')
  const destaque = txt(v, 'destaque')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: fundo, fontFamily: MONTSERRAT, color: '#FFFFFF' }}>
      <Logo src={txt(v, 'logo')} lado={84} estilo={{ left: 30, top: 30 }} />

      <div style={{ position: 'absolute', left: 130, top: 80, width: 280, height: 280, borderRadius: '50%', background: destaque, color: fundo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: ANTON, fontSize: 150, lineHeight: 0.95 }}>{txt(v, 'dia')}</span>
        <span style={{ fontFamily: ANTON, fontSize: 38, lineHeight: 1, letterSpacing: '0.12em' }}>{txt(v, 'mes')}</span>
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 378, textAlign: 'center', fontFamily: CAVEAT, fontWeight: 700, fontSize: 38, color: destaque }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 24, right: 24, top: 424, textAlign: 'center', fontFamily: ANTON, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 80), lineHeight: 0.95, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>
      <p style={{ margin: 0, position: 'absolute', left: 50, right: 50, top: 598, textAlign: 'center', fontWeight: 500, fontSize: 15, lineHeight: 1.4, color: '#E3E8F3' }}>{txt(v, 'itens')}</p>

      <div style={{ position: 'absolute', left: 20, right: 20, top: 680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ height: 120, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.12)' }}>
            <Foto src={txt(v, `foto${n}`)} rotulo={`Foto ${n}`} estiloVazio={vazioFoto} />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: ANTON, fontSize: 44, lineHeight: 1, color: destaque }}>{txt(v, 'hora')}</span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const r11Circulo: DefinicaoDeTemplate = {
  id: 'rr-circulo',
  nome: 'Círculo',
  descricao: 'Círculo grande com dia e mês, chamada manuscrita e quatro fotos em faixa.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    antes: seTiver(i.chamada), titulo: i.titulo, itens: seTiver(itensComPontos(i)),
    dia: dia(i), mes: mesCurto(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'O clube voltou!', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'REUNIÃO\nREGULAR', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 80, min: 44, max: 104, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Bíblia · caderno de classe · garrafa de água · lenço · blusa do clube ou unidade', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'dia', rotulo: 'Dia', secao: 'Quando e onde', padrao: '05', maximo: 2 },
    { tipo: 'texto', chave: 'mes', rotulo: 'Mês', secao: 'Quando e onde', padrao: 'SET', maximo: 4 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto4', rotulo: 'Foto 4', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0B3FA8', opcoes: [
      { valor: '#0B3FA8', nome: 'Azul' }, { valor: '#1F5E30', nome: 'Verde' }, { valor: '#5A1E6B', nome: 'Roxo' },
    ] },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Destaque', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#FF8A3D', nome: 'Laranja' },
    ] },
  ],
}
