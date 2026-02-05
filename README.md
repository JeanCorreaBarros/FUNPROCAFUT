## Bivoo — Plataforma de gestión empresarial (Bivoo App)

Bivoo es una plataforma SaaS de gestión empresarial enfocada en ofrecer funcionalidades de facturación, contabilidad, inventarios, agenda, clientes, caja y más, construida con Next.js, React y TypeScript.

### Resumen

- Nombre del proyecto: bivoo-project
- Versión: 0.1.0
- Stack principal: Next.js 14, React 18, TypeScript, TailwindCSS, Radix UI, Redux Toolkit
- Autor (meta): Jean Carlos Correa Barros

## Características principales

- Dashboard y paneles de control
- Módulos: agenda, facturación, contabilidad, inventarios, clientes, caja, pagos, nómina, marketing, soporte móvil, etc.
- Integraciones y utilidades (Vercel Analytics, redux, react-hook-form, zod para validación)
- UI compuesta con componentes reutilizables (shadcn + Radix + lucide)

## Requisitos previos

- Node.js 18+ (recomendado para Next.js 14)
- pnpm (el repo incluye `pnpm-lock.yaml`)
- Git

## Instalación (local)

Ejemplos usando PowerShell (Windows):

```powershell
# instalar dependencias
pnpm install

# modo desarrollo (hot-reload)
pnpm dev

# compilar para producción
pnpm build

# ejecutar servidor en producción
pnpm start

# ejecutar linter
pnpm lint
```

Nota: el proyecto usa `pnpm` por el lockfile incluido. Si prefieres npm o yarn, adapta los comandos apropiadamente.

## Scripts (extraídos de package.json)

- `dev`: next dev
- `build`: next build
- `start`: next start
- `lint`: next lint

Confirma que los scripts en tu `package.json` coinciden con los comandos que documenté.

## Variables de entorno

No se detectaron variables de entorno explícitas en los archivos leídos (`next.config.mjs` no define secretos). Usa un archivo `.env.local` en la raíz para variables privadas. Ejemplos comunes para una app Next.js:

```
# NEXT_PUBLIC_* para variables públicas accesibles en cliente
# EJEMPLO: NEXT_PUBLIC_API_URL=https://api.midominio.com

# Variables privadas (no commit):
# DATABASE_URL=postgres://user:pass@host:port/db
# NEXTAUTH_SECRET=xxxxxxxxxxxx
```

Agrega aquí las variables reales que use tu proyecto o revisa documentación interna/adicional.

## Configuración y convenciones importantes

- El proyecto tiene TypeScript con `strict: true` (ver `tsconfig.json`).
- `next.config.mjs` contiene:
  - `eslint.ignoreDuringBuilds: true` y `typescript.ignoreBuildErrors: true` (Ojo: la compilación puede permitirse pasar aunque haya errores de TS/ESLint).
  - `images.unoptimized: true` (opciones de imágenes no optimizadas).
  - `experimental.turbo: true` (Turbopack experimental activado si aplica).
- El proyecto utiliza `shadcn` (fichero `components.json`) con soporte para Tailwind y alias `@/components`, `@/lib`, `@/hooks`.

## Estructura del proyecto (resumen)

- `app/` - Rutas principales (Next.js App Router). Contiene layout, páginas y módulos por funcionalidad.
- `components/` - Componentes reutilizables, providers, guards y UI.
- `hooks/` - Hooks personalizados (ej. `use-auth.ts`, `use-permissions.ts`).
- `lib/` - Utilidades y store (ej. `store.ts`, `utils.ts`).
- `public/` - Archivos públicos (manifest, imágenes estáticas).
- `styles/` - Estilos globales (`globals.css`).

Ejemplos de carpetas dentro de `app/`: `agenda`, `facturacion`, `contabilidad`, `inventarios`, `login`, `register`, `mobile`, `configuracion`, `reportes`, `nomina`, etc.

## Desarrollo y buenas prácticas

- Mantén `types` y validaciones con `zod` y `react-hook-form` cuando crees formularios.
- Revisa `next.config.mjs` si quieres activar/desactivar verificaciones de TypeScript/ESLint en build.
- Usa los alias (`@/components`, `@/lib`, etc.) para imports coherentes.
- Añade pruebas unitarias/end-to-end si es requerido; actualmente no se detectó un framework de tests en el repo.

## Despliegue

Recomendado: desplegar en Vercel (Next.js integrado). Pasos generales:

1. Subir repo a tu VCS (GitHub/GitLab/Bitbucket).
2. Conectar Vercel y configurar variables de entorno en el dashboard.
3. Configurar build: `pnpm build` y start automático por Vercel.

Comando para probar el build localmente:

```powershell
pnpm build; pnpm start
```

## Observaciones y notas detectadas

- La página raíz (`app/page.tsx`) redirige automáticamente a `/login` en el cliente.
- `app/layout.tsx` define metadata y providers (ReduxProvider, Analytics y HotToaster).
- Se usa `tailwindcss` y `shadcn` para UI; revisa `app/globals.css` para las configuraciones de estilos.

## Contribuir

1. Crea un fork o rama feature en este repositorio.
2. Asegúrate de que tu rama pase linting y builds locales.
3. Abre un pull request con descripción clara del cambio.

Si quieres, puedo añadir plantillas de PR/Issue y reglas de contribución (CODE_OF_CONDUCT, CONTRIBUTING.md) en una tarea siguiente.

## Licencia

No se encontró un archivo `LICENSE` en el repo. Añade una licencia (por ejemplo MIT, Apache 2.0) si deseas establecer permisos de uso.

## Contacto

Autor/Contacto: Jean Carlos Correa Barros (aparece en metadata del layout)

---

