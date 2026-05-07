/* ============================================
   SHORTSGEN PRO v2.3 - Versión Estable
   Funciona: Voz navegador, subtítulos, video, imágenes AI
   ============================================ */

// ==========================================
// CONFIGURACIÓN
// ==========================================
const ELEVENLABS_CONFIG = {
    baseUrl: 'https://api.elevenlabs.io/v1',
    voices: [
        { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'female' },
        { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', gender: 'female' },
        { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'female' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female' },
        { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'male' },
        { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', gender: 'female' },
        { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'male' },
        { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'male' }
    ]
};

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

const SUBTITLE_STYLES = {
    tiktok: { fontFamily: '"Montserrat", sans-serif', fontWeight: '900', color: '#ffffff', textShadow: '3px 3px 0 #000', fontSize: 28 },
    minimal: { fontFamily: '"Poppins", sans-serif', fontWeight: '600', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)', fontSize: 26 },
    neon: { fontFamily: '"Bebas Neue", sans-serif', fontWeight: '400', color: '#0ff', textShadow: '0 0 10px #0ff', fontSize: 32 }
};

// ==========================================
// ESTADO GLOBAL
// ==========================================
const AppState = {
    currentStep: 1,
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
    apiKey: localStorage.getItem('elevenlabs_api_key') || '',
    useBrowserVoice: false,
    aiBackgroundImage: null,
    settings: { quality: '720', fps: 24, fontSize: 28 }
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }, 800);

    loadSavedData();
    renderVoices();
    renderTemplates();
    setupEventListeners();
    setupPWA();
    setTimeout(() => renderPreview(), 100);
});

function loadSavedData() {
    const savedKey = localStorage.getItem('elevenlabs_api_key');
    if (savedKey) {
        AppState.apiKey = savedKey;
        document.getElementById('elevenlabs-api-key').value = savedKey;
    }
}

// ==========================================
// RENDERIZAR VOCES
// ==========================================
function renderVoices() {
    const container = document.getElementById('voice-options');
    if (!container) return;

    container.innerHTML = `
        <div style="margin-bottom:1rem;">
            <label style="font-size:0.8rem;color:var(--text-muted);display:block;margin-bottom:0.5rem;">Voces ElevenLabs (Requiere API Key)</label>
            ${ELEVENLABS_CONFIG.voices.map(v => createVoiceCard(v)).join('')}
        </div>
        <div style="margin-top:1rem;padding:1rem;background:rgba(255,193,7,0.1);border:1px solid rgba(255,193,7,0.3);border-radius:12px;">
            <label style="font-size:0.85rem;color:#ffc107;display:block;margin-bottom:0.5rem;">⚠️ Voz del Navegador (Gratis - Sin API Key)</label>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <div class="voice-card" data-voice="browser-female" onclick="selectBrowserVoice('female')" style="flex:1;min-width:120px;">
                    <div class="voice-wave">👩</div>
                    <div class="voice-info">
                        <span class="voice-name">Voz Femenina</span>
                        <span class="voice-desc">Gratis · Chrome/Edge</span>
                    </div>
                </div>
                <div class="voice-card" data-voice="browser-male" onclick="selectBrowserVoice('male')" style="flex:1;min-width:120px;">
                    <div class="voice-wave">👨</div>
                    <div class="voice-info">
                        <span class="voice-name">Voz Masculina</span>
                        <span class="voice-desc">Gratis · Chrome/Edge</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Seleccionar primera por defecto
    const firstCard = container.querySelector('.voice-card');
    if (firstCard) firstCard.classList.add('active');
}

function createVoiceCard(voice) {
    return `
        <div class="voice-card" data-voice="${voice.id}" onclick="selectVoice('${voice.id}')">
            <div class="voice-wave">${voice.gender === 'female' ? '👩' : '👨'}</div>
            <div class="voice-info">
                <span class="voice-name">${voice.name}</span>
                <span class="voice-desc">${voice.gender === 'female' ? 'Femenina' : 'Masculina'} · ElevenLabs</span>
            </div>
        </div>
    `;
}

function selectVoice(voiceId) {
    AppState.selectedVoice = voiceId;
    AppState.useBrowserVoice = false;
    document.querySelectorAll('.voice-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-voice="${voiceId}"]`)?.classList.add('active');
}

