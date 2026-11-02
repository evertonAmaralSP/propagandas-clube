import type { CSSProperties } from 'react'
import { FRAUNCES, INTER } from './fontes'
import { dataBarra, hora, itensComMarcadores, temItens } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto } from './pecas'

// "12 · Reunião de pais" do canvas Chamadas do Clube: cabeçalho colorido com logo e nome do clube,
// título serifado, foto arredondada ao lado da frase, quadro da pauta e três cartões de data, hora e local.

const cartao: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, padding: 12, borderWidth: 2, borderStyle: 'solid', borderRadius: 14 }

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  const logo = txt(v, 'logo')
  const rotulo: CSSProperties = { fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: cor }
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#FFFFFF', fontFamily: INTER, color: '#1E2A28' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 120, background: cor, boxSizing: 'border-box', padding: '0 30px', display: 'flex', alignItems: 'center', gap: 16, color: '#FFFFFF' }}>
        {/* o logo está no fluxo do cabeçalho: sem logo, o nome do clube encosta na margem */}
        {logo && (
          <div style={{ width: 76, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage; o PNG sai do DOM */}
            <img src={logo} alt="" crossOrigin="anonymous" style={{ maxWidth: 76, maxHeight: 76, objectFit: 'contain', display: 'block' }} />
          </div>
        )}
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '0.04em', lineHeight: 1.3 }}>{txt(v, 'clube')}</span>
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 30, top: 160, fontWeight: 700, fontSize: 14, letterSpacing: '0.2em', color: cor }}>{txt(v, 'antes')}</p>
      <h1 style={{ margin: 0, position: 'absolute', left: 30, right: 30, top: 186, fontFamily: FRAUNCES, fontWeight: 700, fontSize: num(v, 'tamanhoTitulo', 72), lineHeight: 1, whiteSpace: 'pre-line', color: '#1E2A28' }}>
        {txt(v, 'titulo')}
      </h1>
      <p style={{ margin: 0, position: 'absolute', left: 30, width: 280, top: 350, fontWeight: 500, fontSize: 17, lineHeight: 1.45, color: '#3D4A47' }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', right: 30, top: 340, width: 170, height: 170, borderRadius: 20, overflow: 'hidden', background: '#E6EEEC' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1"
          estiloVazio={{ border: '2px dashed #8AA39E', borderRadius: 20, background: 'transparent', color: '#4F625E', fontSize: 14 }} />
      </div>

      {/* o quadro da pauta só aparece com pauta */}
      {txt(v, 'pauta') && (
        <div style={{ position: 'absolute', left: 30, right: 30, top: 548, padding: '20px 22px', borderRadius: 18, background: txt(v, 'claro'), display: 'flex', flexDirection: 'column', gap: 6 }}>
          {txt(v, 'pautaTitulo') && <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: cor }}>{txt(v, 'pautaTitulo')}</span>}
          <span style={{ fontWeight: 500, fontSize: 16, lineHeight: 1.55, whiteSpace: 'pre-line' }}>{txt(v, 'pauta')}</span>
        </div>
      )}

      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 40, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <div style={{ ...cartao, borderColor: cor }}>
          <span style={rotulo}>DATA</span>
          <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: 26 }}>{txt(v, 'data')}</span>
        </div>
        <div style={{ ...cartao, borderColor: cor }}>
          <span style={rotulo}>HORA</span>
          <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: 26 }}>{txt(v, 'hora')}</span>
        </div>
        <div style={{ ...cartao, borderColor: cor }}>
          <span style={rotulo}>LOCAL</span>
          <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{txt(v, 'local')}</span>
        </div>
      </div>
    </div>
  )
}

export const t12Pais: DefinicaoDeTemplate = {
  id: 'ev-pais',
  nome: 'Reunião de pais',
  descricao: 'Convite sóbrio: cabeçalho com o clube, título serifado, pauta num quadro e cartões de data, hora e local.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: nome do clube, chamada e frase vazios ficam vazios. A pauta não está nas informações:
  // o quadro mostra o que levar, se houver; sem itens, ele some
  deInformacoes: (i) => ({
    clube: i.nomeDoClube, antes: i.chamada, titulo: i.titulo, frase: i.frase,
    pautaTitulo: temItens(i) ? 'LEVE' : '', pauta: itensComMarcadores(i),
    data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'clube', rotulo: 'Nome do clube', secao: 'Texto', padrao: 'Clube de Desbravadores [Nome]', maximo: 50 },
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'CONVITE AOS RESPONSÁVEIS', maximo: 32 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Reunião\nde Pais', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 72, min: 44, max: 96, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Sua presença é muito importante para o planejamento do semestre.', multilinha: true, maximo: 90 },
    { tipo: 'texto', chave: 'pautaTitulo', rotulo: 'Título da pauta', secao: 'Texto', padrao: 'PAUTA', maximo: 24 },
    { tipo: 'texto', chave: 'pauta', rotulo: 'Pauta', secao: 'Texto', padrao: '1. Calendário de eventos\n2. Uniformes e mensalidade\n3. Acampamento e autorizações\n4. Espaço para dúvidas', multilinha: true, maximo: 200, ajuda: 'Um assunto por linha.' },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '08|11', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '10H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto', secao: 'Imagens' },
    { tipo: 'cor', chave: 'cor', rotulo: 'Cor principal', secao: 'Cores', padrao: '#1E6B5C', opcoes: [
      { valor: '#1E6B5C', nome: 'Verde petróleo' }, { valor: '#0B47B5', nome: 'Azul' }, { valor: '#7A3B12', nome: 'Marrom' },
    ] },
    { tipo: 'cor', chave: 'claro', rotulo: 'Fundo da pauta', secao: 'Cores', padrao: '#EAF3F0', opcoes: [
      { valor: '#EAF3F0', nome: 'Verde claro' }, { valor: '#EEF3FB', nome: 'Azul claro' }, { valor: '#FBF1E8', nome: 'Pêssego' },
    ] },
  ],
}
