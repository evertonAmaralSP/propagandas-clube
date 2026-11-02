'use client'
import { useActionState, useState } from 'react'
import p from '@/app/estilo/portal.module.css'
import { entrar } from './actions'

// O destino chega pronto da página (servidor). Ler a URL aqui, com useSearchParams num
// Suspense dentro do <form>, fazia o servidor e o navegador montarem o formulário em
// ordem diferente dos campos ocultos da Server Action: era o erro #418 de hidratação.
export function FormularioLogin({ destino }: { destino: string | null }) {
  const [estado, enviar, enviando] = useActionState(entrar, null)
  // Controlado: no React 19 o formulário se limpa quando a action retorna, e
  // quem errou a senha teria de digitar o e-mail de novo.
  const [email, setEmail] = useState('')

  return (
    <form action={enviar} className={p.campos}>
      {destino && <input type="hidden" name="next" value={destino} />}
      <div>
        <label className={p.rotulo} htmlFor="email">E-mail</label>
        <input className={p.campo} id="email" name="email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className={p.rotulo} htmlFor="senha">Senha</label>
        <input className={p.campo} id="senha" name="senha" type="password" autoComplete="current-password" required />
      </div>
      {estado?.erro && <p className={p.erro} role="alert">{estado.erro}</p>}
      <button className={`${p.btnGold} ${p.btnLargo}`} type="submit" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
