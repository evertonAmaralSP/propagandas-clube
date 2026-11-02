'use server'
import { redirect } from 'next/navigation'
import { clienteDoServidor } from '@/lib/supabase/servidor'

type Estado = { erro: string } | null

// Só caminho interno: `//outro.site` e `https://…` levariam a pessoa para fora
// logo depois de digitar a senha.
function destinoSeguro(valor: FormDataEntryValue | null) {
  const s = typeof valor === 'string' ? valor : ''
  return s.startsWith('/') && !s.startsWith('//') ? s : '/galeria'
}

export async function entrar(_anterior: Estado, dados: FormData): Promise<Estado> {
  const email = String(dados.get('email') ?? '').trim()
  const senha = String(dados.get('senha') ?? '')
  if (!email || !senha) return { erro: 'Preencha o e-mail e a senha.' }

  const supabase = await clienteDoServidor()
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  // Mensagem única para e-mail inexistente e senha errada: dizer qual dos dois
  // falhou contaria a quem tenta quais e-mails têm conta.
  if (error) return { erro: 'E-mail ou senha incorretos.' }

  redirect(destinoSeguro(dados.get('next')))
}

export async function sair() {
  const supabase = await clienteDoServidor()
  await supabase.auth.signOut()
  redirect('/login')
}
