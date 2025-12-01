// script.js (Kode Lengkap yang sudah diupdate dengan fitur klik detail, bukti pembayaran, PENCARIAN & INFO)

// =========================================================
// 0. DATA SIMULASI (BANK, EWALLET, QRIS, PRODUK)
// =========================================================

// script.js: GANTI SELURUH KONSTANTA PAYMENT_ACCOUNTS

const PAYMENT_ACCOUNTS = {
    // Akun tujuan transfer (Nomor rekening/HP tujuan Anda)
    ACCOUNTS: {
        BCA: { name: "WINORO HADI MUKTI", number: "1234567890" },
        BRI: { name: "WINORO HADI MUKTI", number: "1234567891" },
        MANDIRI: { name: "WINORO HADI MUKTI", number: "1234567892" },
        SEABANK: { name: "WINORO HADI MUKTI", number: "1234567893" },
        BNI: { name: "WINORO HADI MUKTI", number: "1234567894" },
        PERMATA: { name: "WINORO HADI MUKTI", number: "1234567895" },
        CIMB: { name: "WINORO HADI MUKTI", number: "1234567896" },
        // E-Wallet (menggunakan nomor HP tujuan)
        DANA: { name: "WINORO HADI MUKTI", number: "089646775883" },
        GOPAY: { name: "WINORO HADI MUKTI", number: "089646775883" },
        SHOPEEPAY: { name: "WINORO HADI MUKTI", number: "089646775883" },
        OVO: { name: "WINORO HADI MUKTI", number: "089646775883" },
        LINKAJA: { name: "WINORO HADI MUKTI", number: "089646775883" },
    },
    // Daftar metode yang ditampilkan di UI (dengan ikon)
    METHODS: [
        // Bank
        { key: 'BCA', name: 'Transfer BCA', type: 'Bank', icon: 'assets/icons/bank/bca.png' },
        { key: 'BRI', name: 'Transfer BRI', type: 'Bank', icon: 'assets/icons/bank/bri.png' },
        { key: 'MANDIRI', name: 'Transfer Mandiri', type: 'Bank', icon: 'assets/icons/bank/mandiri.png' },
        { key: 'SEABANK', name: 'Transfer SeaBank', type: 'Bank', icon: 'assets/icons/bank/seabank.png' },
        { key: 'BNI', name: 'Transfer BNI', type: 'Bank', icon: 'assets/icons/bank/bni.png' },
        { key: 'PERMATA', name: 'Transfer Permata', type: 'Bank', icon: 'assets/icons/bank/permata.png' },
        { key: 'CIMB', name: 'Transfer CIMB Niaga', type: 'Bank', icon: 'assets/icons/bank/cimb.png' },
        // E-Wallet
        { key: 'DANA', name: 'Bayar via DANA', type: 'EWALLET', icon: 'assets/icons/wallet/dana.png' },
        { key: 'GOPAY', name: 'Bayar via Gopay', type: 'EWALLET', icon: 'assets/icons/wallet/gopay.png' },
        { key: 'SHOPEEPAY', name: 'Bayar via ShopeePay', type: 'EWALLET', icon: 'assets/icons/wallet/shopeepay.png' },
        { key: 'OVO', name: 'Bayar via OVO', type: 'EWALLET', icon: 'assets/icons/wallet/ovo.png' },
        { key: 'LINKAJA', name: 'Bayar via LinkAja', type: 'EWALLET', icon: 'assets/icons/wallet/linkaja.png' },
        // QRIS
        { key: 'QRIS', name: 'QRIS (Semua E-Wallet/Bank)', type: 'QRIS', icon: 'assets/icons/qris.png' },
    ]
};

const PRODUCTS_DATA = {
    mlbb: {
        title: "Mobile Legends: Bang Bang",
        server: true, 
        nominals: [
            { amount: 86, price: 25000, label: "86 Diamond", qrisImg: "qris_mlbb_86.png" },
            { amount: 172, price: 50000, label: "172 Diamond", qrisImg: "qris_mlbb_172.png" },
            { amount: 344, price: 100000, label: "344 Diamond", qrisImg: "qris_mlbb_344.png" },
        ]
    },
    pubg: {
        title: "PUBG Mobile",
        server: false, 
        nominals: [
            { amount: 60, price: 15000, label: "60 UC", qrisImg: "qris_pubg_60.png" },
            { amount: 300, price: 70000, label: "300 UC", qrisImg: "qris_pubg_300.png" },
            { amount: 600, price: 135000, label: "600 UC", qrisImg: "qris_pubg_600.png" },
        ]
    },
    supersus: {
        title: "Supersus",
        server: false, 
        nominals: [
            { amount: 30, price: 10000, label: "30 Bintang", qrisImg: "qris_ss_30.png" },
            { amount: 150, price: 45000, label: "150 Bintang", qrisImg: "qris_ss_150.png" },
        ]
    },
    genshin: {
        title: "Genshin Impact",
        server: false,
        nominals: [
            { amount: 60, price: 16000, label: "60 Genesis Crystal", qrisImg: "qris_gi_60.png" },
            { amount: 300, price: 78000, label: "300 Genesis Crystal", qrisImg: "qris_gi_300.png" },
        ]
    },
    freefire: {
        title: "Garena Free Fire",
        server: false,
        nominals: [
            { amount: 70, price: 10000, label: "70 Diamond", qrisImg: "qris_ff_70.png" },
            { amount: 140, price: 20000, label: "140 Diamond", qrisImg: "qris_ff_140.png" },
        ]
    },
    aov: {
        title: "Arena of Valor",
        server: false,
        nominals: [
            { amount: 40, price: 10000, label: "40 Voucher", qrisImg: "qris_aov_40.png" },
            { amount: 200, price: 48000, label: "200 Voucher", qrisImg: "qris_aov_200.png" },
        ]
    },
    
    faya: {
        title: "FAYA TOP UP", // Ini yang akan dicari
        server: false, 
        isPulsa: false,
        externalUrl: "https://fayatopup.vercel.app", // Tautan eksternal
        nominals: [] // Biarkan kosong karena tidak ada top-up internal
    },
    
// script.js: GANTI BAGIAN INI DI DALAM const PRODUCTS_DATA = { ... }

telkomsel: {
    title: "Pulsa Telkomsel",
    server: false,
    isPulsa: true,
    nominals: [
        { amount: 10000, price: 10500, label: "Pulsa 10K", },
        { amount: 25000, price: 25800, label: "Pulsa 25K" },
        { amount: 50000, price: 51500, label: "Pulsa 50K" },
        { amount: 100000, price: 101800, label: "Pulsa 100K" }
    ]
},

indosat: {
    title: "Pulsa Indosat",
    server: false,
    isPulsa: true,
    nominals: [
        { amount: 10000, price: 10500, label: "Pulsa 10K" },
        { amount: 25000, price: 25800, label: "Pulsa 25K" },
        { amount: 50000, price: 51500, label: "Pulsa 50K" },
        { amount: 100000, price: 101800, label: "Pulsa 100K" }
    ]
},

xl: {
    title: "Pulsa XL",
    server: false,
    isPulsa: true,
    nominals: [
        { amount: 10000, price: 10500, label: "Pulsa 10K" },
        { amount: 25000, price: 25800, label: "Pulsa 25K" },
        { amount: 50000, price: 51500, label: "Pulsa 50K" },
        { amount: 100000, price: 101800, label: "Pulsa 100K" }
    ]
},

smartfren: {
    title: "Pulsa Smartfren",
    server: false,
    isPulsa: true,
    nominals: [
        { amount: 10000, price: 10500, label: "Pulsa 10K" },
        { amount: 25000, price: 25800, label: "Pulsa 25K" },
        { amount: 50000, price: 51500, label: "Pulsa 50K" },
        { amount: 100000, price: 101800, label: "Pulsa 100K" }
    ]
},

axis: {
    title: "Pulsa Axis",
    server: false,
    isPulsa: true,
    nominals: [
        { amount: 10000, price: 10500, label: "Pulsa 10K" },
        { amount: 25000, price: 25800, label: "Pulsa 25K" },
        { amount: 50000, price: 51500, label: "Pulsa 50K" },
        { amount: 100000, price: 101800, label: "Pulsa 100K" }
    ]
},

tri: {
    title: "Pulsa Tri",
    server: false,
    isPulsa: true,
    nominals: [
        { amount: 10000, price: 10500, label: "Pulsa 10K" },
        { amount: 25000, price: 25800, label: "Pulsa 25K" },
        { amount: 50000, price: 51500, label: "Pulsa 50K" },
        { amount: 100000, price: 101800, label: "Pulsa 100K" }
    ]
},
};


