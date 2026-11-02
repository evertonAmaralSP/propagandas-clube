import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente do Supabase com a sessão de quem pediu. Só no servidor: o navegador
 * não fala com o banco neste app, então a chave publicável nem precisa ir para
 * o bundle do cliente.
 */
export async function clienteDoServidor() {
  const loja = await cookies()
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => loja.getAll(),
      setAll(todos) {
        // Em Server Component o Next proíbe gravar cookie; quem renova a sessão
        // nesses casos é o middleware, que roda antes.
        try {
          todos.forEach(({ name, value, options }) => loja.set(name, value, options))
        } catch {}
      },
    },
  })
}
