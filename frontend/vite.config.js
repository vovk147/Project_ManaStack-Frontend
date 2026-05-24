import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Включаем принудительный опрос файлов (polling)
      // Это заставит Vite внутри Docker стабильно видеть изменения из Windows
      usePolling: true,
    },
    // Жестко фиксируем порт и хост для контейнера
    host: true,
    port: 5173,
  }
})