import { domToBlob } from 'modern-screenshot'

// Gera o PNG a partir da própria prévia (o nó da arte, sem a escala da tela), em 2× = 1080×1920
// para os templates de 540×960, o tamanho do status do WhatsApp e dos stories.

export const ESCALA_DO_PNG = 2

export async function gerarPng(no: HTMLElement, largura: number, altura: number): Promise<Blob> {
  await document.fonts.ready
  // espera as fotos terminarem de carregar: uma imagem pela metade sairia em branco no PNG
  await Promise.all([...no.querySelectorAll('img')].map((img) =>
    img.complete ? img.decode().catch(() => undefined) : new Promise((ok) => { img.onload = img.onerror = ok })))
  return domToBlob(no, { width: largura, height: altura, scale: ESCALA_DO_PNG, type: 'image/png' })
}

export function nomeDoPng(template: string, titulo: string) {
  const base = `${template} ${titulo}`.replace(/\s+/g, ' ').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 80)
  return `${base || 'propaganda'}.png`
}

export function baixar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** Para salvar na galeria: o PNG, ou um JPG quando o PNG passa do limite do envio. */
export async function arquivoParaSalvar(no: HTMLElement, largura: number, altura: number, png: Blob, limite: number): Promise<Blob> {
  if (png.size <= limite) return png
  for (const qualidade of [0.9, 0.8, 0.7]) {
    const jpg = await domToBlob(no, { width: largura, height: altura, scale: ESCALA_DO_PNG, type: 'image/jpeg', quality: qualidade })
    if (jpg.size <= limite) return jpg
  }
  throw new Error('a arte não coube no limite nem em JPG')
}

/** Celular (e alguns navegadores de computador): abre o menu de compartilhar com a imagem anexada. */
export const podeCompartilharArquivo = (arquivo: File) =>
  typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [arquivo] })

export type ResultadoDoCompartilhar = 'enviado' | 'cancelado' | 'precisa-toque' | 'erro'

export async function compartilharArquivo(arquivo: File): Promise<ResultadoDoCompartilhar> {
  try {
    await navigator.share({ files: [arquivo] })
    return 'enviado'
  } catch (e) {
    const nome = (e as DOMException).name
    if (nome === 'AbortError') return 'cancelado' // a pessoa fechou o menu
    // o navegador perdeu o "toque" enquanto a imagem era preparada: um segundo toque resolve
    if (nome === 'NotAllowedError') return 'precisa-toque'
    return 'erro'
  }
}

/**
 * Celular: menu de compartilhar com a imagem (a pessoa escolhe o WhatsApp). Computador sem
 * compartilhamento de arquivo: baixa a imagem e abre o WhatsApp Web para anexar.
 */
export async function enviarPeloWhatsapp(blob: Blob, nome: string): Promise<{ resultado: ResultadoDoCompartilhar | 'baixado'; arquivo: File }> {
  const arquivo = new File([blob], nome, { type: blob.type || 'image/png' })
  if (podeCompartilharArquivo(arquivo)) return { resultado: await compartilharArquivo(arquivo), arquivo }
  baixar(blob, nome)
  window.open('https://web.whatsapp.com/', '_blank', 'noopener')
  return { resultado: 'baixado', arquivo }
}
