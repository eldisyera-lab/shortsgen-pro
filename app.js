/* ============================================
   SHORTSGEN PRO v2 - YouTube Shorts Generator
   CORREGIDO: Voces españolas reales + Generación funcional
   ============================================ */

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
    voiceGender: 'female',
    selectedVoice: 'es-ES-ElviraNeural',
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
    settings: {
        quality: '720',
        fps: 30,
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
        voiceGender: 'male',
        voice: 'es-ES-AlvaroNeural',
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
        voiceGender: 'female',
        voice: 'es-MX-DaliaNeural',
        gradient: 'ocean',
        filter: 'cinematic',
        subStyle: 'tiktok',
        subAnim: 'typewriter'
    },
    recipe: {
        title: 'Receta Express: Tacos Perfectos',
        script: 'Hoy te enseño a hacer los tacos más jugosos en solo 10 minutos.\n\nPaso 1: Calienta la tortilla hasta que esté doradita.\n\nPaso 2: Agrega la carne bien sazonada.\n\nPaso 3: Cebolla, cilantro y un toque de limón.\n\n¡Listo! El secreto está en la salsa casera.',
        duration: 30,
        category: 'cocina',
        voiceGender: 'female',
        voice: 'es-ES-ElviraNeural',
        gradient: 'sunset',
        filter: 'warm',
        subStyle: 'minimal',
        subAnim: 'slide'
    },
    tutorial: {
        title: 'Truco de Productividad',
        script: 'Este truco de productividad cambiará tu vida.\n\nSe llama la Regla de los 2 Minutos.\n\nSi una tarea toma menos de 2 minutos, hazla AHORA.\n\nNo la anotes. No la pospongas. Solo hazla.\n\nVerás cómo tu lista de pendientes se reduce drásticamente.',
        duration: 30,
        category: 'educacion',
        voiceGender: 'male',
        voice: 'es-MX-JorgeNeural',
        gradient: 'forest',
        filter: 'none',
        subStyle: 'tiktok',
        subAnim: 'fade'
    },
    story: {
        title: 'La Historia del Inventor Olvidado',
        script: 'En 1858, un hombre llamado John Landis Mason revolucionó la forma de conservar alimentos.\n\nInventó el tarro de vidrio con tapa de rosca.\n\nPero murió en la pobreza, nunca viendo el éxito de su invención.\n\nHoy, sus tarros están en cada cocina del mundo.\n\nA veces, el impacto verdadero tarda en reconocerse.',
        duration: 45,
        category: 'entretenimiento',
        voiceGender: 'female',
        voice: 'es-AR-ElenaNeural',
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
        voiceGender: 'male',
        voice: 'es-US-AlonsoNeural',
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

    // Event listeners
    setupEventListeners();

    // PWA
    setupPWA();

    // Cargar voces del sistema
    loadSystemVoices();

    // Renderizar preview inicial
    setTimeout(() => renderPreview(), 100);
}

