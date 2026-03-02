// Starfield Animation
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = (Math.random() - 0.5) * canvas.width * 2;
        this.y = (Math.random() - 0.5) * canvas.height * 2;
        this.z = Math.random() * canvas.width;
        this.baseSpeed = Math.random() * 5 + 2;
    }

    update() {
        this.z -= this.baseSpeed * spaceSpeedMultiplier;
        if (this.z <= 1) {
            this.reset();
            this.z = canvas.width;
        }
    }

    draw() {
        const sx = (this.x / this.z) * canvas.width + canvas.width / 2;
        const sy = (this.y / this.z) * canvas.height + canvas.height / 2;
        const r = (1 - this.z / canvas.width) * 2;
        const opacity = 1 - this.z / canvas.width;

        ctx.beginPath();
        ctx.fillStyle = `rgba(194, 240, 247, ${opacity})`;
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();

        // Add tail for "warp" feel
        if (spaceSpeedMultiplier > 1.5) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(194, 240, 247, ${opacity * 0.5})`;
            ctx.lineWidth = r;
            const px = (this.x / (this.z + 20)) * canvas.width + canvas.width / 2;
            const py = (this.y / (this.z + 20)) * canvas.height + canvas.height / 2;
            ctx.moveTo(sx, sy);
            ctx.lineTo(px, py);
            ctx.stroke();
        }
    }
}

const stars = Array(200).fill().map(() => new Star());

function animateStars() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateStars);
}

animateStars();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Model Configuration
let currentGender = 'female';
let currentPose = 'standing';
let spaceSpeedMultiplier = 1.0;

const measurements = {
    height: 170,
    shoulders: 40,
    chest: 90,
    waist: 70,
    hips: 95,
    armLength: 65,
    legLength: 90,
    neckSize: 35
};

// Gender Selection
document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        currentGender = this.dataset.gender;

        document.querySelectorAll('.model').forEach(model => {
            model.classList.remove('active');
        });

        document.getElementById(`${currentGender}-model`).classList.add('active');

        // Adjust default measurements based on gender
        if (currentGender === 'male') {
            measurements.shoulders = 45;
            measurements.chest = 100;
            measurements.waist = 85;
            measurements.hips = 95;
            measurements.armLength = 70;
            measurements.legLength = 95;
            measurements.neckSize = 40;
        } else {
            measurements.shoulders = 40;
            measurements.chest = 90;
            measurements.waist = 70;
            measurements.hips = 95;
            measurements.armLength = 65;
            measurements.legLength = 90;
            measurements.neckSize = 35;
        }

        updateMeasurements();
    });
});

// Measurement Controls
const sliders = {
    height: document.getElementById('height'),
    shoulders: document.getElementById('shoulders'),
    chest: document.getElementById('chest'),
    waist: document.getElementById('waist'),
    hips: document.getElementById('hips'),
    armLength: document.getElementById('armLength'),
    legLength: document.getElementById('legLength'),
    neckSize: document.getElementById('neckSize')
};

Object.keys(sliders).forEach(key => {
    const slider = sliders[key];
    const valueDisplay = document.getElementById(`${key}-value`);
    const displayElement = document.getElementById(`display-${key}`);

    slider.addEventListener('input', function () {
        measurements[key] = parseInt(this.value);
        valueDisplay.textContent = this.value;
        displayElement.textContent = this.value;
        updateModel();
    });
});

function updateMeasurements() {
    Object.keys(measurements).forEach(key => {
        sliders[key].value = measurements[key];
        document.getElementById(`${key}-value`).textContent = measurements[key];
        document.getElementById(`display-${key}`).textContent = measurements[key];
    });
    updateModel();
}

function updateModel() {
    const prefix = currentGender;
    const h = measurements.height / 170;
    const s = measurements.shoulders / 40;
    const c = measurements.chest / 90;
    const w = measurements.waist / 70;
    const hi = measurements.hips / 95;
    const neck = measurements.neckSize / 35;

    const svg = document.getElementById('human-model');
    const baseHeight = 400;
    const newHeight = baseHeight * h;
    svg.setAttribute('viewBox', `0 0 200 ${newHeight}`);

    if (currentGender === 'female') {
        const torso = document.getElementById('female-torso');
        const sh = 65 * s;
        const ch = 75 * c;
        const wa = 80 * w;
        const hip = 95 * hi;

        // More natural curves for female form
        torso.setAttribute('d', `
            M ${100 - sh} 75
            C ${100 - ch} 80, ${100 - ch} 120, ${100 - wa} 160
            C ${100 - wa} 190, ${100 - hip} 220, ${100 - hip} 280
            L 100 340
            L ${100 + hip} 280
            C ${100 + hip} 220, ${100 + wa} 190, ${100 + wa} 160
            C ${100 + wa} 120, ${100 + ch} 80, ${100 + sh} 75
            Q 100 65 ${100 - sh} 75 Z
        `);

        // Scale other parts
        const neckEl = activeModel().querySelector('.neck');
        if (neckEl) neckEl.setAttribute('width', 10 * neck);
    } else {
        const torso = document.getElementById('male-torso');
        const sh = 80 * s;
        const ch = 70 * c;
        const wa = 70 * w;

        // V-taper for male form
        torso.setAttribute('d', `
            M ${100 - sh} 80
            C ${100 - ch - 10} 100, ${100 - ch - 5} 150, ${100 - wa} 220
            C ${100 - wa} 260, ${100 - wa + 10} 320, 100 365
            C ${100 + wa - 10} 320, ${100 + wa} 260, ${100 + wa} 220
            C ${100 + wa} 150, ${100 + ch + 5} 100, ${100 + sh} 80
            Q 100 70 ${100 - sh} 80 Z
        `);
    }

    // Update arms and legs position based on shoulder/waist width
    updateLimbs(h, s, w, hi);
}

function activeModel() {
    return document.getElementById(`${currentGender}-model`);
}

function updateLimbs(h, s, w, hi) {
    const model = activeModel();
    const sh = (currentGender === 'female' ? 65 : 80) * s;
    const hip = (currentGender === 'female' ? 95 : 70) * hi;

    const leftArm = model.querySelector('.left-arm');
    const rightArm = model.querySelector('.right-arm');
    const leftLeg = model.querySelector('.left-leg');
    const rightLeg = model.querySelector('.right-leg');

    const shoulderY = 80;
    const elbowY = 200 * h;
    const handY = 320 * h;
    const kneeY = 360 * h;
    const footY = 400 * h;

    if (leftArm && rightArm) {
        leftArm.setAttribute('d', `M ${100 - sh} ${shoulderY} L ${80 - sh / 2} ${elbowY} L ${70 - sh / 2} ${handY}`);
        rightArm.setAttribute('d', `M ${100 + sh} ${shoulderY} L ${120 + sh / 2} ${elbowY} L ${130 + sh / 2} ${handY}`);
    }

    if (leftLeg && rightLeg) {
        const hipOffset = currentGender === 'female' ? 30 : 15;
        leftLeg.setAttribute('d', `M ${100 - hipOffset} 340 L ${100 - hipOffset - 5} ${kneeY} L ${100 - hipOffset - 10} ${footY}`);
        rightLeg.setAttribute('d', `M ${100 + hipOffset} 340 L ${100 + hipOffset + 5} ${kneeY} L ${100 + hipOffset + 10} ${footY}`);
    }
}

// Color Gradient
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const applyGradientBtn = document.getElementById('apply-gradient');

applyGradientBtn.addEventListener('click', function () {
    const color1 = color1Input.value;
    const color2 = color2Input.value;

    const gradient = document.getElementById('outfit-gradient');
    gradient.innerHTML = `
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    `;

    // Add flash effect
    const outfits = document.querySelectorAll('.outfit');
    outfits.forEach(outfit => {
        outfit.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            outfit.style.filter = 'brightness(1)';
        }, 200);
    });
});

// Gradient Presets
document.querySelectorAll('.grad-preset').forEach(preset => {
    preset.addEventListener('click', function () {
        color1Input.value = this.dataset.c1;
        color2Input.value = this.dataset.c2;
        applyGradientBtn.click();
    });
});

// Texture Selection
const textureSelect = document.getElementById('texture');
textureSelect.addEventListener('change', function () {
    const texture = this.value;
    const outfits = document.querySelectorAll('.outfit');

    outfits.forEach(outfit => {
        outfit.style.transition = 'all 0.3s ease';

        switch (texture) {
            case 'solid':
                outfit.setAttribute('fill', 'url(#outfit-gradient)');
                break;
            case 'striped':
                outfit.setAttribute('fill', 'url(#striped-pattern)');
                break;
            case 'dotted':
                outfit.setAttribute('fill', 'url(#dotted-pattern)');
                break;
            case 'geometric':
                outfit.setAttribute('fill', 'url(#geometric-pattern)');
                break;
            case 'plaid':
                outfit.setAttribute('fill', 'url(#plaid-pattern)');
                break;
            case 'waves':
                outfit.setAttribute('fill', 'url(#waves-pattern)');
                break;
            case 'sparkles':
                outfit.setAttribute('fill', 'url(#sparkles-pattern)');
                break;
            case 'diagonal':
                outfit.setAttribute('fill', 'url(#diagonal-pattern)');
                break;
        }
    });
});

// File Upload
const fileUpload = document.getElementById('file-upload');
const uploadPreview = document.getElementById('upload-preview');

fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function (event) {
            uploadPreview.style.display = 'block';
            uploadPreview.style.backgroundImage = `url(${event.target.result})`;

            // Optionally apply uploaded image as texture
            const svg = document.getElementById('human-model');
            const defs = svg.querySelector('defs');

            // Create pattern from uploaded image
            const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            pattern.setAttribute('id', 'uploaded-pattern');
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', '100');
            pattern.setAttribute('height', '100');

            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('href', event.target.result);
            image.setAttribute('width', '100');
            image.setAttribute('height', '100');

            pattern.appendChild(image);
            defs.appendChild(pattern);

            // Apply to outfit
            const outfits = document.querySelectorAll('.outfit');
            outfits.forEach(outfit => {
                outfit.setAttribute('fill', 'url(#uploaded-pattern)');
            });
        };

        reader.readAsDataURL(file);
    }
});

// Pose Selection
document.querySelectorAll('.pose-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.pose-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        currentPose = this.dataset.pose;
        setPose(currentPose);
    });
});

// Function to set pose
function setPose(pose) {
    currentPose = pose;
    const activeModel = document.querySelector('.model.active');

    // Add pose animation class
    activeModel.classList.remove('pose-standing', 'pose-walking', 'pose-arms-out', 'pose-sitting');
    activeModel.classList.add(`pose-${pose}`);

    console.log(`Pose changed to: ${pose}`);
}

// Animation Speed Control
const spaceSpeedSlider = document.getElementById('spaceSpeed');
const spaceSpeedValue = document.getElementById('spaceSpeed-value');

if (spaceSpeedSlider) {
    spaceSpeedSlider.addEventListener('input', function () {
        spaceSpeedMultiplier = parseFloat(this.value);
        spaceSpeedValue.textContent = spaceSpeedMultiplier.toFixed(1) + 'x';
    });
}

// Export Screenshot Function
const exportBtn = document.getElementById('export-screenshot');
if (exportBtn) {
    exportBtn.addEventListener('click', function () {
        exportScreenshot();
    });
}

function exportScreenshot() {
    const modelContainer = document.querySelector('.model-display');

    // Create a canvas to render the screenshot
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 1000;

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#00474F');
    gradient.addColorStop(1, '#001a1f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get SVG
    const svg = document.getElementById('human-model');
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = function () {
        // Draw SVG to canvas
        const scale = 2;
        const x = (canvas.width - (200 * scale)) / 2;
        const y = 50;
        ctx.drawImage(img, x, y, 200 * scale, 400 * scale);

        // Add branding
        ctx.fillStyle = '#C2F0F7';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Jacque Jeme', canvas.width / 2, canvas.height - 50);

        // Download
        canvas.toBlob(function (blob) {
            const link = document.createElement('a');
            link.download = `jacque-jeme-design-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();

            // Show notification
            if (typeof showNotification === 'function') {
                showNotification('Screenshot exported successfully!', 'success');
            } else {
                alert('Screenshot downloaded!');
            }
        });

        URL.revokeObjectURL(url);
    };

    img.src = url;
}

