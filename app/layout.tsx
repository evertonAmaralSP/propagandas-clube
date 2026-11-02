import type { Metadata } from 'next'
import { classeFontes } from '@/app/estilo/fontes'
import { BarraDeRota, ProvedorDeRota } from '@/components/rota'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Propagandas Clube', template: '%s — Propagandas Clube' },
  description: 'Banco de imagens e templates para as propagandas do clube.',
  // MVP fechado: nada daqui deve aparecer em busca.
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={classeFontes}>
        <ProvedorDeRota>
          <BarraDeRota />
          {children}
        </ProvedorDeRota>
      </body>
    </html>
  )
}
