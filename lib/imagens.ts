// Regras das imagens das propagandas (migration 0001): balde privado `imagens`, arquivo em
// <usuario_id>/<id>.<ext>, dados em public.imagens. Sem `server-only`: a tela de envio usa os
// mesmos limites para avisar antes de subir.

export const BALDE_DAS_IMAGENS = 'imagens'
/** 5 MB: a função do Netlify aceita até 6 MB por pedido, e cada foto sobe num pedido só. */
export const LIMITE_DA_IMAGEM = 5 * 1024 * 1024
export const LIMITE_DO_NOME = 120
export const LIMITE_DE_ETIQUETAS = 12
export const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'] as const

export type TipoDaImagem = (typeof TIPOS_ACEITOS)[number]

export type Imagem = {
  id: string
  nome: string
  etiquetas: string[]
  tipo: TipoDaImagem
  tamanho: number
  largura: number | null
  altura: number | null
  criadoEm: string
  minha: boolean
  url: string | null
}

const EXTENSAO: Record<TipoDaImagem, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }
export const extensaoDoTipo = (t: TipoDaImagem) => EXTENSAO[t]

/** Confere pelos primeiros bytes, não pela extensão nem pelo tipo que o navegador informou. */
export function tipoPelosBytes(b: Uint8Array): TipoDaImagem | null {
  if (b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((x, i) => b[i] === x)) return 'image/png'
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.length >= 12 && String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') return 'image/webp'
  return null
}

/** "verão, Acampamento ,  verão" → ["verão", "acampamento"]: minúsculas, sem repetição, até 12. */
export function lerEtiquetas(texto: string): string[] {
  const vistas = new Set<string>()
  for (const parte of texto.split(/[,;#\n]/)) {
    const e = parte.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR').slice(0, 30)
    if (e) vistas.add(e)
  }
  return [...vistas].slice(0, LIMITE_DE_ETIQUETAS)
}

/** O nome que a foto ganha por padrão: o do arquivo, sem extensão, com espaço no lugar de - e _. */
export function nomeDoArquivo(arquivo: string): string {
  const base = arquivo.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  return (base || 'Imagem').slice(0, LIMITE_DO_NOME)
}

export function tamanhoLegivel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
}

/** Para comparar na busca: minúsculas e sem acento. */
export const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('pt-BR')