// --- Variabel Global & Elemen Halaman ---
const homePage = document.querySelector('.product-grid-section');
const dataPage = document.getElementById('data-page');
const mlbbPage = document.getElementById('mlbb-page');
const genericPage = document.getElementById('generic-page'); 

let currentGameState = {
    key: null,
    productTitle: null,
    serverRequired: false,
    selectedNominal: null,
    selectedMethod: null,
};
let transactionDetails = {};

// MLBB Elements
const mlbbGameIdInput = document.getElementById('mlbb-game-id');
const mlbbServerIdInput = document.getElementById('mlbb-server-id');
const finalCheckoutButtonMlbb = document.getElementById('final-checkout-button-mlbb');

// Generic Elements
const genericGameTitle = document.getElementById('generic-game-title');
const genericGameIdInput = document.getElementById('generic-game-id');
const genericNominalGrid = document.querySelector('.generic-nominal-grid');
const genericInfoText = document.getElementById('generic-info-text');
const finalCheckoutButtonGeneric = document.getElementById('final-checkout-button-generic');


// Modal Elements (Shared & Payment)
const paymentModal = document.getElementById('payment-details-modal');
const closePaymentModal = document.getElementById('close-payment-modal');
const paymentModalTitle = document.getElementById('payment-modal-title');
const paymentContent = document.getElementById('payment-content');
const confirmPaymentButton = document.getElementById('confirm-payment');

// MODAL DETAIL TRANSAKSI
const detailModal = document.getElementById('transaction-detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');

// MODAL BARU (Pencarian & Info)
const searchButton = document.getElementById('search-button');
const infoButton = document.getElementById('info-button');
const searchModal = document.getElementById('search-modal');
const infoModal = document.getElementById('info-modal');
const closeSearchModal = document.getElementById('close-search-modal');
const closeInfoModal = document.getElementById('close-info-modal');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');
const productCards = document.querySelectorAll('.product-card');


// =========================================================
// 1. FUNGSI NAVIGASI HALAMAN (SPA)
// =========================================================

function navigate(targetId) {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    
    // Non-aktifkan semua halaman utama
    homePage.classList.add('hidden-page');
    dataPage.classList.add('hidden-page');
    mlbbPage.classList.add('hidden-page'); 
    genericPage.classList.add('hidden-page');
    
    // Tampilkan halaman sesuai target
    if (targetId === 'home') {
        homePage.classList.remove('hidden-page');
    } else if (targetId === 'data') {
        dataPage.classList.remove('hidden-page');
        renderTransactionHistory(); 
    } else if (targetId === 'mlbb-page') { 
        mlbbPage.classList.remove('hidden-page');
    } else if (targetId === 'generic-page') {
        genericPage.classList.remove('hidden-page');
    }

    // Perbarui status active di Nav Bar
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        
        if (targetId === 'home' && href === '#') {
             item.classList.add('active');
        } else if (targetId === 'data' && href === '#data') {
             item.classList.add('active');
        }
    });
}


// =========================================================
// 2. LOGIKA TOP-UP (MLBB & GENERIK)
// =========================================================

// --- A. Setup Halaman Berdasarkan Game ---
function setupTopUpPage(gameKey) {
    const gameData = PRODUCTS_DATA[gameKey];
    const type = gameData.server ? 'mlbb' : 'generic';

    // 1. Reset State Global
    currentGameState = {
        key: gameKey,
        productTitle: gameData.title,
        serverRequired: gameData.server,
        isPulsa: gameData.isPulsa || false, // Tambahkan cek Pulsa
        selectedNominal: null,
        selectedMethod: null,
    };
    
    // 2. Tentukan target elemen
    const nominalContainer = type === 'mlbb' ? document.querySelector('.mlbb-nominal-grid') : genericNominalGrid;
    
    // 3. Reset UI dan Render Nominal
    if (type === 'mlbb') {
        mlbbGameIdInput.value = '';
        mlbbServerIdInput.value = '';
        document.getElementById('mlbb-summary-nominal').textContent = "Diamond: -";
        document.getElementById('mlbb-summary-price').textContent = "Harga: -";
        document.getElementById('mlbb-summary-method').textContent = "Metode: -";
        finalCheckoutButtonMlbb.disabled = true;
        finalCheckoutButtonMlbb.textContent = `Lengkapi Data di Atas`;
        
        // Reset tampilan metode pembayaran kembali ke kategori
        const mlbbPaymentView = document.querySelector('#mlbb-page .payment-detail-view');
        if (mlbbPaymentView) mlbbPaymentView.classList.remove('active');
        const mlbbCategoryButtons = document.querySelector('#mlbb-page .payment-category-buttons');
        if (mlbbCategoryButtons) mlbbCategoryButtons.style.display = 'flex';

    } else { // Generic
        genericGameTitle.textContent = gameData.title;
        genericGameIdInput.value = '';
        
        // Update Info Text berdasarkan apakah itu Pulsa atau Game Generik
        if (currentGameState.isPulsa) {
            genericInfoText.innerHTML = `<i class="fas fa-info-circle"></i> Harap masukkan **Nomor Handphone** Anda.`;
        } else {
            genericInfoText.innerHTML = `<i class="fas fa-info-circle"></i> Harap masukkan **ID Pengguna (User ID/UID)** Anda di sini. ID ini **tidak** memerlukan Server ID.`;
        }
        
        document.getElementById('generic-summary-nominal').textContent = "Nominal: -";
        document.getElementById('generic-summary-price').textContent = "Harga: -";
        document.getElementById('generic-summary-method').textContent = "Metode: -";
        finalCheckoutButtonGeneric.disabled = true;
        finalCheckoutButtonGeneric.textContent = `Lengkapi Data di Atas`;
        
        // Reset tampilan metode pembayaran kembali ke kategori
        const genericPaymentView = document.querySelector('#generic-page .payment-detail-view');
        if (genericPaymentView) genericPaymentView.classList.remove('active');
        const genericCategoryButtons = document.querySelector('#generic-page .payment-category-buttons');
        if (genericCategoryButtons) genericCategoryButtons.style.display = 'flex';
    }

    renderNominalOptions(gameData.nominals, nominalContainer, type);
}

