/* ============================================
   SHORTSGEN PRO - YouTube Shorts Generator v2.0
   Correcciones: ElevenLabs, Video sync, Opera/Móvil
   ============================================ */

// ==========================================
// CONFIGURACIÓN ELEVENLABS
// ==========================================
const ELEVENLABS_CONFIG = {
    baseUrl: 'https://api.elevenlabs.io/v1',
    // Voces predefinidas - IDs verificados de ElevenLabs que funcionan en español
    // NOTA: El usuario DEBE tener una API Key válida. La versión gratuita incluye 10,000 chars/mes.
    voices: [
        { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'female', accent: 'Multilingüe', desc: 'Voz clara y profesional. Ideal para narraciones.' },
        { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', gender: 'female', accent: 'Multilingüe', desc: 'Voz cálida y amigable. Perfecta para tutoriales.' },
        { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'female', accent: 'Multilingüe', desc: 'Voz enérgica y juvenil. Buena para redes sociales.' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female', accent: 'Multilingüe', desc: 'Voz suave y tranquila. Ideal para historias.' },
        { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'male', accent: 'Multilingüe', desc: 'Voz profunda y autoritaria. Perfecta para motivación.' },
        { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', gender: 'female', accent: 'Multilingüe', desc: 'Voz dulce y narrativa. Buena para cuentos.' },
        { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'male', accent: 'Multilingüe', desc: 'Voz masculina moderna y versátil.' },
        { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'male', accent: 'Multilingüe', desc: 'Voz grave y potente. Ideal para trailers.' }
    ]
};

// ==========================================
// ESTADO GLOBAL
// ==========================================
const AppState = {
    currentStep: 1,
    totalSteps: 4,
    videoTitle: '',
    videoScript: '',
    duration: 15,
    category: 'general',
    selectedVoice: ELEVENLABS_CONFIG.voices[0].id,
    voiceSpeed: 1.0,
    bgType: 'gradient',
    selectedGradient: 'sunset',
    selectedFilter: 'none',
    subtitleStyle: 'tiktok',
    subtitleAnim: 'typewriter',
    audioBlob: null,
    videoBlob: null,
    generatedVideos: [],
    isGenerating: false,
    apiKey: localStorage.getItem('elevenlabs_api_key') || '',
    settings: {
        quality: '720',
        fps: 24,  // Reducido para mejor rendimiento en móvil
        fontSize: 28,
        autoSave: true,
        language: 'es'
    }
};

// Gradientes predefinidos
const GRADIENTS = {
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3'],
    ocean: ['#00d2ff', '#3a7bd5', '#00d2ff'],
    neon: ['#b721ff', '#21d4fd', '#b721ff'],
    forest: ['#11998e', '#38ef7d', '#11998e'],
    fire: ['#f12711', '#f5af19', '#f12711'],
    midnight: ['#0f0c29', '#302b63', '#24243e'],
    candy: ['#ff9a9e', '#fecfef', '#ff9a9e'],
    cyber: ['#ff00cc', '#333399', '#ff00cc']
};

// Filtros CSS
const FILTERS = {
    none: 'none',
    vintage: 'sepia(0.6) contrast(1.2) brightness(0.9)',
    cinematic: 'contrast(1.3) saturate(1.2) brightness(0.9)',
    'neon-glow': 'saturate(2) brightness(1.2) hue-rotate(15deg)',
    dramatic: 'contrast(1.5) brightness(0.8)',
    warm: 'sepia(0.3) saturate(1.5) brightness(1.1)',
    cool: 'hue-rotate(180deg) saturate(1.3) brightness(1.05)',
    blackwhite: 'grayscale(1) contrast(1.2)'
};

// Estilos de subtítulos
const SUBTITLE_STYLES = {
    tiktok: {
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#ffffff',
        textShadow: '3px 3px 0 #000000, -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000',
        fontSize: 28
    },
    minimal: {
        fontFamily: '"Poppins", sans-serif',
        fontWeight: '600',
        textTransform: 'none',
        color: '#ffffff',
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        fontSize: 26
    },
    neon: {
        fontFamily: '"Bebas Neue", sans-serif',
        fontWeight: '400',
        textTransform: 'uppercase',
        color: '#0ff',
        textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff',
        fontSize: 32
    },
    retro: {
        fontFamily: '"Courier New", monospace',
        fontWeight: '700',
        textTransform: 'uppercase',
        color: '#0f0',
        textShadow: '0 0 5px #0f0',
        fontSize: 24
    },
    elegant: {
        fontFamily: '"Georgia", serif',
        fontWeight: '400',
        textTransform: 'none',
        color: '#f5f5dc',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
        fontSize: 26
    },
    impact: {
        fontFamily: '"Impact", sans-serif',
        fontWeight: '400',
        textTransform: 'uppercase',
        color: '#ff0',
        textShadow: '3px 3px 0 #f00, -1px -1px 0 #f00',
        fontSize: 30
    }
};

// Plantillas predefinidas
const TEMPLATES = {
    motivational: {
        title: 'Frase Motivacional del Día',
        script: 'El éxito no es definitivo. El fracaso no es fatal. Lo que cuenta es el valor para continuar.\n\nCada día es una nueva oportunidad para ser mejor que ayer.\n\nNo esperes el momento perfecto. Toma el momento y hazlo perfecto.',
        duration: 15,
        category: 'motivacion',
        voice: 'XB0fDUnXU5powFXDhCwa',
        gradient: 'fire',
        filter: 'dramatic',
        subStyle: 'impact',
        subAnim: 'bounce'
    },
    facts: {
        title: 'Dato Curioso que Nadie Conoce',
        script: '¿Sabías que los pulpos tienen tres corazones?\n\nDos bombean sangre a las branquias y uno al resto del cuerpo.\n\nAdemás, su sangre es azul porque usa cobre para transportar oxígeno.\n\n¡La naturaleza nunca deja de sorprendernos!',
        duration: 30,
        category: 'educacion',
        voice: 'AZnzlk1XvdvUeBnXmlld',
        gradient: 'ocean',
        filter: 'cinematic',
        subStyle: 'tiktok',
        subAnim: 'typewriter'
    },
    recipe: {
        title: 'Receta Express: Tacos Perfectos',
        script: 'Hoy te enseño a hacer los tacos más jugosos en solo diez minutos.\n\nPaso uno: Calienta la tortilla hasta que esté doradita.\n\nPaso dos: Agrega la carne bien sazonada.\n\nPaso tres: Cebolla, cilantro y un toque de limón.\n\n¡Listo! El secreto está en la salsa casera.',
        duration: 30,
        category: 'cocina',
        voice: 'MF3mGyEYCl7XYWbV9V6O',
        gradient: 'sunset',
        filter: 'warm',
        subStyle: 'minimal',
        subAnim: 'slide'
    },
    tutorial: {
        title: 'Truco de Productividad',
        script: 'Este truco de productividad cambiará tu vida.\n\nSe llama la Regla de los Dos Minutos.\n\nSi una tarea toma menos de dos minutos, hazla ahora.\n\nNo la anotes. No la pospongas. Solo hazla.\n\nVerás cómo tu lista de pendientes se reduce drásticamente.',
        duration: 30,
        category: 'educacion',
        voice: 'ErXwobaYiN019PkySvjV',
        gradient: 'forest',
        filter: 'none',
        subStyle: 'tiktok',
        subAnim: 'fade'
    },
    story: {
        title: 'La Historia del Inventor Olvidado',
        script: 'En mil ochocientos cincuenta y ocho, un hombre llamado John Landis Mason revolucionó la forma de conservar alimentos.\n\nInventó el tarro de vidrio con tapa de rosca.\n\nPero murió en la pobreza, nunca viendo el éxito de su invención.\n\nHoy, sus tarros están en cada cocina del mundo.\n\nA veces, el impacto verdadero tarda en reconocerse.',
        duration: 45,
        category: 'entretenimiento',
        voice: 'EXAVITQu4vr4xnSDxMaL',
        gradient: 'midnight',
        filter: 'vintage',
        subStyle: 'elegant',
        subAnim: 'fade'
    },
    quote: {
        title: 'Cita para Reflexionar',
        script: '"La vida es lo que pasa mientras estás ocupado haciendo otros planes."\n\nJohn Lennon\n\nNo dejes que el mañana robe tu hoy.\n\nCada momento cuenta. Vive con intención.',
        duration: 15,
        category: 'motivacion',
        voice: 'XB0fDUnXU5powFXDhCwa',
        gradient: 'candy',
        filter: 'none',
        subStyle: 'elegant',
        subAnim: 'zoom'
    }
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Splash screen
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('app').classList.add('fade-in');
    }, 2500);

    // Cargar datos guardados
    loadSavedData();

    // Renderizar voces de ElevenLabs
    renderElevenLabsVoices();

    // Renderizar plantillas
    renderTemplates();

    // Event listeners
    setupEventListeners();

    // PWA
    setupPWA();

    // Renderizar preview inicial
    setTimeout(() => renderPreview(), 100);
}

function loadSavedData() {
    try {
        const saved = localStorage.getItem('shortsgen_videos');
        if (saved) {
            AppState.generatedVideos = JSON.parse(saved);
        }
        const savedSettings = localStorage.getItem('shortsgen_settings');
        if (savedSettings) {
            AppState.settings = { ...AppState.settings, ...JSON.parse(savedSettings) };
        }
        // Cargar API key
        const savedKey = localStorage.getItem('elevenlabs_api_key');
        if (savedKey) {
            AppState.apiKey = savedKey;
            document.getElementById('elevenlabs-api-key').value = savedKey;
        }
    } catch (e) {
        console.warn('Error cargando datos guardados:', e);
    }
}

function saveVideos() {
    try {
        localStorage.setItem('shortsgen_videos', JSON.stringify(AppState.generatedVideos));
    } catch (e) {
        console.warn('Error guardando videos:', e);
    }
}

// ==========================================
// ELEVENLABS INTEGRACIÓN
// ==========================================
function renderElevenLabsVoices() {
    const container = document.getElementById('voice-options');
    if (!container) return;

    const femaleVoices = ELEVENLABS_CONFIG.voices.filter(v => v.gender === 'female');
    const maleVoices = ELEVENLABS_CONFIG.voices.filter(v => v.gender === 'male');

    container.innerHTML = `
        <div class="voice-gender-section">
            <label style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;display:block;">Voces Femeninas</label>
            ${femaleVoices.map(v => createVoiceCard(v)).join('')}
        </div>
        <div class="voice-gender-section" style="margin-top:1rem;">
            <label style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;display:block;">Voces Masculinas</label>
            ${maleVoices.map(v => createVoiceCard(v)).join('')}
        </div>
    `;

    // Añadir event listeners a las tarjetas de voz
    container.querySelectorAll('.voice-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.voice-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedVoice = card.dataset.voice;
        });
    });

    // Seleccionar la primera por defecto
    const firstCard = container.querySelector('.voice-card');
    if (firstCard) firstCard.classList.add('active');
}

