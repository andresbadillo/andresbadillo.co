# andres_badillo

Portfolio SPA minimalista (demo) construido con Vite + React + TypeScript.

## Referencia de creación inicial (no ejecutar aquí)

```bash
npm create vite@latest miromannino-clone -- --template react-ts
cd miromannino-clone
npm install
npm run dev
```

## Comandos

```bash
npm i
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run typecheck
```

## Deploy

- `npm run build` genera la carpeta `dist`.
- Sube `dist` a tu proveedor de hosting estático.
- Configura fallback SPA para redirigir rutas a `index.html`.
- En Vercel, basta con detectar Vite y desplegar; verifica que rutas internas usen fallback.
- Configura dominio con `CNAME` o `A` según tu proveedor DNS.
