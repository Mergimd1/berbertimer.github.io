let booking = { s: '', b: '', d: '', t: '' };

function switchPage(p) {
    ['home', 'membership', 'kontakt'].forEach(v => {
        const el = document.getElementById('view-' + v);
        if(el) el.classList.add('hidden');
    });
    document.getElementById('view-' + p).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if(document.getElementById('nav-' + p)) document.getElementById('nav-' + p).classList.add('active');
    document.getElementById('main-header').style.display = (p === 'home') ? 'flex' : 'none';
}

function openBooking() { document.getElementById('bookingModal').classList.add('active'); goStep(1); }
function closeModal() { document.getElementById('bookingModal').classList.remove('active'); }

function goStep(n) {
    ['step1', 'step2', 'step3'].forEach(s => document.getElementById(s).classList.add('hidden'));
    document.getElementById('step' + n).classList.remove('hidden');
    if(n === 3) buildSchedule();
}

function setService(s, id) {
    booking.s = s;
    document.querySelectorAll('#step1 .border-2').forEach(d => d.style.borderColor = '#e5e7eb');
    document.getElementById(id).style.borderColor = '#111827';
    document.getElementById('v1').classList.add('active');
}

function setB(b, id) {
    booking.b = b;
    document.querySelectorAll('#step2 .border-2').forEach(d => d.style.borderColor = '#e5e7eb');
    document.getElementById(id).style.borderColor = '#111827';
    document.getElementById('v2').classList.add('active');
}

// Logjika e Rrotulles
const prizes = [
    { text: "Qethje Falas", win: true }, { text: "Pa Fat Sot", win: false },
    { text: "Wax Nishman", win: true }, { text: "Provoni Neser", win: false },
    { text: "Kafe Falas", win: true }, { text: "Pa Fat Sot", win: false },
    { text: "Mjekerr Falas", win: true }, { text: "Provoni Neser", win: false }
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

function openWheel() { document.getElementById('wheelModal').classList.add('active'); initWheel(); }
function closeWheel() { document.getElementById('wheelModal').classList.remove('active'); }

function spinWheel() {
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const degrees = (3600 + (360 - (prizeIndex * 45)) - 22.5);
    document.getElementById('wheel').style.transform = `rotate(${degrees}deg)`;
    setTimeout(() => {
        if(prizes[prizeIndex].win) {
            document.getElementById('winDisplay').classList.remove('hidden');
            document.getElementById('winText').innerText = "FITOVE: " + prizes[prizeIndex].text;
        } else { alert("Me shume fat neser!"); }
    }, 5000);
}