// Reset Button
const resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', function () {
    // Reset measurements
    measurements.height = 170;
    measurements.shoulders = currentGender === 'male' ? 45 : 40;
    measurements.chest = currentGender === 'male' ? 100 : 90;
    measurements.waist = currentGender === 'male' ? 85 : 70;
    measurements.hips = 95;
    measurements.armLength = currentGender === 'male' ? 70 : 65;
    measurements.legLength = currentGender === 'male' ? 95 : 90;
    measurements.neckSize = currentGender === 'male' ? 40 : 35;

    updateMeasurements();

    // Reset colors
    color1Input.value = '#00474F';
    color2Input.value = '#C2F0F7';
    applyGradientBtn.click();

    // Reset texture
    textureSelect.value = 'solid';
    textureSelect.dispatchEvent(new Event('change'));

    // Reset file upload
    fileUpload.value = '';
    uploadPreview.style.display = 'none';
    uploadPreview.style.backgroundImage = '';

    // Add reset animation
    const modelContainer = document.querySelector('.model-container');
    modelContainer.style.transform = 'scale(0.95)';
    setTimeout(() => {
        modelContainer.style.transform = 'scale(1)';
    }, 200);
});

// Initialize
updateModel();

// Add parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    const model = document.querySelector('.model-container svg');
    if (model) {
        model.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetBtn.click();
    }
    if (e.key === 'm' || e.key === 'M') {
        document.querySelector('[data-gender="male"]').click();
    }
    if (e.key === 'f' || e.key === 'F') {
        document.querySelector('[data-gender="female"]').click();
    }
});

console.log('%c🚀 Jacque Jeme Interactive Studio Ready!', 'color: #C2F0F7; font-size: 20px; font-weight: bold;');
console.log('%cKeyboard Shortcuts: R=Reset, M=Male, F=Female', 'color: #00474F; font-size: 14px;');