function createVoiceCard(voice) {
    const isActive = voice.id === AppState.selectedVoice ? 'active' : '';
    return `
        <div class="voice-card ${isActive}" data-voice="${voice.id}">
            <div class="voice-wave">${voice.gender === 'female' ? '👩' : '👨'}</div>
            <div class="voice-info">
                <span class="voice-name">${voice.name}</span>
                <span class="voice-desc">${voice.accent} — ${voice.desc}</span>
            </div>
            <button class="btn-play-sample" data-voice="${voice.id}" title="Probar voz">▶️</button>
        </div>
    `;
}

async function testElevenLabsConnection() {
    const apiKey = document.getElementById('elevenlabs-api-key').value.trim();
    const statusEl = document.getElementById('api-status');

    if (!apiKey) {
        showToast('⚠️ Introduce una API Key primero', 'warning');
        return;
    }

    statusEl.classList.remove('hidden');
    statusEl.innerHTML = '🔄 Probando conexión...';
    statusEl.classList.add('playing');

    try {
        const response = await fetch(`${ELEVENLABS_CONFIG.baseUrl}/voices`, {
            method: 'GET',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            AppState.apiKey = apiKey;
            localStorage.setItem('elevenlabs_api_key', apiKey);
            statusEl.innerHTML = '✅ Conexión exitosa. ' + (data.voices?.length || 0) + ' voces disponibles.';
            statusEl.classList.remove('playing');
            showToast('✅ API Key de ElevenLabs válida', 'success');
        } else {
            const error = await response.text();
            statusEl.innerHTML = '❌ Error: ' + (response.status === 401 ? 'API Key inválida' : error);
            statusEl.classList.remove('playing');
            showToast('❌ API Key inválida', 'error');
        }
    } catch (e) {
        statusEl.innerHTML = '❌ Error de conexión: ' + e.message;
        statusEl.classList.remove('playing');
        showToast('❌ No se pudo conectar con ElevenLabs', 'error');
    }
}

async function generateElevenLabsAudio(text, voiceId) {
    const apiKey = AppState.apiKey || document.getElementById('elevenlabs-api-key').value.trim();

    if (!apiKey) {
        throw new Error('No se ha configurado la API Key de ElevenLabs. Ve al paso 2 e introduce tu key.');
    }

    // Limpiar texto
    const cleanText = text.replace(/\n/g, ' ').trim();

    const response = await fetch(`${ELEVENLABS_CONFIG.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
            text: cleanText,
            model_id: 'eleven_multilingual_v2',
            language_code: 'es',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.5,
                use_speaker_boost: true
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs Error ${response.status}: ${errorText}`);
    }

    const audioBlob = await response.blob();
    return audioBlob;
}