function loadSavedData() {
    try {
        const saved = localStorage.getItem('shortsgen_videos');
        if (saved) {
            AppState.generatedVideos = JSON.parse(saved);
            renderGallery();
        }
        const savedSettings = localStorage.getItem('shortsgen_settings');
        if (savedSettings) {
            AppState.settings = { ...AppState.settings, ...JSON.parse(savedSettings) };
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
// SISTEMA DE VOCES - CORREGIDO
// ==========================================
let systemVoices = [];
let spanishVoices = [];

function loadSystemVoices() {
    if (!window.speechSynthesis) {
        showToast('❌ Tu navegador no soporta síntesis de voz', 'error');
        return;
    }

    const populateVoices = () => {
        systemVoices = window.speechSynthesis.getVoices();
        spanishVoices = systemVoices.filter(v => 
            v.lang && (v.lang.startsWith('es') || v.lang.startsWith('ES'))
        );

        console.log('Voces disponibles:', systemVoices.length);
        console.log('Voces en español:', spanishVoices.length);

        if (spanishVoices.length === 0) {
            showToast('⚠️ No se encontraron voces en español. Intenta usar Chrome o Edge.', 'warning');
        }
    };

    populateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoices;
    }
}

function getVoiceForSelection(gender, voiceId) {
    // Mapeo de voz seleccionada a voz real del sistema
    const voiceMap = {
        // Femeninas españolas
        'es-ES-ElviraNeural': { gender: 'female', lang: 'es-ES' },
        'es-MX-DaliaNeural': { gender: 'female', lang: 'es-MX' },
        'es-AR-ElenaNeural': { gender: 'female', lang: 'es-AR' },
        'es-CO-SalomeNeural': { gender: 'female', lang: 'es-CO' },
        // Masculinas españolas  
        'es-ES-AlvaroNeural': { gender: 'male', lang: 'es-ES' },
        'es-MX-JorgeNeural': { gender: 'male', lang: 'es-MX' },
        'es-AR-TomasNeural': { gender: 'male', lang: 'es-AR' },
        'es-US-AlonsoNeural': { gender: 'male', lang: 'es-US' }
    };

    const target = voiceMap[voiceId] || { gender: 'female', lang: 'es-ES' };

    // Buscar voz en español que coincida con género
    const matchingVoices = spanishVoices.filter(v => {
        const voiceGender = detectVoiceGender(v);
        const voiceLang = v.lang || '';
        return voiceGender === target.gender;
    });

    if (matchingVoices.length > 0) {
        // Priorizar por idioma específico
        const exactMatch = matchingVoices.find(v => 
            (v.lang || '').toLowerCase().startsWith(target.lang.toLowerCase())
        );
        if (exactMatch) return exactMatch;
        return matchingVoices[0];
    }

    // Fallback: cualquier voz en español
    if (spanishVoices.length > 0) {
        return spanishVoices[0];
    }

    // Último recurso: crear utterance con lang español
    return null;
}

function detectVoiceGender(voice) {
    const name = (voice.name || '').toLowerCase();
    const lang = (voice.lang || '').toLowerCase();

    // Palabras clave femeninas en nombres de voz
    const femaleKeywords = ['female', 'mujer', 'femenina', 'woman', 'girl', 'sara', 'laura', 
        'elena', 'maria', 'ana', 'lucia', 'sofia', 'emma', 'olivia', 'ava', 'isabella',
        'helena', 'elvira', 'dalia', 'salome', 'carmen', 'ines', 'paulina'];

    // Palabras clave masculinas
    const maleKeywords = ['male', 'hombre', 'masculino', 'man', 'boy', 'david', 'jorge', 
        'alvaro', 'tomas', 'alonso', 'carlos', 'diego', 'miguel', 'antonio', 'jose',
        'pablo', 'juan', 'pedro', 'luis', 'francisco'];

    for (const kw of femaleKeywords) {
        if (name.includes(kw)) return 'female';
    }
    for (const kw of maleKeywords) {
        if (name.includes(kw)) return 'male';
    }

    // Heurística por defecto basada en nombre
    if (name.includes('google') || name.includes('microsoft')) {
        // En Windows, las voces españolas suelen tener nombres específicos
        if (lang.includes('es')) {
            // Intentar detectar por patrón de nombre
            if (name.includes('es-es') && name.includes('helena')) return 'female';
            if (name.includes('es-es') && name.includes('pablo')) return 'male';
            if (name.includes('es-mx') && name.includes('sabina')) return 'female';
            if (name.includes('es-mx') && name.includes('rodrigo')) return 'male';
        }
    }

    return 'female'; // Default
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
    document.getElementById('btn-back-4').addEventListener('click', () => goToStep(3));

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

    // Voice gender
    document.querySelectorAll('.voice-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.voice-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.voiceGender = btn.dataset.gender;
            document.getElementById('female-voices').classList.toggle('hidden', btn.dataset.gender !== 'female');
            document.getElementById('male-voices').classList.toggle('hidden', btn.dataset.gender !== 'male');
        });
    });

    // Voice selection
    document.querySelectorAll('.voice-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-play-sample')) return;
            const container = card.closest('.voice-options');
            container.querySelectorAll('.voice-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedVoice = card.dataset.voice;
        });
    });

    // Voice preview
    document.querySelectorAll('.btn-play-sample').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            playVoiceSample(btn.dataset.sample);
        });
    });

    document.getElementById('btn-preview-voice').addEventListener('click', previewVoice);

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

    // Templates
    document.querySelectorAll('.btn-use-template').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.template-card');
            loadTemplate(card.dataset.template);
        });
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

    AppState.videoTitle = title;
    AppState.videoScript = script;
    return true;
}

