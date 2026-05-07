🎬 ShortsGen Pro - Generador de YouTube Shorts
Aplicación web progresiva (PWA) para crear videos tipo YouTube Shorts con voz en español, subtítulos animados y diseños en tendencia.
✨ Características
Formato vertical 9:16 optimizado para YouTube Shorts (720x1280)
Texto a voz con voces masculinas y femeninas en español
Subtítulos animados con 6 estilos en tendencia (TikTok Bold, Neon, Retro, etc.)
Fondos dinámicos con gradientes animados y partículas
Filtros de video (Vintage, Cinematic, Neon Glow, Dramatic, etc.)
6 animaciones de subtítulos (Typewriter, Bounce, Fade, Slide, Zoom, Glitch)
Plantillas predefinidas para comenzar rápido
Galería local para guardar y gestionar tus Shorts
Exportación en formato MP4/WebM con botón de descarga directa
Funciona offline como PWA instalable
🚀 Cómo usar
En Windows (Navegador)
Abre index.html en Chrome, Edge o Firefox
Usa el botón "Instalar" para agregarlo como app de escritorio
Crea, personaliza y descarga tus Shorts
En Móvil (Android/iOS)
Abre la URL en Chrome/Safari
Ve a "Agregar a pantalla de inicio"
La app funciona como una app nativa
Para convertir a APK (Android)
Usa Trusted Web Activity (TWA) con Bubblewrap:
bash
Copy
npx @bubblewrap/cli init --manifest=https://tudominio.com/manifest.json
npx @bubblewrap/cli build
O usa Capacitor:
bash
Copy
npm install @capacitor/core @capacitor/cli
npx cap init ShortsGenPro com.tudominio.shortsgen
npx cap add android
npx cap open android
📁 Estructura del proyecto
plain
Copy
shorts-generator/
├── index.html          # Interfaz principal
├── styles.css          # Estilos responsive y tema oscuro
├── app.js              # Lógica completa de la app
├── manifest.json       # Configuración PWA
├── sw.js               # Service Worker para offline
├── icons/              # Iconos de la app
└── screenshots/        # Capturas para stores
🛠️ Tecnologías
HTML5 Canvas - Renderizado de video frame por frame
Web Speech API - Síntesis de voz en español
MediaRecorder API - Codificación de video MP4/WebM
Service Workers - Funcionamiento offline
LocalStorage - Persistencia de galería y configuración
📝 Notas importantes
Voz: Usa Web Speech API (gratuito, funciona en navegador). Para producción, conecta con ElevenLabs API para voces más naturales.
Video: Genera video canvas + audio localmente. No requiere servidor.
Límites: La duración máxima es 60 segundos (límite de YouTube Shorts).
Calidad: 720p por defecto. Se puede cambiar a 1080p en configuración.
🎨 Personalización
Puedes modificar:
GRADIENTS en app.js para nuevos fondos
SUBTITLE_STYLES para nuevos estilos de texto
TEMPLATES para nuevas plantillas predefinidas
FILTERS para nuevos efectos de video
📄 Licencia
MIT License - Libre para uso personal y comercial.