// --- B. Render Nominal Options ---
function renderNominalOptions(nominals, container, type) {
    container.innerHTML = '';
    nominals.forEach(item => {
        const itemHtml = `
            <div class="nominal-item" data-price="${item.price}" data-qris-img="${item.qrisImg}" data-label="${item.label}">
                ${item.label} <br> Rp ${item.price.toLocaleString('id-ID')}
            </div>
        `;
        container.innerHTML += itemHtml;
    });
    
    // Attach listener ke nominal baru
    document.querySelectorAll(`.${type}-nominal-grid .nominal-item`).forEach(item => {
        item.addEventListener('click', (e) => handleNominalSelection(e.currentTarget, type));
    });
}

// --- C. Handler Pemilihan Nominal ---
function handleNominalSelection(item, type) {
    // Hapus selection di grid yang sama
    const nominalGridClass = type === 'mlbb' ? '.mlbb-nominal-grid' : '.generic-nominal-grid';
    document.querySelectorAll(`${nominalGridClass} .nominal-item`).forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    
    // Update state
    currentGameState.selectedNominal = {
        price: parseInt(item.getAttribute('data-price')),
        label: item.getAttribute('data-label'),
        qrisImg: item.getAttribute('data-qris-img')
    };
    
    updateSummary(type);
}

// script.js: GANTI SELURUH FUNGSI handleMethodSelection
// --- D. Handler Pemilihan Metode Pembayaran ---
function handleMethodSelection(item, type) {
    // Cari selector yang benar berdasarkan tipe halaman
    const selector = type === 'mlbb' ? '#mlbb-page .payment-method-card' : '#generic-page .payment-method-card';
    document.querySelectorAll(selector).forEach(c => c.classList.remove('selected'));
    
    item.classList.add('selected');
    
    // Update state dengan KEY spesifik (BCA, DANA) dan TIPE (Bank, EWALLET, QRIS)
    currentGameState.selectedMethod = {
        key: item.getAttribute('data-method-key'), // e.g., 'BCA'
        type: item.getAttribute('data-method-type') // e.g., 'Bank'
    };

    updateSummary(type);
}

/** * Mengelola tampilan detail pembayaran: menyembunyikan kategori, menampilkan metode spesifik.
 * @param {string} type - 'Bank', 'EWALLET', atau 'QRIS'.
 * @param {string} parentSelector - Selector halaman induk ('#mlbb-page' atau '#generic-page').
 */
function togglePaymentGroup(type, parentSelector) {
    const parentContainer = document.querySelector(parentSelector);
    if (!parentContainer) return;

    // Sembunyikan semua grup metode spesifik
    parentContainer.querySelectorAll('.method-group').forEach(g => g.style.display = 'none');
    
    // Tampilkan grup yang dipilih
    const targetGroup = parentContainer.querySelector(`.method-group[data-group="${type}"]`);
    if (targetGroup) {
        targetGroup.style.display = 'block';
    }

    // Toggle tampilan
    parentContainer.querySelector('.payment-category-buttons').style.display = 'none'; // Sembunyikan tombol kategori
    parentContainer.querySelector('.payment-detail-view').classList.add('active'); // Tampilkan tampilan detail
}


// --- E. Update Ringkasan ---
function updateSummary(type) {
    let gameId, serverId = null, nominalElement, priceElement, methodElement, checkoutButton;
    let isValid = false;

    if (type === 'mlbb') {
        gameId = mlbbGameIdInput.value;
        serverId = mlbbServerIdInput.value;
        nominalElement = document.getElementById('mlbb-summary-nominal');
        priceElement = document.getElementById('mlbb-summary-price');
        methodElement = document.getElementById('mlbb-summary-method');
        checkoutButton = finalCheckoutButtonMlbb;
        isValid = currentGameState.selectedNominal && currentGameState.selectedMethod && gameId && serverId;
    } else { // Generic
        gameId = genericGameIdInput.value;
        nominalElement = document.getElementById('generic-summary-nominal');
        priceElement = document.getElementById('generic-summary-price');
        methodElement = document.getElementById('generic-summary-method');
        checkoutButton = finalCheckoutButtonGeneric;
        isValid = currentGameState.selectedNominal && currentGameState.selectedMethod && gameId;
    }

    if (currentGameState.selectedNominal) {
        nominalElement.textContent = `Nominal: ${currentGameState.selectedNominal.label}`;
        priceElement.textContent = `Harga: Rp ${currentGameState.selectedNominal.price.toLocaleString('id-ID')}`;
    }
if (currentGameState.selectedMethod) {
    // Cari nama metode spesifik dari METHODS
    const selectedMethodName = PAYMENT_ACCOUNTS.METHODS.find(m => m.key === currentGameState.selectedMethod.key).name;
    methodElement.textContent = `Metode: ${selectedMethodName}`;
}
    
    checkoutButton.disabled = !isValid;
    if (isValid) {
        checkoutButton.textContent = `BAYAR SEKARANG - Rp ${currentGameState.selectedNominal.price.toLocaleString('id-ID')}`;
    } else {
        checkoutButton.textContent = `Lengkapi Data di Atas`;
    }
}


// =========================================================
// 3. LOGIKA CHECKOUT & MODAL PEMBAYARAN
// =========================================================

// script.js: GANTI SELURUH FUNGSI handleCheckout

function handleCheckout(type) {
    if (!currentGameState.selectedNominal || !currentGameState.selectedMethod) return;

    let gameId = type === 'mlbb' ? mlbbGameIdInput.value : genericGameIdInput.value;
    let serverId = type === 'mlbb' ? mlbbServerIdInput.value : null;

    const methodKey = currentGameState.selectedMethod.key;
    const methodType = currentGameState.selectedMethod.type;
    const selectedMethodName = PAYMENT_ACCOUNTS.METHODS.find(m => m.key === methodKey).name;

    transactionDetails = {
        product: currentGameState.productTitle,
        nominal: currentGameState.selectedNominal.label,
        price: currentGameState.selectedNominal.price,
        
        // PENTING: Simpan detail lengkap
        methodKey: methodKey, 
        methodType: methodType, 
        
        // PENTING: Gunakan 'method' untuk nama yang ditampilkan di Riwayat dan Modal
        method: selectedMethodName, 
        
        gameId: gameId,
        serverId: serverId,
        qrisImg: currentGameState.selectedNominal.qrisImg
    };

    renderPaymentContent(transactionDetails);
    paymentModal.style.display = 'block';
}