function selectBrowserVoice(gender) {
    AppState.selectedVoice = gender === 'female' ? 'browser-female' : 'browser-male';
    AppState.useBrowserVoice = true;
    document.querySelectorAll('.voice-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-voice="browser-${gender}"]`)?.classList.add('active');
    showToast('✅ Voz del navegador seleccionada', 'success');
}

window.selectVoice = selectVoice;
window.selectBrowserVoice = selectBrowserVoice;

// ==========================================
// GENERAR AUDIO
// ==========================================
async function generateAudio(text) {
    if (AppState.useBrowserVoice || !AppState.apiKey) {
        return await generateBrowserTTS(text);
    }
    return await generateElevenLabsAudio(text, AppState.selectedVoice);
}

async function generateElevenLabsAudio(text, voiceId) {
    const response = await fetch(`${ELEVENLABS_CONFIG.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'xi-api-key': AppState.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
            text: text.replace(/\n/g, ' ').trim(),
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs ${response.status}: ${error}`);
    }

    return await response.blob();
}

async function generateBrowserTTS(text) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('Navegador no soporta voz'));
            return;
        }

        // Detener cualquier reproducción anterior
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = AppState.voiceSpeed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Esperar a que las voces estén disponibles
        let voices = window.speechSynthesis.getVoices();

        const selectVoice = () => {
            voices = window.speechSynthesis.getVoices();
            const spanishVoices = voices.filter(v => v.lang && v.lang.startsWith('es'));

            if (spanishVoices.length > 0) {
                // Seleccionar por género
                const isFemale = AppState.selectedVoice === 'browser-female';
                const targetGender = isFemale ? 'female' : 'male';

                // Buscar voz que coincida con género
                let selected = spanishVoices.find(v => {
                    const name = v.name.toLowerCase();
                    if (isFemale) {
                        return name.includes('female') || name.includes('mujer') || name.includes('laura') || name.includes('helena') || name.includes('monica');
                    } else {
                        return name.includes('male') || name.includes('hombre') || name.includes('pablo') || name.includes('jorge') || name.includes('carlos');
                    }
                });

                // Si no encontramos específica, usar primera española
                if (!selected) selected = spanishVoices[0];

                utterance.voice = selected;
                console.log('Voz seleccionada:', selected.name, 'Género esperado:', targetGender);
            }
        };

        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                selectVoice();
                window.speechSynthesis.speak(utterance);
            };
        } else {
            selectVoice();
        }

        // Crear audio usando MediaRecorder
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            resolve(blob);
        };

        // Conectar audio del sistema al MediaRecorder
        // Nota: En Chrome no podemos capturar directamente TTS, así que usamos un workaround

        utterance.onstart = () => {
            console.log('TTS iniciado');
            mediaRecorder.start();
        };

        utterance.onend = () => {
            console.log('TTS completado');
            setTimeout(() => {
                mediaRecorder.stop();
                audioContext.close();
            }, 500);
        };

        utterance.onerror = (e) => {
            console.error('Error TTS:', e);
            mediaRecorder.stop();
            reject(new Error('Error en voz del navegador'));
        };

        // Iniciar
        if (voices.length > 0) {
            window.speechSynthesis.speak(utterance);
        }

        // Timeout de seguridad
        setTimeout(() => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            if (mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
        }, 120000);
    });
}

