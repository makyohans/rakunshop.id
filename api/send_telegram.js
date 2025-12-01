// api/send_telegram.js (KODE YANG HARUS ANDA GUNAKAN)

// Menggunakan variabel lingkungan (Environment Variable) yang Aman
// Token dan Chat ID diambil secara aman dari setting Vercel (Langkah 4)
const BOT_TOKEN = process.env.BOT_TOKEN; 
const CHAT_ID = process.env.CHAT_ID;
const TELEGRAM_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Fungsi pembantu untuk mengirim pesan teks
async function sendMessage(text) {
    const params = {
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
    };

    const response = await fetch(`${TELEGRAM_URL}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    return response.json();
}

// Fungsi utama untuk menangani request dari script.js
export default async (req, res) => {
    // Pastikan hanya menerima permintaan POST
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // Mengizinkan permintaan dari domain yang berbeda (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request (khusus browser)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Vercel otomatis mem-parse body JSON
        const { message_caption, file_content, file_name } = req.body;
        
        if (!message_caption) {
            res.status(400).json({ status: 'error', message: 'Data atau pesan Telegram tidak valid' });
            return;
        }

        let telegramResult;

        if (file_content && file_name) {
            // Karena pengiriman Base64 via JSON body di Vercel tidak disarankan (payload limit),
            // kita kirimkan pesan teks peringatan saja.
            const warningCaption = message_caption + 
                `\n\n*⚠️ Peringatan:* Bukti gambar tersedia secara lokal di browser pelanggan, tidak dapat dikirim langsung dari Vercel Serverless Function dalam format Base64.`;
            telegramResult = await sendMessage(warningCaption);

        } else {
            // Jika hanya teks
            telegramResult = await sendMessage(message_caption);
        }

        if (telegramResult.ok === true) {
            res.status(200).json({ status: 'success', message: 'Pesan Telegram berhasil terkirim' });
        } else {
            res.status(500).json({ status: 'error', message: 'Gagal mengirim ke Telegram API: ' + telegramResult.description });
        }

    } catch (error) {
        console.error('Serverless Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};
