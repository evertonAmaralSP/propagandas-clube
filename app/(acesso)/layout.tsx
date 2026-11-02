import p from '@/app/estilo/portal.module.css'
import a from './acesso.module.css'

// Sempre claro, como as telas de acesso do portal.
export default function LayoutAcesso({ children }: { children: React.ReactNode }) {
  return <div data-tema="claro" className={`${p.tokens} ${a.casca}`}>{children}</div>
}
