// Regras da galeria de propagandas (migration 0003): balde privado `propagandas`, arquivo em
// <usuario_id>/<id>.<ext>, dados em public.propagandas. Sem `server-only`: o editor usa o limite.

export const BALDE_DAS_PROPAGANDAS = 'propagandas'
/** Mesmo limite das fotos: a arte sobe por Server Action, abaixo dos 6 MB da função do Netlify. */
export const LIMITE_DA_PROPAGANDA = 5 * 1024 * 1024
export const LIMITE_DO_TEXTO_DE_UM_VALOR = 500

export type Propaganda = {
  id: string
  template: string
  nomeDoTemplate: string
  nome: string
  tipo: 'image/png' | 'image/jpeg'
  tamanho: number
  largura: number
  altura: number
  criadoEm: string
  minha: boolean
  url: string | null
}

export const extensaoDaPropaganda = (tipo: string) => (tipo === 'image/jpeg' ? 'jpg' : 'png')
