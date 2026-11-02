import { NextResponse } from 'next/server'
import { BALDE_DAS_PROPAGANDAS, extensaoDaPropaganda } from '@/lib/propagandas'
import { clienteDoServidor } from '@/lib/supabase/servidor'

export const runtime = 'nodejs'

// Baixar a arte salva com o nome da galeria: redireciona para uma URL assinada de 60 s, com o
// cabeçalho de download. O arquivo não passa pela função.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await clienteDoServidor()
  const { data } = await supabase.from('propagandas').select('caminho, nome, tipo').eq('id', id).maybeSingle()
  if (!data) return new NextResponse('Propaganda não encontrada.', { status: 404 })
  const arquivo = `${data.nome.replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'propaganda'}.${extensaoDaPropaganda(data.tipo)}`
  const { data: assinada, error } = await supabase.storage.from(BALDE_DAS_PROPAGANDAS)
    .createSignedUrl(data.caminho, 60, { download: arquivo })
  if (error || !assinada) return new NextResponse('Não consegui preparar o download.', { status: 502 })
  return NextResponse.redirect(assinada.signedUrl)
}
