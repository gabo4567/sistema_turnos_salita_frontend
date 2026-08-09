# Sistema de Turnos - Salita Municipal (Frontend)

Interfaz web para visualizar y buscar los turnos de la salita municipal. Proyecto personal, pensado como frontend del backend [sistema_turnos_salita](https://github.com/gabo4567/sistema_turnos_salita).

## Stack

- React 19 + Vite
- Bootstrap 5
- Oxlint

## Estado actual

Por ahora trabaja con datos de ejemplo (mock) mientras se conecta con la API del backend. Ya tiene la pantalla principal de "Turnos del día" con buscador por nombre de paciente.

## Cómo correrlo

1. Instalar dependencias:
   ```
   npm install
   ```
2. Levantar el servidor de desarrollo:
   ```
   npm run dev
   ```
3. Otros scripts disponibles:
   ```
   npm run build     # build de producción
   npm run preview   # previsualizar el build
   npm run lint      # correr Oxlint
   ```

## Estructura

```
src/
  pages/        # Páginas (TurnosPage)
  components/   # Componentes reutilizables (TurnoCard)
  App.jsx       # Componente raíz
  main.jsx      # Punto de entrada
```
