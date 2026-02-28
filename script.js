// script.js

// 1. Ndërrimi i faqeve
function switchPage(page) {
    const views = ['home', 'membership', 'terminet', 'kontakt'];
    views.forEach(v => {
        const el = document.getElementById('view-' + v);
        if(el) el.classList.add('hidden');
    });
    const target = document.getElementById('view-' + page);
    if(target) target.classList.remove('hidden');
    
    document.getElementById('main-header').style.display = (page === 'home') ? 'flex' : 'none';
}

// 2. Hapja/Mbyllja e modalit të rezervimit
function openBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    goStep(1);
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

// 3. Hapat e rezervimit
let bookingData = { s: '', b: '', d: '', t: '' };

function goStep(n) {
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step' + n).classList.remove('hidden');
    
    if(n === 3) buildSchedule();
}

function setService(name, el) {
    bookingData.s = name;
    document.querySelectorAll('.service-opt').forEach(opt => opt.style.borderColor = '#e5e7eb');
    el.style.borderColor = '#111827';
    document.getElementById('v1').classList.add('active');
}

function setB(name, el) {
    bookingData.b = name;
    document.querySelectorAll('.barber-opt').forEach(opt => opt.style.borderColor = '#e5e7eb');
    el.style.borderColor = '#111827';
    document.getElementById('v2').classList.add('active');
}

// 4. Rrotulla
const prizes = [
    { text: "Qethje Falas", win: true }, { text: "Pa Fat", win: false },
    { text: "Wax Falas", win: true }, { text: "Pa Fat", win: false },
    { text: "Kafe Gratis", win: true }, { text: "Pa Fat", win: false },
    { text: "Mjekerr Falas", win: true }, { text: "Pa Fat", win: false }
];

function initWheel() {
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = '';
    prizes.forEach((p, i) => {
        const seg = document.createElement('div');
        seg.className = 'segment';
        seg.style.backgroundColor = (i % 2 === 0) ? "#fbbf24" : "#ffffff";
        seg.style.transform = `rotate(${i * 45}deg)`;
        const content = document.createElement('div');
        content.className = 'segment-content';
        content.style.transform = `rotate(22.5deg)`;
        content.innerHTML = `<b>${p.text}</b>`;
        seg.appendChild(content);
        wheel.appendChild(seg);
    });
}

function openWheel() {
    document.getElementById('wheelModal').classList.add('active');
    initWheel();
}

function closeWheel() {
    document.getElementById('wheelModal').classList.remove('active');
}

function spinWheel() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const degrees = (3600 + (360 - (prizeIndex * 45)) - 22.5);
    document.getElementById('wheel').style.transform = `rotate(${degrees}deg)`;
    
    setTimeout(() => {
        const display = document.getElementById('winDisplay');
        display.classList.remove('hidden');
        display.innerText = prizes[prizeIndex].win ? "FITOVE: " + prizes[prizeIndex].text : "Provo herën tjetër!";
    }, 5000);
}
