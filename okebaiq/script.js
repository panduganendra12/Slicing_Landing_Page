// Preloader: tampil minimal 1,5 detik, hilang setelah semua aset selesai dimuat
const MIN_LOADING_MS = 1500;
const loadStartedAt = performance.now();
window.addEventListener('load', () => {
    const wait = Math.max(0, MIN_LOADING_MS - (performance.now() - loadStartedAt));
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
