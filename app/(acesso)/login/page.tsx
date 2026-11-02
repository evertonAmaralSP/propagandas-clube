import p from '@/app/estilo/portal.module.css'
import { MolduraAcesso } from '../moldura'
import { FormularioLogin } from './formulario'

export const metadata = { title: 'Entrar' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams
  // a action confere de novo se o destino é interno; aqui só se descarta o que nem é texto
  const destino = typeof next === 'string' ? next : null

  return (
    <MolduraAcesso
      titulo={<>As fotos do clube, <span className={p.painelDestaque}>prontas para a próxima propaganda</span>.</>}
      sub="Envie as imagens uma vez e use em todos os templates de divulgação do clube."
      rodape="Versão de teste, aberta só para os líderes convidados."
    >
      <h1 className={p.tituloTela}>Entrar</h1>
      <p className={p.ledeTela}>Use o e-mail e a senha que você recebeu.</p>
      <FormularioLogin destino={destino} />
    </MolduraAcesso>
  )
}
