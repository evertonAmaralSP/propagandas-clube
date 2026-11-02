import { ANTON, MONTSERRAT } from './fontes'
import { dia, diaDaSemana, hora, itensComMarcadores, mesLongo } from './informacoes'
import { comAlfa, num, txt, type DefinicaoDeTemplate, type PropsDaArte } from './motor'
import { Foto, IconeLocal, Logo } from './pecas'

// "Template · Acampamento" do canvas Chamadas do Clube: foto de fundo que some num degradê para a
// cor de fundo, selo, título enorme, lista da mochila, data em destaque e o local numa pílula.

function Arte({ v }: PropsDaArte) {
  const fundo = txt(v, 'fundo')
  const destaque = txt(v, 'destaque')
  return (
    <div style={{ width: 540, height: 960, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: fundo, fontFamily: MONTSERRAT, color: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 560 }}>
        <Foto src={txt(v, 'fotoFundo')} rotulo="Foto de fundo"
          estiloVazio={{ border: '2px dashed rgba(255,255,255,0.55)', background: 'transparent', color: 'rgba(255,255,255,0.85)', fontSize: 16 }} />
      </div>
      {/* o degradê vai do transparente para a própria cor de fundo, seja qual for */}
      <div style={{ position: 'absolute', left: 0, top: 300, width: 540, height: 260, background: `linear-gradient(180deg, ${comAlfa(fundo, 0)} 0%, ${fundo} 92%)` }} />

      <Logo src={txt(v, 'logo')} lado={96} estilo={{ right: 28, top: 28 }} />

      {txt(v, 'selo') && <div style={{ position: 'absolute', left: 36, top: 36, padding: '8px 14px', border: `2px solid ${destaque}`, borderRadius: 999, fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', color: destaque }}>
        {txt(v, 'selo')}
      </div>}

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 272, display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 600, fontStyle: 'italic', fontSize: 26, color: destaque }}>{txt(v, 'chamada')}</p>
        <h1 style={{ margin: 0, fontFamily: ANTON, fontWeight: 400, fontSize: num(v, 'tamanhoTitulo', 118), lineHeight: 0.9, whiteSpace: 'pre-line', color: '#FFFFFF' }}>
          {txt(v, 'titulo')}
        </h1>
      </div>

      {txt(v, 'itens') && <div style={{ position: 'absolute', left: 36, top: 712, width: 270, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', color: destaque }}>{txt(v, 'rotuloItens')}</p>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 15, lineHeight: 1.45, whiteSpace: 'pre-line' }}>{txt(v, 'itens')}</p>
      </div>}

      <div style={{ position: 'absolute', right: 36, top: 704, width: 190, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, textAlign: 'right' }}>
        <p style={{ margin: 0, fontFamily: ANTON, fontSize: 58, lineHeight: 0.95, color: destaque }}>{txt(v, 'data')}</p>
        <p style={{ margin: 0, fontFamily: ANTON, fontSize: 34, lineHeight: 1 }}>{txt(v, 'mes')}</p>
        <p style={{ margin: '8px 0 0', fontWeight: 700, fontSize: 15 }}>{txt(v, 'hora')}</p>
      </div>

      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 36, minHeight: 52, boxSizing: 'border-box', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, border: `2px solid ${destaque}`, borderRadius: 999, fontWeight: 600, fontSize: 16, textAlign: 'center' }}>
        <IconeLocal cor={destaque} />
        <span>{txt(v, 'local')}</span>
      </div>
    </div>
  )
}

export const acampamento: DefinicaoDeTemplate = {
  id: 'acampamento',
  nome: 'Acampamento',
  descricao: 'Para acampamento ou saída: foto de fundo, título enorme, lista da mochila e a data em destaque.',
  largura: 540,
  categoria: 'eventos',
  altura: 960,
  Arte,
  // num evento que não é acampamento, selo e "Bora acampar!" não servem: vazios, eles somem
  deInformacoes: (i) => ({
    titulo: i.titulo, chamada: i.chamada, selo: '', rotuloItens: 'LEVE:', itens: itensComMarcadores(i),
    data: dia(i), mes: mesLongo(i),
    hora: `${diaDaSemana(i).charAt(0)}${diaDaSemana(i).slice(1).toLocaleLowerCase('pt-BR')}, ${hora(i)}`, local: i.local,
  }),
  campos: [
    { tipo: 'texto', chave: 'titulo', rotulo: 'Título', secao: 'Texto', padrao: 'ACAMPA\nMENTO', multilinha: true, maximo: 40, ajuda: 'Use Enter para quebrar a linha.' },
    { tipo: 'tamanho', chave: 'tamanhoTitulo', rotulo: 'Tamanho do título', secao: 'Texto', padrao: 118, min: 64, max: 140, passo: 2 },
    { tipo: 'texto', chave: 'chamada', rotulo: 'Chamada', secao: 'Texto', padrao: 'Bora acampar!', maximo: 30 },
    { tipo: 'texto', chave: 'selo', rotulo: 'Selo', secao: 'Texto', padrao: '3 DIAS · 2 NOITES', maximo: 24 },
    { tipo: 'texto', chave: 'rotuloItens', rotulo: 'Chamada da lista', secao: 'Texto', padrao: 'NA MOCHILA:', maximo: 30 },
    { tipo: 'texto', chave: 'itens', rotulo: 'Itens', secao: 'Texto', padrao: '• Bíblia e caderno de classe\n• barraca e saco de dormir\n• lanterna e garrafa de água\n• lenço e uniforme de campo\n• autorização assinada', multilinha: true, maximo: 220 },
    { tipo: 'texto', chave: 'data', rotulo: 'Dias', secao: 'Quando e onde', padrao: '19–21', maximo: 10 },
    { tipo: 'texto', chave: 'mes', rotulo: 'Mês', secao: 'Quando e onde', padrao: 'SETEMBRO', maximo: 12 },
    { tipo: 'texto', chave: 'hora', rotulo: 'Saída', secao: 'Quando e onde', padrao: 'Saída sexta, 19h', maximo: 30 },
    { tipo: 'texto', chave: 'local', rotulo: 'Local', secao: 'Quando e onde', padrao: '', maximo: 70, obrigatorio: true, ajuda: 'Onde vai ser o acampamento.' },
    { tipo: 'logo', chave: 'logo', rotulo: 'Logo', secao: 'Imagens' },
    { tipo: 'foto', chave: 'fotoFundo', rotulo: 'Foto de fundo', secao: 'Imagens' },
    { tipo: 'cor', chave: 'fundo', rotulo: 'Fundo', secao: 'Cores', padrao: '#0A1A44', opcoes: [
      { valor: '#0A1A44', nome: 'Azul noite' }, { valor: '#12321E', nome: 'Verde mata' }, { valor: '#2B1608', nome: 'Marrom fogueira' },
    ] },
    { tipo: 'cor', chave: 'destaque', rotulo: 'Destaque', secao: 'Cores', padrao: '#F5B82E', opcoes: [
      { valor: '#F5B82E', nome: 'Dourado' }, { valor: '#7CCB6B', nome: 'Verde claro' }, { valor: '#FF8A3D', nome: 'Laranja' },
    ] },
  ],
}
