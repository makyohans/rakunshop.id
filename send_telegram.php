<?php
// send_telegram.php

// -------------------------------------------------------------------
// --- KONFIGURASI TELEGRAM (AMAN, Karena di Sisi Server) ---
// -------------------------------------------------------------------
// GANTI DENGAN BOT TOKEN DAN CHAT ID ANDA YANG ASLI
define('BOT_TOKEN', '8481339874:AAHr2jz-MCqpsml5CCIVz5QZ31ZteTFrdO8'); 
define('CHAT_ID', '7729097393'); 
// -------------------------------------------------------------------

header('Content-Type: application/json');

// Pastikan hanya menerima permintaan POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Hanya menerima permintaan POST']);
    exit;
}

// Ambil data JSON dari body request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Pastikan data yang diterima valid
if (empty($data) || !isset($data['message_caption'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Data atau pesan Telegram tidak valid']);
    exit;
}

$messageCaption = $data['message_caption'];
$fileContent = $data['file_content'] ?? null;
$fileName = $data['file_name'] ?? 'bukti_pembayaran.jpg';

$tmpFilePath = null; // Path untuk menyimpan file sementara
$ch = curl_init();
$url = 'https://api.telegram.org/bot' . BOT_TOKEN;

// Cek apakah ada file bukti pembayaran (Base64)
if ($fileContent) {
    // Decode Base64
    $decodedFile = base64_decode($fileContent);
    
    // Simpan file sementara (penting untuk cURL agar bisa mengirim file)
    $tmpFilePath = sys_get_temp_dir() . '/' . uniqid() . '_' . $fileName;
    if (file_put_contents($tmpFilePath, $decodedFile) === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan file sementara di server.']);
        exit;
    }
    
    // Siapkan untuk mengirim FOTO
    $url .= '/sendPhoto';
    
    // Ciptakan file cURL yang baru dengan path sementara
    $cFile = curl_file_create($tmpFilePath, mime_content_type($tmpFilePath), $fileName);
    
    $params = [
        'chat_id' => CHAT_ID,
        'caption' => $messageCaption,
        'parse_mode' => 'Markdown', // Menggunakan Markdown untuk format pesan
        'photo' => $cFile
    ];

    // Menggunakan CURLOPT_POSTFIELDS normal karena ada file
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

} else {
    // Siapkan untuk mengirim PESAN TEKS biasa
    $url .= '/sendMessage';

    $params = [
        'chat_id' => CHAT_ID,
        'text' => $messageCaption,
        'parse_mode' => 'Markdown' // Menggunakan Markdown untuk format pesan
    ];
    
    // Menggunakan JSON karena tidak ada file
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
}


// Jalankan cURL dan dapatkan respon
$response = curl_exec($ch);

// Periksa error cURL
if (curl_errno($ch)) {
    $error_msg = curl_error($ch);
    curl_close($ch);
    // Hapus file sementara jika ada (Penting!)
    if ($tmpFilePath && file_exists($tmpFilePath)) unlink($tmpFilePath);
    
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengirim ke Telegram (cURL Error): ' . $error_msg]);
    exit;
}

curl_close($ch);

// Hapus file sementara SETELAH cURL selesai dan berhasil
if ($tmpFilePath && file_exists($tmpFilePath)) unlink($tmpFilePath);

// Dekode respon dari Telegram
$result = json_decode($response, true);

if (isset($result['ok']) && $result['ok'] === true) {
    // Sukses
    echo json_encode(['status' => 'success', 'message' => 'Pesan Telegram berhasil terkirim']);
} else {
    // Gagal dari API Telegram
    $error_desc = $result['description'] ?? 'Pesan tidak terkirim';
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengirim ke Telegram API: ' . $error_desc]);
}
?>