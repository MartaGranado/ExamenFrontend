import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',  // Asegúrate de permitir cualquier ruta en ese dominio
      },
    ], // Agrega el dominio de Cloudinary aquí
  },
};

export default nextConfig;
