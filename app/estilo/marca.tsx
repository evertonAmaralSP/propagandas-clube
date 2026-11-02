import Image from 'next/image'
import p from './portal.module.css'

/** Logo com o nome em duas linhas, quebrado na última palavra (cópia da do portal). */
export function Marca({ tamanho = 56, nome = 'Propagandas Clube' }: { tamanho?: number; nome?: string }) {
  const corte = nome.lastIndexOf(' ')
  const [inicio, fim] = corte === -1 ? [nome, ''] : [nome.slice(0, corte), nome.slice(corte + 1)]
  return (
    <div className={p.marca}>
      <Image src="/img/instrutoresclube.png" alt="" width={tamanho} height={tamanho} style={{ display: 'block', flexShrink: 0 }} />
      <span className={p.marcaTexto}>
        <span className={p.marcaNome}>{inicio}</span>
        {fim ? <span className={p.marcaSub}>{fim}</span> : null}
      </span>
    </div>
  )
}
