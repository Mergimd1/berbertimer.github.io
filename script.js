// Konfigurimi i Rrotullës
const prizes = [
    { text: "Qethje Falas", win: true }, { text: "Pa Fat Sot", win: false },
    { text: "Wax Nishman", win: true }, { text: "Provoni Nesër", win: false },
    { text: "Kafe Falas", win: true }, { text: "Provoni Nesër", win: false },
    { text: "Mjekërr Falas", win: true }, { text: "Pa Fat Sot", win: false }
];

function initWheel() {
    const wheel = document.getElementById('wheel');
    if (!wheel) return;
    wheel.innerHTML = '';
    prizes.forEach((p, i) => {
        const seg = document.createElement('div');
        seg.className = 'segment';
        seg.style.backgroundColor = (i % 2 === 0) ? "#fbbf24" : "#ffffff";
        seg.style.transform = `rotate(${i * 45}deg)`;
        
        const content = document.createElement('div');
        content.className = 'segment-content';
        content.style.transform = `rotate(22.5deg)`; // Vendos tekstin në mes
        
        const textSpan = document.createElement('span');
        textSpan.innerHTML = p.text;
        
        content.appendChild(textSpan);
        seg.appendChild(content);
        wheel.appendChild(seg);
    });
}

function openWheel() {
    document.getElementById('wheelModal').classList.add('active');
    initWheel();
    checkSpinLimit();
}

function closeWheel() {
    document.getElementById('wheelModal').classList.remove('active');
}

function checkSpinLimit() {
    const lastSpin = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpin === today) {
        document.getElementById('spinBtn').disabled = true;
        document.getElementById('spinBtn').style.opacity = "0.5";
        document.getElementById('wheelMsg').innerText = "Keni rrotulluar sot! Provoni nesër.";
    }
}

function spinWheel() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    
    let rand = Math.floor(Math.random() * 300);
    let prizeIndex;
    
    if (rand === 0) prizeIndex = 0;
    else if (rand === 1) prizeIndex = 2;
    else if (rand === 2) prizeIndex = 4;
    else if (rand === 3) prizeIndex = 6;
    else {
        const losers = [1, 3, 5, 7];
        prizeIndex = losers[Math.floor(Math.random() * losers.length)];
    }

    const degrees = (3600 + (360 - (prizeIndex * 45)) - 22.5); 
    const wheel = document.getElementById('wheel');
    wheel.style.transform = `rotate(${degrees}deg)`;

    setTimeout(() => {
        localStorage.setItem('lastSpinDate', new Date().toDateString());
        if (prizes[prizeIndex].win) {
            document.getElementById('winDisplay').classList.remove('hidden');
            document.getElementById('winText').innerText = "URIME! FITOVE: " + prizes[prizeIndex].text;
        } else {
            alert("Më shumë fat herën tjetër!");
        }
        checkSpinLimit();
    }, 5000);
}

// Logjika e Rezervimeve & Ndërrimit të faqeve
function getDynamicDays() {
    const arr = [];
    const names = ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'];
    for(let i=0; i<5; i++) {
        let d = new Date();
        d.setDate(d.getDate() + i);
        arr.push(`${names[d.getDay()]} ${d.getDate()}`);
    }
    return arr;
}

const dynamicDays = getDynamicDays();
let booking = { s: '', b: '', d: dynamicDays[0], t: '' };
let mBooking = { s: 'Membership Gold', b: '', d: dynamicDays[0], t: '' };
const users = { "Agon": "Goni30", "Mendim": "mendi12", "Dori": "dori201", "Enis": "nisi99", "Rejan": "rejan77" };

function switchPage(p) {
    ['home', 'membership', 'terminet', 'kontakt'].forEach(v => {
        const el = document.getElementById('view-'+v);
        if(el) el.classList.add('hidden');
    });
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('view-'+p).classList.remove('hidden');
    if(document.getElementById('nav-'+p)) document.getElementById('nav-'+p).classList.add('active');
    document.getElementById('main-header').style.display = (p === 'home') ? 'flex' : 'none';
}

function openBooking() { document.getElementById('bookingModal').classList.add('active'); goStep(1); }
function closeModal() { document.getElementById('bookingModal').classList.remove('active'); }

function goStep(n) {
    ['step1', 'step2', 'step3'].forEach(s => document.getElementById(s).classList.add('hidden'));
    document.getElementById('step'+n).classList.remove('hidden');
    if(n==3) buildSchedule('cal-days', 'time-grid', booking);
}

function selectMB(berber, el) {
    mBooking.b = berber;
    document.querySelectorAll('.berber-select').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('membership-schedule').classList.remove('hidden');
    buildSchedule('m-cal-days', 'm-time-grid', mBooking);
}

function setService(s, id) {
    booking.s = s;
    document.querySelectorAll('#step1 div.border-2').forEach(d => d.style.borderColor = '#e5e7eb');
    document.getElementById(id).style.borderColor = '#111827';
    document.getElementById('v1').classList.add('active');
}

