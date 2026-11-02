import { redirect } from 'next/navigation'
import p from '@/app/estilo/portal.module.css'
import { Marca } from '@/app/estilo/marca'
import { sair } from '@/app/(acesso)/login/actions'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import { Navegacao } from './navegacao'
import t from './topo.module.css'

// Sempre claro por enquanto, como as telas de acesso. O middleware já barra quem não entrou;
// a conferência aqui é a rede de segurança.
export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const supabase = await clienteDoServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const nome = (user.user_metadata?.nome as string | undefined) ?? user.email ?? ''

  return (
    <div data-tema="claro" className={p.tokens}>
      <a href="#conteudo" className={p.pular}>Pular para o conteúdo</a>
      <header className={p.appTopo}>
        <div className={`${p.appTopoInterno} ${t.interno}`}>
          <Marca tamanho={40} />
          <Navegacao />
          <div className={t.conta}>
            <span className={p.appNome} title={user.email ?? undefined}>{nome}</span>
            <form action={sair}>
              <button className={p.appSair} type="submit">Sair</button>
            </form>
          </div>
        </div>
      </header>
      <div className={p.appCorpo}>
        <main id="conteudo" className={p.wrap}>{children}</main>
      </div>
    </div>
  )
}
