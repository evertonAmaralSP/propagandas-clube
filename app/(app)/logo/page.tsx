import p from '@/app/estilo/portal.module.css'
import { BALDE_DOS_LOGOS, type Logo } from '@/lib/logos'
import { clienteDoServidor } from '@/lib/supabase/servidor'
import { Logos } from './logos'
import l from './logo.module.css'

export const metadata = { title: 'Logo do clube' }
export const dynamic = 'force-dynamic'

/** As URLs assinadas valem 1 hora, como na galeria. */
const VALIDADE_DA_URL = 60 * 60

export default async function PaginaLogo() {
  const supabase = await clienteDoServidor()
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('logos')
    .select('id, usuario_id, caminho, nome, principal, tamanho, largura, altura, criado_em')
    .order('principal', { ascending: false })
    .order('criado_em', { ascending: false })
  if (error) console.error('logo: não leu os logos', error)
  const linhas = data ?? []

  const urls = new Map<string, string>()
  if (linhas.length) {
    const { data: assinadas } = await supabase.storage.from(BALDE_DOS_LOGOS)
      .createSignedUrls(linhas.map((r) => r.caminho), VALIDADE_DA_URL)
    assinadas?.forEach((a) => { if (a.path && a.signedUrl) urls.set(a.path, a.signedUrl) })
  }

  const logos: Logo[] = linhas.map((r) => ({
    id: r.id, nome: r.nome, principal: r.principal, tamanho: r.tamanho, largura: r.largura, altura: r.altura,
    criadoEm: r.criado_em, meu: r.usuario_id === user?.id, url: urls.get(r.caminho) ?? null,
  }))

  return (
    <>
      <div className={l.cabeca}>
        <p className={p.eyebrow}>Identidade</p>
        <h1 className={p.tituloTela}>Logo do clube</h1>
        <p className={p.ledeTela}>
          As versões do logo que os templates vão aplicar sobre as fotos. Envie em PNG com fundo transparente,
          até 5 MB. A versão principal é a que o template usa quando ninguém escolhe outra.
        </p>
      </div>
      {error
        ? <p className={p.erro} role="alert">Não consegui carregar os logos. Recarregue a página.</p>
        : <Logos logos={logos} />}
    </>
  )
}
