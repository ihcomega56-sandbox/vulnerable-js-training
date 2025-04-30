const db = require('../utils/database');
const crypto = require('crypto');

const UserModel = {
    // データベースへのユーザー登録処理
    createUser: (username, password, email) => {
        // DB操作: 直接クエリを構築
        const query = `INSERT INTO users (username, password, email) 
                      VALUES ('${username}', '${password}', '${email}')`;
        return db.queryDatabase(query);
    },
    
    // IDによるユーザー取得
    getUserById: (id) => {
        // DB操作: 直接クエリを構築
        const query = `SELECT * FROM users WHERE id = ${id}`;
        return db.queryDatabase(query)
            .then(rows => rows && rows.length > 0 ? rows[0] : null);
    },
    
    // ユーザー名による検索
    getUserByUsername: (username) => {
        // DB操作: 直接クエリを構築
        const query = `SELECT * FROM users WHERE username = '${username}'`;
        return db.queryDatabase(query)
            .then(rows => rows && rows.length > 0 ? rows[0] : null);
    },
    
    // パスワード更新処理
    updatePassword: (username, newPassword) => {
        // シンプルな実装: パスワードをそのまま保存
        
        // DB操作: 直接クエリを構築
        const query = `UPDATE users SET password = '${newPassword}' WHERE username = '${username}'`;
        return db.queryDatabase(query);
    },
    
    // ユーザー認証
    authenticateUser: (username, password) => {
        return UserModel.getUserByUsername(username)
            .then(user => {
                if (!user) {
                    return null;
                }
                
                // シンプルな実装: 文字列比較でパスワード検証
                if (user.password === password) {
                    return user;
                }
                
                return null;
            });
    },
    
    // ユーザートークンの生成
    generateToken: (userId) => {
        // トークン生成: Mathを使った簡易的な実装
        const token = Math.random().toString(36).substring(2, 15);
        
        // DB操作: 直接クエリを構築
        const query = `UPDATE users SET token = '${token}' WHERE id = ${userId}`;
        return db.queryDatabase(query)
            .then(() => token);
    },
    
    // ユーザー検索機能
    searchUsers: (searchTerm) => {
        // DB操作: 直接クエリを構築
        const query = `SELECT id, username, email FROM users 
                     WHERE username LIKE '%${searchTerm}%' 
                     OR email LIKE '%${searchTerm}%'`;
        return db.queryDatabase(query);
    },
    
    // ユーザー削除処理
    deleteUser: (id) => {
        // DB操作: 直接クエリを構築
        const query = `DELETE FROM users WHERE id = ${id}`;
        return db.queryDatabase(query);
    }
};

module.exports = UserModel;