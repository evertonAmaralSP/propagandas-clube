import { BEBAS, POPPINS } from './fontes'
import { dia, hora, mesCurto } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "03 · Campori" do canvas Chamadas do Clube: foto no topo com cantos de baixo arredondados, cartão
// branco com dia e mês, título enorme em Bebas, frase e uma segunda foto redonda com aro branco.

function Arte({ v }: PropsDaArte) {
  const fundo = txt(v, 'fundo')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: fundo, fontFamily: POPPINS, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 470, borderRadius: '0 0 48px 48px', overflow: 'hidden', background: 'rgba(0,0,0,0.12)' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ position: 'absolute', left: 16, top: 16, width: 508, height: 438, border: '2px dashed rgba(255,255,255,0.7)', borderRadius: '0 0 36px 36px', background: 'transparent', fontWeight: 600, fontSize: 16, color: '#FFFFFF' }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={90} estilo={{ right: 28, top: 28 }} />

      <div style={{ position: 'absolute', left: 36, top: 410, width: 130, height: 150, borderRadius: 18, background: '#FFFFFF', color: fundo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.2)' }}>
        <span style={{ fontFamily: BEBAS, fontSize: 80, lineHeight: 0.9 }}>{txt(v, 'dia')}</span>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: '#2B2B2B' }}>{txt(v, 'mes')}</span>
      </div>

      <div style={{ position: 'absolute', left: 190, top: 486, right: 36, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '0.08em' }}>{txt(v, 'hora')}</span>
        <span style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.35 }}>{txt(v, 'local')}</span>
      </div>

      <h1 style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 580, fontFamily: BEBAS, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 124), lineHeight: 0.88, whiteSpace: 'pre-line', color: '#FFFFFF' }}>{txt(v, 'titulo')}</h1>

      <p style={{ margin: 0, position: 'absolute', left: 36, width: 290, top: 790, fontWeight: 500, fontSize: 17, lineHeight: 1.4 }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', right: 30, top: 760, width: 160, height: 160, borderRadius: '50%', border: '6px solid #FFFFFF', overflow: 'hidden', boxSizing: 'border-box', background: 'rgba(0,0,0,0.12)' }}>
        <Foto src={txt(v, 'foto2')} rotulo="Foto 2"
          estiloVazio={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: 14, color: '#FFFFFF' }} />
      </div>
    </div>
  )
}

export const t03Campori: DefinicaoDeTemplate = {
  id: 'ev-campori',
  nome: 'Campori',
  descricao: 'Foto no topo, cartão com dia e mês, título enorme e foto redonda.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: frase vazia fica vazia; "SAÍDA 6H00" vira só a hora
  deInformacoes: (i) => ({
    titulo: i.titulo, frase: i.frase, dia: dia(i), mes: mesCurto(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'CAMPORI\n2026', multilinha: true, maximo: 30, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 124, min: 60, max: 150, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Inscrições abertas! Garanta sua vaga com a diretoria.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'dia', rotulo: 'Dia', secao: 'Quando e onde', padrao: '14', maximo: 2 },
    { tipo: 'texto', chave: 'mes', rotulo: 'Mês', secao: 'Quando e onde', padrao: 'NOV', maximo: 4 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: 'SAÍDA 6H00', maximo: 20 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: '[Local do campori]', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#D9531E', opcoes: [
      { valor: '#D9531E', nome: 'Laranja' }, { valor: '#0B47B5', nome: 'Azul' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
  ],
}
