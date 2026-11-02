'use client'
import { usePathname } from 'next/navigation'
import { LinkDeRota } from '@/components/rota'
import t from './topo.module.css'

const DESTINOS = [
  { href: '/enviar', rotulo: 'Enviar imagens' },
  { href: '/galeria', rotulo: 'Galeria' },
  { href: '/logo', rotulo: 'Logo do clube' },
  { href: '/templates', rotulo: 'Templates' },
  { href: '/propagandas', rotulo: 'Propagandas' },
]

/** A navegação do topo. No celular ela desce para uma faixa própria, logo abaixo da marca. */
export function Navegacao() {
  const caminho = usePathname()
  return (
    <nav className={t.nav} aria-label="Principal">
      {DESTINOS.map((d) => {
        const atual = caminho === d.href || caminho.startsWith(`${d.href}/`)
        return (
          <LinkDeRota key={d.href} href={d.href} className={`${t.item} ${atual ? t.atual : ''}`} aria-current={atual ? 'page' : undefined}>
            {d.rotulo}
          </LinkDeRota>
        )
      })}
    </nav>
  )
}
