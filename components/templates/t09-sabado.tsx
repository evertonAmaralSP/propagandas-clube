import { INTER, PLAYFAIR } from './fontes'
import { dataBarra, horaComAs, tamanhoQueCabe } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "09 · Sábado especial" do canvas Chamadas do Clube: fundo claro, foto alta à direita, título
// serifado à esquerda com traço de acento, versículo em itálico e rodapé com filete.

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  const acento = txt(v, 'acento')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: txt(v, 'fundo'), fontFamily: INTER, color: cor }}>
      <div style={{ position: 'absolute', left: 290, top: 0, width: 250, height: 620, background: '#DAD5CA' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ position: 'absolute', left: 14, top: 14, right: 14, bottom: 14, width: 'auto', height: 'auto', border: '2px dashed #8E877A', background: 'transparent', color: '#5E584D', fontSize: 14 }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={76} estilo={{ left: 36, top: 40 }} />

      <p style={{ margin: 0, position: 'absolute', left: 36, top: 180, fontWeight: 600, fontSize: 13, letterSpacing: '0.28em', color: acento }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 36, width: 240, top: 208, fontFamily: PLAYFAIR, fontWeight: 600, fontSize: num(v, 'tamanhoTitulo', 76), lineHeight: 1, whiteSpace: 'pre-line', color: cor }}>
        {txt(v, 'titulo')}
      </h1>
      <div style={{ position: 'absolute', left: 36, top: 440, width: 60, height: 3, background: acento }} />
      <p style={{ margin: 0, position: 'absolute', left: 36, width: 230, top: 466, fontWeight: 500, fontSize: 16, lineHeight: 1.5 }}>{txt(v, 'frase')}</p>

      {/* as aspas só aparecem com versículo */}
      {txt(v, 'versiculo') && (
        <p style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 670, fontFamily: PLAYFAIR, fontStyle: 'italic', fontWeight: 500, fontSize: 24, lineHeight: 1.4 }}>“{txt(v, 'versiculo')}”</p>
      )}
      <p style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 776, fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', color: acento }}>{txt(v, 'referencia')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 40, paddingTop: 16, borderTop: `1px solid ${cor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 34, lineHeight: 1 }}>{txt(v, 'data')}</span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{txt(v, 'hora')}</span>
        </div>
        <span style={{ maxWidth: 240, textAlign: 'right', fontWeight: 500, fontSize: 14, lineHeight: 1.4 }}>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const t09Sabado: DefinicaoDeTemplate = {
  id: 'ev-sabado',
  nome: 'Sábado especial',
  descricao: 'Editorial claro: foto alta à direita, título serifado e versículo em itálico.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: chamada, frase, versículo e referência vazios ficam vazios (sem versículo, as aspas somem)
  deInformacoes: (i) => ({
    antes: i.chamada, titulo: i.titulo, tamanhoTitulo: tamanhoQueCabe(i.titulo, 240, 76, 0.56), frase: i.frase, versiculo: i.versiculo, referencia: i.referencia,
    data: dataBarra(i), hora: horaComAs(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'CULTO JOVEM', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Sábado\nEspecial', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 76, min: 44, max: 96, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'O clube conduz o culto. Venha de uniforme de gala.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'versiculo', rotulo: 'Versículo', secao: 'Texto', padrao: 'Lembra-te do teu Criador nos dias da tua mocidade.', multilinha: true, maximo: 120 },
    { tipo: 'texto', chave: 'referencia', rotulo: 'Referência', secao: 'Texto', padrao: 'ECLESIASTES 12:1', maximo: 30 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '13|12', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: 'às 17H00', maximo: 16 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#F6F3EC', opcoes: [
      { valor: '#F6F3EC', nome: 'Creme' }, { valor: '#FFFFFF', nome: 'Branco' }, { valor: '#EAF0F6', nome: 'Azul claro' },
    ] },
    { tipo: 'cor', chave: 'cor', rotulo: 'Texto', secao: 'Cores', padrao: '#0E2A5C', opcoes: [
      { valor: '#0E2A5C', nome: 'Azul marinho' }, { valor: '#2B2B2B', nome: 'Grafite' }, { valor: '#3A1F12', nome: 'Marrom' },
    ] },
    { tipo: 'cor', chave: 'acento', rotulo: 'Acento', secao: 'Cores', padrao: '#A9761A', opcoes: [
      { valor: '#A9761A', nome: 'Dourado' }, { valor: '#0B47B5', nome: 'Azul' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
  ],
}