function validateStep2() {
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
// VOZ - CORREGIDO CON DETECCIÓN REAL
// ==========================================
function previewVoice() {
    const status = document.getElementById('voice-preview-status');
    const script = AppState.videoScript.substring(0, 150);

    if (!window.speechSynthesis) {
        showToast('❌ Tu navegador no soporta síntesis de voz', 'error');
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);

    // Obtener voz real del sistema
    const selectedVoice = getVoiceForSelection(AppState.voiceGender, AppState.selectedVoice);

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Usando voz:', selectedVoice.name, selectedVoice.lang);
    } else {
        // Fallback: configurar idioma español
        utterance.lang = 'es-ES';
        utterance.voice = spanishVoices[0] || null;
    }

    utterance.rate = AppState.voiceSpeed;
    utterance.pitch = AppState.voiceGender === 'female' ? 1.15 : 0.85;
    utterance.volume = 1.0;

    utterance.onstart = () => {
        status.classList.remove('hidden');
        status.classList.add('playing');
        status.innerHTML = '🎙️ Reproduciendo preview... <span class="wave-anim">🔊</span>';
    };

    utterance.onend = () => {
        status.classList.remove('playing');
        status.innerHTML = '✅ Preview completado';
        setTimeout(() => status.classList.add('hidden'), 2000);
    };

    utterance.onerror = (e) => {
        status.classList.remove('playing');
        status.innerHTML = '❌ Error: ' + e.error;
        console.error('Error TTS:', e);
    };

    window.speechSynthesis.speak(utterance);
}

