import { INTER, PLAYFAIR } from './fontes'
import { dataBarra, horaComAs, itensEmFrase, tamanhoQueCabe, temItens } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "RR 09 · Versículo" do canvas Chamadas do Clube: fundo claro, foto alta à direita, título serifado,
// itens, versículo em itálico com referência e rodapé com data, hora e local.

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  const acento = txt(v, 'acento')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: INTER, color: cor }}>
      <div style={{ position: 'absolute', left: 290, top: 0, width: 250, height: 600, background: '#D9DDE5' }}>
        {/* o espaço vazio do HTML é um tracejado recuado 14px dentro da caixa */}
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ border: 'none', outline: '2px dashed #8A93A6', outlineOffset: -16, background: 'transparent', color: '#555E70', fontSize: 14 }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={76} estilo={{ left: 36, top: 40 }} />

      <p style={{ margin: 0, position: 'absolute', left: 36, top: 180, fontWeight: 600, fontSize: 13, letterSpacing: '0.24em', color: acento }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 36, width: 240, top: 208, fontFamily: PLAYFAIR, fontWeight: 600, fontSize: num(v, 'tamanhoTitulo', 72), lineHeight: 1, whiteSpace: 'pre-line', color: cor }}>
        {txt(v, 'titulo')}
      </h1>
      <div style={{ position: 'absolute', left: 36, top: 410, width: 60, height: 3, background: acento }} />
      <p style={{ margin: 0, position: 'absolute', left: 36, width: 236, top: 434, fontWeight: 500, fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{txt(v, 'itens')}</p>

      {txt(v, 'versiculo') && (
        <p style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 650, fontFamily: PLAYFAIR, fontStyle: 'italic', fontWeight: 500, fontSize: 25, lineHeight: 1.4 }}>“{txt(v, 'versiculo')}”</p>
      )}
      <p style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 750, fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', color: acento }}>{txt(v, 'referencia')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 40, paddingTop: 16, borderTop: `1px solid ${cor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ maxWidth: 240, textAlign: 'right', fontWeight: 500, fontSize: 14, lineHeight: 1.4 }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const r09Versiculo: DefinicaoDeTemplate = {
  id: 'rr-versiculo',
  nome: 'Versículo',
  descricao: 'Fundo claro, foto alta à direita e versículo em itálico serifado.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  // itens no formato do padrão: "Itens essenciais:" e a lista em frase com ponto final
  deInformacoes: (i) => ({
    antes: seTiver(i.chamada), titulo: i.titulo, tamanhoTitulo: tamanhoQueCabe(i.titulo, 240, 72, 0.56),
    itens: temItens(i) ? `Itens essenciais:\n${itensEmFrase(i)}.` : undefined,
    versiculo: seTiver(i.versiculo), referencia: seTiver(i.referencia),
    data: dataBarra(i), hora: horaComAs(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'CLUBE DE DESBRAVADORES', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Reunião\nRegular', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 72, min: 44, max: 92, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Itens essenciais:\nBíblia, caderno de classe,\ngarrafa de água, lenço\ne blusa do clube.', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'versiculo', rotulo: 'Versículo', secao: 'Texto', padrao: 'Tudo posso naquele que me fortalece.', multilinha: true, maximo: 120 },
    { tipo: 'texto', chave: 'referencia', rotulo: 'Referência', secao: 'Texto', padrao: 'FILIPENSES 4:13', maximo: 30 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '05|09', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: 'às 15H00', maximo: 16 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#F4F5F8', opcoes: [
      { valor: '#F4F5F8', nome: 'Cinza claro' }, { valor: '#F6F3EC', nome: 'Creme' }, { valor: '#FFFFFF', nome: 'Branco' },
    ] },
    { tipo: 'cor', chave: 'cor', rotulo: 'Texto', secao: 'Cores', padrao: '#0B2A6B', opcoes: [
      { valor: '#0B2A6B', nome: 'Azul marinho' }, { valor: '#2B2B2B', nome: 'Grafite' }, { valor: '#12321E', nome: 'Verde mata' },
    ] },
    { tipo: 'cor', chave: 'acento', rotulo: 'Detalhes', secao: 'Cores', padrao: '#C9930C', opcoes: [
      { valor: '#C9930C', nome: 'Dourado' }, { valor: '#0B47B5', nome: 'Azul' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
  ],
}
