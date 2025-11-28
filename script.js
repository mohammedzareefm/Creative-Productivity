// ===============================================
// ** 1. منطق التبديل بين الأدوات (Switching Logic) **
// ===============================================

function switchTool() {
    const selector = document.getElementById('toolSelector');
    const selectedToolId = selector.value;
    const toolContents = document.querySelectorAll('.tool-content');

    toolContents.forEach(tool => {
        // إخفاء جميع الأدوات
        tool.classList.remove('active');
    });

    // إظهار الأداة المختارة فقط
    const activeTool = document.getElementById(selectedToolId);
    if (activeTool) {
        activeTool.classList.add('active');
    }

    // تشغيل الدوال التلقائية عند التبديل (لضمان تحديث المعاينة)
    if (selectedToolId === 'logo-generator') {
        generateLogo();
    } else if (selectedToolId === 'reading-time-calc') {
        calculateReadingTime();
    } else if (selectedToolId === 'text-analyzer') {
        analyzeText();
    } else if (selectedToolId === 'qr-generator') {
        generateQrCode();
    }
}

// تشغيل دالة التبديل عند تحميل الصفحة لأول مرة (لإظهار الأداة الأولى)
document.addEventListener('DOMContentLoaded', switchTool);


// ===============================================
// ** 2. مُولِّد الشعارات (Logo Generator) **
// ===============================================

function generateLogo() {
    const textInput = document.getElementById('logoText').value || "شعارك هنا";
    const iconClass = document.getElementById('iconClass').value || "fa-rocket";
    const font = document.getElementById('fontSelector').value;
    const size = document.getElementById('fontSize').value + 'px';

    const logoSpan = document.getElementById('logoSpan');
    const logoIcon = document.getElementById('logoIcon');
    const logoPreview = document.getElementById('logoPreview');

    logoSpan.textContent = textInput;
    logoPreview.style.fontFamily = font;
    logoPreview.style.fontSize = size;
    
    // تحديث الأيقونة
    logoIcon.className = `fas ${iconClass}`; 
}


// ===============================================
// ** 3. حاسبة وقت القراءة والتحدث (Reading Time) **
// ===============================================

function calculateReadingTime() {
    const text = document.getElementById('articleText').value;
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    // متوسط سرعة القراءة (200 كلمة في الدقيقة)
    const readingSpeed = 200; 
    const readingTime = Math.ceil(wordCount / readingSpeed);

    // متوسط سرعة التحدث (120 كلمة في الدقيقة)
    const speakingSpeed = 120; 
    const speakingTime = Math.ceil(wordCount / speakingSpeed);

    // حساب عدد الجمل
    const sentenceCount = (text.match(/[.!?\u0627-\u064A\u0640\u064B-\u0652\u060C\u060B\u061B\u061F\u064B-\u0652]/g) || []).length;


    document.getElementById('readingTimeResult').textContent = 
        `${wordCount} كلمة | وقت القراءة: ${readingTime} دقيقة`;
    
    document.getElementById('speakingTimeResult').textContent = 
        `وقت التحدث: ${speakingTime} دقيقة | عدد الجمل: ${sentenceCount}`;
}


// ===============================================
// ** 4. مؤقت بومودورو (Pomodoro Timer) **
// ===============================================

let timerInterval;
let isWorkTime = true;
let timeLeft = 25 * 60; // 25 دقيقة كافتراضية
let workDuration = 25 * 60;
let breakDuration = 5 * 60;

function setCustomTimer() {
    const workMins = parseInt(document.getElementById('workMins').value);
    const breakMins = parseInt(document.getElementById('breakMins').value);

    if (workMins > 0 && breakMins > 0) {
        // إذا كان المؤقت متوقفاً، قم بتطبيق الأرقام الجديدة
        if (!timerInterval) {
            workDuration = workMins * 60;
            breakDuration = breakMins * 60;
            
            // إعادة تعيين المؤقت الحالي إلى المدة الجديدة لوقت العمل
            isWorkTime = true;
            timeLeft = workDuration;
            updateDisplay();
            document.getElementById('timerStatus').textContent = `جاهز للعمل (${workMins} دقيقة)`;
        } else {
             alert("يجب إيقاف المؤقت مؤقتاً قبل تغيير الإعدادات.");
        }
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('timerDisplay').textContent = display;

    // تغيير لون عرض الوقت بناءً على الحالة
    const timerDisplay = document.getElementById('timerDisplay');
    if (isWorkTime) {
        timerDisplay.style.color = '#dc3545'; // أحمر للعمل
    } else {
        timerDisplay.style.color = '#28a745'; // أخضر للراحة
    }
}

function startTimer() {
    if (timerInterval) return; // إذا كان المؤقت قيد التشغيل، لا تفعل شيئاً

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            // صوت تنبيه (يمكنك إضافة صوت حقيقي هنا)
            alert(isWorkTime ? "انتهى وقت العمل! استراحة!" : "انتهت فترة الراحة! ابدأ العمل!"); 
            
            // التبديل بين العمل والراحة
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workDuration : breakDuration;
            
            // تحديث حالة المؤقت
            document.getElementById('timerStatus').textContent = 
                isWorkTime ? `جاهز للعمل (${workDuration / 60} دقيقة)` : `جاهز للراحة (${breakDuration / 60} دقيقة)`;
            
            // بدء الدورة التالية تلقائياً
            startTimer(); 
        }
    }, 1000);
    
    document.getElementById('timerStatus').textContent = isWorkTime ? "العمل قيد التقدم..." : "الراحة قيد التقدم...";
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('timerStatus').textContent = isWorkTime ? "تم إيقاف العمل مؤقتاً." : "تم إيقاف الراحة مؤقتاً.";
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isWorkTime = true;
    
    // إعادة تعيين إلى مدة العمل المخصصة
    const workMins = parseInt(document.getElementById('workMins').value) || 25;
    workDuration = workMins * 60;
    timeLeft = workDuration;
    
    updateDisplay();
    document.getElementById('timerStatus').textContent = `جاهز للعمل (${workMins} دقيقة)`;
}

