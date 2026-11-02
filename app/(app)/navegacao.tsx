'use client'
import { usePathname } from 'next/navigation'
import { LinkDeRota } from '@/components/rota'
import t from './topo.module.css'

const DESTINOS = [
  { href: '/enviar', rotulo: 'Enviar imagens' },
  { href: '/galeria', rotulo: 'Galeria' },
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
      {/* passo 2: a galeria de templates, que vai usar estas imagens */}
      <span className={`${t.item} ${t.emBreve}`} aria-disabled="true" title="A galeria de templates vem no próximo passo">
        Templates <span className={t.selo}>em breve</span>
      </span>
    </nav>
  )
}