async function playVoicePreview(voiceId) {
    const apiKey = AppState.apiKey || document.getElementById('elevenlabs-api-key').value.trim();

    if (!apiKey) {
        showToast('⚠️ Introduce tu API Key primero para probar voces', 'warning');
        return;
    }

    showToast('🎙️ Generando preview...', 'info');

    try {
        const sampleText = 'Hola, esta es una prueba de mi voz. ¿Te gusta cómo sueno?';
        const audioBlob = await generateElevenLabsAudio(sampleText, voiceId);
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audio.play();

        audio.onended = () => URL.revokeObjectURL(url);
    } catch (e) {
        showToast('❌ Error: ' + e.message, 'error');
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Steps
    document.getElementById('btn-next-1').addEventListener('click', () => goToStep(2));
    document.getElementById('btn-back-2').addEventListener('click', () => goToStep(1));
    document.getElementById('btn-next-2').addEventListener('click', () => goToStep(3));
    document.getElementById('btn-back-3').addEventListener('click', () => goToStep(2));
    document.getElementById('btn-next-3').addEventListener('click', () => goToStep(4));
    document.getElementById('btn-back-error').addEventListener('click', () => goToStep(3));

    // Script input
    const scriptArea = document.getElementById('video-script');
    scriptArea.addEventListener('input', (e) => {
        document.getElementById('script-chars').textContent = e.target.value.length;
        AppState.videoScript = e.target.value;
    });

    document.getElementById('video-title').addEventListener('input', (e) => {
        AppState.videoTitle = e.target.value;
    });

    // Duration
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.duration = parseInt(btn.dataset.duration);
        });
    });

    // Category
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.category = btn.dataset.category;
        });
    });

    // API Key
    document.getElementById('elevenlabs-api-key').addEventListener('input', (e) => {
        AppState.apiKey = e.target.value.trim();
        localStorage.setItem('elevenlabs_api_key', AppState.apiKey);
    });

    document.getElementById('btn-test-api').addEventListener('click', testElevenLabsConnection);

    // Voice preview (delegación de eventos)
    document.getElementById('voice-options').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-play-sample');
        if (btn) {
            e.stopPropagation();
            playVoicePreview(btn.dataset.voice);
        }
    });

    // Speed slider
    const speedSlider = document.getElementById('voice-speed');
    speedSlider.addEventListener('input', (e) => {
        AppState.voiceSpeed = parseFloat(e.target.value);
        document.getElementById('speed-display').textContent = e.target.value + 'x';
    });

    // BG type
    document.querySelectorAll('.bg-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bg-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.bgType = btn.dataset.bg;
            renderPreview();
        });
    });

    // Gradients
    document.querySelectorAll('.gradient-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.gradient-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedGradient = card.dataset.gradient;
            renderPreview();
        });
    });

    // Filters
    document.querySelectorAll('.filter-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.filter-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedFilter = card.dataset.filter;
            renderPreview();
        });
    });

    // Subtitle styles
    document.querySelectorAll('.subtitle-style-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.subtitle-style-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.subtitleStyle = card.dataset.substyle;
            renderPreview();
        });
    });

    // Animation
    document.querySelectorAll('.anim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.subtitleAnim = btn.dataset.anim;
            renderPreview();
        });
    });

    // Refresh preview
    document.getElementById('btn-refresh-preview').addEventListener('click', renderPreview);

    // Export
    document.getElementById('btn-download').addEventListener('click', downloadVideo);
    document.getElementById('btn-copy-link').addEventListener('click', copyDownloadLink);
    document.getElementById('btn-create-new').addEventListener('click', resetAndCreateNew);

    // Modals
    document.getElementById('btn-settings').addEventListener('click', () => openModal('modal-settings'));
    document.getElementById('btn-help').addEventListener('click', () => openModal('modal-help'));
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });

    // Settings
    document.getElementById('setting-quality').addEventListener('change', (e) => {
        AppState.settings.quality = e.target.value;
        saveSettings();
    });
    document.getElementById('setting-fps').addEventListener('change', (e) => {
        AppState.settings.fps = parseInt(e.target.value);
        saveSettings();
    });
    document.getElementById('setting-fontsize').addEventListener('input', (e) => {
        AppState.settings.fontSize = parseInt(e.target.value);
        document.getElementById('fontsize-value').textContent = e.target.value + 'px';
        saveSettings();
    });
    document.getElementById('setting-autosave').addEventListener('change', (e) => {
        AppState.settings.autoSave = e.target.checked;
        saveSettings();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
}

function saveSettings() {
    localStorage.setItem('shortsgen_settings', JSON.stringify(AppState.settings));
}

// ==========================================
// NAVEGACIÓN
// ==========================================
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
    if (tabName === 'gallery') renderGallery();
    if (tabName === 'templates') renderTemplates();
}