document.addEventListener('DOMContentLoaded', updateDisplay);


// ===============================================
// ** 5. مُحلل النصوص (Text Analyzer) **
// ===============================================

function analyzeText() {
    const text = document.getElementById('analysisText').value;

    // 1. حساب الأحرف (بالفراغات)
    const charCount = text.length;

    // 2. حساب الأحرف (بدون فراغات)
    const charNoSpaces = text.replace(/\s/g, '').length;

    // 3. تحليل الكلمات المتكررة
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFrequency = {};
    let maxCount = 0;
    let mostUsedWord = '---';

    words.forEach(word => {
        // تجاهل الكلمات القصيرة جداً (مثل حروف الجر)
        if (word.length > 2) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            if (wordFrequency[word] > maxCount) {
                maxCount = wordFrequency[word];
                mostUsedWord = `${word} (${maxCount} مرات)`;
            }
        }
    });
    
    document.getElementById('charCount').textContent = charCount;
    document.getElementById('charNoSpaces').textContent = charNoSpaces;
    document.getElementById('mostUsedWord').textContent = mostUsedWord;
}


// ===============================================
// ** 6. مُنشئ QR (QR Generator) **
// ===============================================

let qrcodeInstance = null; // للاحتفاظ بمرجع لمكتبة QR Code

function generateQrCode() {
    const qrInput = document.getElementById('qrInput').value;
    const qrcodeDiv = document.getElementById('qrcode');

    // إذا لم يتم تهيئة المكتبة بعد، قم بتهيئتها
    if (!qrcodeInstance) {
        qrcodeInstance = new QRCode(qrcodeDiv, {
            text: qrInput,
            width: 150,
            height: 150,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } else {
        // إذا كانت مهيأة، قم بتحديث المحتوى فقط
        qrcodeInstance.makeCode(qrInput);
    }
}
// تشغيل الدالة تلقائياً عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', generateQrCode);


// ===============================================
// ** 7. مُشفِّر ومُفكِّك النصوص (Encoder/Decoder) **
// ===============================================

function encodeText(type) {
    const input = document.getElementById('encoderInput');
    let output = '';

    try {
        if (type === 'base64') {
            // تشفير Base64 (يتطلب تحويل UTF-8 للتعامل مع الأحرف العربية بشكل صحيح)
            output = btoa(unescape(encodeURIComponent(input.value)));
        } else if (type === 'url') {
            output = encodeURIComponent(input.value);
        }
    } catch (e) {
        output = 'خطأ في التشفير.';
    }

    input.value = output;
}

function decodeText(type) {
    const input = document.getElementById('encoderInput');
    let output = '';

    try {
        if (type === 'base64') {
            // فك تشفير Base64
            output = decodeURIComponent(escape(atob(input.value)));
        } else if (type === 'url') {
            output = decodeURIComponent(input.value);
        }
    } catch (e) {
        output = 'خطأ في فك التشفير.';
    }
    
    input.value = output;
}

// ===============================================
// ** 8. مُحول الألوان (Color Converter) **
// ===============================================

function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function convertColor(mode) {
    const previewBox = document.getElementById('colorPreviewBox');
    
    if (mode === 'rgbToHex') {
        const rgbInput = document.getElementById('rgbInput').value;
        const parts = rgbInput.split(',').map(p => parseInt(p.trim()));

        if (parts.length === 3 && parts.every(p => p >= 0 && p <= 255)) {
            const hex = rgbToHex(parts[0], parts[1], parts[2]).toUpperCase();
            document.getElementById('hexOutput').textContent = hex;
            previewBox.style.backgroundColor = hex;
            document.getElementById('hexInput').value = hex;
        } else {
            document.getElementById('hexOutput').textContent = '#------';
        }
    } else if (mode === 'hexToRgb') {
        let hexInput = document.getElementById('hexInput').value.trim();
        if (hexInput.startsWith('#') && (hexInput.length === 7 || hexInput.length === 4)) {
            const rgb = hexToRgb(hexInput);
            document.getElementById('rgbOutput').textContent = rgb;
            previewBox.style.backgroundColor = hexInput;
            document.getElementById('rgbInput').value = rgb;
        } else {
            document.getElementById('rgbOutput').textContent = '---';
        }
    }
}


// ===============================================
// ** 9. كود تشغيل الموسيقى (MP3 Background Music) **
// ===============================================

// هذا الكود يهدف إلى تشغيل الصوت بمجرد تفاعل المستخدم مع الصفحة
// بسبب قيود المتصفحات على خاصية التشغيل التلقائي (autoplay)

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('backgroundAudio');
    
    // محاولة تشغيل الصوت عند النقر على أي مكان في الصفحة
    document.body.addEventListener('click', () => {
        // إذا كان الصوت متوقفاً، قم بتشغيله
        if (audio && audio.paused) {
            audio.play().catch(e => console.error("Could not play audio on click", e));
        }
    }, { once: true }); 
});
