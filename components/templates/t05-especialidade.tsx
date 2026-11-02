import type { ReactNode } from 'react'
import { INTER, OSWALD } from './fontes'
import { dataPorExtenso, horaFaixa } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "05 · Aula de especialidade" do canvas Chamadas do Clube: foto na metade de cima, cartão branco
// com o logo, etiqueta colorida, título em Oswald, frase e a lista com ícones (data, hora, local,
// instrutor), fechada por uma barra de destaque.

function Icone({ cor, children }: { cor: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      {children}
    </svg>
  )
}

const linha = { display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 18 } as const

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  const logo = txt(v, 'logo')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#FFFFFF', fontFamily: INTER, color: '#1A1A1A' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 500, background: '#DCDFE6' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ position: 'absolute', left: 16, top: 16, width: 508, height: 468, border: '2px dashed #8A8A8A', background: 'transparent', fontWeight: 600, fontSize: 16, color: '#555' }} />
      </div>

      {/* o cartão branco do logo só aparece quando há logo */}
      {logo && (
        <div style={{ position: 'absolute', left: 28, top: 28, width: 84, height: 84, borderRadius: 16, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo src={logo} lado={72} estilo={{ position: 'relative' }} />
        </div>
      )}

      {txt(v, 'etiqueta') && (
        <div style={{ position: 'absolute', left: 36, top: 476, padding: '10px 16px', background: cor, color: '#FFFFFF', fontWeight: 700, fontSize: 14, letterSpacing: '0.14em' }}>{txt(v, 'etiqueta')}</div>
      )}

      <h1 style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 534, fontFamily: OSWALD, fontWeight: 700, fontSize: num(v, 'tamanhoTitulo', 64), lineHeight: 1, textTransform: 'uppercase', whiteSpace: 'pre-line', color: cor }}>{txt(v, 'titulo')}</h1>
      <p style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 676, fontWeight: 500, fontSize: 17, lineHeight: 1.4, color: '#3A3A3A' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 756, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={linha}>
          <Icone cor={cor}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Icone>
          <span>{txt(v, 'data')}</span>
        </div>
        <div style={linha}>
          <Icone cor={cor}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icone>
          <span>{txt(v, 'hora')}</span>
        </div>
        <div style={linha}>
          <Icone cor={cor}><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></Icone>
          <span>{txt(v, 'local')}</span>
        </div>
        {/* o instrutor é próprio de cada aula: sem ele, a linha some */}
        {txt(v, 'instrutor') && (
          <div style={linha}>
            <Icone cor={cor}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Icone>
            <span>{txt(v, 'instrutor')}</span>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: txt(v, 'destaque') }} />
    </div>
  )
}

export const t05Especialidade: DefinicaoDeTemplate = {
  id: 'ev-especialidade',
  nome: 'Aula de especialidade',
  descricao: 'Foto em cima, etiqueta colorida, título em Oswald e lista com ícones.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: a etiqueta vem da chamada (vazia some); o instrutor não está nas informações e fica vazio
  deInformacoes: (i) => ({
    etiqueta: i.chamada, titulo: i.titulo, frase: i.frase, instrutor: '',
    data: dataPorExtenso(i), hora: horaFaixa(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'etiqueta', rotulo: 'Etiqueta', secao: 'Texto', padrao: 'ESPECIALIDADE', maximo: 24 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Primeiros\nSocorros', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 64, min: 40, max: 90, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Aula prática com certificado. Traga caderno e caneta.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'instrutor', rotulo: 'Instrutor', secao: 'Texto', padrao: 'Instrutor: [Nome]', maximo: 40 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: 'Sábado, 08 de novembro', maximo: 30 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '14H00 às 17H00', maximo: 20 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto', secao: 'Imagens' },
    { tipo: 'cor', chave: 'cor', rotulo: 'Cor principal', secao: 'Cores', padrao: '#0B47B5', opcoes: [
      { valor: '#0B47B5', nome: 'Azul' }, { valor: '#B4232A', nome: 'Vermelho' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Barra de destaque', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo' }, { valor: '#FF8A3D', nome: 'Laranja' }, { valor: '#7CCB6B', nome: 'Verde claro' },
    ] },
  ],
}