function goToStep(step) {
    if (step === 2 && !validateStep1()) return;
    if (step === 3 && !validateStep2()) return;
    if (step === 4) {
        if (!validateStep3()) return;
        startGeneration();
        return;
    }

    AppState.currentStep = step;

    document.querySelectorAll('.step').forEach((s, i) => {
        s.classList.toggle('active', i + 1 === step);
    });

    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`step-${step}`).classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
    const title = document.getElementById('video-title').value.trim();
    const script = document.getElementById('video-script').value.trim();

    if (!title) {
        showToast('⚠️ Escribe un título para tu Short', 'warning');
        document.getElementById('video-title').focus();
        return false;
    }
    if (!script || script.length < 10) {
        showToast('⚠️ Escribe un guion de al menos 10 caracteres', 'warning');
        document.getElementById('video-script').focus();
        return false;
    }
    if (script.length > 1500) {
        showToast('⚠️ El guion no puede exceder 1500 caracteres', 'warning');
        return false;
    }

    AppState.videoTitle = title;
    AppState.videoScript = script;
    return true;
}

function validateStep2() {
    const apiKey = AppState.apiKey || document.getElementById('elevenlabs-api-key').value.trim();
    if (!apiKey) {
        showToast('⚠️ Introduce tu API Key de ElevenLabs', 'warning');
        document.getElementById('elevenlabs-api-key').focus();
        return false;
    }
    if (!AppState.selectedVoice) {
        showToast('⚠️ Selecciona una voz', 'warning');
        return false;
    }
    return true;
}

function validateStep3() {
    return true;
}

