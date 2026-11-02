import p from '@/app/estilo/portal.module.css'
import { Envio } from './envio'
import e from './envio.module.css'

export const metadata = { title: 'Enviar imagens' }

export default function PaginaEnviar() {
  return (
    <>
      <div className={e.cabeca}>
        <p className={p.eyebrow}>Banco de imagens</p>
        <h1 className={p.tituloTela}>Enviar imagens</h1>
        <p className={p.ledeTela}>
          As fotos enviadas aqui vão para a galeria e alimentam os templates das propagandas do clube.
          PNG, JPG ou WebP, até 5 MB cada.
        </p>
      </div>
      <Envio />
    </>
  )
}
