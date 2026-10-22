# sistema_turnos_salita_frontend

SPA de la Salita Municipal (bootcamp). React 19 + Vite + TypeScript + React Router + React Hook Form + Zod + Bootstrap 5.

## Reglas del proyecto (seguir siempre, sin excepción)

- **Toda llamada a la API pasa por `src/api/*.ts`**, que a su vez usa `apiFetch` de `src/api/httpClient.ts`. Nunca hacer `fetch()` directo desde una página o componente (la única excepción histórica es `authApi.ts`, porque el login usa una URL base distinta).
- **Todo formulario usa `react-hook-form` + `zodResolver`**, nunca `useState` + `onChange` manual por campo. El schema de Zod vive en `src/schemas/` y espeja (a mano, no es un monorepo) el schema equivalente del backend — si una regla de validación cambia en el backend, hay que replicarla acá.
- **`src/types/` es solo para lo que devuelve la API** (modelos de lectura). Los tipos de formulario son los que infiere Zod (`z.infer<typeof Schema>`) desde `src/schemas/` — no duplicar un tipo de formulario a mano si ya existe el schema.
- **Páginas de listado usan el hook `useFetch<T>`** (`src/hooks/useFetch.ts`) en vez de reimplementar `useEffect` + `useState` de carga/error a mano.
- **Props de componentes tipadas como interface/type explícito**, nunca `React.FC`. Funciones que vienen por props (`onLlamar`, `onDarDeBaja`, etc.) tipadas con su firma completa, ej. `(id: string) => void`.
- **Rutas protegidas van dentro de `<RutaProtegida />`** en `App.tsx`; nada de chequear el token a mano en cada página.
- **Antes de dar algo por terminado**: correr `npx tsc -b` (o `npm run build`) y, si se puede, probar la pantalla real en el navegador con el backend corriendo — no alcanza con que "compile".

## Stack

React 19, Vite, TypeScript, React Router DOM 7, React Hook Form, Zod, Bootstrap 5, oxlint.

## Cómo correr

```
npm install
npm run dev     # http://localhost:5173
npm run build   # tsc -b && vite build
```

## Proyecto hermano

El backend vive en un repo aparte: `sistema_turnos_salita`, corriendo en `http://localhost:3000`. No tocar ese código desde acá.
