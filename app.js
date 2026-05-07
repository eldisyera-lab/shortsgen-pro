/* ============================================
   SHORTSGEN PRO v3.1 - Cuba/VPN Edition
   Pollinations.ai para imágenes AI (GRATIS)
   Web Speech API para voz (gratis)
   ============================================ */

// ==========================================
// ESTADO GLOBAL
// ==========================================
const AppState = {
    currentStep: 1,
    videoTitle: '',
    videoScript: '',
    duration: 15,
    category: 'general',
    selectedVoice: 'browser-female',
    voiceSpeed: 1.0,
    bgType: 'gradient',
    selectedGradient: 'sunset',
    selectedFilter: 'none',
    subtitleStyle: 'tiktok',
    subtitleAnim: 'typewriter',
    audioBlob: null,
    videoBlob: null,
    aiImageUrl: null,
    settings: { quality: '720', fps: 24, fontSize: 28 }
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
    tiktok: { fontFamily: '"Montserrat", sans-serif', fontWeight: '900', color: '#ffffff', textShadow: '3px 3px 0 #000000', fontSize: 28 },
    minimal: { fontFamily: '"Poppins", sans-serif', fontWeight: '600', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)', fontSize: 26 },
    neon: { fontFamily: '"Bebas Neue", sans-serif', fontWeight: '400', color: '#0ff', textShadow: '0 0 10px #0ff, 0 0 20px #0ff', fontSize: 32 }
};

// Cache de imágenes para no regenerar
const imageCache = new Map();
let aiImageFailed = false;

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const app = document.getElementById('app');
        if (splash) splash.classList.add('hidden');
        if (app) app.classList.remove('hidden');
    }, 800);

    renderVoices();
    renderTemplates();
    setupEventListeners();
    renderPreview();
});

// ==========================================
// VOCES
// ==========================================
function renderVoices() {
    const container = document.getElementById('voice-options');
    if (!container) return;

    container.innerHTML = `
        <div style="margin-bottom:1rem;">
            <label style="font-size:0.8rem;color:var(--text-muted);display:block;margin-bottom:0.5rem;">🎙️ Voces del Navegador (Gratis - Funciona en Cuba)</label>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <div class="voice-card active" data-voice="browser-female" onclick="selectVoice('browser-female')" style="flex:1;min-width:120px;cursor:pointer;">
                    <div class="voice-wave">👩</div>
                    <div class="voice-info">
                        <span class="voice-name">Mujer</span>
                        <span class="voice-desc">Español · Gratis</span>
                    </div>
                </div>
                <div class="voice-card" data-voice="browser-male" onclick="selectVoice('browser-male')" style="flex:1;min-width:120px;cursor:pointer;">
                    <div class="voice-wave">👨</div>
                    <div class="voice-info">
                        <span class="voice-name">Hombre</span>
                        <span class="voice-desc">Español · Gratis</span>
                    </div>
                </div>
            </div>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.5rem;">
                Usa las voces de tu sistema. Chrome/Edge tienen las mejores voces en español.
            </p>
        </div>
    `;
}

