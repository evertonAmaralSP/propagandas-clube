import { NextResponse } from 'next/server'
import { BALDE_DAS_IMAGENS, extensaoDoTipo, type TipoDaImagem } from '@/lib/imagens'
import { clienteDoServidor } from '@/lib/supabase/servidor'

export const runtime = 'nodejs'

// Baixar a imagem original com o nome dado na galeria: redireciona para uma URL assinada de 60 s,
// com o cabeçalho de download. O arquivo não passa pela função.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await clienteDoServidor()
  const { data } = await supabase.from('imagens').select('caminho, nome, tipo').eq('id', id).maybeSingle()
  if (!data) return new NextResponse('Imagem não encontrada.', { status: 404 })
  const arquivo = `${data.nome.replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'imagem'}.${extensaoDoTipo(data.tipo as TipoDaImagem)}`
  const { data: assinada, error } = await supabase.storage.from(BALDE_DAS_IMAGENS)
    .createSignedUrl(data.caminho, 60, { download: arquivo })
  if (error || !assinada) return new NextResponse('Não consegui preparar o download.', { status: 502 })
  return NextResponse.redirect(assinada.signedUrl)
}
