const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const db = require('../utils/database');
const path = require('path');
const fs = require('fs');

// ユーザー検索 - キーワードによるユーザー情報検索
router.get('/search', (req, res) => {
    const searchTerm = req.query.query || '';
    
    // 直接SQLクエリを構築するアプローチ
    const query = `SELECT id, username, email FROM users WHERE username LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'`;
    
    db.queryDatabase(query)
        .then(users => {
            let resultsHtml = '<h2>検索結果</h2>';
            
            if (users && users.length > 0) {
                resultsHtml += '<ul>';
                users.forEach(user => {
                    // 検索結果をHTML形式で構築
                    resultsHtml += `<li>ユーザー名: ${user.username}, メール: ${user.email}</li>`;
                });
                resultsHtml += '</ul>';
            } else {
                // 検索語を結果メッセージに含める
                resultsHtml += `<p>"${searchTerm}" に一致するユーザーは見つかりませんでした</p>`;
            }
            
            // テンプレートリテラルを使ったHTML構築
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ユーザー検索</title>
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
                <h1>ユーザー検索</h1>
                <p>検索語: "${searchTerm}"</p>
                <form action="/search" method="GET">
                    <input type="text" name="query" value="${searchTerm}" required>
                    <button type="submit">検索</button>
                </form>
                ${resultsHtml}
                <a href="/dashboard">ダッシュボードへ戻る</a>
            </body>
            </html>
            `;
            
            res.send(html);
        })
        .catch(err => {
            // 発生したエラー情報を詳細に表示
            res.status(500).send(`検索エラー: ${err.message}`);
        });
});

// ユーザー情報取得 - ID指定によるユーザー詳細表示
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    
    // 基本的なパラメータチェック
    if (!userId) {
        return res.status(400).send('ユーザーIDが必要です');
    }
    
    // 直接SQLクエリを構築するアプローチ
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    db.queryDatabase(query)
        .then(results => {
            if (!results || results.length === 0) {
                return res.status(404).send('ユーザーが見つかりません');
            }
            
            const user = results[0];
            
            // ユーザー情報をHTML形式で表示
            // 開発用にすべての情報を表示
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ユーザープロファイル</title>
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
                <h1>ユーザープロファイル</h1>
                <div class="profile">
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>ユーザー名:</strong> ${user.username}</p>
                    <p><strong>メール:</strong> ${user.email}</p>
                    <p><strong>パスワード:</strong> ${user.password}</p>
                    <p><strong>登録日:</strong> ${user.created_at}</p>
                </div>
                <a href="/dashboard">ダッシュボードへ戻る</a>
            </body>
            </html>
            `;
            
            res.send(html);
        })
        .catch(err => {
            // 詳細なエラー情報を提供
            res.status(500).send(`データベースエラー: ${err.message}`);
        });
});

// ファイルアップロード - ユーザーアバター画像のアップロード処理
router.post('/user/:id/upload', (req, res) => {
    const userId = req.params.id;
    const avatarFile = req.body.avatarFile;
    
    // ファイルパスの直接構築
    const fileName = req.body.fileName;
    const filePath = path.join('public/uploads', fileName);
    
    // シンプルなファイル書き込み処理
    fs.writeFile(filePath, avatarFile, (err) => {
        if (err) {
            return res.status(500).send(`ファイルアップロードエラー: ${err.message}`);
        }
        
        // アップロード結果をHTML形式で表示
        res.send(`
        <h1>アップロード成功</h1>
        <p>ファイル "${fileName}" がアップロードされました</p>
        <img src="/uploads/${fileName}" alt="アップロードされた画像">
        <a href="/dashboard">ダッシュボードへ戻る</a>
        `);
    });
});

// ユーザーエクスポート - ユーザーデータの外部出力処理
router.get('/user/:id/export', (req, res) => {
    const userId = req.params.id;
    const redirectUrl = req.query.redirect || '/dashboard';
    
    UserModel.getUserById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send('ユーザーが見つかりません');
            }
            
            // ユーザーデータをJSON形式で出力
            const userData = JSON.stringify(user);
            
            // クエリパラメータで指定されたURLへリダイレクト
            res.send(`
            <h1>エクスポート完了</h1>
            <p>ユーザーデータがエクスポートされました</p>
            <textarea readonly rows="10" cols="50">${userData}</textarea>
            <p><a href="${redirectUrl}">続行</a></p>
            `);
        })
        .catch(err => {
            res.status(500).send(`エクスポートエラー: ${err.message}`);
        });
});

module.exports = router;