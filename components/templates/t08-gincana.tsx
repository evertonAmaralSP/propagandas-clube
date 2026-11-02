import type { CSSProperties } from 'react'
import { ARCHIVO, ARCHIVO_BLACK } from './fontes'
import { dataBarra, hora } from './informacoes'
import { num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, Logo } from './pecas'

// "08 · Gincana" do canvas Chamadas do Clube: fundo branco com faixa de três cores, título pesado
// com sombra chapada, mosaico 2×2 de fotos com borda colorida e três blocos de data, hora e local.

const vazioDaFoto: CSSProperties = { border: 'none', background: 'transparent', fontWeight: 700, fontSize: 14, color: '#555' }
const rotuloDoBloco: CSSProperties = { fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }

function Arte({ v }: PropsDaArte) {
  const cor1 = txt(v, 'cor1')
  const cor2 = txt(v, 'cor2')
  const cor3 = txt(v, 'cor3')
  const caixa = (cor: string): CSSProperties => ({ height: 190, border: `4px solid ${cor}`, boxSizing: 'border-box', background: '#EEEEEE' })
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#FFFFFF', fontFamily: ARCHIVO, color: '#141414' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 18, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <div style={{ background: cor1 }} /><div style={{ background: cor2 }} /><div style={{ background: cor3 }} />
      </div>

      <Logo src={txt(v, 'logo')} lado={84} estilo={{ right: 30, top: 42 }} />

      {/* a etiqueta tem fundo: sem chamada, some */}
      {txt(v, 'antes') && (
        <p style={{ margin: 0, position: 'absolute', left: 32, top: 56, padding: '6px 12px', background: cor2, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em' }}>{txt(v, 'antes')}</p>
      )}
      <h1 style={{ margin: 0, position: 'absolute', left: 30, right: 30, top: 104, fontFamily: ARCHIVO_BLACK, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 96), lineHeight: 0.95, letterSpacing: '-0.02em', whiteSpace: 'pre-line', color: cor1, textShadow: `5px 5px 0 ${cor2}` }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 32, right: 32, top: 330, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        <div style={caixa(cor1)}><Foto src={txt(v, 'foto1')} rotulo="Foto 1" estiloVazio={vazioDaFoto} /></div>
        <div style={caixa(cor2)}><Foto src={txt(v, 'foto2')} rotulo="Foto 2" estiloVazio={vazioDaFoto} /></div>
        <div style={caixa(cor3)}><Foto src={txt(v, 'foto3')} rotulo="Foto 3" estiloVazio={vazioDaFoto} /></div>
        <div style={caixa(cor1)}><Foto src={txt(v, 'foto4')} rotulo="Foto 4" estiloVazio={vazioDaFoto} /></div>
      </div>

      <p style={{ margin: 0, position: 'absolute', left: 32, right: 32, top: 744, fontWeight: 700, fontSize: 20, lineHeight: 1.35 }}>{txt(v, 'frase')}</p>

      <div style={{ position: 'absolute', left: 32, right: 32, bottom: 40, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: cor1, color: '#FFFFFF' }}>
          <span style={rotuloDoBloco}>DATA</span>
          <span style={{ fontFamily: ARCHIVO_BLACK, fontSize: 24 }}>{txt(v, 'data')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: cor2 }}>
          <span style={rotuloDoBloco}>HORA</span>
          <span style={{ fontFamily: ARCHIVO_BLACK, fontSize: 24 }}>{txt(v, 'hora')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: cor3, color: '#FFFFFF' }}>
          <span style={rotuloDoBloco}>LOCAL</span>
          <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25 }}>{txt(v, 'local')}</span>
        </div>
      </div>
    </div>
  )
}

export const t08Gincana: DefinicaoDeTemplate = {
  id: 'ev-gincana',
  nome: 'Gincana',
  descricao: 'Três cores fortes: título com sombra chapada, mosaico de quatro fotos e blocos coloridos.',
  categoria: 'eventos',
  largura: 540,
  altura: 960,
  Arte,
  // Eventos: chamada e frase vazias ficam vazias (sem chamada, a etiqueta amarela some)
  deInformacoes: (i) => ({
    antes: i.chamada, titulo: i.titulo, frase: i.frase, data: dataBarra(i), hora: hora(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'antes', rotulo: 'Chamada', secao: 'Texto', padrao: 'UNIDADE CONTRA UNIDADE', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'GRANDE\nGINCANA', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 96, min: 50, max: 120, passo: 2 },
    { tipo: 'texto', chave: 'frase', rotulo: 'Frase', secao: 'Texto', padrao: 'Provas, desafios bíblicos e muita correria. Que vença a melhor unidade!', multilinha: true, maximo: 110 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: '29|11', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00', maximo: 12 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 60 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto2', rotulo: 'Foto 2', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto3', rotulo: 'Foto 3', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto4', rotulo: 'Foto 4', secao: 'Imagens' },
    { tipo: 'cor', chave: 'cor1', rotulo: 'Cor 1', secao: 'Cores', padrao: '#0B47B5', opcoes: [{ valor: '#0B47B5', nome: 'Azul' }] },
    { tipo: 'cor', chave: 'cor2', rotulo: 'Cor 2', secao: 'Cores', padrao: '#F5C518', opcoes: [{ valor: '#F5C518', nome: 'Amarelo' }] },
    { tipo: 'cor', chave: 'cor3', rotulo: 'Cor 3', secao: 'Cores', padrao: '#C62828', opcoes: [{ valor: '#C62828', nome: 'Vermelho' }] },
  ],
}
