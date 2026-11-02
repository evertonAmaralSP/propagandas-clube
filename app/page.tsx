import { redirect } from 'next/navigation'

// A raiz não tem conteúdo próprio: o middleware leva quem não entrou ao login.
export default function Inicio() {
  redirect('/galeria')
}