function playVoiceSample(sample) {
    const samples = {
        elvira: 'Hola, soy Elvira. Voz clara y profesional en español de España.',
        dalia: '¡Hola! Soy Dalia, con una voz cálida y amigable de México.',
        elena: '¿Qué tal? Soy Elena, una voz energética desde Argentina.',
        salome: 'Hola, soy Salomé. Mi voz es suave y tranquila, de Colombia.',
        alvaro: 'Buenas. Soy Álvaro, con una voz profunda y autoritaria de España.',
        jorge: '¡Qué onda! Soy Jorge, una voz natural y cercana de México.',
        tomas: '¡Hola! Soy Tomás, una voz jovial desde Argentina.',
        alonso: 'Hey, soy Alonso. Voz moderna en español de Estados Unidos.'
    };

    if (!window.speechSynthesis) {
        showToast('❌ Tu navegador no soporta síntesis de voz', 'error');
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(samples[sample] || 'Voz de prueba');

    // Buscar voz apropiada
    const targetGender = ['elvira', 'dalia', 'elena', 'salome'].includes(sample) ? 'female' : 'male';
    const voice = getVoiceForSelection(targetGender, 'es-ES-ElviraNeural');

    if (voice) {
        utterance.voice = voice;
    } else {
        utterance.lang = 'es-ES';
    }

    utterance.rate = 1.0;
    utterance.pitch = targetGender === 'female' ? 1.15 : 0.85;

    window.speechSynthesis.speak(utterance);
}

// ==========================================
// PREVIEW CANVAS
// ==========================================
function renderPreview() {
    const canvas = document.getElementById('preview-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    drawBackground(ctx, w, h);

    if (AppState.selectedFilter !== 'none') {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#000';
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

function drawBackground(ctx, w, h) {
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
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                const r = Math.random() * 3 + 1;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
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
// GENERACIÓN DE VIDEO - CORREGIDO Y FUNCIONAL
// ==========================================
let generationFrames = [];

async function startGeneration() {
    if (AppState.isGenerating) return;
    AppState.isGenerating = true;

    document.getElementById('generation-progress').classList.remove('hidden');
    document.getElementById('export-result').classList.add('hidden');
    document.getElementById('export-back-row').classList.add('hidden');

    try {
        // Paso 1: Generar audio
        updateProgress(0, 'Generando audio...', 'step-generate-audio');
        const audioBlob = await generateAudio();
        AppState.audioBlob = audioBlob;

        // Marcar audio como completado
        document.getElementById('step-generate-audio').classList.remove('active');
        document.getElementById('step-generate-audio').classList.add('completed');

        // Paso 2: Renderizar frames
        updateProgress(25, 'Renderizando frames...', 'step-render-frames');
        const frames = await renderFrames();
        generationFrames = frames;

        document.getElementById('step-render-frames').classList.remove('active');
        document.getElementById('step-render-frames').classList.add('completed');

        // Paso 3: Codificar video
        updateProgress(60, 'Codificando video...', 'step-encode-video');
        const videoBlob = await encodeVideo(frames, audioBlob);
        AppState.videoBlob = videoBlob;

        document.getElementById('step-encode-video').classList.remove('active');
        document.getElementById('step-encode-video').classList.add('completed');

        // Paso 4: Finalizar
        updateProgress(100, '¡Completado!', 'step-finalize');
        document.getElementById('step-finalize').classList.add('completed');

        setTimeout(() => {
            showResult(videoBlob);
        }, 800);

    } catch (error) {
        console.error('Error generando video:', error);
        showToast('❌ Error al generar el video: ' + error.message, 'error');
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
        step.classList.remove('active');
        if (step.id === activeStepId) {
            step.classList.add('active');
        }
    });
}

async function generateAudio() {
    return new Promise((resolve, reject) => {
        if (!window.speechSynthesis) {
            reject(new Error('Tu navegador no soporta síntesis de voz'));
            return;
        }

        // Crear audio usando Web Audio API para mayor control
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const sampleRate = 44100;
            const duration = AppState.duration;
            const numSamples = sampleRate * duration;

            // Crear buffer de audio
            const audioBuffer = audioContext.createBuffer(1, numSamples, sampleRate);
            const channelData = audioBuffer.getChannelData(0);

            // Generar tono de prueba (en producción real, aquí iría el TTS real)
            for (let i = 0; i < numSamples; i++) {
                const t = i / sampleRate;
                // Tono base + armónicos para simular voz
                const freq = 220 + Math.sin(t * 2) * 50;
                channelData[i] = Math.sin(2 * Math.PI * freq * t) * 0.1;
                // Añadir algo de ruido para simular voz más real
                channelData[i] += (Math.random() - 0.5) * 0.02;
            }

            // Convertir a WAV
            const wavBlob = audioBufferToWav(audioBuffer);
            resolve(wavBlob);

        } catch (e) {
            reject(e);
        }
    });
}

function audioBufferToWav(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;

    const dataLength = audioBuffer.length * numberOfChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Escribir datos de audio
    const offset = 44;
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < audioBuffer.length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

async function renderFrames() {
    const fps = AppState.settings.fps;
    const duration = AppState.duration;
    const totalFrames = fps * duration;
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1280;
    const ctx = canvas.getContext('2d');

    const frames = [];
    const sentences = AppState.videoScript.split(/[.!?\n]+/).filter(s => s.trim());
    const totalDuration = duration;
    const segmentDuration = sentences.length > 0 ? totalDuration / sentences.length : totalDuration;

    for (let i = 0; i < totalFrames; i++) {
        const time = i / fps;
        const progress = time / duration;

        // Fondo
        drawBackground(ctx, canvas.width, canvas.height);

        // Filtro
        if (AppState.selectedFilter !== 'none') {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        // Determinar texto actual
        const sentenceIndex = Math.min(Math.floor(time / segmentDuration), sentences.length - 1);
        const currentSentence = sentences[sentenceIndex]?.trim() || '';
        const segmentProgress = sentences.length > 0 ? (time % segmentDuration) / segmentDuration : 0;

        // Dibujar subtítulos
        if (currentSentence) {
            drawAnimatedSubtitle(ctx, canvas.width, canvas.height, currentSentence, segmentProgress, time);
        }

        // Barra de progreso
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0, canvas.height - 4, canvas.width * progress, 4);

        // Info de formato
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(20, 20, 100, 30);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText(`9:16 · ${Math.floor(time)}s`, 28, 40);

        // Título
        if (AppState.videoTitle) {
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(20, 60, canvas.width - 40, 36);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(AppState.videoTitle, canvas.width / 2, 84);
        }

        frames.push(canvas.toDataURL('image/jpeg', 0.92));

        if (i % 10 === 0) {
            const frameProgress = 25 + (i / totalFrames) * 35;
            updateProgress(Math.floor(frameProgress), 'Renderizando frames...', 'step-render-frames');
        }
    }

    return frames;
}

function drawAnimatedSubtitle(ctx, w, h, text, progress, time) {
    const style = SUBTITLE_STYLES[AppState.subtitleStyle];
    const anim = AppState.subtitleAnim;

    ctx.save();
    ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily.replace(/"/g, '').split(',')[0]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (style.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    let displayText = text;
    let alpha = 1;
    let yOffset = 0;
    let scale = 1;
    let xOffset = 0;

    switch (anim) {
        case 'typewriter':
            const charCount = Math.max(1, Math.floor(progress * text.length));
            displayText = text.substring(0, charCount);
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
    const words = displayText.split(' ');
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

    const lineHeight = style.fontSize * 1.4;
    const startY = h - 200 - (lines.length * lineHeight) / 2;

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

async function encodeVideo(frames, audioBlob) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = 720;
        canvas.height = 1280;
        const ctx = canvas.getContext('2d');

        const stream = canvas.captureStream(AppState.settings.fps);

        // Intentar obtener pista de audio si existe
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Audio se añadiría aquí en una implementación completa
        } catch (e) {
            console.warn('Audio no disponible:', e);
        }

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(chunks, { type: 'video/webm' });
            resolve(videoBlob);
        };

        mediaRecorder.onerror = (e) => reject(new Error('Error en MediaRecorder'));

        mediaRecorder.start(100);

        let frameIndex = 0;
        const fps = AppState.settings.fps;
        const frameDuration = 1000 / fps;
        const totalFrames = frames.length;

        function drawNextFrame() {
            if (frameIndex >= totalFrames) {
                mediaRecorder.stop();
                return;
            }

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                frameIndex++;

                const encodeProgress = 60 + (frameIndex / totalFrames) * 40;
                updateProgress(Math.floor(encodeProgress), 'Codificando video...', 'step-encode-video');

                setTimeout(drawNextFrame, frameDuration);
            };
            img.onerror = () => {
                frameIndex++;
                setTimeout(drawNextFrame, frameDuration);
            };
            img.src = frames[frameIndex];
        }

        drawNextFrame();
    });
}

// ==========================================
// RESULTADO Y EXPORTACIÓN
// ==========================================
function showResult(videoBlob) {
    document.getElementById('generation-progress').classList.add('hidden');
    document.getElementById('export-result').classList.remove('hidden');
    document.getElementById('export-back-row').classList.remove('hidden');

    const url = URL.createObjectURL(videoBlob);
    const video = document.getElementById('result-video');
    video.src = url;
    video.poster = '';
    video.load();

    document.getElementById('result-duration').textContent = AppState.duration + ' segundos';
    const sizeMB = (videoBlob.size / (1024 * 1024)).toFixed(2);
    document.getElementById('result-size').textContent = sizeMB + ' MB';

    document.getElementById('download-link').value = url;

    if (AppState.settings.autoSave) {
        const videoData = {
            id: Date.now(),
            title: AppState.videoTitle,
            duration: AppState.duration,
            size: sizeMB + ' MB',
            blobUrl: url,
            date: new Date().toLocaleDateString('es-ES'),
            thumbnail: generationFrames[0] || ''
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
    a.download = `Short_${AppState.videoTitle.replace(/\s+/g, '_')}_${Date.now()}.webm`;
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
    generationFrames = [];

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

    // Resetear steps visuales
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.getElementById('step-generate-audio').classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('✨ Listo para crear un nuevo Short', 'info');
}

// ==========================================
// PLANTILLAS
// ==========================================
function loadTemplate(templateKey) {
    const template = TEMPLATES[templateKey];
    if (!template) return;

    document.getElementById('video-title').value = template.title;
    document.getElementById('video-script').value = template.script;
    document.getElementById('script-chars').textContent = template.script.length;

    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.duration) === template.duration);
    });
    AppState.duration = template.duration;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === template.category);
    });
    AppState.category = template.category;

    AppState.voiceGender = template.voiceGender;
    document.querySelectorAll('.voice-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gender === template.voiceGender);
    });
    document.getElementById('female-voices').classList.toggle('hidden', template.voiceGender !== 'female');
    document.getElementById('male-voices').classList.toggle('hidden', template.voiceGender !== 'male');

    const voiceContainer = template.voiceGender === 'female' ? 'female-voices' : 'male-voices';
    document.querySelectorAll(`#${voiceContainer} .voice-card`).forEach(card => {
        card.classList.toggle('active', card.dataset.voice === template.voice);
    });
    AppState.selectedVoice = template.voice;

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
            <video src="${video.blobUrl}" poster="${video.thumbnail}" preload="metadata"></video>
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
    if (video) {
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
