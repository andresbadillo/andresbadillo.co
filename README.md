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

## Supabase y consumo de DB

### Variables de entorno

- Archivo base: `.env.example`.
- Variables requeridas:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Importante: en frontend solo usar clave publicable, nunca `service_role`.

### Dónde se conecta Supabase

- Cliente: `src/lib/supabaseClient.ts`
  - Crea un cliente singleton con `createClient(url, key)`.
  - Valida que existan variables de entorno antes de iniciar.

### Dónde se consulta la base de datos

- Contexto: `src/context/PostsContext.tsx`
  - Consulta principal: `supabase.from("posts").select(...).order("display_order", { ascending: true })`.
  - Maneja estado de `loading`, `error`, `refetch`.
  - Expone los datos a toda la app mediante `PostsProvider` y `usePosts()`.

### Dónde se transforma la data de DB

- Mapper: `src/data/postMapper.ts`
  - `PostRow` define la forma esperada de la fila que llega desde Supabase.
  - `rowToPost()` convierte la fila SQL al modelo `Post` usado por UI.
  - Incluye normalización de fecha, tags y validación de `linkedin_embed`.

### Flujo completo de datos

1. `main.tsx` monta `PostsProvider`.
2. `PostsProvider` ejecuta `load()` al iniciar.
3. `load()` consulta la tabla `posts` en Supabase.
4. Las filas se adaptan con `rowToPost()`.
5. Las páginas consumen datos con `usePosts()`.
