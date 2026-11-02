import localFont from 'next/font/local'

// As três famílias do sistema visual do portal. Ficam num módulo só para
// carregar uma vez e valerem em todas as telas que usam `tokens`.
//
// Locais, e não `next/font/google`: o build de produção baixava do Google na
// hora e quebrou duas vezes (23 e 25/09/2026) com `Cannot read properties of
// null (reading '1')` no loader — resposta do Google fora do formato esperado,
// com o mesmo arquivo compilando minutos antes. O site ficava no deploy velho.
const display = localFont({
  src: [
    { path: './arquivos-de-fonte/zilla-slab-400.woff2', weight: '400', style: 'normal' },
    { path: './arquivos-de-fonte/zilla-slab-500.woff2', weight: '500', style: 'normal' },
    { path: './arquivos-de-fonte/zilla-slab-600.woff2', weight: '600', style: 'normal' },
    { path: './arquivos-de-fonte/zilla-slab-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--dbv-display',
  display: 'swap',
})
// O Google serve o Plex Sans como fonte variável: um arquivo para todos os pesos.
const corpo = localFont({
  src: './arquivos-de-fonte/ibm-plex-sans.woff2',
  weight: '400 700',
  variable: '--dbv-corpo',
  display: 'swap',
})
const mono = localFont({
  src: [
    { path: './arquivos-de-fonte/ibm-plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './arquivos-de-fonte/ibm-plex-mono-500.woff2', weight: '500', style: 'normal' },
    { path: './arquivos-de-fonte/ibm-plex-mono-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--dbv-mono',
  display: 'swap',
})

export const classeFontes = `${display.variable} ${corpo.variable} ${mono.variable}`
