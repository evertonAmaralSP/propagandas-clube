import p from '@/app/estilo/portal.module.css'
import a from './acesso.module.css'
import { Marca } from '@/app/estilo/marca'

/**
 * Moldura das telas de acesso, a mesma do portal: painel escuro com a marca à
 * esquerda e o formulário no papel à direita.
 */
export function MolduraAcesso({ titulo, sub, rodape, children }: {
  titulo: React.ReactNode
  sub: string
  rodape?: string
  children: React.ReactNode
}) {
  return (
    <div className={p.acesso}>
      <aside className={p.painel} aria-label="Sobre o Propagandas Clube">
        <svg viewBox="0 0 700 300" preserveAspectRatio="none" className={p.painelMontanhas} aria-hidden="true">
          <path d="M0 300 L96 168 L180 220 L288 104 L392 198 L488 136 L588 214 L700 128 L700 300 Z" style={{ fill: 'var(--montanha-frente)' }} />
          <path d="M0 300 L128 214 L242 250 L356 196 L472 244 L594 200 L700 236 L700 300 Z" style={{ fill: 'var(--montanha-fundo)' }} />
        </svg>
        <div className={p.painelBrilho} />
        <Marca />
        <div className={p.painelTitulo}>
          <div className={a.painelFrase}>{titulo}</div>
          <p>{sub}</p>
        </div>
        {rodape ? <div className={p.painelRodape}>{rodape}</div> : <span />}
      </aside>
      <main className={`${p.conteudo} ${a.conteudoEstreito}`}>
        <div className={p.coluna}>
          {children}
          {/* `style`: o `.tokens p { margin: 0 }` vence a margem de `.rodapeLegal`. */}
          <p className={p.rodapeLegal} style={{ marginTop: '30px' }}>
            Ferramenta independente, sem vínculo com a Igreja Adventista do Sétimo Dia ou o Ministério dos
            Desbravadores. Use só imagens que o clube tem direito de publicar.
          </p>
        </div>
      </main>
    </div>
  )
}