// script.js: GANTI SELURUH FUNGSI renderPaymentContent

function renderPaymentContent(details) {
    let contentHtml = ``;
    let accountInfo;
    
    paymentModalTitle.textContent = `Bayar Rp ${details.price.toLocaleString('id-ID')}`;
    
    const methodKey = details.methodKey; // BCA, DANA, QRIS
    const methodType = details.methodType; // Bank, EWALLET, QRIS
    
    // DETAIL TRANSAKSI UNTUK DIPAKAI DI KEDUA JENIS PEMBAYARAN
    const transactionTableHtml = `
        <hr style="border-color: #333; margin: 15px 0;">
        <p style="text-align: left; font-size: 0.9em;">**Detail Pesanan**</p>
        <table style="width: 100%; text-align: left; font-size: 0.9em; color: #ccc;">
            <tr><td>Produk</td><td>${details.product}</td></tr>
            <tr><td>Nominal</td><td>${details.nominal}</td></tr>
            <tr><td>ID</td><td>${details.gameId}${details.serverId ? ` (${details.serverId})` : ''}</td></tr>
            <tr><td>Metode</td><td>${details.method}</td></tr>
        </table>
    `;

    if (methodType === 'Bank' || methodType === 'EWALLET') {
        accountInfo = PAYMENT_ACCOUNTS.ACCOUNTS[methodKey]; 
        
        let targetLabel = methodType === 'Bank' ? 'Nomor Rekening' : 'Nomor Tujuan/HP';
        
        contentHtml = `
            <p>Transfer ke:</p>
            <div class="payment-info">
                <p class="bank-name">${details.method} (A.N. ${accountInfo.name})</p>
                <p id="account-number" class="copy-target" data-copy="${accountInfo.number}">${targetLabel}: <b>${accountInfo.number}</b></p>
                <p>Jumlah Bayar: <b>Rp ${details.price.toLocaleString('id-ID')}</b></p>
                <p class="copied-message">Nomor berhasil disalin!</p>
            </div>
            ${transactionTableHtml} <div class="confirmation-input-group">
                <h4 style="color: #ffc107; margin-top: 20px;">Langkah Konfirmasi</h4>
                <p class="small-info" style="margin-bottom: 5px;">Setelah transfer, masukkan ID Transaksi atau Unggah Bukti:</p>
                
                <input type="text" id="transaction-id-input" placeholder="ID Transaksi (Optional)" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #333; color: white; margin-bottom: 10px;">
                <input type="file" id="proof-image-upload" accept="image/*" class="file-input-style" style="margin-bottom: 15px;">

                <button id="confirm-payment" class="top-up-button">Konfirmasi Pembayaran</button>
            </div>
        `;
    } else if (methodType === 'QRIS') {
        contentHtml = `
            <p>Scan QRIS berikut untuk nominal <b>${details.nominal}</b>:</p>
            <div class="payment-info">
                <img src="assets/qris/${details.qrisImg}" alt="QRIS Pembayaran ${details.nominal}">
                <p>Jumlah Bayar: <b>Rp ${details.price.toLocaleString('id-ID')}</b></p>
                <p class="small-info">Pastikan nominal QRIS yang Anda scan sudah sesuai.</p>
            </div>
            ${transactionTableHtml} <div class="confirmation-input-group">
                <h4 style="color: #ffc107; margin-top: 20px;">Langkah Konfirmasi</h4>
                <p class="small-info" style="margin-bottom: 5px;">Setelah scan/bayar, masukkan ID Transaksi atau Unggah Bukti:</p>
                
                <input type="text" id="transaction-id-input" placeholder="ID Transaksi (Optional)" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #333; color: white; margin-bottom: 10px;">
                <input type="file" id="proof-image-upload" accept="image/*" class="file-input-style" style="margin-bottom: 15px;">

                <button id="confirm-payment" class="top-up-button">Konfirmasi Pembayaran</button>
            </div>
        `;
    } 
    
    paymentContent.innerHTML = contentHtml;

    // Re-attach listeners setelah konten dirender
    const copyTarget = document.getElementById('account-number');
    if (copyTarget) {
        copyTarget.addEventListener('click', copyAccountNumber);
    }
    
    // Re-attach listener untuk confirm payment
    const newConfirmButton = document.getElementById('confirm-payment');
    // Hapus listener lama jika ada (penting untuk menghindari duplikasi)
    if (newConfirmButton) {
        newConfirmButton.removeEventListener('click', confirmPaymentHandler);
        newConfirmButton.addEventListener('click', confirmPaymentHandler);
    }
}

function confirmPaymentHandler() {
    const transactionId = document.getElementById('transaction-id-input').value.trim();
    const proofImageFile = document.getElementById('proof-image-upload').files[0];

    if (!transactionId && !proofImageFile) {
        alert("Mohon masukkan ID Transaksi atau Unggah Bukti Gambar untuk melanjutkan konfirmasi.");
        return;
    }
    
    // Memanggil fungsi utama konfirmasi
    processTransactionConfirmation(transactionId, proofImageFile);
}


function copyAccountNumber(e) {
    const target = e.currentTarget;
    const numberToCopy = target.getAttribute('data-copy');
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(numberToCopy).then(() => {
            const message = target.closest('.payment-info').querySelector('.copied-message');
            message.style.display = 'block';
            setTimeout(() => message.style.display = 'none', 1500);
        }).catch(err => {
            console.error('Gagal menyalin: ', err);
            alert(`Gagal menyalin. Silakan salin manual: ${numberToCopy}`);
        });
    } else {
        alert(`Gagal menyalin. Silakan salin manual: ${numberToCopy}`);
    }
}

closePaymentModal.addEventListener('click', () => {
    paymentModal.style.display = 'none';
});

// *********************************************************
// LOGIKA KONFIRMASI PEMBAYARAN & PENYIMPANAN BUKTI (DIPERBARUI)
// *********************************************************
// script.js: GANTI SELURUH FUNGSI processTransactionConfirmation