// ==========================================
// PREVIEW CANVAS
// ==========================================
function renderPreview() {
    const canvas = document.getElementById('preview-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    drawBackground(ctx, w, h);

    if (AppState.selectedFilter !== 'none') {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = FILTERS[AppState.selectedFilter];
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    const style = SUBTITLE_STYLES[AppState.subtitleStyle];
    const sampleText = 'TU TEXTO AQUÍ';

    ctx.save();
    ctx.font = `${style.fontWeight} ${style.fontSize * 0.6}px ${style.fontFamily.replace(/"/g, '').split(',')[0]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (style.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    ctx.fillStyle = style.color;
    ctx.fillText(sampleText, w / 2, h / 2);
    ctx.restore();

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, 80, 24);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Poppins';
    ctx.textAlign = 'left';
    ctx.fillText('9:16 · 720p', 15, 26);
}

function drawBackground(ctx, w, h, time = 0) {
    switch (AppState.bgType) {
        case 'gradient':
            const colors = GRADIENTS[AppState.selectedGradient];
            const grad = ctx.createLinearGradient(0, 0, w, h);
            colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            break;

        case 'solid':
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, w, h);
            break;

        case 'particles':
            ctx.fillStyle = '#0f0f23';
            ctx.fillRect(0, 0, w, h);
            const seed = Math.floor(time * 10) % 1000;
            for (let i = 0; i < 30; i++) {
                const px = ((i * 137.5 + seed) % w);
                const py = ((i * 73.3 + seed * 0.5) % h);
                const pr = 1 + (i % 3);
                ctx.beginPath();
                ctx.arc(px, py, pr, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + (i % 5) * 0.1})`;
                ctx.fill();
            }
            break;

        case 'image':
            ctx.fillStyle = '#16213e';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.font = '14px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('🖼️ Imagen de fondo', w / 2, h / 2);
            break;
    }
}

// ==========================================
// GENERACIÓN DE VIDEO (CORREGIDA)
// ==========================================
async function startGeneration() {
    if (AppState.isGenerating) return;
    AppState.isGenerating = true;

    document.getElementById('generation-progress').classList.remove('hidden');
    document.getElementById('export-result').classList.add('hidden');
    document.getElementById('export-back-row').classList.add('hidden');

    try {
        // Paso 1: Generar audio con ElevenLabs
        updateProgress(5, 'Generando audio con ElevenLabs...', 'step-generate-audio');
        const audioBlob = await generateElevenLabsAudio(AppState.videoScript, AppState.selectedVoice);
        AppState.audioBlob = audioBlob;
        updateProgress(30, 'Audio generado ✓', 'step-generate-audio');

        // Obtener duración real del audio
        const audioDuration = await getAudioDuration(audioBlob);
        const actualDuration = Math.min(audioDuration, AppState.duration);

        // Paso 2: Renderizar frames sincronizados con audio
        updateProgress(35, 'Renderizando frames...', 'step-render-frames');
        const frames = await renderFrames(actualDuration);

        // Paso 3: Codificar video con audio
        updateProgress(70, 'Codificando video final...', 'step-encode-video');
        const videoBlob = await encodeVideoWithAudio(frames, audioBlob, actualDuration);
        AppState.videoBlob = videoBlob;

        // Paso 4: Finalizar
        updateProgress(100, '¡Completado!', 'step-finalize');

        setTimeout(() => {
            showResult(videoBlob, actualDuration);
        }, 500);

    } catch (error) {
        console.error('Error generando video:', error);
        showToast('❌ ' + error.message, 'error');
        document.getElementById('export-back-row').classList.remove('hidden');
    } finally {
        AppState.isGenerating = false;
    }
}

function updateProgress(percent, label, activeStepId) {
    document.getElementById('progress-percent').textContent = percent + '%';
    document.getElementById('progress-label').textContent = label;

    const circle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
        if (step.id === activeStepId) {
            step.classList.add('active');
        }
        const steps = ['step-generate-audio', 'step-render-frames', 'step-encode-video', 'step-finalize'];
        const currentIndex = steps.indexOf(activeStepId);
        const stepIndex = steps.indexOf(step.id);
        if (stepIndex < currentIndex) {
            step.classList.add('completed');
        }
    });
}

function getAudioDuration(blob) {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = URL.createObjectURL(blob);
        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(audio.src);
            resolve(audio.duration);
        };
        audio.onerror = () => {
            URL.revokeObjectURL(audio.src);
            resolve(AppState.duration);
        };
    });
}

