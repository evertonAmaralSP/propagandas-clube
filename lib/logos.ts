// Regras dos logos do clube (migration 0002): balde privado `logos`, arquivo em <id>.png, dados em
// public.logos. Só PNG com transparência. Sem `server-only`: a tela usa os mesmos limites.

export const BALDE_DOS_LOGOS = 'logos'
/** Abaixo disso o logo tende a ficar serrilhado quando o template amplia. Só aviso, não barra. */
export const LADO_MINIMO_RECOMENDADO = 500

export type Logo = {
  id: string
  nome: string
  principal: boolean
  tamanho: number
  largura: number | null
  altura: number | null
  criadoEm: string
  meu: boolean
  url: string | null
}

const ASSINATURA_PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const texto = (b: Uint8Array, i: number) => String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3])
const inteiro = (b: Uint8Array, i: number) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0

export type ConferenciaDoPng = { ok: true } | { ok: false; motivo: 'nao-png' | 'sem-transparencia' }

/**
 * Confere pelos bytes que é PNG e que o arquivo PODE ter transparência: canal alfa no IHDR
 * (tipo de cor 4 ou 6) ou um bloco tRNS antes dos dados. Não decodifica os pixels; a conferência
 * de que algum pixel é de fato transparente é feita no navegador, antes do envio.
 */
export function conferirPng(b: Uint8Array): ConferenciaDoPng {
  if (b.length < 33 || !ASSINATURA_PNG.every((x, i) => b[i] === x) || texto(b, 12) !== 'IHDR') {
    return { ok: false, motivo: 'nao-png' }
  }
  const tipoDeCor = b[25]
  if (tipoDeCor === 4 || tipoDeCor === 6) return { ok: true }
  // tipos sem alfa (0, 2, 3) só têm transparência com um bloco tRNS, que vem antes do IDAT
  let i = 8
  while (i + 8 <= b.length) {
    const tamanho = inteiro(b, i)
    const nome = texto(b, i + 4)
    if (nome === 'tRNS') return { ok: true }
    if (nome === 'IDAT' || nome === 'IEND') break
    i += 12 + tamanho
  }
  return { ok: false, motivo: 'sem-transparencia' }
}
