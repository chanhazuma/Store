const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring');

const FILE_PATH = 'assets/product.json'; // Jalur database JSON kamu

function bacaDataJSON(callback) {
    fs.readFile(FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') return callback([]);
            return callback(null);
        }
        try { callback(JSON.parse(data)); } catch (e) { callback([]); }
    });
}

function simpanDataJSON(data, callback) {
    fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8', (err) => { callback(err); });
}

// Map tipe file agar browser tidak bingung membedakan teks, css, atau js
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const parsedUrl = url.parse(req.url, true);

    // ============================================================
    // ROUTE UTAMA API UNTUK KELOLA DATA (BACKEND)
    // ============================================================
    if (parsedUrl.pathname === '/api/produk' && req.method === 'GET') {
        bacaDataJSON(produkList => {
            if (!produkList) { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('Gagal'); return; }
            res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(produkList));
        });
        return;
    }
    else if (parsedUrl.pathname === '/api/produk/tambah' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const dataBaru = querystring.parse(body);
            dataBaru.harga = parseInt(dataBaru.harga) || 0;
            bacaDataJSON(produkList => {
                produkList.push(dataBaru);
                simpanDataJSON(produkList, err => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h3>Sukses ditambah!</h3><script>setTimeout(() => { window.location.href = "/adminPanel.html"; }, 1000);</script>');
                });
            });
        });
        return;
    }
    else if (parsedUrl.pathname === '/api/produk/ubah' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const dataEdit = querystring.parse(body);
            const index = parseInt(dataEdit.id);
            bacaDataJSON(produkList => {
                if (produkList[index]) {
                    produkList[index] = {
                        nama: dataEdit.nama, deskripsi: dataEdit.deskripsi, info: dataEdit.info,
                        harga: parseInt(dataEdit.harga) || 0, kategori: dataEdit.kategori,
                        gambar: dataEdit.gambar, link: dataEdit.link
                    };
                    simpanDataJSON(produkList, err => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end('<h3>Sukses diubah!</h3><script>setTimeout(() => { window.location.href = "/adminPanel.html"; }, 1000);</script>');
                    });
                } else { res.writeHead(404); res.end('Not Found'); }
            });
        });
        return;
    }
    else if (parsedUrl.pathname === '/api/produk/hapus' && req.method === 'GET') {
        const index = parseInt(parsedUrl.query.id);
        bacaDataJSON(produkList => {
            if (produkList[index] !== undefined) {
                produkList.splice(index, 1);
                simpanDataJSON(produkList, err => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h3>Sukses dihapus!</h3><script>setTimeout(() => { window.location.href = "/adminPanel.html"; }, 1000);</script>');
                });
            } else { res.writeHead(404); res.end('Not Found'); }
        });
        return;
    }

    // ============================================================
    // OTOMATIS MENYAJIKAN FILE JIKA USER MINTA INDEX, ADMIN, CSS, ATAU JS
    // ============================================================
    // Kalau user cuma ketik localhost:3000, otomatis arahkan ke index.html
    let namaFileDicari = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
    
    // Tentukan lokasi file asli di HP kamu
    let lokasiFileAsli = path.join(__dirname, namaFileDicari);
    let ekstensiFile = path.extname(lokasiFileAsli);
    let contentType = MIME_TYPES[ekstensiFile] || 'text/plain';

    // Periksa apakah filenya beneran ada di folder HP kamu
    fs.readFile(lokasiFileAsli, (err, isiFile) => {
        if (err) {
            // Jika file css/js/html tidak ketemu di folder
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File tidak ditemukan di server: ' + namaFileDicari);
            return;
        }
        // Kirim file aslinya ke browser sesuai tipenya (HTML/CSS/JS)
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(isiFile);
    });
});

server.listen(3000, () => {
    console.log('Server Hazuma Store Fullstack aktif di http://localhost:3000');
});