function selectVoice(voiceId) {
    AppState.selectedVoice = voiceId;
    document.querySelectorAll('.voice-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-voice="${voiceId}"]`)?.classList.add('active');

    const testText = voiceId === 'browser-female' ? 'Hola, soy la voz femenina.' : 'Hola, soy la voz masculina.';
    speakText(testText, true);
}

window.selectVoice = selectVoice;

// ==========================================
// SÍNTESIS DE VOZ (Web Speech API)
// ==========================================
function speakText(text, isPreview = false) {
    if (!('speechSynthesis' in window)) {
        showToast('❌ Tu navegador no soporta voz', 'error');
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = AppState.voiceSpeed || 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const spanishVoices = voices.filter(v => v.lang && (v.lang.startsWith('es') || v.lang.startsWith('es-')));

    if (spanishVoices.length > 0) {
        const isFemale = AppState.selectedVoice === 'browser-female';
        let selectedVoice = null;

        for (const voice of spanishVoices) {
            const name = voice.name.toLowerCase();
            if (isFemale) {
                if (name.includes('female') || name.includes('mujer') || name.includes('español') || 
                    name.includes('laura') || name.includes('helena') || name.includes('monica') ||
                    name.includes('sofia') || name.includes('isabela') || name.includes('camila')) {
                    selectedVoice = voice;
                    break;
                }
            } else {
                if (name.includes('male') || name.includes('hombre') || name.includes('español') ||
                    name.includes('pablo') || name.includes('jorge') || name.includes('diego') ||
                    name.includes('carlos') || name.includes('juan') || name.includes('mateo')) {
                    selectedVoice = voice;
                    break;
                }
            }
        }

        if (!selectedVoice) selectedVoice = spanishVoices[0];
        utterance.voice = selectedVoice;
    }

    if (isPreview) {
        utterance.onstart = () => showToast('🔊 Reproduciendo voz...', 'info');
        utterance.onend = () => showToast('✅ Voz lista', 'success');
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
}

// ==========================================
// GENERAR VIDEO COMPLETO
// ==========================================
async function startGeneration() {
    if (!validateInputs()) return;

    const progressEl = document.getElementById('generation-progress');
    const resultEl = document.getElementById('export-result');

    progressEl.classList.remove('hidden');
    resultEl.classList.add('hidden');

    try {
        // PASO 1: Generar imagen AI con Pollinations (GRATIS) o fallback a gradiente
        if (AppState.bgType === 'image' && !aiImageFailed) {
            updateProgress(5, '🎨 Generando imagen con IA (gratis)...');
            const success = await generatePollinationsImage();
            if (success) {
                updateProgress(20, '✅ Imagen generada');
            } else {
                updateProgress(20, '⚠️ Usando gradiente (IA no disponible)');
            }
        } else {
            updateProgress(20, '🎨 Usando fondo ' + AppState.bgType);
        }

        // PASO 2: Generar audio con Web Speech API
        updateProgress(30, '🎙️ Generando audio...');
        const estimatedDuration = Math.max(AppState.duration, estimateSpeechDuration(AppState.videoScript));
        updateProgress(40, '✅ Audio estimado: ' + Math.round(estimatedDuration) + 's');

        // PASO 3: Renderizar video frame por frame
        updateProgress(50, '🎬 Renderizando video...');
        const videoBlob = await renderVideoFrames(estimatedDuration);

        updateProgress(100, '✅ ¡Video completado!');
        showResult(videoBlob, estimatedDuration);

    } catch (error) {
        console.error('Error generando video:', error);
        showToast('❌ Error: ' + error.message, 'error');
        document.getElementById('export-back-row').classList.remove('hidden');
    }
}

function estimateSpeechDuration(text) {
    const charCount = text.replace(/\s+/g, '').length;
    return Math.max(5, Math.ceil(charCount / 15));
}

// ==========================================
// GENERAR IMAGEN CON POLLINATIONS.AI (GRATIS)
// ==========================================
async function generatePollinationsImage() {
    try {
        const cacheKey = AppState.videoTitle + '_' + AppState.videoScript.substring(0, 50);
        
        // Verificar cache
        if (imageCache.has(cacheKey)) {
            AppState.aiImageUrl = imageCache.get(cacheKey);
            showToast('♻️ Imagen recuperada del cache', 'info');
            return true;
        }

        showToast('🎨 Generando imagen gratuita...', 'info');

        // Prompt optimizado para Pollinations.ai
        const prompt = encodeURIComponent(
            `${AppState.videoTitle}. ${AppState.videoScript.substring(0, 200)}. ` +
            `High quality, cinematic lighting, vertical format 9:16, professional photography, vibrant colors`
        );

        // Pollinations.ai es GRATIS y no requiere API key
        const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=720&height=1280&nologo=true&seed=${Date.now()}&enhance=true`;

        // Precargar imagen para verificar que carga
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
            // Timeout de 15 segundos
            setTimeout(() => reject(new Error('Timeout')), 15000);
        });

        // Convertir a data URL para uso offline
        const canvas = document.createElement('canvas');
        canvas.width = 720;
        canvas.height = 1280;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 720, 1280);
        
        AppState.aiImageUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        // Guardar en cache
        imageCache.set(cacheKey, AppState.aiImageUrl);
        
        // Limitar cache a 10 imágenes
        if (imageCache.size > 10) {
            const firstKey = imageCache.keys().next().value;
            imageCache.delete(firstKey);
        }

        showToast('✅ Imagen generada (gratis)', 'success');
        return true;

    } catch (error) {
        console.error('Error generando imagen:', error);
        aiImageFailed = true;
        AppState.bgType = 'gradient';
        showToast('⚠️ Error con imágenes AI, usando gradiente', 'warning');
        return false;
    }
}

// ==========================================
// RENDERIZAR VIDEO FRAME POR FRAME
// ==========================================
async function renderVideoFrames(duration) {
    const canvas = document.createElement('canvas');
    const w = 720;
    const h = 1280;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const fps = 24;
    const totalFrames = Math.ceil(duration * fps);
    const frameDuration = 1000 / fps;

    // Precargar imagen de fondo si existe
    let bgImage = null;
    if (AppState.aiImageUrl) {
        bgImage = new Image();
        bgImage.src = AppState.aiImageUrl;
        await new Promise(resolve => { bgImage.onload = resolve; bgImage.onerror = resolve; });
    }

    // Dividir texto en segmentos
    const lines = AppState.videoScript.split(/\n+/).map(s => s.trim()).filter(s => s.length > 0);
    const segmentDuration = duration / Math.max(lines.length, 1);

    // Configurar MediaRecorder
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000
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
        mediaRecorder.onerror = reject;

        mediaRecorder.start(100);

        let frameIndex = 0;

        function drawNextFrame() {
            if (frameIndex >= totalFrames) {
                mediaRecorder.stop();
                return;
            }

            const time = frameIndex / fps;
            const progress = time / duration;

            // 1. Fondo
            drawBackground(ctx, w, h, bgImage);

            // 2. Determinar texto actual
            const lineIndex = Math.min(Math.floor(time / segmentDuration), lines.length - 1);
            const currentLine = lines[lineIndex] || '';
            const segmentProgress = (time % segmentDuration) / segmentDuration;

            // 3. Subtítulos
            if (currentLine) {
                drawSubtitle(ctx, w, h, currentLine, segmentProgress);
            }

            // 4. Barra de progreso
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillRect(20, h - 20, (w - 40) * progress, 6);

            // 5. Info
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(20, 20, 120, 30);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Poppins';
            ctx.textAlign = 'left';
            ctx.fillText(`9:16 · ${Math.floor(time)}s`, 28, 40);

            frameIndex++;

            // Actualizar progreso cada 10 frames
            if (frameIndex % 10 === 0) {
                const p = 50 + (frameIndex / totalFrames) * 50;
                updateProgress(Math.floor(p), `Renderizando... ${Math.floor(p)}%`);
            }

            setTimeout(drawNextFrame, frameDuration);
        }

        drawNextFrame();
    });
}

function drawBackground(ctx, w, h, bgImage) {
    if (AppState.bgType === 'image' && bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
        const scale = Math.max(w / bgImage.width, h / bgImage.height);
        const x = (w - bgImage.width * scale) / 2;
        const y = (h - bgImage.height * scale) / 2;
        ctx.drawImage(bgImage, x, y, bgImage.width * scale, bgImage.height * scale);
    } else {
        const colors = GRADIENTS[AppState.selectedGradient] || GRADIENTS.sunset;
        const grad = ctx.createLinearGradient(0, 0, w, h);
        colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }
}

function drawSubtitle(ctx, w, h, text, progress) {
    const style = SUBTITLE_STYLES[AppState.subtitleStyle] || SUBTITLE_STYLES.tiktok;
    const fontSize = AppState.settings.fontSize || style.fontSize;

    ctx.save();
    ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily.replace(/"/g, '').split(',')[0]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    let displayText = text;
    if (AppState.subtitleAnim === 'typewriter') {
        const charCount = Math.max(1, Math.floor(progress * text.length));
        displayText = text.substring(0, charCount);
    }

    const maxWidth = w - 60;
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

    const lineHeight = fontSize * 1.5;
    const startY = h - 250 - (lines.length * lineHeight) / 2;

    ctx.fillStyle = style.color;
    lines.forEach((line, i) => {
        ctx.fillText(line, w / 2, startY + i * lineHeight);
    });

    ctx.restore();
}

// ==========================================
// MOSTRAR RESULTADO Y DESCARGA
// ==========================================
function showResult(videoBlob, duration) {
    AppState.videoBlob = videoBlob;
    
    document.getElementById('generation-progress').classList.add('hidden');
    document.getElementById('export-result').classList.remove('hidden');
    document.getElementById('export-back-row').classList.remove('hidden');

    const url = URL.createObjectURL(videoBlob);
    const video = document.getElementById('result-video');
    video.src = url;

    document.getElementById('result-duration').textContent = Math.round(duration) + ' segundos';
    const sizeMB = (videoBlob.size / (1024 * 1024)).toFixed(2);
    document.getElementById('result-size').textContent = sizeMB + ' MB';

    const downloadLink = document.getElementById('download-link');
    if (downloadLink) {
        downloadLink.value = url;
    }

    showToast('🎉 ¡Short generado! Reproduce y descarga', 'success');
}

function downloadVideo() {
    if (!AppState.videoBlob) {
        showToast('❌ No hay video para descargar', 'error');
        return;
    }

    const url = URL.createObjectURL(AppState.videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Short_${AppState.videoTitle.replace(/[^a-z0-9áéíóúñü]/gi, '_').substring(0, 30)}_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('⬇️ Descarga iniciada', 'success');
}

function copyDownloadLink() {
    const linkInput = document.getElementById('download-link');
    if (linkInput) {
        linkInput.select();
        navigator.clipboard.writeText(linkInput.value).then(() => {
            showToast('📋 Link copiado', 'success');
        }).catch(() => {
            showToast('❌ No se pudo copiar', 'error');
        });
    }
}

// ==========================================
// VALIDACIÓN Y NAVEGACIÓN
// ==========================================
function validateInputs() {
    const title = document.getElementById('video-title')?.value.trim();
    const script = document.getElementById('video-script')?.value.trim();

    if (!title) {
        showToast('⚠️ Escribe un título', 'warning');
        return false;
    }
    if (!script || script.length < 5) {
        showToast('⚠️ Escribe un guion de al menos 5 caracteres', 'warning');
        return false;
    }

    AppState.videoTitle = title;
    AppState.videoScript = script;
    return true;
}

function goToStep(step) {
    if (step === 2 && !validateInputs()) return;
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

function updateProgress(percent, label) {
    const percentEl = document.getElementById('progress-percent');
    const labelEl = document.getElementById('progress-label');
    const circle = document.getElementById('progress-circle');

    if (percentEl) percentEl.textContent = percent + '%';
    if (labelEl) labelEl.textContent = label;
    if (circle) {
        const circumference = 2 * Math.PI * 54;
        circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.getElementById('btn-next-1')?.addEventListener('click', () => goToStep(2));
    document.getElementById('btn-back-2')?.addEventListener('click', () => goToStep(1));
    document.getElementById('btn-next-2')?.addEventListener('click', () => goToStep(3));
    document.getElementById('btn-back-3')?.addEventListener('click', () => goToStep(2));
    document.getElementById('btn-next-3')?.addEventListener('click', () => goToStep(4));
    document.getElementById('btn-back-error')?.addEventListener('click', () => goToStep(3));

    document.getElementById('video-script')?.addEventListener('input', (e) => {
        const chars = document.getElementById('script-chars');
        if (chars) chars.textContent = e.target.value.length;
        AppState.videoScript = e.target.value;
    });

    document.getElementById('video-title')?.addEventListener('input', (e) => {
        AppState.videoTitle = e.target.value;
    });

    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.duration = parseInt(btn.dataset.duration);
        });
    });

    document.getElementById('voice-speed')?.addEventListener('input', (e) => {
        AppState.voiceSpeed = parseFloat(e.target.value);
        const display = document.getElementById('speed-display');
        if (display) display.textContent = e.target.value + 'x';
    });

    document.querySelectorAll('.bg-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bg-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.bgType = btn.dataset.bg;
            // Resetear flag de error si cambian a gradiente
            if (btn.dataset.bg !== 'image') {
                aiImageFailed = false;
            }
            renderPreview();
        });
    });

    document.querySelectorAll('.gradient-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.gradient-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedGradient = card.dataset.gradient;
            renderPreview();
        });
    });

    document.querySelectorAll('.subtitle-style-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.subtitle-style-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.subtitleStyle = card.dataset.substyle;
            renderPreview();
        });
    });

    document.getElementById('btn-refresh-preview')?.addEventListener('click', renderPreview);
    document.getElementById('btn-download')?.addEventListener('click', downloadVideo);
    document.getElementById('btn-copy-link')?.addEventListener('click', copyDownloadLink);
    document.getElementById('btn-create-new')?.addEventListener('click', resetApp);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
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
    drawBackground(ctx, w, h, null);

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
    AppState.aiImageUrl = null;
    aiImageFailed = false;

    const title = document.getElementById('video-title');
    const script = document.getElementById('video-script');
    if (title) title.value = '';
    if (script) script.value = '';

    const chars = document.getElementById('script-chars');
    if (chars) chars.textContent = '0';

    goToStep(1);
    document.getElementById('generation-progress')?.classList.remove('hidden');
    document.getElementById('export-result')?.classList.add('hidden');
    document.getElementById('export-back-row')?.classList.add('hidden');
    updateProgress(0, 'Generando...');
}

// ==========================================
// PLANTILLAS
// ==========================================
const TEMPLATES = {
    motivational: {
        title: 'Frase Motivacional del Día',
        script: 'El éxito no es definitivo. El fracaso no es fatal. Lo que cuenta es el valor para continuar. Cada día es una nueva oportunidad.',
        duration: 15,
        gradient: 'fire'
    },
    facts: {
        title: 'Dato Curioso',
        script: '¿Sabías que los pulpos tienen tres corazones? Dos bombean sangre a las branquias y uno al resto del cuerpo.',
        duration: 15,
        gradient: 'ocean'
    },
    recipe: {
        title: 'Receta Express',
        script: 'Hoy te enseño a hacer los tacos más jugosos. Calienta la tortilla, agrega carne sazonada, cebolla, cilantro y limón.',
        duration: 15,
        gradient: 'sunset'
    }
};

function renderTemplates() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    grid.innerHTML = Object.keys(TEMPLATES).map(key => {
        const t = TEMPLATES[key];
        return `
            <div class="template-card" onclick="loadTemplate('${key}')" style="cursor:pointer;">
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

    const title = document.getElementById('video-title');
    const script = document.getElementById('video-script');
    if (title) title.value = t.title;
    if (script) script.value = t.script;

    const chars = document.getElementById('script-chars');
    if (chars) chars.textContent = t.script.length;

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
    toast.style.cssText = `
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: ${type === 'warning' ? '#000' : '#fff'};
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
        z-index: 10000;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Exponer funciones necesarias
window.goToStep = goToStep;
window.downloadVideo = downloadVideo;
window.copyDownloadLink = copyDownloadLink;
window.resetApp = resetApp;
window.showHelp = function() {
    showToast('🎬 ShortsGen Pro v3.1 - Usa Pollinations.ai (gratis) para imágenes', 'info');
};
