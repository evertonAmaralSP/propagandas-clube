// O que o servidor entrega ao editor: as fotos da galeria e as versões do logo, já com URL assinada.

export type FotoDaGaleria = { id: string; nome: string; etiquetas: string[]; url: string }
export type LogoDoClube = { id: string; nome: string; principal: boolean; url: string }
