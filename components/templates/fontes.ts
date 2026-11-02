import localFont from 'next/font/local'

// As fontes das artes (as do canvas "Chamadas do Clube"). Locais pelo mesmo motivo das do portal
// (app/estilo/fontes.ts): o build não depende do Google. As variáveis cobrem a faixa de pesos indicada.

const anton = localFont({ src: '../../app/estilo/arquivos-de-fonte/anton-400.woff2', weight: '400', variable: '--tpl-anton', display: 'block' })
const montserrat = localFont({
  src: [
    { path: '../../app/estilo/arquivos-de-fonte/montserrat.woff2', weight: '500 800', style: 'normal' },
    { path: '../../app/estilo/arquivos-de-fonte/montserrat-italico.woff2', weight: '600 700', style: 'italic' },
  ],
  variable: '--tpl-montserrat',
  display: 'block',
})
const raleway = localFont({ src: '../../app/estilo/arquivos-de-fonte/raleway.woff2', weight: '500 700', variable: '--tpl-raleway', display: 'block' })
const gochi = localFont({ src: '../../app/estilo/arquivos-de-fonte/gochi-hand-400.woff2', weight: '400', variable: '--tpl-gochi', display: 'block' })
const playfair = localFont({
  src: [
    { path: '../../app/estilo/arquivos-de-fonte/playfair-display.woff2', weight: '600 700', style: 'normal' },
    { path: '../../app/estilo/arquivos-de-fonte/playfair-display-italico.woff2', weight: '500 600', style: 'italic' },
  ],
  variable: '--tpl-playfair',
  display: 'block',
})
const archivo = localFont({ src: '../../app/estilo/arquivos-de-fonte/archivo.woff2', weight: '500 700', variable: '--tpl-archivo', display: 'block' })
const archivoBlack = localFont({ src: '../../app/estilo/arquivos-de-fonte/archivo-black-400.woff2', weight: '400', variable: '--tpl-archivo-black', display: 'block' })
const bebas = localFont({ src: '../../app/estilo/arquivos-de-fonte/bebas-neue-400.woff2', weight: '400', variable: '--tpl-bebas', display: 'block' })
const poppins = localFont({
  src: [
    { path: '../../app/estilo/arquivos-de-fonte/poppins-500.woff2', weight: '500', style: 'normal' },
    { path: '../../app/estilo/arquivos-de-fonte/poppins-600.woff2', weight: '600', style: 'normal' },
    { path: '../../app/estilo/arquivos-de-fonte/poppins-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--tpl-poppins',
  display: 'block',
})
const oswald = localFont({ src: '../../app/estilo/arquivos-de-fonte/oswald.woff2', weight: '500 700', variable: '--tpl-oswald', display: 'block' })
const inter = localFont({ src: '../../app/estilo/arquivos-de-fonte/inter.woff2', weight: '500 700', variable: '--tpl-inter', display: 'block' })
const dmSerif = localFont({ src: '../../app/estilo/arquivos-de-fonte/dm-serif-display-400.woff2', weight: '400', variable: '--tpl-dm-serif', display: 'block' })
const outfit = localFont({ src: '../../app/estilo/arquivos-de-fonte/outfit.woff2', weight: '400 700', variable: '--tpl-outfit', display: 'block' })
const caveat = localFont({ src: '../../app/estilo/arquivos-de-fonte/caveat.woff2', weight: '600 700', variable: '--tpl-caveat', display: 'block' })
const fraunces = localFont({ src: '../../app/estilo/arquivos-de-fonte/fraunces.woff2', weight: '600 700', variable: '--tpl-fraunces', display: 'block' })

export const classeFontesDasArtes = [
  anton, montserrat, raleway, gochi, playfair, archivo, archivoBlack, bebas, poppins, oswald, inter, dmSerif, outfit, caveat, fraunces,
].map((f) => f.variable).join(' ')

export const ANTON = 'var(--tpl-anton), Impact, sans-serif'
export const MONTSERRAT = 'var(--tpl-montserrat), sans-serif'
export const RALEWAY = 'var(--tpl-raleway), sans-serif'
export const GOCHI = 'var(--tpl-gochi), cursive'
export const PLAYFAIR = 'var(--tpl-playfair), Georgia, serif'
export const ARCHIVO = 'var(--tpl-archivo), sans-serif'
export const ARCHIVO_BLACK = 'var(--tpl-archivo-black), sans-serif'
export const BEBAS = 'var(--tpl-bebas), Impact, sans-serif'
export const POPPINS = 'var(--tpl-poppins), sans-serif'
export const OSWALD = 'var(--tpl-oswald), sans-serif'
export const INTER = 'var(--tpl-inter), sans-serif'
export const DM_SERIF = 'var(--tpl-dm-serif), Georgia, serif'
export const OUTFIT = 'var(--tpl-outfit), sans-serif'
export const CAVEAT = 'var(--tpl-caveat), cursive'
export const FRAUNCES = 'var(--tpl-fraunces), Georgia, serif'
