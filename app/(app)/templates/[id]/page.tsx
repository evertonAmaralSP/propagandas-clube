import { notFound } from 'next/navigation'
import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { templatePorId } from '@/components/templates'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import { carregarFotosELogos } from '../carregar'
import { Editor } from './editor'
import ed from './editor.module.css'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const t = templatePorId((await params).id)
  return { title: t ? `Template ${t.nome}` : 'Template' }
}

/**
 * O editor de um template. `?de=<id>` abre a cópia de uma propaganda salva; `?rascunho=<chave>`
 * abre uma opção do wizard (os valores ficam no sessionStorage do navegador).
 */
export default async function PaginaDoTemplate({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ de?: string; rascunho?: string; modo?: string }>
}) {
  const t = templatePorId((await params).id)
  if (!t) notFound()
  const { de, rascunho, modo } = await searchParams

  const supabase = await clienteDoServidor()
  const copia = de && UUID.test(de)
    ? (await supabase.from('propagandas').select('nome, template, valores').eq('id', de).maybeSingle()).data
    : null
  const origem = copia?.template === t.id ? copia : null
  const doWizard = !origem && rascunho && /^[a-z0-9-]{1,60}$/i.test(rascunho) ? rascunho : null

  const { fotos, logos, erro } = await carregarFotosELogos()

  return (
    <>
      <div className={ed.cabeca}>
        <LinkDeRota href={modo === 'manual' ? '/templates?modo=manual' : '/templates'} className={p.voltar}>
          ← {doWizard ? 'Voltar às opções' : modo === 'manual' ? 'Modelos' : 'Templates'}
        </LinkDeRota>
        <h1 className={p.tituloTela}>{t.nome}</h1>
        <p className={p.ledeTela}>
          {origem
            ? <>Cópia de <strong>{origem.nome}</strong>. Mude o que precisar; a original continua na galeria.</>
            : doWizard
              ? <>Ajuste a opção sorteada; depois baixe, envie no WhatsApp ou salve na galeria.</>
              : <>{t.descricao} Preencha ao lado e veja a arte mudar; depois baixe, envie no WhatsApp ou salve na galeria.</>}
        </p>
      </div>
      {erro
        ? <p className={p.erro} role="alert">Não consegui carregar as fotos e os logos. Recarregue a página.</p>
        : <Editor key={origem ? de : doWizard ?? 'novo'} templateId={t.id} fotos={fotos} logos={logos}
            inicial={origem?.valores} rascunho={doWizard ?? undefined} />}
    </>
  )
}