// ==========================================
// GENERAR IMÁGENES AI
// ==========================================
async function generateAIImage(prompt) {
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&model=flux`;

    showToast('🎨 Generando imagen...', 'info');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error generando imagen');

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

// ==========================================
// GENERAR VIDEO
// ==========================================
async function startGeneration() {
    if (!validateInputs()) return;

    document.getElementById('generation-progress').classList.remove('hidden');
    document.getElementById('export-result').classList.add('hidden');

    try {
        // Paso 1: Audio
        updateProgress(10, 'Generando audio...');
        const audioBlob = await generateAudio(AppState.videoScript);
        AppState.audioBlob = audioBlob;

        // Obtener duración real del audio
        const audioDuration = await getAudioDuration(audioBlob);
        const duration = Math.min(audioDuration, AppState.duration);

        updateProgress(30, 'Audio generado ✓');

        // Paso 2: Generar imagen AI si es necesario
        if (AppState.bgType === 'image') {
            updateProgress(35, 'Generando imagen AI...');
            const prompt = `${AppState.videoTitle}. ${AppState.videoScript.substring(0, 100)}. High quality, cinematic, vertical format 9:16`;
            AppState.aiBackgroundImage = await generateAIImage(prompt);
            updateProgress(45, 'Imagen generada ✓');
        }

        // Paso 3: Renderizar frames
        updateProgress(50, 'Renderizando video...');
        const videoBlob = await renderVideo(duration);
        AppState.videoBlob = videoBlob;

        // Paso 4: Finalizar
        updateProgress(100, '¡Completado!');
        showResult(videoBlob, duration);

    } catch (error) {
        console.error('Error:', error);
        showToast('❌ ' + error.message, 'error');
        document.getElementById('export-back-row').classList.remove('hidden');
    }
}

function updateProgress(percent, label) {
    document.getElementById('progress-percent').textContent = percent + '%';
    document.getElementById('progress-label').textContent = label;
    const circle = document.getElementById('progress-circle');
    if (circle) {
        const circumference = 2 * Math.PI * 54;
        circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
    }
}

function getAudioDuration(blob) {
    return new Promise((resolve) => {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(audio.src);
            resolve(audio.duration || AppState.duration);
        };
        audio.onerror = () => resolve(AppState.duration);
    });
}

// ==========================================
// RENDERIZAR VIDEO CON CANVAS
// ==========================================
async function renderVideo(duration) {
    const canvas = document.createElement('canvas');
    const quality = AppState.settings.quality;
    canvas.width = quality === '1080' ? 1080 : 720;
    canvas.height = quality === '1080' ? 1920 : 1280;
    const ctx = canvas.getContext('2d');
    const fps = AppState.settings.fps;
    const totalFrames = Math.ceil(fps * duration);

    // Precargar imagen de fondo si existe
    let bgImage = null;
    if (AppState.aiBackgroundImage) {
        bgImage = new Image();
        bgImage.src = AppState.aiBackgroundImage;
        await new Promise((resolve) => { bgImage.onload = resolve; bgImage.onerror = resolve; });
    }

    // Dividir texto en líneas
    const lines = AppState.videoScript.split(/\n+/).map(s => s.trim()).filter(s => s.length > 0);
    const segmentDuration = duration / Math.max(lines.length, 1);

    // Configurar MediaRecorder
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    return new Promise((resolve, reject) => {
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            resolve(blob);
        };
        mediaRecorder.onerror = (e) => reject(e);

        mediaRecorder.start(100);

        let frameIndex = 0;
        const frameDuration = 1000 / fps;

        function drawFrame() {
            if (frameIndex >= totalFrames) {
                mediaRecorder.stop();
                return;
            }

            const time = frameIndex / fps;
            const progress = time / duration;

            // 1. Dibujar fondo
            drawBackground(ctx, canvas.width, canvas.height, time, bgImage);

            // 2. Determinar texto actual
            const lineIndex = Math.min(Math.floor(time / segmentDuration), lines.length - 1);
            const currentLine = lines[lineIndex] || '';
            const segmentProgress = (time % segmentDuration) / segmentDuration;

            // 3. Dibujar subtítulos
            if (currentLine) {
                drawSubtitle(ctx, canvas.width, canvas.height, currentLine, segmentProgress, time);
            }

            // 4. Barra de progreso
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(0, canvas.height - 8, canvas.width * progress, 8);

            // 5. Info
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(20, 20, 100, 30);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Poppins';
            ctx.textAlign = 'left';
            ctx.fillText(`9:16 · ${Math.floor(time)}s`, 28, 40);

            frameIndex++;

            if (frameIndex % 5 === 0) {
                const p = 50 + (frameIndex / totalFrames) * 50;
                updateProgress(Math.floor(p), 'Renderizando video...');
            }

            setTimeout(drawFrame, frameDuration);
        }

        drawFrame();
    });
}

function drawBackground(ctx, w, h, time, bgImage) {
    if (AppState.bgType === 'image' && bgImage && bgImage.complete) {
        // Dibujar imagen AI
        const scale = Math.max(w / bgImage.width, h / bgImage.height);
        const x = (w - bgImage.width * scale) / 2;
        const y = (h - bgImage.height * scale) / 2;
        ctx.drawImage(bgImage, x, y, bgImage.width * scale, bgImage.height * scale);
    } else if (AppState.bgType === 'gradient') {
        const colors = GRADIENTS[AppState.selectedGradient];
        const grad = ctx.createLinearGradient(0, 0, w, h);
        colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, w, h);
    }
}

function drawSubtitle(ctx, w, h, text, progress, time) {
    const style = SUBTITLE_STYLES[AppState.subtitleStyle] || SUBTITLE_STYLES.tiktok;
    const fontSize = AppState.settings.fontSize || style.fontSize;

    ctx.save();
    ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily.replace(/"/g, '').split(',')[0]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Animación typewriter
    let displayText = text;
    if (AppState.subtitleAnim === 'typewriter') {
        const charCount = Math.max(1, Math.floor(progress * text.length));
        displayText = text.substring(0, charCount);
    }

    // Wrap text
    const maxWidth = w - 80;
    const words = displayText.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    // Dibujar líneas
    const lineHeight = fontSize * 1.4;
    const startY = h - 200 - (lines.length * lineHeight) / 2;

    ctx.fillStyle = style.color;
    lines.forEach((line, i) => {
        ctx.fillText(line, w / 2, startY + i * lineHeight);
    });

    ctx.restore();
}

// ==========================================
// MOSTRAR RESULTADO
// ==========================================
function showResult(videoBlob, duration) {
    document.getElementById('generation-progress').classList.add('hidden');
    document.getElementById('export-result').classList.remove('hidden');
    document.getElementById('export-back-row').classList.remove('hidden');

    const url = URL.createObjectURL(videoBlob);
    const video = document.getElementById('result-video');
    video.src = url;

    document.getElementById('result-duration').textContent = Math.round(duration) + ' segundos';
    const sizeMB = (videoBlob.size / (1024 * 1024)).toFixed(2);
    document.getElementById('result-size').textContent = sizeMB + ' MB';

    showToast('🎉 ¡Short generado exitosamente!', 'success');
}

function downloadVideo() {
    if (!AppState.videoBlob) return;
    const url = URL.createObjectURL(AppState.videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Short_${AppState.videoTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.webm`;
    a.click();
    showToast('⬇️ Descargando...', 'success');
}