function processTransactionConfirmation(transactionId, proofImageFile) {
    
    // URL Vercel Serverless Function Anda (Endpoint)
    const TELEGRAM_SERVERLESS_ENDPOINT = '/api/send_telegram'; // Relatif ke domain Vercel Anda

    // Fungsi untuk melanjutkan setelah mendapatkan Base64
    const sendAndSave = (confirmationImageSrc, fileName) => {
        
        // 1. Buat pesan Telegram
        const messageCaption = `
*--- 🔔 PESANAN BARU (RAKUNSHOP) 🔔 ---*

*Produk:* ${transactionDetails.product}
*Nominal:* ${transactionDetails.nominal}
*Harga:* Rp ${transactionDetails.price.toLocaleString('id-ID')}
*Metode Bayar:* ${transactionDetails.method}

*Detail Pelanggan:*
${currentGameState.isPulsa ? 'No. HP' : 'ID'} : \`${transactionDetails.gameId}\`
${transactionDetails.serverId ? `Server : \`${transactionDetails.serverId}\`` : ''}

*Konfirmasi:*
${transactionId ? `ID Transaksi: \`${transactionId}\`` : 'Tidak Ada ID Transaksi'}
${proofImageFile ? `Bukti Gambar: ${fileName} (Lihat Riwayat Lokal)` : 'Tidak Ada Bukti Gambar'}
`;

        // 2. Siapkan Data untuk Dikirim ke Vercel Serverless Function
        const dataToSend = {
            message_caption: messageCaption,
            // Kita tetap kirimkan data file, tapi Serverless Function mungkin mengabaikannya
            // karena kompleksitas pengiriman file via JSON body.
            file_content: confirmationImageSrc, // Base64 data atau null
            file_name: fileName
        };

        // 3. Kirim ke Vercel Serverless Function
        fetch(TELEGRAM_SERVERLESS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(result => {
            let status = 'Menunggu Konfirmasi';
            let statusClass = 'pending';
            let alertMessage = "";

            if (result.status === 'success') {
                alertMessage = "✅ Konfirmasi pembayaran berhasil dikirim ke Telegram (via Vercel)!";
            } else {
                status = 'Gagal Notifikasi';
                statusClass = 'error';
                alertMessage = `❌ GAGAL mengirim notifikasi ke Telegram: ${result.message}. Data disimpan lokal.`;
            }

            // 4. SELALU simpan lokal setelah respon dari server
            const newTransaction = {
                id: Date.now(),
                date: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
                timestamp: Date.now(), 
                productTitle: transactionDetails.product,
                type: currentGameState.isPulsa ? 'Pulsa' : 'Game', 
                uniqueDetail: currentGameState.isPulsa
                    ? `No. HP: ${transactionDetails.gameId}`
                    : transactionDetails.serverId 
                    ? `ID: ${transactionDetails.gameId} | Server: ${transactionDetails.serverId}`
                    : `ID: ${transactionDetails.gameId}`, 
                amount: transactionDetails.nominal,
                paymentMethod: transactionDetails.method,
                price: `Rp ${transactionDetails.price.toLocaleString('id-ID')}`,
                confirmationProof: transactionId ? `ID Transaksi: ${transactionId}` : proofImageFile ? `Bukti Gambar: ${fileName}` : 'Tidak Ada Bukti Yang Diberikan',
                confirmationImageSrc: confirmationImageSrc, // Base64 Data URL
                status: status, 
                statusClass: statusClass 
            };
            
            saveTransaction(newTransaction);
            
            // Bersihkan input dan tutup modal
            const modalContent = paymentModal.querySelector('.modal-content');
            if (modalContent) {
                const idInput = modalContent.querySelector('#transaction-id-input');
                const fileInput = modalContent.querySelector('#proof-image-upload');
                if(idInput) idInput.value = '';
                if(fileInput) fileInput.value = '';
            }
            paymentModal.style.display = 'none';
            alert(alertMessage);
            navigate('data');
        })
        .catch(error => {
            // Gagal di sisi jaringan
            alert(`⚠️ Terjadi kesalahan jaringan: ${error.message}. Transaksi gagal. Data disimpan lokal dengan status Gagal Notifikasi.`);
            // Simpan lokal sebagai gagal notifikasi
            saveTransactionLocally('Gagal Notifikasi', 'error', confirmationImageSrc);
            paymentModal.style.display = 'none';
            navigate('data');
        });
    };

    // Logika pembacaan file proof (untuk mendapatkan Base64 untuk penyimpanan lokal)
    if (proofImageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            sendAndSave(e.target.result); 
        };
        reader.onerror = function() {
            alert("Gagal membaca file gambar. Mengirim data tanpa gambar.");
            sendAndSave(null); 
        };
        reader.readAsDataURL(proofImageFile);
    } else {
        sendAndSave(null); // Kirim tanpa gambar
    }
}
// *********************************************************

// =========================================================
// 4. HISTORY TRANSAKSI & DETAIL MODAL (DIPERBARUI)
// =========================================================

function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('rakunshop_transactions') || '[]');
    transactions.unshift(transaction); 
    if (transactions.length > 100) {
        transactions = transactions.slice(0, 100);
    }
    localStorage.setItem('rakunshop_transactions', JSON.stringify(transactions));
}

// FUNGSI BARU: MENAMPILKAN DETAIL TRANSAKSI
function showTransactionDetails(transaction) {
    document.getElementById('detail-product').textContent = transaction.productTitle;
    document.getElementById('detail-unique-id').textContent = transaction.uniqueDetail;
    document.getElementById('detail-nominal').textContent = transaction.amount;
    document.getElementById('detail-price').textContent = transaction.price;
    document.getElementById('detail-method').textContent = transaction.paymentMethod;
    
    const detailStatus = document.getElementById('detail-status');
    detailStatus.textContent = transaction.finalStatusText; 
    detailStatus.style.color = transaction.currentStatusClass === 'success' ? '#1affc1' : '#ffc107'; 

    const proofText = document.getElementById('detail-proof-text');
    const proofImage = document.getElementById('detail-proof-image');

    // Logic Menampilkan Bukti Gambar
    if (transaction.confirmationImageSrc) {
        proofText.style.display = 'none';
        proofImage.style.display = 'block';
        proofImage.src = transaction.confirmationImageSrc;
    } else {
        // Tampilkan teks jika tidak ada gambar (atau hanya ID Transaksi)
        proofImage.style.display = 'none';
        proofText.style.display = 'block';
        // Tampilkan bukti konfirmasi, jika ada. Jika tidak ada, tampilkan pesan default.
        proofText.textContent = transaction.confirmationProof || "Tidak ada bukti yang dilampirkan.";
    }

    detailModal.style.display = 'block';
}

if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => {
        detailModal.style.display = 'none';
    });
}


function renderTransactionHistory() {
    const transactions = JSON.parse(localStorage.getItem('rakunshop_transactions') || '[]');
    const berhasilContainer = document.getElementById('berhasil');
    const menungguContainer = document.getElementById('menunggu');
    
    berhasilContainer.innerHTML = '';
    menungguContainer.innerHTML = '';
    
    let successCount = 0;
    let pendingCount = 0;

    // Logika Waktu Otomatis Sukses (5 menit)
    const timeThreshold = 5 * 60 * 1000; 
    const currentTime = Date.now();


    transactions.forEach(t => {
        let currentStatusClass = t.statusClass; 
        let currentStatusText = t.status;
        let remainingMinutes = null;
        
        // Cek Logika Sukses Otomatis
        if (t.timestamp) { 
            const timeElapsed = currentTime - t.timestamp;
            
            if (timeElapsed >= timeThreshold) {
                currentStatusClass = 'success';
                currentStatusText = 'Berhasil (Otomatis)';
            } else {
                const remainingTimeMs = timeThreshold - timeElapsed;
                remainingMinutes = Math.ceil(remainingTimeMs / 60000); 
                currentStatusText = `Menunggu Konfirmasi`;
            }
        } 
        
        // Logika Sukses Simulasi Lama
        else if (t.id % 20000 < 5000) {
              currentStatusClass = 'success';
              currentStatusText = 'Berhasil (Simulasi ID)';
        }

        // Final status text for display
        const finalStatusDisplay = currentStatusClass === 'success' 
            ? 'Berhasil' 
            : `Menunggu Konfirmasi ${remainingMinutes ? '(' + remainingMinutes + ' mnt lagi)' : ''}`;

        // Objek Transaksi Lengkap untuk Modal Detail
        const transactionWithStatus = {
            ...t,
            finalStatusText: finalStatusDisplay,
            currentStatusClass: currentStatusClass
        };

        const itemHtml = `
            <div class="transaction-item ${currentStatusClass}" data-transaction-id="${t.id}">
                <div class="transaction-icon"><i class="fas ${currentStatusClass === 'success' ? 'fa-check-circle' : 'fa-clock'}"></i></div>
                <div class="transaction-details">
                    <p class="transaction-title">${t.productTitle}</p>
                    <p class="transaction-desc">${t.uniqueDetail} | Bayar: ${t.paymentMethod}</p>
                    <p class="transaction-status">Status: ${finalStatusDisplay} (${t.date})</p>
                    ${t.confirmationProof ? `<p class="transaction-proof" style="font-size: 0.8em; color: #1affc1;">Bukti: ${t.confirmationProof}</p>` : ''}
                </div>
                <p class="transaction-price">${t.price}</p>
            </div>
        `;

        // Buat Elemen DOM dari HTML String
        const tempElement = document.createElement('div');
        tempElement.innerHTML = itemHtml.trim();
        const itemElement = tempElement.firstChild;
        
        // PENTING: Tambahkan event listener untuk menampilkan detail modal
        itemElement.addEventListener('click', () => showTransactionDetails(transactionWithStatus));
        
        if (currentStatusClass === 'success') {
            berhasilContainer.appendChild(itemElement);
            successCount++;
        } else {
            menungguContainer.appendChild(itemElement);
            pendingCount++;
        }
    });
    
    const emptyHtml = (message) => `
        <div class="empty-state">
            <span class="icon-large">唐</span>
            <h3>${message}</h3>
            <p>Ayo, cek kembali riwayatmu atau buat pesanan baru.</p>
            <a href="#" class="top-up-button back-to-home-button">TOP UP SEKARANG</a>
        </div>
    `;

    if (successCount === 0) {
        berhasilContainer.innerHTML = emptyHtml("Riwayat Transaksi Berhasil Kosong");
    }
    if (pendingCount === 0) {
          menungguContainer.innerHTML = emptyHtml("Tidak Ada Transaksi yang Diproses / Menunggu");
    }

    document.querySelectorAll('.back-to-home-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigate('home');
        });
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(button.getAttribute('data-tab')).classList.add('active');
        });
    });
    
    // PENTING: Refresh halaman 'Data' setiap 5 detik untuk cek waktu
    if (!dataPage.classList.contains('hidden-page')) {
          setTimeout(renderTransactionHistory, 5000); 
    }
}



// =========================================================
// 5. LOGIKA PENCARIAN (DIPERBARUI: Tambah Ikon & UI)
// =========================================================

// Tambahkan data Ikon untuk Pencarian (Harap pastikan gambar ini ada di folder 'assets/icons/')
const SEARCHABLE_PRODUCTS = [
    // Game
    { id: 'mlbb', page: 'mlbb-page', name: 'Mobile Legends: Bang Bang', keywords: ['diamond', 'ml', 'moba', 'legends'], icon: 'assets/icons/mlbb.png' },
    
    { id: 'pubg', page: 'generic-page', name: 'PUBG Mobile', keywords: ['uc', 'battle royale', 'pubgi'], icon: 'assets/icons/pubg.png' },
    
    { id: 'supersus', page: 'generic-page', name: 'Supersus', keywords: ['bintang', 'sus', 'among us', 'sos'], icon: 'assets/icons/supersus.png' },
    
    { id: 'genshin', page: 'generic-page', name: 'Genshin Impact', keywords: ['crystal', 'gi', 'mihoyo', 'primogem'], icon: 'assets/icons/genshin.png' },
    
    { id: 'freefire', page: 'generic-page', name: 'Garena Free Fire', keywords: ['diamond', 'ff', 'garena', 'fire'], icon: 'assets/icons/freefire.png' },
    
    { id: 'aov', page: 'generic-page', name: 'Arena of Valor', keywords: ['voucher', 'aov', 'moba'], icon: 'assets/icons/aov.png' },
    
    // Game Tambahan (Harap pastikan ikon ada)
    
    { id: 'valorant', page: 'generic-page', name: 'Valorant Points', keywords: ['vp', 'riot', 'fps', 'val'], icon: 'assets/icons/valorant.png' },
    
    { id: 'codm', page: 'generic-page', name: 'Call of Duty Mobile', keywords: ['cp', 'cod', 'mobile'], icon: 'assets/icons/codm.png' },
    
    { id: 'hago', page: 'generic-page', name: 'Hago Coin', keywords: ['koin', 'hago', 'coin'], icon: 'assets/icons/hago.png' }, 
    
    // --- TAMBAHAN DATA FAYA DI SINI ---
    { 
        id: 'faya', 
        page: 'generic-page', 
        name: 'FAYA TOP UP', 
        keywords: ['faya', 'top up', 'link', 'external', 'topupfaya'], 
        icon: 'assets/icons/fingerprint.png',
    },
    
    // Pulsa
    
    { id: 'telkomsel', page: 'generic-page', name: 'Pulsa Telkomsel', keywords: ['pulsa', 'telkom', 'simpati', 'as', 'kartu as'], icon: 'assets/icons/telkomsel.png' },
    
    { id: 'indosat', page: 'generic-page', name: 'Pulsa Indosat', keywords: ['pulsa', 'indosat', 'im3'], icon: 'assets/icons/indosat.png' },
    
    { id: 'xl', page: 'generic-page', name: 'Pulsa XL', keywords: ['pulsa', 'xl', 'axiata'], icon: 'assets/icons/xl.png' },
    
    { id: 'smartfren', page: 'generic-page', name: 'Pulsa Smartfren', keywords: ['pulsa', 'smartfren'], icon: 'assets/icons/smartfren.png' },
    
    { id: 'axis', page: 'generic-page', name: 'Pulsa Axis', keywords: ['pulsa', 'axis'], icon: 'assets/icons/axis.png' },
    
    { id: 'tri', page: 'generic-page', name: 'Pulsa Tri', keywords: ['pulsa', 'three'], icon: 'assets/icons/tri.png' },
    
    // Contoh lain
    
    { id: 'googleplay', page: 'generic-page', name: 'Voucher Google Play', keywords: ['voucher', 'google', 'play store'], icon: 'assets/icons/googleplay.png' },
    
    { id: 'spotify', page: 'generic-page', name: 'Voucher Spotify Premium', keywords: ['spotify', 'musik', 'premium'], icon: 'assets/icons/spotify.png' },
    
    { id: 'tiktokkoin', page: 'generic-page', name: 'Koin TikTok', keywords: ['tiktok', 'koin', 'gift'], icon: 'assets/icons/tiktok-koin.png' },
    
    { id: 'domino', page: 'generic-page', name: 'Chip Higgs Domino', keywords: ['domino', 'higgs', 'chip'], icon: 'assets/icons/domino.png' },
];

// script.js: GANTI SELURUH FUNGSI renderSearchResults(query)

function renderSearchResults(query) {
    const term = query.toLowerCase().trim();
    searchResultsContainer.innerHTML = '';
    
    // Jika query kosong, tampilkan pesan default (UI lebih baik)
    if (term.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="empty-state-search">
                <span class="icon-large">剥</span>
                <h3>Cari Produk Impianmu</h3>
                <p>Ketik nama game, pulsa, atau voucher yang ingin kamu beli.</p>
            </div>
        `;
        return;
    }

    // Cari produk yang cocok
    const filteredProducts = SEARCHABLE_PRODUCTS.filter(product => {
        return product.name.toLowerCase().includes(term) || 
               product.keywords.some(keyword => keyword.includes(term));
    });

    if (filteredProducts.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="empty-state-search">
                <span class="icon-large">亊</span>
                <h3>Oops, Tidak Ditemukan</h3>
                <p>Tidak ada hasil untuk <b>"${query}"</b>. Coba kata kunci lain atau periksa ejaan.</p>
            </div>
        `;
        return;
    }

    // --- LOGIKA RENDERING YANG DI PERBAHARUI ---
    filteredProducts.forEach(product => {
        // Cek data lengkap dari PRODUCTS_DATA untuk mendapatkan externalUrl
        const fullProductData = PRODUCTS_DATA[product.id] || {}; 
        
        const iconSrc = product.icon || 'assets/icons/default.png'; 
        
        // Tentukan atribut jika produk memiliki tautan eksternal (PENTING untuk FAYA)
        const isExternal = fullProductData.externalUrl;
        const externalAttr = isExternal ? `data-external-url="${fullProductData.externalUrl}"` : '';
        const dataIdAttr = isExternal ? '' : `data-id="${product.id}"`;
        const dataPageAttr = isExternal ? '' : `data-page="${product.page}"`;
        
        // Tambahkan subtitle jika ini link eksternal
        const subtitle = isExternal ? '<div class="product-subtitle">Link Eksternal</div>' : '';
        
        const cardHtml = `
            <div class="product-card search-result-card" ${dataIdAttr} ${dataPageAttr} ${externalAttr}>
                <div class="product-icon"><img src="${iconSrc}" alt="${product.name}" onerror="this.src='assets/icons/default.png'"></div>
                <div class="product-name">${product.name}</div>
                ${subtitle}
            </div>
        `;
        searchResultsContainer.innerHTML += cardHtml;
    });

    // --- LOGIKA KLIK YANG DI PERBAHARUI ---
    document.querySelectorAll('#search-results-container .product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Cek apakah kartu memiliki tautan eksternal (Untuk FAYA)
            const externalUrl = card.getAttribute('data-external-url');
            
            // Tutup modal pencarian
            searchModal.style.display = 'none';

            if (externalUrl) {
                // JIKA FAYA: Buka link eksternal di tab baru
                window.open(externalUrl, '_blank'); 
                return; // Hentikan proses
            } 
            
            // 2. JIKA PRODUK INTERNAL: Lanjutkan Logika Top-Up Game/Pulsa
            const gameKey = card.getAttribute('data-id');
            const targetPage = card.getAttribute('data-page');

            if (PRODUCTS_DATA[gameKey]) {
                setupTopUpPage(gameKey); 
                navigate(targetPage);
            } else {
                // Memberikan feedback yang lebih baik jika produk belum didukung
                alert(`Maaf, produk **${card.querySelector('.product-name').textContent}** belum tersedia untuk Top Up. Fitur akan segera hadir!`);
            }
        });
    });
}

// script.js: GANTI SELURUH FUNGSI renderPaymentMethods

function renderPaymentMethods() {
    // 1. Kelompokkan metode berdasarkan tipe (Bank, EWALLET, QRIS)
    const groupedMethods = PAYMENT_ACCOUNTS.METHODS.reduce((acc, method) => {
        if (!acc[method.type]) {
            acc[method.type] = [];
        }
        acc[method.type].push(method);
        return acc;
    }, {});

    // 2. Fungsi pembantu untuk membuat HTML kartu
    const generateMethodHtml = (methods) => methods.map(method => {
        // Tentukan path icon berdasarkan key (e.g., bca.png, dana.png)
        // Jika type QRIS, gunakan ikon 'qris.png', jika Bank/EWALLET gunakan ikon spesifik
        let iconPath = method.key.toLowerCase();
        if (method.key === 'QRIS') {
            iconPath = 'qris'; // Ganti agar mengambil qris.png
        }
        
        return `
            <div class="payment-method-card" data-method-key="${method.key}" data-method-type="${method.type}">
                <div class="method-icon">
                    <img src="assets/icons/bank/${iconPath}.png" alt="${method.name} Icon" onerror="this.src='assets/icons/default_payment.png'">
                </div>
                <div class="method-name">${method.name}</div>
                <div class="method-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
        `;
    }).join('');

    // 3. Pasang metode pembayaran ke kontainer di MLBB dan Generic Page
    const containers = [
        { type: 'mlbb', parentSelector: '#mlbb-page' },
        { type: 'generic', parentSelector: '#generic-page' }
    ];

    containers.forEach(cont => {
        const parentContainer = document.querySelector(cont.parentSelector);
        if (!parentContainer) return;

        // Isi konten ke kontainer spesifik (bank, ewallet, qris)
        const bankContainer = parentContainer.querySelector('.bank-methods-group');
        const ewalletContainer = parentContainer.querySelector('.ewallet-methods-group');
        const qrisContainer = parentContainer.querySelector('.qris-methods-group');

        if (bankContainer) bankContainer.innerHTML = generateMethodHtml(groupedMethods.Bank || []);
        if (ewalletContainer) ewalletContainer.innerHTML = generateMethodHtml(groupedMethods.EWALLET || []);
        if (qrisContainer) qrisContainer.innerHTML = generateMethodHtml(groupedMethods.QRIS || []);
        
        // 4. Tambahkan Event Listener ke Tombol Kategori
        parentContainer.querySelectorAll('.payment-category-buttons .category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                togglePaymentGroup(e.currentTarget.getAttribute('data-type'), cont.parentSelector);
            });
        });
        
        // 5. Tambahkan Event Listener ke Tombol Kembali
        parentContainer.querySelectorAll('.back-to-categories').forEach(backBtn => {
            backBtn.addEventListener('click', () => {
                // Sembunyikan detail view dan tampilkan tombol kategori utama
                parentContainer.querySelector('.payment-category-buttons').style.display = 'flex';
                parentContainer.querySelector('.payment-detail-view').classList.remove('active');
            });
        });
    });

    // 6. Tambahkan Event Listener ke setiap Kartu Metode Spesifik
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Tentukan jenis halaman
            const pageType = card.closest('#mlbb-page') ? 'mlbb' : 'generic';
            handleMethodSelection(e.currentTarget, pageType);
            
            // Setelah memilih, kembali otomatis ke tampilan ringkasan
            const parentSelector = pageType === 'mlbb' ? '#mlbb-page' : '#generic-page';
            const parentContainer = document.querySelector(parentSelector);
            
            // Pastikan kita selalu kembali ke tampilan kategori utama
            parentContainer.querySelector('.payment-category-buttons').style.display = 'flex';
            parentContainer.querySelector('.payment-detail-view').classList.remove('active');
        });
    });
}


// =========================================================
// 6. LOGIKA SLIDER, TOGGLE & DOMContentLoaded
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SLIDER OTOMATIS ---
    const bannerSlider = document.querySelector('.banner-slider');
    const bannerSlides = document.querySelectorAll('.banner-slide'); 
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const totalSlides = bannerSlides.length; 
    let intervalID; 

    function updateSlides(index) {
        bannerSlides.forEach(slide => slide.classList.remove('active')); 
        dots.forEach(dot => dot.classList.remove('active')); 

        if (bannerSlides[index]) {
            bannerSlides[index].classList.add('active'); 
            dots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlides(currentIndex);
    }

    function startAutoSlide() {
        if (intervalID) {
            clearInterval(intervalID);
        }
        intervalID = setInterval(nextSlide, 4000); 
    }

    function stopAutoSlide() {
        clearInterval(intervalID);
    }

    if (totalSlides > 0 && bannerSlider) {
        updateSlides(currentIndex); 
        startAutoSlide();
        
        bannerSlider.addEventListener('mouseover', stopAutoSlide);
        bannerSlider.addEventListener('mouseout', startAutoSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide(); 
                currentIndex = index;
                updateSlides(currentIndex);
                startAutoSlide(); 
            });
        });
    }

    // --- 2. FITUR TAMPILKAN/SEMBUNYIKAN PRODUK TAMBAHAN ---
    const toggleButton = document.getElementById('toggle-products');
    const hiddenContainer = document.querySelector('.product-grid .hidden-products.active-on-toggle'); 
    
    if (toggleButton && hiddenContainer) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            hiddenContainer.classList.toggle('show');
            
            const isVisible = hiddenContainer.classList.contains('show');
            toggleButton.textContent = isVisible ? 'Sembunyikan' : 'Tampilkan semua';
        });
    }

    // --- 3. LISTENERS & INISIASI ---
    
    // Listener Navigasi (Bottom Bar)
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            let targetId = href === '#' ? 'home' : href.substring(1); 
            navigate(targetId);
        });
    });

// Listener Card Produk (Pindah Halaman Top-Up / Eksternal)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Cek apakah kartu memiliki tautan eksternal
            const externalUrl = card.getAttribute('data-external-url'); 
            
            if (externalUrl) {
                // Jika ada URL eksternal, buka di tab baru
                window.open(externalUrl, '_blank'); 
            } else {
                // Lanjutkan dengan logika internal SPA yang lama (Pindah Halaman Top-Up)
                const gameKey = card.getAttribute('data-id');
                const targetPage = card.getAttribute('data-page');

                if (gameKey && targetPage) {
                    setupTopUpPage(gameKey); 
                    navigate(targetPage);
                }
            }
        });
    });
    
    // Listeners untuk Input ID/Server (Update Summary)
    if (mlbbGameIdInput && mlbbServerIdInput) {
        mlbbGameIdInput.addEventListener('input', () => updateSummary('mlbb'));
        mlbbServerIdInput.addEventListener('input', () => updateSummary('mlbb'));
    }
    if (genericGameIdInput) {
        genericGameIdInput.addEventListener('input', () => updateSummary('generic'));
    }
    
    // Listener Checkout
    if (finalCheckoutButtonMlbb) {
        finalCheckoutButtonMlbb.addEventListener('click', () => handleCheckout('mlbb'));
    }
    if (finalCheckoutButtonGeneric) {
        finalCheckoutButtonGeneric.addEventListener('click', () => handleCheckout('generic'));
    }

    // =========================================================
    // 7. LOGIKA MODAL PENCARIAN & INFO (INISIASI)
    // =========================================================
    
    // A. Buka Modal Pencarian
    searchButton.addEventListener('click', () => {
        searchModal.style.display = 'block';
        searchInput.value = ''; // Reset input
        searchInput.focus();
        renderSearchResults(''); // Tampilkan semua produk saat dibuka
    });

    // B. Tutup Modal Pencarian
    closeSearchModal.addEventListener('click', () => {
        searchModal.style.display = 'none';
    });

    // C. Buka Modal Info
    infoButton.addEventListener('click', () => {
        infoModal.style.display = 'block';
    });

    // D. Tutup Modal Info
    closeInfoModal.addEventListener('click', () => {
        infoModal.style.display = 'none';
    });

    // E. Tutup modal jika klik di luar area konten
    window.addEventListener('click', (event) => {
        if (event.target == searchModal) {
            searchModal.style.display = 'none';
        }
        if (event.target == infoModal) {
            infoModal.style.display = 'none';
        }
    });
    
// F. Event Listener untuk input teks pencarian
searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
});

// PENTING: Render Metode Pembayaran Baru
renderPaymentMethods(); 

// INISIASI APLIKASI UTAMA
navigate('home');
});

// script.js: SISIPKAN FUNGSI BARU INI

/**
 * Mengelola tampilan detail pembayaran: menyembunyikan kategori, menampilkan metode spesifik.
 * @param {string} type - 'Bank', 'EWALLET', atau 'QRIS'.
 * @param {string} parentSelector - Selector halaman induk ('#mlbb-page' atau '#generic-page').
 */
function togglePaymentGroup(type, parentSelector) {
    const parentContainer = document.querySelector(parentSelector);
    if (!parentContainer) return;

    // Sembunyikan semua grup metode spesifik
    parentContainer.querySelectorAll('.method-group').forEach(g => g.style.display = 'none');
    
    // Tampilkan grup yang dipilih
    const targetGroup = parentContainer.querySelector(`.method-group[data-group="${type}"]`);
    if (targetGroup) {
        targetGroup.style.display = 'block';
    }

    // Toggle tampilan
    parentContainer.querySelector('.payment-category-buttons').style.display = 'none'; // Sembunyikan tombol kategori
    parentContainer.querySelector('.payment-detail-view').classList.add('active'); // Tampilkan tampilan detail
}