/// <reference types="vite/client" />

// Fallback pour react-big-calendar si @types manquants
declare module 'react-big-calendar' {
  export const Calendar: any;
  export const dateFnsLocalizer: any;
  export type View = 'day' | 'week' | 'month' | 'agenda';
}