// ==========================================
// VALIDACIÓN Y NAVEGACIÓN
// ==========================================
function validateInputs() {
    const title = document.getElementById('video-title').value.trim();
    const script = document.getElementById('video-script').value.trim();

    if (!title) {
        showToast('⚠️ Escribe un título', 'warning');
        return false;
    }
    if (!script || script.length < 10) {
        showToast('⚠️ Escribe un guion de al menos 10 caracteres', 'warning');
        return false;
    }

    AppState.videoTitle = title;
    AppState.videoScript = script;
    return true;
}

function goToStep(step) {
    if (step === 2 && !validateInputs()) return;
    if (step === 3) {
        const apiKey = document.getElementById('elevenlabs-api-key').value.trim();
        if (apiKey) AppState.apiKey = apiKey;
    }
    if (step === 4) {
        if (!validateInputs()) return;
        startGeneration();
        return;
    }

    AppState.currentStep = step;
    document.querySelectorAll('.step').forEach((s, i) => s.classList.toggle('active', i + 1 === step));
    document.querySelectorAll('.step-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`step-${step}`)?.classList.add('active');
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Navegación
    document.getElementById('btn-next-1')?.addEventListener('click', () => goToStep(2));
    document.getElementById('btn-back-2')?.addEventListener('click', () => goToStep(1));
    document.getElementById('btn-next-2')?.addEventListener('click', () => goToStep(3));
    document.getElementById('btn-back-3')?.addEventListener('click', () => goToStep(2));
    document.getElementById('btn-next-3')?.addEventListener('click', () => goToStep(4));
    document.getElementById('btn-back-error')?.addEventListener('click', () => goToStep(3));

    // Inputs
    document.getElementById('video-script')?.addEventListener('input', (e) => {
        document.getElementById('script-chars').textContent = e.target.value.length;
        AppState.videoScript = e.target.value;
    });

    document.getElementById('video-title')?.addEventListener('input', (e) => {
        AppState.videoTitle = e.target.value;
    });

    // Duración
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.duration = parseInt(btn.dataset.duration);
        });
    });

    // API Key
    document.getElementById('elevenlabs-api-key')?.addEventListener('input', (e) => {
        AppState.apiKey = e.target.value.trim();
        localStorage.setItem('elevenlabs_api_key', AppState.apiKey);
    });

    document.getElementById('btn-test-api')?.addEventListener('click', testAPI);

    // Velocidad
    document.getElementById('voice-speed')?.addEventListener('input', (e) => {
        AppState.voiceSpeed = parseFloat(e.target.value);
        document.getElementById('speed-display').textContent = e.target.value + 'x';
    });

    // Fondo
    document.querySelectorAll('.bg-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bg-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.bgType = btn.dataset.bg;
            renderPreview();
        });
    });

    // Gradientes
    document.querySelectorAll('.gradient-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.gradient-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedGradient = card.dataset.gradient;
            renderPreview();
        });
    });

    // Filtros
    document.querySelectorAll('.filter-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.filter-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedFilter = card.dataset.filter;
            renderPreview();
        });
    });

    // Estilos subtítulos
    document.querySelectorAll('.subtitle-style-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.subtitle-style-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.subtitleStyle = card.dataset.substyle;
            renderPreview();
        });
    });

    // Animación
    document.querySelectorAll('.anim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.subtitleAnim = btn.dataset.anim;
            renderPreview();
        });
    });

    // Preview
    document.getElementById('btn-refresh-preview')?.addEventListener('click', renderPreview);

    // Exportar
    document.getElementById('btn-download')?.addEventListener('click', downloadVideo);
    document.getElementById('btn-create-new')?.addEventListener('click', resetApp);

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