function setB(b, id) {
    booking.b = b;
    document.querySelectorAll('#step2 div.border-2').forEach(d => d.style.borderColor = '#e5e7eb');
    document.getElementById(id).style.borderColor = '#111827';
    document.getElementById('v2').classList.add('active');
}

async function buildSchedule(calId, gridId, obj) {
    const daysContainer = document.getElementById(calId);
    daysContainer.innerHTML = '';
    const querySnapshot = await window.getTerminePerBllokim(obj.b, obj.d);
    
    dynamicDays.forEach(day => {
        let d = document.createElement('div');
        d.className = `p-4 rounded-2xl min-w-[85px] text-center font-bold ${obj.d === day ? 'bg-slate-900 text-white' : 'bg-gray-100'}`;
        d.innerText = day;
        d.onclick = () => { obj.d = day; buildSchedule(calId, gridId, obj); };
        daysContainer.appendChild(d);
    });

    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    for(let h=9; h<=18; h++) {
        for(let m of ['00', '30']) {
            let t = `${h<10?'0'+h:h}:${m}`;
            let isBusy = querySnapshot.some(doc => doc.t === t);
            let slot = document.createElement('div');
            slot.className = `time-slot ${isBusy ? 'busy' : ''} ${obj.t === t ? 'selected' : ''}`;
            slot.innerText = t;
            if(!isBusy) slot.onclick = () => { obj.t = t; buildSchedule(calId, gridId, obj); };
            grid.appendChild(slot);
        }
    }
}

async function confirmApp() {
    let n = document.getElementById('cName').value;
    let p = document.getElementById('cPhone').value;
    if(!n || !booking.t) return alert("Ju lutem plotësoni emrin dhe orarin!");
    const success = await window.saveToFirebase({ ...booking, name: n, phone: p, createdAt: new Date().toISOString() });
    if(success) {
        const token = "8608115004:AAE-jHShbQbGGI1L7Z8qYFdS-J77rsX51OY";
        const chatid = "5802987116";
        const msg = `✂️ *REZERVIM I RI*\n──────────────\n👤 *Klienti:* ${n}\n📞 *Tel:* ${p}\n🧔 *Berberi:* ${booking.b}\n📅 *Data:* ${booking.d}\n⏰ *Ora:* ${booking.t}\n──────────────\n💇‍♂️ *Shërbimi:* ${booking.s}`;
        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${encodeURIComponent(msg)}&parse_mode=Markdown`);
        alert("Rezervimi u krye me sukses!");
        location.reload();
    }
}

async function confirmGold() {
    let n = document.getElementById('mName').value;
    let p = document.getElementById('mPhone').value;
    if(!n || !mBooking.t) return alert("Plotësoni të dhënat!");
    const success = await window.saveToFirebase({ ...mBooking, name: n, phone: p, type: 'GOLD' });
    if(success) {
        const token = "8608115004:AAE-jHShbQbGGI1L7Z8qYFdS-J77rsX51OY";
        const chatid = "5802987116";
        const msgGold = `👑 *ANËTAR I RI GOLD*\n──────────────\n👤 *Klienti:* ${n}\n📞 *Tel:* ${p}\n🧔 *Berberi Preferuar:* ${mBooking.b}\n📅 *Termini i parë:* ${mBooking.d} në ${mBooking.t}`;
        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${encodeURIComponent(msgGold)}&parse_mode=Markdown`);
        alert("Urime! Tani jeni Gold Member.");
        location.reload();
    }
}

function handleLogin() {
    let id = document.getElementById('uID').value;
    if(users[id] === document.getElementById('uPass').value) {
        document.getElementById('login-box').classList.add('hidden');
        document.getElementById('staff-dash').classList.remove('hidden');
        document.getElementById('staff-name').innerText = "Berberi: " + id;
        window.getTerminetRealTime(id, (terminet) => { renderStaffAppointments(terminet); });
    } else alert("Të dhëna të gabuara!");
}

function renderStaffAppointments(mine) {
    const container = document.getElementById('list-app');
    container.innerHTML = mine.length ? mine.map(a => `
        <div class="bg-white p-5 rounded-2xl border-l-8 border-slate-900 shadow-sm">
            <div class="flex justify-between items-start">
                <div><b>${a.name}</b><p class="text-[10px] font-bold text-gray-500 uppercase">${a.s}</p></div>
                <div class="text-right"><b>${a.t}</b><p class="text-[10px] text-gray-400 font-bold">${a.d}</p></div>
            </div>
            <div class="flex justify-between mt-3 pt-3 border-t">
                <a href="tel:${a.phone}" class="text-blue-600 font-bold">Thirr</a>
                <button onclick="window.deleteTerminFirebase('${a.id}')" class="text-red-500 font-bold">Fshije</button>
            </div>
        </div>
    `).join('') : `<p class="text-center text-gray-400 py-10 italic">Asnjë rezervim për momentin.</p>`;
}
