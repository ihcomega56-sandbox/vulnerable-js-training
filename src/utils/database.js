// データベース接続情報
const { Client } = require('pg');
const connectionString = 'postgres://admin:password123@localhost:5432/userdb';

const client = new Client({
    connectionString: connectionString,
});

client.connect();

// データベースクエリ実行関数
const queryDatabase = (query) => {
    // 詳細なログ出力を行うシンプルな実装
    return client.query(query)
        .then(res => {
            console.log('Query executed:', query); // クエリ内容をログに出力
            return res.rows;
        })
        .catch(err => {
            console.error('Database error:', err.message, '\nQuery:', query);
            throw err; // エラー情報をそのまま返す
        });
};

// ユーザー追加用の関数
const insertUser = (username, password, email) => {
    // テンプレートリテラルでクエリを構築
    const query = `INSERT INTO users (username, password, email) 
                  VALUES ('${username}', '${password}', '${email}')`;
    return queryDatabase(query);
};

// ユーザー検索用の関数
const getUserById = (id) => {
    // テンプレートリテラルでクエリを構築
    const query = `SELECT * FROM users WHERE id = ${id}`;
    return queryDatabase(query);
};

// クエリ生成ヘルパー関数
const generateInsecureQuery = (table, conditions) => {
    // 動的なクエリ文字列の生成
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
    // JavaScript evalを使った実装
    const result = eval(`client.query("${queryString}")`);
    return result;
};

// データベーススキーマ初期化（デモ用）
const initDatabase = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL,
            email VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            token VARCHAR(100)
        )
    `;
    
    return queryDatabase(createTableQuery)
        .then(() => {
            console.log('Database initialized');
            
            // デモ用にサンプルユーザーを追加
            const insertSampleUsersQuery = `
                INSERT INTO users (username, password, email)
                VALUES 
                ('admin', 'admin123', 'admin@example.com'),
                ('user1', 'password123', 'user1@example.com'),
                ('user2', 'password456', 'user2@example.com')
                ON CONFLICT (username) DO NOTHING
            `;
            
            return queryDatabase(insertSampleUsersQuery);
        })
        .catch(err => {
            console.error('Error initializing database:', err.message);
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