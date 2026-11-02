import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Renova a sessão do Supabase a cada pedido e decide quem passa: tudo, menos o
 * login, é só para quem entrou; quem já entrou não precisa ver o login de novo.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(todos) {
        todos.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        todos.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  const caminho = request.nextUrl.pathname

  if (!user && caminho !== '/login') {
    if (caminho.startsWith('/api/')) {
      return NextResponse.json({ erro: 'Sessão expirada. Entre de novo.' }, { status: 401 })
    }
    const destino = new URL('/login', request.url)
    if (caminho !== '/') destino.searchParams.set('next', caminho)
    return NextResponse.redirect(destino)
  }
  if (user && caminho === '/login') {
    return NextResponse.redirect(new URL('/galeria', request.url))
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|img/).*)'],
}
