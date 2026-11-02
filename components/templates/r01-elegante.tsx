import { MONTSERRAT, PLAYFAIR } from './fontes'
import { dataBarra, hora, itensComPontos } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 01 · Elegante" do canvas Chamadas do Clube: moldura fina dourada, logo centralizado, título em
// itálico serifado, três fotos em arco, itens e data | hora.

const vazioArco = { border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: 13 }

function Arte({ v }: PropsDaArte) {
  const dourado = txt(v, 'dourado')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: MONTSERRAT, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 24, top: 24, right: 24, bottom: 24, border: `1px solid ${dourado}` }} />

      <Logo src={txt(v, 'logo')} lado={96} estilo={{ left: 222, top: 54 }} />

      <p style={{ margin: 0, position: 'absolute', left: 0, right: 0, top: 172, textAlign: 'center', fontWeight: 600, fontSize: 13, letterSpacing: '0.32em', color: dourado }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 40, right: 40, top: 196, textAlign: 'center', fontFamily: PLAYFAIR, fontStyle: 'italic', fontWeight: 600, fontSize: num(v, 'tamanhoTitulo', 80), lineHeight: 1, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 40, right: 40, top: 370, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ height: 220, boxSizing: 'border-box', border: `2px solid ${dourado}`, borderRadius: '110px 110px 8px 8px', overflow: 'hidden' }}>
            <Foto src={txt(v, `foto${n}`)} rotulo={`Foto ${n}`} estiloVazio={vazioArco} />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 60, right: 60, top: 618, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.24em', color: dourado }}>ITENS ESSENCIAIS</span>
        <span style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', fontWeight: 500, fontSize: 19, lineHeight: 1.4, color: '#E9E3D3' }}>{txt(v, 'itens')}</span>
      </div>

      <div style={{ position: 'absolute', left: 60, right: 60, top: 760, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 40, color: dourado }}>{txt(v, 'data')}</span>
        <span style={{ width: 2, height: 40, background: dourado }} />
        <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 40 }}>{txt(v, 'hora')}</span>
      </div>
      <p style={{ margin: 0, position: 'absolute', left: 60, right: 60, top: 840, textAlign: 'center', fontWeight: 600, fontSize: 15, letterSpacing: '0.04em' }}>{txt(v, 'local')}</p>
    </div>
  )
}

export const r01Elegante: DefinicaoDeTemplate = {
  id: 'rr-elegante',
  nome: 'Elegante',
  descricao: 'Moldura dourada, título em itálico e três fotos em arco.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    antes: seTiver(i.chamada), titulo: i.titulo, itens: seTiver(itensComPontos(i)),
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'SÁBADO É DIA DE', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Reunião\nRegular', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 80, min: 48, max: 104, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Bíblia · caderno de classe · garrafa de água · lenço · blusa do clube ou unidade', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0E1F4D', opcoes: [
      { valor: '#0E1F4D', nome: 'Azul marinho' }, { valor: '#1C1C1C', nome: 'Preto' }, { valor: '#12321E', nome: 'Verde mata' },
    ] },
    { tipo: 'cor', chave: 'dourado', rotulo: 'Detalhes', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#D4A73A', nome: 'Dourado' }, { valor: '#FFFFFF', nome: 'Branco' },
    ] },
  ],
}
