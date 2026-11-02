'use client'
import { useState } from 'react'
import p from '@/app/estilo/portal.module.css'
import { compartilharArquivo, enviarPeloWhatsapp, type ResultadoDoCompartilhar } from './exportar'

// O envio para o WhatsApp e os avisos que ele pode precisar, iguais no editor e na galeria.

type Estado =
  | { tipo: 'parado' }
  | { tipo: 'precisa-toque'; arquivo: File }
  | { tipo: 'baixado'; nome: string }
  | { tipo: 'erro' }

export function useEnvioWhatsapp() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'parado' })

  const aplicar = (resultado: ResultadoDoCompartilhar | 'baixado', arquivo: File) => {
    if (resultado === 'precisa-toque') setEstado({ tipo: 'precisa-toque', arquivo })
    else if (resultado === 'baixado') setEstado({ tipo: 'baixado', nome: arquivo.name })
    else if (resultado === 'erro') setEstado({ tipo: 'erro' })
    else setEstado({ tipo: 'parado' })
  }

  return {
    estado,
    limpar: () => setEstado({ tipo: 'parado' }),
    enviar: async (blob: Blob, nome: string) => {
      const { resultado, arquivo } = await enviarPeloWhatsapp(blob, nome)
      aplicar(resultado, arquivo)
    },
    tocar: async (arquivo: File) => aplicar(await compartilharArquivo(arquivo), arquivo),
  }
}

export function AvisoDoEnvio({ envio, classe }: { envio: ReturnType<typeof useEnvioWhatsapp>; classe: string }) {
  const { estado } = envio
  if (estado.tipo === 'precisa-toque') {
    return (
      <div className={classe} role="status">
        <p>A imagem está pronta.</p>
        <button type="button" className={p.btnPine} onClick={() => envio.tocar(estado.arquivo)}>Toque para enviar</button>
      </div>
    )
  }
  if (estado.tipo === 'baixado') {
    return (
      <p className={classe} role="status">
        Baixei <strong>{estado.nome}</strong> e abri o WhatsApp Web numa aba nova. Lá, escolha a conversa e anexe a imagem.
      </p>
    )
  }
  if (estado.tipo === 'erro') {
    return <p className={p.erro} role="alert">Não consegui abrir o compartilhamento. Baixe a imagem e envie pelo WhatsApp.</p>
  }
  return null
}
