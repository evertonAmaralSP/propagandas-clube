// As informações que o wizard pede uma vez e que cada template formata do seu jeito: a mesma data
// vira "05|09" num, "Sábado, 05 de setembro" noutro, "05" + "SET" num terceiro; os itens viram
// lista com marcadores, texto com "·" ou uma frase.

export type Categoria = 'reuniao-regular' | 'eventos'

export const CATEGORIAS: { id: Categoria; nome: string; descricao: string }[] = [
  { id: 'reuniao-regular', nome: 'Reunião Regular', descricao: 'A chamada de todo sábado: data, hora, local e o que levar.' },
  { id: 'eventos', nome: 'Eventos', descricao: 'Investidura, trilha, campori, gincana, acampamento e outras chamadas especiais.' },
]

export type Informacoes = {
  /** título principal; Enter quebra a linha */
  titulo: string
  /** frase curta que vem antes ou acima do título ("SÁBADO É DIA DE", "VEM AÍ O"); vazia = cada modelo usa a sua */
  chamada: string
  /** AAAA-MM-DD */
  data: string
  /** HH:MM */
  horaInicio: string
  /** HH:MM ou vazio */
  horaFim: string
  local: string
  /** um item por linha */
  itens: string
  /** frase de apoio; vazia = cada modelo usa a sua (Reunião Regular) ou some (Eventos) */
  frase: string
  versiculo: string
  referencia: string
  nomeDoClube: string
}

export const ITENS_DA_REUNIAO = 'Bíblia\ncaderno de classe\ngarrafa de água\nlenço\nblusa do clube ou unidade'

export function informacoesIniciais(categoria: Categoria): Informacoes {
  const reuniao = categoria === 'reuniao-regular'
  return {
    titulo: reuniao ? 'Reunião\nRegular' : '',
    chamada: '',
    data: proximoSabado(),
    horaInicio: reuniao ? '15:00' : '',
    horaFim: '',
    local: '',
    itens: reuniao ? ITENS_DA_REUNIAO : '',
    frase: '',
    versiculo: '',
    referencia: '',
    nomeDoClube: '',
  }
}

function proximoSabado(hoje = new Date()) {
  const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** O que falta no passo de informações. */
export function faltandoNasInformacoes(i: Informacoes): string[] {
  const f: string[] = []
  if (!i.titulo.trim()) f.push('Título')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(i.data)) f.push('Data')
  if (!/^\d{2}:\d{2}$/.test(i.horaInicio)) f.push('Hora')
  if (!i.local.trim()) f.push('Local')
  return f
}

// ---------- formatadores que os templates usam ----------

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

function partes(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return { ano: m[1], mes: d.getMonth(), dia: d.getDate(), semana: d.getDay() }
}
const doisDigitos = (n: number) => String(n).padStart(2, '0')
const maiuscula = (s: string) => s.charAt(0).toLocaleUpperCase('pt-BR') + s.slice(1)

/** "05|09" */
export const dataBarra = (i: Informacoes) => { const p = partes(i.data); return p ? `${doisDigitos(p.dia)}|${doisDigitos(p.mes + 1)}` : '' }
/** "05" */
export const dia = (i: Informacoes) => { const p = partes(i.data); return p ? doisDigitos(p.dia) : '' }
/** "SET" */
export const mesCurto = (i: Informacoes) => { const p = partes(i.data); return p ? MESES[p.mes].slice(0, 3).toLocaleUpperCase('pt-BR') : '' }
/** "SETEMBRO" */
export const mesLongo = (i: Informacoes) => { const p = partes(i.data); return p ? MESES[p.mes].toLocaleUpperCase('pt-BR') : '' }
/** "10 DE OUT" */
export const diaDeMes = (i: Informacoes) => (partes(i.data) ? `${dia(i)} DE ${mesCurto(i)}` : '')
/** "Sábado, 05 de setembro" */
export const dataPorExtenso = (i: Informacoes) => {
  const p = partes(i.data)
  return p ? `${maiuscula(DIAS[p.semana])}, ${doisDigitos(p.dia)} de ${MESES[p.mes]}` : ''
}
/** "SÁBADO" */
export const diaDaSemana = (i: Informacoes) => { const p = partes(i.data); return p ? DIAS[p.semana].toLocaleUpperCase('pt-BR') : '' }

const horaCurta = (hhmm: string) => {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm)
  return m ? `${Number(m[1])}H${m[2]}` : ''
}
/** "15H00" (ou "9H00") */
export const hora = (i: Informacoes) => horaCurta(i.horaInicio)
/** "15H00 às 18H00" ou só "15H00" */
export const horaFaixa = (i: Informacoes) => (i.horaFim ? `${hora(i)} às ${horaCurta(i.horaFim)}` : hora(i))
/** "às 15H00" */
export const horaComAs = (i: Informacoes) => (hora(i) ? `às ${hora(i)}` : '')

const listaDeItens = (i: Informacoes) => i.itens.split('\n').map((s) => s.replace(/^[•·\-*\s]+/, '').trim()).filter(Boolean)
/** "• Bíblia\n• lenço" */
export const itensComMarcadores = (i: Informacoes) => listaDeItens(i).map((s) => `• ${s}`).join('\n')
/** "Bíblia · lenço · água" */
export const itensComPontos = (i: Informacoes) => listaDeItens(i).join(' · ')
/** "Bíblia, lenço e água" (sem ponto final) */
export const itensEmFrase = (i: Informacoes) => {
  const l = listaDeItens(i)
  return l.length <= 1 ? (l[0] ?? '') : `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}`
}
export const temItens = (i: Informacoes) => listaDeItens(i).length > 0

/**
 * Tamanho do título que cabe na largura: o padrão do template, ou menos quando a linha mais longa
 * passaria da caixa. `proporcao` é a largura média de uma letra em relação ao tamanho da fonte
 * (≈0,5 serifada, ≈0,75 para as pretas largas). Aproximado, mas evita título invadindo a foto.
 */
export function tamanhoQueCabe(titulo: string, larguraDaCaixa: number, padrao: number, proporcao: number, minimo = 40) {
  const maior = Math.max(1, ...titulo.split('\n').map((l) => l.trim().length))
  return String(Math.max(minimo, Math.min(padrao, Math.floor(larguraDaCaixa / (maior * proporcao)))))
}

/** O título numa linha só ("Reunião Regular"), para quem não quebra linha. */
export const tituloEmUmaLinha = (i: Informacoes) => i.titulo.replace(/\s*\n\s*/g, ' ').trim()
