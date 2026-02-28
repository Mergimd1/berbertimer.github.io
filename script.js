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
        const winDisplay = document.getElementById('winDisplay');
        winDisplay.classList.remove('hidden');
        winDisplay.innerText = prizes[prizeIndex].win ? "FITUES: " + prizes[prizeIndex].text : "Më shumë fat herën tjetër!";
    }, 5000);
}

function switchPage(page) {
    // Logjika per nderrimin e faqeve
    console.log("Duke kaluar ne: " + page);
}

function openBooking() {
    alert("Sistemi i rezervimeve do te hapet!");
}