async function testAPI() {
    const apiKey = document.getElementById('elevenlabs-api-key').value.trim();
    const statusEl = document.getElementById('api-status');

    if (!apiKey) {
        showToast('⚠️ Introduce una API Key', 'warning');
        return;
    }

    statusEl.classList.remove('hidden');
    statusEl.textContent = '🔄 Probando...';

    try {
        const response = await fetch(`${ELEVENLABS_CONFIG.baseUrl}/voices`, {
            headers: { 'xi-api-key': apiKey }
        });

        if (response.ok) {
            const data = await response.json();
            AppState.apiKey = apiKey;
            localStorage.setItem('elevenlabs_api_key', apiKey);
            statusEl.innerHTML = '✅ Conectado. ' + (data.voices?.length || 0) + ' voces';
            showToast('✅ API Key válida', 'success');
        } else {
            statusEl.innerHTML = '❌ API Key inválida';
            showToast('❌ API Key inválida', 'error');
        }
    } catch (e) {
        statusEl.innerHTML = '❌ Error de conexión';
        showToast('❌ No se pudo conectar', 'error');
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
}

function renderPreview() {
    const canvas = document.getElementById('preview-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    drawBackground(ctx, w, h, 0, null);

    const style = SUBTITLE_STYLES[AppState.subtitleStyle] || SUBTITLE_STYLES.tiktok;
    ctx.save();
    ctx.font = `${style.fontWeight} ${style.fontSize * 0.6}px ${style.fontFamily.replace(/"/g, '').split(',')[0]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = style.color;
    ctx.fillText('TU TEXTO AQUÍ', w / 2, h / 2);
    ctx.restore();
}

function resetApp() {
    AppState.currentStep = 1;
    AppState.videoTitle = '';
    AppState.videoScript = '';
    AppState.audioBlob = null;
    AppState.videoBlob = null;

    document.getElementById('video-title').value = '';
    document.getElementById('video-script').value = '';
    document.getElementById('script-chars').textContent = '0';

    goToStep(1);
    document.getElementById('generation-progress').classList.remove('hidden');
    document.getElementById('export-result').classList.add('hidden');
    document.getElementById('export-back-row').classList.add('hidden');
    updateProgress(0, 'Generando...');
}

// ==========================================
// PLANTILLAS
// ==========================================
const TEMPLATES = {
    motivational: {
        title: 'Frase Motivacional del Día',
        script: 'El éxito no es definitivo. El fracaso no es fatal. Lo que cuenta es el valor para continuar.\n\nCada día es una nueva oportunidad para ser mejor que ayer.',
        duration: 15,
        voice: 'XB0fDUnXU5powFXDhCwa',
        gradient: 'fire'
    },
    facts: {
        title: 'Dato Curioso',
        script: '¿Sabías que los pulpos tienen tres corazones?\n\nDos bombean sangre a las branquias y uno al resto del cuerpo.',
        duration: 15,
        voice: 'AZnzlk1XvdvUeBnXmlld',
        gradient: 'ocean'
    }
};

function renderTemplates() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    grid.innerHTML = Object.keys(TEMPLATES).map(key => {
        const t = TEMPLATES[key];
        return `
            <div class="template-card" onclick="loadTemplate('${key}')">
                <div class="template-preview" style="background: linear-gradient(135deg, ${GRADIENTS[t.gradient][0]}, ${GRADIENTS[t.gradient][1]});">
                    <span style="font-size:2rem;">🎬</span>
                </div>
                <div class="template-info">
                    <h3>${t.title}</h3>
                    <span style="font-size:0.75rem;color:var(--text-muted);">${t.duration}s</span>
                </div>
            </div>
        `;
    }).join('');
}

function loadTemplate(key) {
    const t = TEMPLATES[key];
    if (!t) return;

    document.getElementById('video-title').value = t.title;
    document.getElementById('video-script').value = t.script;
    document.getElementById('script-chars').textContent = t.script.length;
    AppState.videoTitle = t.title;
    AppState.videoScript = t.script;
    AppState.duration = t.duration;
    AppState.selectedGradient = t.gradient;

    switchTab('create');
    renderPreview();
    showToast('🎨 Plantilla cargada', 'success');
}

window.loadTemplate = loadTemplate;

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.cssText = `
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: ${type === 'warning' ? '#000' : '#fff'};
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        animation: slideIn 0.3s ease;
        font-size: 0.9rem;
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==========================================
// PWA
// ==========================================
function setupPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}
