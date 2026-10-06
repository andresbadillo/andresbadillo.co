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
npm ci
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run test:run
npm run check:generated
npm run security:audit
npm run verify
```

## Formulario de contacto

Los formularios de la home y de `/contact` envían a `api/contact.ts`, una función de Vercel que valida el mensaje (`src/lib/contactMessage.ts`, las mismas reglas que en el navegador) y lo manda por correo con [Resend](https://resend.com). La respuesta llega con «Responder a» = email del visitante.

1. Crea una cuenta en Resend con el correo que recibirá los mensajes y genera una API key con permiso de envío.
2. En Vercel → Project → Settings → Environment Variables (Production y Preview):
   - `RESEND_API_KEY`: la clave de Resend.
   - `CONTACT_TO_EMAIL`: el buzón que recibe los mensajes.
   - `CONTACT_FROM_EMAIL` (opcional): remitente con dominio verificado en Resend. Sin dominio verificado, se usa `onboarding@resend.dev`, que solo puede enviar al correo de tu propia cuenta de Resend.
3. Estas variables no llevan prefijo `VITE_`: solo existen en el servidor.

`npm run dev` no ejecuta las funciones de `api/`. Para probar el envío en local usa `npx vercel dev` (con las variables en `.env.local`) o un deploy de preview. Antispam: campo trampa oculto y tiempo mínimo de 3 s entre mostrar y enviar el formulario; a los bots se les responde 200 sin enviar nada.

## Seguridad, Supabase y panel administrativo

- El blog mantiene lectura pública mediante RLS.
- Las escrituras requieren un JWT con `app_metadata.role = "admin"`.
- No existe registro público. Las cuentas administrativas se crean manualmente.
- El panel está en `/admin/login`; no aparece en la navegación pública.
- Todos los posts guardados son públicos y la eliminación es definitiva, con confirmación.
- Nunca uses una clave `sb_secret_` o `service_role` en variables `VITE_*`.

### Preparación remota de Supabase

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push --dry-run
npx supabase db push
npx supabase db advisors --linked --type security --level warn
```

La migración base `supabase/migrations/20260827202146_remote_schema_baseline.sql` reproduce el esquema remoto enlazado. A continuación, `supabase/migrations/20260827202233_harden_posts_rls_remote.sql` valida los datos existentes y aplica constraints, privilegios y políticas. Si algún embed heredado no cumple la allowlist de LinkedIn, el despliegue se detiene antes de cambiar el acceso.

En Authentication del Dashboard:

1. Deshabilita **Allow new users to sign up**.
2. Crea el usuario administrador manualmente.
3. Asigna `{"role":"admin"}` a `app_metadata` mediante Dashboard o Admin API fuera del frontend.
4. Cierra las sesiones existentes y vuelve a iniciar sesión para refrescar el JWT.

Para validar RLS en el stack local:

```bash
npx supabase start
npx supabase db reset --local
npx supabase test db --local supabase/tests/posts_rls.sql
npx supabase db advisors --local --type security --level warn --fail-on error
```

### Variables de entorno

- Archivo base: `.env.example`.
- Variables requeridas:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Importante: en frontend solo usar clave publicable, nunca `service_role`.

### Despliegue en Vercel

`vercel.ts` configura Vite, CSP y las cabeceras defensivas. Tras aplicar RLS y crear el administrador:

```bash
vercel pull --yes --environment=preview
vercel deploy
```

Comprueba en el preview el fallback SPA, `/admin/login`, el CRUD completo y las cabeceras antes de promoverlo a producción. Si el panel falla, revierte únicamente el despliegue web; no relajes RLS.

### Dónde se conecta Supabase

- Cliente: `src/lib/supabaseClient.ts`
  - Crea un cliente singleton tipado con `createClient(url, key)`.
  - Rechaza variables ausentes, URLs inseguras y claves secretas.

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

### Diagrama rápido de arquitectura (onboarding)

```mermaid
flowchart LR
  A[(Supabase DB\nTabla: posts)]
  B[src/lib/supabaseClient.ts\ncreateClient(url, key)]
  C[src/context/PostsContext.tsx\nload() + from('posts').select(...)]
  D[src/data/postMapper.ts\nPostRow -> rowToPost() -> Post]
  E[UI React\nPages + Components con usePosts()]

  A --> C
  B --> C
  C --> D
  D --> E
```
