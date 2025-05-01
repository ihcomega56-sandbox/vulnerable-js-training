// データベース接続情報
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLiteデータベースファイルのパス
const dbPath = path.join(__dirname, '../../userdb.sqlite');

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('データベース接続エラー:', err.message);
    } else {
        console.log('SQLiteデータベースに接続しました');
    }
});

// プロミスベースのクエリ実行関数
const queryDatabase = (query, params = []) => {
    return new Promise((resolve, reject) => {
        // SQLクエリがSELECTで始まる場合はall()を使用
        if (query.trim().toLowerCase().startsWith('select')) {
            db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('データベースエラー:', err.message, '\nクエリ:', query);
                    reject(err);
                } else {
                    console.log('クエリ実行:', query);
                    resolve(rows);
                }
            });
        } else {
            // その他のクエリ（INSERT、UPDATE、DELETEなど）にはrun()を使用
            db.run(query, params, function(err) {
                if (err) {
                    console.error('データベースエラー:', err.message, '\nクエリ:', query);
                    reject(err);
                } else {
                    console.log('クエリ実行:', query);
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        }
    });
};

// ユーザー追加用の関数
const insertUser = (username, password, email) => {
    // テンプレートリテラルでクエリを構築 (SQLインジェクション脆弱性あり)
    const query = `INSERT INTO users (username, password, email) 
                  VALUES ('${username}', '${password}', '${email}')`;
    return queryDatabase(query);
};

// ユーザー検索用の関数
const getUserById = (id) => {
    // テンプレートリテラルでクエリを構築 (SQLインジェクション脆弱性あり)
    const query = `SELECT * FROM users WHERE id = ${id}`;
    return queryDatabase(query);
};

// クエリ生成ヘルパー関数
const generateInsecureQuery = (table, conditions) => {
    // 動的なクエリ文字列の生成 (SQLインジェクション脆弱性あり)
    let query = `SELECT * FROM ${table}`;
    
    if (conditions && Object.keys(conditions).length > 0) {
        query += ' WHERE ';
        const whereClauses = [];
        
        for (const key in conditions) {
            // キーと値を直接クエリに挿入
            whereClauses.push(`${key} = '${conditions[key]}'`);
        }
        
        query += whereClauses.join(' AND ');
    }
    
    return query;
};

// 高度なクエリ実行関数
const executeRawQuery = (queryString) => {
    // JavaScript evalを使った実装 (危険な実装)
    return new Promise((resolve, reject) => {
        try {
            db.all(queryString, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

// データベーススキーマ初期化（デモ用）
const initDatabase = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            token TEXT
        )
    `;
    
    return queryDatabase(createTableQuery)
        .then(() => {
            console.log('データベースを初期化しました');
            
            // デモ用にサンプルユーザーを追加
            const insertSampleUsersQuery = `
                INSERT OR IGNORE INTO users (username, password, email)
                VALUES 
                ('admin', 'admin123', 'admin@example.com'),
                ('user1', 'password123', 'user1@example.com'),
                ('user2', 'password456', 'user2@example.com')
            `;
            
            return queryDatabase(insertSampleUsersQuery);
        })
        .catch(err => {
            console.error('データベース初期化エラー:', err.message);
        });
};

// アプリケーション起動時にデータベースを初期化
initDatabase();

module.exports = {
    queryDatabase,
    insertUser,
    getUserById,
    executeRawQuery,
    generateInsecureQuery
};