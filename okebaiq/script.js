const GIF_DURATION_FALLBACK_MS = 1500;

const preGif = document.querySelector('#preloader img');
let gifShownAt = performance.now();
if (preGif.complete) gifShownAt = performance.now();
else preGif.addEventListener('load', () => { gifShownAt = performance.now(); });

// Baca durasi GIF dengan menjumlahkan delay setiap frame
function readGifDuration(url) {
    return fetch(url)
        .then(r => r.arrayBuffer())
        .then(buf => {
            const b = new Uint8Array(buf);
            const packed = b[10];
            let pos = 13; // lewati header + logical screen descriptor
            if (packed & 0x80) pos += 3 * (1 << ((packed & 7) + 1));
            const skipSubBlocks = () => { while (b[pos] !== 0) pos += b[pos] + 1; pos++; };
            let total = 0;
            while (pos < b.length) {
                const t = b[pos++];
                if (t === 0x21) {
                    const label = b[pos++];
                    if (label === 0xF9) {
                        const delay = b[pos + 2] | (b[pos + 3] << 8); // satuan 1/100 detik
                        total += (delay <= 1 ? 10 : delay * 10);
                        skipSubBlocks();
                    } else skipSubBlocks();
                } else if (t === 0x2C) {
                    pos += 8;
                    const lp = b[pos++];
                    if (lp & 0x80) pos += 3 * (1 << ((lp & 7) + 1));
                    pos++; // LZW min code size
                    skipSubBlocks();
                } else if (t === 0x3B) break;
                else break;
            }
            if (!total) throw new Error('durasi 0');
            return total;
        });
}

const gifDuration = readGifDuration(preGif.getAttribute('src')).catch(() => GIF_DURATION_FALLBACK_MS);

window.addEventListener('load', async () => {
    const duration = await gifDuration;
    const wait = Math.max(0, duration - (performance.now() - gifShownAt));
    setTimeout(() => {
        const pre = document.getElementById('preloader');
        pre.classList.add('hide');
        document.body.classList.remove('is-loading');
        setTimeout(() => pre.remove(), 700);
    }, wait);
});

// Navbar berubah warna saat scroll
const nav = document.getElementById('SectionNavbar');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll); onScroll();

// Slider kamar
const track = document.getElementById('roomsTrack');
document.querySelectorAll('[data-rooms]').forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.dataset.rooms === 'next' ? 1 : -1;
        track.scrollBy({ left: dir * (track.firstElementChild.offsetWidth + 16), behavior: 'smooth' });
    });
});

// Validasi newsletter
document.getElementById('newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const msg = document.getElementById('newsletterMsg');
    const ok = input.checkValidity();
    msg.textContent = ok ? 'Terima kasih, Anda sudah terdaftar.' : 'Masukkan email yang valid.';
    msg.className = 'd-block mt-2 ' + (ok ? 'text-success' : 'text-danger');
    if (ok) input.value = '';
});