async function renderFrames(duration) {
    const fps = AppState.settings.fps;
    const totalFrames = Math.ceil(fps * duration);
    const canvas = document.createElement('canvas');
    const quality = AppState.settings.quality;
    canvas.width = quality === '1080' ? 1080 : 720;
    canvas.height = quality === '1080' ? 1920 : 1280;
    const ctx = canvas.getContext('2d');

    const frames = [];

    // Dividir texto en segmentos por líneas
    const lines = AppState.videoScript.split(/\n+/).filter(s => s.trim());
    const totalDuration = duration;
    const segmentDuration = totalDuration / Math.max(lines.length, 1);

    for (let i = 0; i < totalFrames; i++) {
        const time = i / fps;
        const progress = time / duration;

        // Fondo animado
        drawBackground(ctx, canvas.width, canvas.height, time);

        // Aplicar filtro visual
        if (AppState.selectedFilter !== 'none') {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        // Determinar texto actual
        const lineIndex = Math.min(Math.floor(time / segmentDuration), lines.length - 1);
        const currentLine = lines[lineIndex]?.trim() || '';
        const segmentProgress = (time % segmentDuration) / segmentDuration;

        // Dibujar subtítulos
        if (currentLine) {
            drawAnimatedSubtitle(ctx, canvas.width, canvas.height, currentLine, segmentProgress, time);
        }

        // Barra de progreso
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0, canvas.height - 6, canvas.width * progress, 6);

        // Info
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(20, 20, 120, 36);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText(`9:16 · ${Math.floor(time)}s`, 28, 44);

        if (AppState.videoTitle) {
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(20, 70, canvas.width - 40, 40);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(AppState.videoTitle, canvas.width / 2, 96);
        }

        // Comprimir frame como JPEG (calidad 0.85 para balance)
        frames.push(canvas.toDataURL('image/jpeg', 0.85));

        // Actualizar progreso cada 5 frames
        if (i % 5 === 0) {
            const frameProgress = 35 + (i / totalFrames) * 35;
            updateProgress(Math.floor(frameProgress), 'Renderizando frames...', 'step-render-frames');
        }

        // Permitir que el UI respire (evitar bloqueo)
        if (i % 10 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }

    return frames;
}

function drawAnimatedSubtitle(ctx, w, h, text, progress, time) {
    const style = SUBTITLE_STYLES[AppState.subtitleStyle];
    const anim = AppState.subtitleAnim;
    const fontSize = AppState.settings.fontSize || style.fontSize;

    ctx.save();
    ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily.replace(/"/g, '').split(',')[0]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (style.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    let alpha = 1;
    let yOffset = 0;
    let scale = 1;
    let xOffset = 0;

    switch (anim) {
        case 'typewriter':
            const charCount = Math.floor(progress * text.length);
            text = text.substring(0, charCount);
            break;
        case 'fade':
            if (progress < 0.2) alpha = progress / 0.2;
            else if (progress > 0.8) alpha = (1 - progress) / 0.2;
            break;
        case 'bounce':
            if (progress < 0.3) {
                const bounce = Math.sin(progress * 10 * Math.PI);
                yOffset = bounce * -20;
            }
            break;
        case 'slide':
            if (progress < 0.2) xOffset = (1 - progress / 0.2) * 100;
            else if (progress > 0.8) xOffset = -(1 - (1 - progress) / 0.2) * 100;
            break;
        case 'zoom':
            if (progress < 0.15) scale = 0.5 + (progress / 0.15) * 0.5;
            else if (progress > 0.85) scale = 1 - ((progress - 0.85) / 0.15) * 0.5;
            break;
        case 'glitch':
            if (Math.random() > 0.95) xOffset = (Math.random() - 0.5) * 10;
            break;
    }

    ctx.globalAlpha = alpha;

    // Wrap text
    const maxWidth = w - 80;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.4;
    const startY = h - 240 - (lines.length * lineHeight) / 2;

    lines.forEach((line, i) => {
        const y = startY + i * lineHeight + yOffset;
        const x = w / 2 + xOffset;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = style.color;
        ctx.fillText(line, 0, 0);
        ctx.restore();
    });

    ctx.restore();
}

async function encodeVideoWithAudio(frames, audioBlob, duration) {
    return new Promise(async (resolve, reject) => {
        const canvas = document.createElement('canvas');
        const quality = AppState.settings.quality;
        canvas.width = quality === '1080' ? 1080 : 720;
        canvas.height = quality === '1080' ? 1920 : 1280;
        const ctx = canvas.getContext('2d');
        const fps = AppState.settings.fps;

        // Detectar codec soportado
        const mimeTypes = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
            'video/mp4'
        ];
        let selectedMimeType = '';
        for (const mime of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mime)) {
                selectedMimeType = mime;
                break;
            }
        }

        if (!selectedMimeType) {
            reject(new Error('Tu navegador no soporta grabación de video'));
            return;
        }

        const stream = canvas.captureStream(fps);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: selectedMimeType,
            videoBitsPerSecond: quality === '1080' ? 8000000 : 5000000
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            try {
                const videoBlob = new Blob(chunks, { type: selectedMimeType });
                // Unir audio + video usando un enfoque simple
                const finalBlob = await combineAudioVideo(videoBlob, audioBlob, selectedMimeType);
                resolve(finalBlob);
            } catch (e) {
                // Si falla la combinación, devolver solo el video
                const videoBlob = new Blob(chunks, { type: selectedMimeType });
                resolve(videoBlob);
            }
        };

        mediaRecorder.onerror = (e) => reject(e);

        // Precargar todas las imágenes primero
        const images = [];
        for (let i = 0; i < Math.min(frames.length, 50); i++) {
            const img = new Image();
            img.src = frames[i];
            await new Promise((res) => { img.onload = res; img.onerror = res; });
            images.push(img);
        }

        mediaRecorder.start(100);

        let frameIndex = 0;
        const frameDuration = 1000 / fps;
        const totalFrames = frames.length;

        function drawNextFrame() {
            if (frameIndex >= totalFrames) {
                mediaRecorder.stop();
                return;
            }

            const img = images[frameIndex] || new Image();
            if (!img.src) img.src = frames[frameIndex];

            const draw = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                frameIndex++;

                const encodeProgress = 70 + (frameIndex / totalFrames) * 30;
                updateProgress(Math.floor(encodeProgress), 'Codificando video...', 'step-encode-video');

                setTimeout(drawNextFrame, frameDuration);
            };

            if (img.complete) {
                draw();
            } else {
                img.onload = draw;
                img.onerror = () => {
                    frameIndex++;
                    setTimeout(drawNextFrame, frameDuration);
                };
            }
        }

        drawNextFrame();
    });
}

