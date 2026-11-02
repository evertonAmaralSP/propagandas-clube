import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // As fotos sobem por Server Action (até 5 MB cada, veja lib/imagens.ts). O padrão do Next é 1 MB,
  // e a função do Netlify aceita até 6 MB por pedido: o limite fica logo abaixo disso.
  experimental: { serverActions: { bodySizeLimit: '6mb' } },
}

export default nextConfig
