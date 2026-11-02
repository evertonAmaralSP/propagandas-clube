import type { Informacoes } from './informacoes'
import { valoresPadrao, type DefinicaoDeTemplate, type Valores } from './motor'
import type { FotoDaGaleria, LogoDoClube } from './tipos-do-editor'

// O sorteio do wizard: cada variação de um template leva as informações (no formato do template) e
// sorteia fotos, cores e logo conforme a configuração escolhida.

export type ConfigDasFotos =
  | { modo: 'todas' }
  | { modo: 'etiquetas'; etiquetas: string[] }
  | { modo: 'escolhidas'; ids: string[] }

export type ConfigDoLogo =
  | { modo: 'sortear' }
  | { modo: 'fixo'; id: string }
  | { modo: 'sem' }

export type ConfigDoSorteio = { fotos: ConfigDasFotos; logo: ConfigDoLogo }

export const CONFIG_INICIAL: ConfigDoSorteio = { fotos: { modo: 'todas' }, logo: { modo: 'sortear' } }

/** As fotos que entram no sorteio. */
export function fotosDoSorteio(fotos: FotoDaGaleria[], c: ConfigDasFotos): FotoDaGaleria[] {
  if (c.modo === 'etiquetas') return c.etiquetas.length ? fotos.filter((f) => f.etiquetas.some((e) => c.etiquetas.includes(e))) : fotos
  if (c.modo === 'escolhidas') { const ids = new Set(c.ids); return fotos.filter((f) => ids.has(f.id)) }
  return fotos
}

/** As versões do logo que entram no sorteio (vazio = arte sem logo). */
export function logosDoSorteio(logos: LogoDoClube[], c: ConfigDoLogo): string[] {
  if (c.modo === 'sem') return []
  if (c.modo === 'fixo') return logos.some((l) => l.id === c.id) ? [c.id] : []
  return logos.map((l) => l.id)
}

function embaralhar<T>(lista: T[]): T[] {
  const a = [...lista]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
const umDe = <T,>(lista: T[]): T | undefined => lista[Math.floor(Math.random() * lista.length)]

/** As informações aplicadas no template, sem sortear nada (cores e imagens no padrão). */
export function comInformacoes(t: DefinicaoDeTemplate, i: Informacoes): Valores {
  const v = valoresPadrao(t, null)
  for (const [chave, valor] of Object.entries(t.deInformacoes(i))) if (valor !== undefined) v[chave] = valor
  return v
}

/**
 * Uma variação: informações + cores sorteadas entre as opções do template + fotos sorteadas sem
 * repetir dentro da arte (se houver menos fotos que espaços, repete) + uma versão do logo.
 */
export function sortearVariacao(t: DefinicaoDeTemplate, i: Informacoes, fotos: string[], logos: string[]): Valores {
  const v = comInformacoes(t, i)
  const espacos = t.campos.filter((c) => c.tipo === 'foto')
  let fila = embaralhar(fotos)
  for (const c of t.campos) {
    if (c.tipo === 'cor') v[c.chave] = umDe(c.opcoes)?.valor ?? c.padrao
    else if (c.tipo === 'logo') v[c.chave] = umDe(logos) ?? ''
  }
  for (const c of espacos) {
    if (!fila.length) fila = embaralhar(fotos)
    v[c.chave] = fila.shift() ?? ''
  }
  return v
}

export const quantasFotos = (t: DefinicaoDeTemplate) => t.campos.filter((c) => c.tipo === 'foto').length