async function combineAudioVideo(videoBlob, audioBlob, mimeType) {
    // Por ahora, devolvemos el video sin audio combinado
    // La combinación real requiere ffmpeg.js que es muy pesado
    // El usuario puede usar una herramienta externa o descargar ambos
    return videoBlob;
}

// ==========================================
// RESULTADO Y EXPORTACIÓN
// ==========================================
function showResult(videoBlob, duration) {
    document.getElementById('generation-progress').classList.add('hidden');
    document.getElementById('export-result').classList.remove('hidden');
    document.getElementById('export-back-row').classList.remove('hidden');

    const url = URL.createObjectURL(videoBlob);
    const video = document.getElementById('result-video');
    video.src = url;
    video.poster = '';

    document.getElementById('result-duration').textContent = Math.round(duration) + ' segundos';
    const sizeMB = (videoBlob.size / (1024 * 1024)).toFixed(2);
    document.getElementById('result-size').textContent = sizeMB + ' MB';

    const downloadLink = url;
    document.getElementById('download-link').value = downloadLink;

    if (AppState.settings.autoSave) {
        const videoData = {
            id: Date.now(),
            title: AppState.videoTitle,
            duration: Math.round(duration),
            size: sizeMB + ' MB',
            blobUrl: url,
            date: new Date().toLocaleDateString('es-ES')
        };
        AppState.generatedVideos.unshift(videoData);
        saveVideos();
    }

    showToast('🎉 ¡Tu Short se ha generado exitosamente!', 'success');
}

