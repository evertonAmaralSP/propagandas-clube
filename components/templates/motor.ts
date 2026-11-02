import type { ComponentType } from 'react'
import type { Categoria, Informacoes } from './informacoes'

// O motor de templates: um template é uma definição (campos + valores padrão) e um componente que
// desenha a arte num tamanho fixo. O editor monta o formulário a partir dos campos, a prévia é o
// próprio componente e o PNG sai dessa mesma prévia, então o que se vê é o que se baixa.

export type Secao = 'Texto' | 'Quando e onde' | 'Imagens' | 'Cores'
export const ORDEM_DAS_SECOES: Secao[] = ['Texto', 'Quando e onde', 'Imagens', 'Cores']

type Base = { chave: string; rotulo: string; secao: Secao; ajuda?: string }
export type Campo =
  /** `obrigatorio`: vazio impede gerar a arte (como as fotos). */
  | (Base & { tipo: 'texto'; padrao: string; multilinha?: boolean; maximo?: number; obrigatorio?: boolean })
  | (Base & { tipo: 'tamanho'; padrao: number; min: number; max: number; passo: number })
  | (Base & { tipo: 'cor'; padrao: string; opcoes: { valor: string; nome: string }[] })
  /** foto da galeria; o valor é o id da imagem. Toda foto é obrigatória para gerar a arte. */
  | (Base & { tipo: 'foto' })
  /** versão do logo do clube; o valor é o id do logo. Vazio = a arte sai sem logo. */
  | (Base & { tipo: 'logo' })

/** No editor, foto e logo guardam o id; para a arte, o motor troca pelo endereço da imagem. */
export type Valores = Record<string, string | number>

export type PropsDaArte = { v: Valores }

export type DefinicaoDeTemplate = {
  id: string
  nome: string
  descricao: string
  categoria: Categoria
  largura: number
  altura: number
  campos: Campo[]
  Arte: ComponentType<PropsDaArte>
  /**
   * Leva as informações do wizard para os campos de texto deste template, no formato dele. Só
   * devolve as chaves que as informações preenchem; o resto fica no padrão do template. Fotos,
   * logo e cores não passam por aqui: são sorteados.
   */
  deInformacoes: (i: Informacoes) => Partial<Record<string, string>>
}

/** Lê um texto dos valores; número vira texto e ausente vira vazio. */
export const txt = (v: Valores, chave: string) => String(v[chave] ?? '')
export const num = (v: Valores, chave: string, padrao: number) => {
  const n = Number(v[chave])
  return Number.isFinite(n) ? n : padrao
}

export function valoresPadrao(t: DefinicaoDeTemplate, logoPrincipal: string | null): Valores {
  const v: Valores = {}
  for (const c of t.campos) {
    if (c.tipo === 'foto') v[c.chave] = ''
    else if (c.tipo === 'logo') v[c.chave] = logoPrincipal ?? ''
    else v[c.chave] = c.padrao
  }
  return v
}

/** Troca os ids de foto e logo pelos endereços das imagens; id desconhecido vira vazio. */
export function resolverImagens(t: DefinicaoDeTemplate, v: Valores, enderecos: Map<string, string>): Valores {
  const r: Valores = { ...v }
  for (const c of t.campos) {
    if (c.tipo === 'foto' || c.tipo === 'logo') r[c.chave] = enderecos.get(String(v[c.chave] ?? '')) ?? ''
  }
  return r
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Valores de fora (o que o navegador mandou salvar, ou o que veio do banco para uma cópia) passam
 * por aqui: só as chaves do template, cada uma no tipo e no limite do seu campo. O que não serve
 * vira o padrão.
 */
export function limparValores(t: DefinicaoDeTemplate, bruto: unknown, logoPrincipal: string | null = null): Valores {
  const entrada = bruto && typeof bruto === 'object' && !Array.isArray(bruto) ? (bruto as Record<string, unknown>) : {}
  const v = valoresPadrao(t, logoPrincipal)
  for (const c of t.campos) {
    if (!(c.chave in entrada)) continue
    const x = entrada[c.chave]
    if (c.tipo === 'texto' && typeof x === 'string') v[c.chave] = x.slice(0, c.maximo ?? 500)
    else if (c.tipo === 'tamanho' && typeof x === 'number' && Number.isFinite(x)) v[c.chave] = Math.min(c.max, Math.max(c.min, Math.round(x)))
    else if (c.tipo === 'cor' && typeof x === 'string' && c.opcoes.some((o) => o.valor === x)) v[c.chave] = x
    else if ((c.tipo === 'foto' || c.tipo === 'logo') && typeof x === 'string' && (x === '' || UUID.test(x))) v[c.chave] = x
  }
  return v
}

/** `x` se tiver texto; senão nada (a chave fica no padrão do template). */
export const seTiver = (x: string) => (x.trim() ? x : undefined)

/** O que falta para gerar a arte: toda foto e todo texto obrigatório preenchidos. */
export function pendencias(t: DefinicaoDeTemplate, v: Valores): string[] {
  return t.campos
    .filter((c) => (c.tipo === 'foto' || (c.tipo === 'texto' && c.obrigatorio)) && !String(v[c.chave] ?? '').trim())
    .map((c) => c.rotulo)
}

/** Hex de 6 dígitos com transparência (para o degradê que some no fundo). */
export const comAlfa = (hex: string, alfa: number) =>
  /^#[0-9a-f]{6}$/i.test(hex) ? `${hex}${Math.round(alfa * 255).toString(16).padStart(2, '0')}` : hex
