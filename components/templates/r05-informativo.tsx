import { INTER, OSWALD } from './fontes'
import { dataPorExtenso, horaFaixa, itensEmFrase, temItens } from './informacoes'
import { num, seTiver, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto } from './pecas'

// "RR 05 · Informativo" do canvas Chamadas do Clube: foto no topo, cartão branco com o logo,
// etiqueta colorida, título em caixa alta e a lista data / hora / local com ícones.

const linha = { display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 18 }
const icone = { width: 22, height: 22, fill: 'none', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function Arte({ v }: PropsDaArte) {
  const cor = txt(v, 'cor')
  const logo = txt(v, 'logo')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: '#FFFFFF', fontFamily: INTER, color: '#1A1A1A' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 440, background: '#DCDFE6' }}>
        <Foto src={txt(v, 'foto1')} rotulo="Foto 1" estiloVazio={{
          position: 'absolute', left: 16, top: 16, right: 16, bottom: 16, width: 'auto', height: 'auto',
          border: '2px dashed #8A8A8A', background: 'transparent', fontWeight: 600, fontSize: 16, color: '#555',
        }} />
      </div>

      {/* o cartão branco é da arte; o logo só entra quando há um escolhido */}
      <div style={{ position: 'absolute', left: 28, top: 28, width: 84, height: 84, borderRadius: 16, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage; o PNG sai do DOM */}
        {logo && <img src={logo} alt="" crossOrigin="anonymous" style={{ maxWidth: 72, maxHeight: 72, objectFit: 'contain', display: 'block' }} />}
      </div>

      <div style={{ position: 'absolute', left: 36, top: 418, padding: '10px 16px', background: txt(v, 'destaque'), color: '#1A1A1A', fontWeight: 700, fontSize: 14, letterSpacing: '0.14em' }}>{txt(v, 'etiqueta')}</div>

      <h1 style={{ margin: 0, position: 'absolute', left: 36, right: 36, top: 474, fontFamily: OSWALD, fontWeight: 700, fontSize: num(v, 'tamanhoTitulo', 72), lineHeight: 1, textTransform: 'uppercase', whiteSpace: 'pre-line', color: cor }}>
        {txt(v, 'titulo')}
      </h1>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 636, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={linha}>
          <svg viewBox="0 0 24 24" stroke={cor} aria-hidden="true" style={{ flex: 'none' }} {...icone}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          <span>{txt(v, 'data')}</span>
        </div>
        <div style={linha}>
          <svg viewBox="0 0 24 24" stroke={cor} aria-hidden="true" style={{ flex: 'none' }} {...icone}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span>{txt(v, 'hora')}</span>
        </div>
        <div style={linha}>
          <svg viewBox="0 0 24 24" stroke={cor} aria-hidden="true" style={{ flex: 'none' }} {...icone}><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
          <span>{txt(v, 'local')}</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 36, right: 36, top: 776, padding: '14px 16px', border: `2px solid ${cor}`, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', color: cor }}>ITENS ESSENCIAIS</span>
        <span style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.45 }}>{txt(v, 'itens')}</span>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: cor }} />
    </div>
  )
}

export const r05Informativo: DefinicaoDeTemplate = {
  id: 'rr-informativo',
  nome: 'Informativo',
  descricao: 'Foto no topo, etiqueta colorida e data, hora e local com ícones.',
  categoria: 'reuniao-regular',
  largura: 540,
  altura: 960,
  Arte,
  deInformacoes: (i) => ({
    etiqueta: seTiver(i.chamada), titulo: i.titulo, itens: temItens(i) ? `${itensEmFrase(i)}.` : undefined,
    data: dataPorExtenso(i), hora: horaFaixa(i), local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'etiqueta', rotulo: 'Etiqueta', secao: 'Texto', padrao: 'TODA SEMANA', maximo: 30 },
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'Reunião\nRegular', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 72, min: 40, max: 96, passo: 2 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: 'Bíblia, caderno de classe, garrafa de água, lenço e blusa do clube ou unidade.', multilinha: true, maximo: 200 },
    { tipo: 'texto', chave: 'data', rotulo: 'Data', secao: 'Quando e onde', padrao: 'Sábado, 05 de setembro', maximo: 40 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Hora', secao: 'Quando e onde', padrao: '15H00 às 18H00', maximo: 20 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: 'Rua Engenheiro Rebouças, 520', maximo: 70 },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'foto1', rotulo: 'Foto 1', secao: 'Imagens' },
    { tipo: 'cor', chave: 'cor', rotulo: 'Cor principal', secao: 'Cores', padrao: '#0B47B5', opcoes: [
      { valor: '#0B47B5', nome: 'Azul' }, { valor: '#B4232A', nome: 'Vermelho' }, { valor: '#1F7A3A', nome: 'Verde' },
    ] },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Etiqueta', secao: 'Cores', padrao: '#F5C518', opcoes: [
      { valor: '#F5C518', nome: 'Amarelo ouro' }, { valor: '#FF8A3D', nome: 'Laranja' }, { valor: '#7CCB6B', nome: 'Verde claro' },
    ] },
  ],
}