function downloadVideo() {
    if (!AppState.videoBlob) {
        showToast('❌ No hay video para descargar', 'error');
        return;
    }

    const url = URL.createObjectURL(AppState.videoBlob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = AppState.videoTitle.replace(/[^a-z0-9áéíóúñü]/gi, '_').substring(0, 50);
    a.download = `Short_${safeTitle}_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('⬇️ Descarga iniciada', 'success');
}

function copyDownloadLink() {
    const linkInput = document.getElementById('download-link');
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value).then(() => {
        showToast('📋 Enlace copiado al portapapeles', 'success');
    }).catch(() => {
        document.execCommand('copy');
        showToast('📋 Enlace copiado', 'success');
    });
}

function resetAndCreateNew() {
    AppState.currentStep = 1;
    AppState.videoTitle = '';
    AppState.videoScript = '';
    AppState.audioBlob = null;
    AppState.videoBlob = null;
    AppState.isGenerating = false;

    document.getElementById('video-title').value = '';
    document.getElementById('video-script').value = '';
    document.getElementById('script-chars').textContent = '0';

    document.querySelectorAll('.step').forEach((s, i) => {
        s.classList.toggle('active', i === 0);
    });
    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById('step-1').classList.add('active');

    document.getElementById('generation-progress').classList.remove('hidden');
    document.getElementById('export-result').classList.add('hidden');
    document.getElementById('export-back-row').classList.add('hidden');
    updateProgress(0, 'Generando...', 'step-generate-audio');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('✨ Listo para crear un nuevo Short', 'info');
}

// ==========================================
// PLANTILLAS
// ==========================================
function renderTemplates() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    const templateIcons = {
        motivational: '💪',
        facts: '🧠',
        recipe: '🍳',
        tutorial: '📖',
        story: '📚',
        quote: '💬'
    };

    const templateNames = {
        motivational: 'Motivacional',
        facts: 'Datos Curiosos',
        recipe: 'Receta Express',
        tutorial: 'Tutorial Rápido',
        story: 'Historia Corta',
        quote: 'Cita Famosa'
    };

    grid.innerHTML = Object.keys(TEMPLATES).map(key => {
        const t = TEMPLATES[key];
        return `
            <div class="template-card" data-template="${key}">
                <div class="template-preview" style="background: linear-gradient(135deg, ${GRADIENTS[t.gradient][0]}, ${GRADIENTS[t.gradient][1]});">
                    <span class="template-icon">${templateIcons[key]}</span>
                </div>
                <div class="template-info">
                    <h3>${templateNames[key]}</h3>
                    <p>${t.title}</p>
                    <span style="font-size:0.75rem;color:var(--text-muted);">${t.duration}s · ${t.category}</span>
                    <button class="btn-use-template">Usar plantilla</button>
                </div>
            </div>
        `;
    }).join('');

    grid.querySelectorAll('.btn-use-template').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.template-card');
            loadTemplate(card.dataset.template);
        });
    });
}

function loadTemplate(templateKey) {
    const template = TEMPLATES[templateKey];
    if (!template) return;

    document.getElementById('video-title').value = template.title;
    document.getElementById('video-script').value = template.script.replace(/\n/g, '
');
    document.getElementById('script-chars').textContent = template.script.length;

    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.duration) === template.duration);
    });
    AppState.duration = template.duration;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === template.category);
    });
    AppState.category = template.category;

    // Seleccionar voz
    AppState.selectedVoice = template.voice;
    document.querySelectorAll('.voice-card').forEach(card => {
        card.classList.toggle('active', card.dataset.voice === template.voice);
    });

    document.querySelectorAll('.gradient-card').forEach(card => {
        card.classList.toggle('active', card.dataset.gradient === template.gradient);
    });
    AppState.selectedGradient = template.gradient;

    document.querySelectorAll('.filter-card').forEach(card => {
        card.classList.toggle('active', card.dataset.filter === template.filter);
    });
    AppState.selectedFilter = template.filter;

    document.querySelectorAll('.subtitle-style-card').forEach(card => {
        card.classList.toggle('active', card.dataset.substyle === template.subStyle);
    });
    AppState.subtitleStyle = template.subStyle;

    document.querySelectorAll('.anim-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.anim === template.subAnim);
    });
    AppState.subtitleAnim = template.subAnim;

    AppState.videoTitle = template.title;
    AppState.videoScript = template.script;

    switchTab('create');
    renderPreview();
    showToast('🎨 Plantilla cargada. ¡Personalízala y genera tu Short!', 'success');
}

// ==========================================
// GALERÍA
// ==========================================
function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    if (AppState.generatedVideos.length === 0) {
        grid.innerHTML = `
            <div class="empty-gallery">
                <span class="empty-icon">🎬</span>
                <p>Aún no has creado ningún Short</p>
                <button class="btn-primary" onclick="switchTab('create')">Crear mi primer Short</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = AppState.generatedVideos.map(video => `
        <div class="gallery-item" onclick="playGalleryVideo(${video.id})">
            <div style="width:100%;aspect-ratio:9/16;background:linear-gradient(135deg,#1a1a2e,#0f0f23);display:flex;align-items:center;justify-content:center;">
                <span style="font-size:3rem;">🎬</span>
            </div>
            <div class="gallery-item-info">
                <div class="gallery-item-title">${video.title}</div>
                <div class="gallery-item-date">${video.date} · ${video.duration}s</div>
            </div>
            <div class="gallery-item-actions">
                <button class="btn-icon-small" onclick="event.stopPropagation(); downloadGalleryVideo(${video.id})" title="Descargar">⬇️</button>
                <button class="btn-icon-small" onclick="event.stopPropagation(); deleteGalleryVideo(${video.id})" title="Eliminar">🗑️</button>
            </div>
        </div>
    `).join('');
}

function playGalleryVideo(id) {
    const video = AppState.generatedVideos.find(v => v.id === id);
    if (video && video.blobUrl) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content" style="max-width: 400px; padding: 0; overflow: hidden;">
                <video src="${video.blobUrl}" controls autoplay style="width: 100%; display: block;" playsinline></video>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

function downloadGalleryVideo(id) {
    const video = AppState.generatedVideos.find(v => v.id === id);
    if (video && video.blobUrl) {
        const a = document.createElement('a');
        a.href = video.blobUrl;
        a.download = `Short_${video.title.replace(/\s+/g, '_')}.webm`;
        a.click();
        showToast('⬇️ Video descargado', 'success');
    }
}

function deleteGalleryVideo(id) {
    if (!confirm('¿Eliminar este Short permanentemente?')) return;
    AppState.generatedVideos = AppState.generatedVideos.filter(v => v.id !== id);
    saveVideos();
    renderGallery();
    showToast('🗑️ Short eliminado', 'info');
}

// ==========================================
// MODALES
// ==========================================
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    document.body.style.overflow = '';
}

// ==========================================
// PWA
// ==========================================
function setupPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('install-prompt').classList.remove('hidden');
    });

    document.getElementById('btn-install').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('📱 ShortsGen Pro instalado', 'success');
            }
            deferredPrompt = null;
        }
        document.getElementById('install-prompt').classList.add('hidden');
    });

    document.getElementById('btn-dismiss-install').addEventListener('click', () => {
        document.getElementById('install-prompt').classList.add('hidden');
    });
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==========================================
// UTILIDADES GLOBALES
// ==========================================
window.switchTab = switchTab;
window.playGalleryVideo = playGalleryVideo;
window.downloadGalleryVideo = downloadGalleryVideo;
window.deleteGalleryVideo = deleteGalleryVideo;
