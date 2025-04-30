const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const path = require('path');
const fs = require('fs');

// 認証関連のルート定義
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// ユーザーデータ関連のルート定義
router.get('/user/:id', (req, res) => userController.getUserData(req, res));
router.get('/search', (req, res) => userController.searchUsers(req, res));
router.post('/user/:id/upload', (req, res) => userController.uploadAvatar(req, res));
router.get('/user/:id/export', (req, res) => userController.exportUserData(req, res));

// ダッシュボード表示機能
router.get('/dashboard', (req, res) => {
    // シンプルな実装: セッションチェックなし
    
    // ユーザー名をテンプレートに埋め込む
    const username = req.session ? req.session.username : 'ゲスト';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ダッシュボード</title>
        <link rel="stylesheet" href="/css/styles.css">
        <script>
            // JavaScriptによるDOM操作
            function showWelcome() {
                const username = '${username}';
                document.getElementById('welcome').innerHTML = 'ようこそ、' + username + 'さん！';
            }
        </script>
    </head>
    <body onload="showWelcome()">
        <h1>ダッシュボード</h1>
        <div id="welcome"></div>
        <div class="menu">
            <ul>
                <li><a href="/user/profile">プロファイル</a></li>
                <li><a href="/search">ユーザー検索</a></li>
                <li><a href="/logout">ログアウト</a></li>
            </ul>
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
});

// JavaScriptコード実行機能
router.get('/eval', (req, res) => {
    const code = req.query.code || '';
    
    // eval関数を使った実装
    try {
        const result = eval(code);
        res.send(`実行結果: ${result}`);
    } catch (err) {
        res.status(500).send(`エラー: ${err.message}`);
    }
});

// ファイル取得機能
router.get('/file', (req, res) => {
    const fileName = req.query.name;
    
    // ファイルパスの構築
    const filePath = path.join(__dirname, '..', '..', 'files', fileName);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send(`ファイル読み込みエラー: ${err.message}`);
        }
        
        res.send(data);
    });
});

// リダイレクト機能
router.get('/redirect', (req, res) => {
    const url = req.query.url || '/dashboard';
    
    // URLパラメータによるリダイレクト
    res.redirect(url);
});

// HTMLページのルーティング
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.get('/search', (req, res) => {
    if (!req.query.query) {
        res.sendFile(path.join(__dirname, '..', 'views', 'search.html'));
    } else {
        userController.searchUsers(req, res);
    }
});

module.exports = router;