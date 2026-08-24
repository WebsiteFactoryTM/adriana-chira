import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    // AVIF primul: ~30% mai mic decât WebP pe portrete.
    formats: ['image/avif', 'image/webp'],
    // Vercel Blob — activ când BLOB_READ_WRITE_TOKEN există (vezi payload.config.ts).
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },

  // Anteturi de securitate. `Permissions-Policy` taie API-uri pe care nu le folosim.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
    // Notă: nu suprascriem Cache-Control pe /_next/static — Next livrează deja
    // `immutable` pe assets cu hash, iar un override rupe comportamentul de dev.
  },
}

/**
 * `withPayload` montează rutele din grupul `(payload)` și ține pachetele
 * native ale Payload în afara bundle-ului de server.
 */
export default withPayload(nextConfig, { devBundleServerPackages: false })
