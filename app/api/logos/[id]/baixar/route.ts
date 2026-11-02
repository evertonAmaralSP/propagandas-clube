import { NextResponse } from 'next/server'
import { BALDE_DOS_LOGOS } from '@/lib/logos'
import { clienteDoServidor } from '@/lib/supabase/servidor'

export const runtime = 'nodejs'

// Baixar o PNG original do logo com o nome dado na tela: redireciona para uma URL assinada de 60 s,
// com o cabeçalho de download. O arquivo não passa pela função.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await clienteDoServidor()
  const { data } = await supabase.from('logos').select('caminho, nome').eq('id', id).maybeSingle()
  if (!data) return new NextResponse('Logo não encontrado.', { status: 404 })
  const arquivo = `${data.nome.replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'logo'}.png`
  const { data: assinada, error } = await supabase.storage.from(BALDE_DOS_LOGOS)
    .createSignedUrl(data.caminho, 60, { download: arquivo })
  if (error || !assinada) return new NextResponse('Não consegui preparar o download.', { status: 502 })
  return NextResponse.redirect(assinada.signedUrl)
}
