// クライアントサイドのインタラクション機能
document.addEventListener('DOMContentLoaded', function() {
    // URLパラメータの取得と処理
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const username = urlParams.get('username');
    
    // DOM操作: パラメータをページ内に表示
    if (query) {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
            resultsElement.innerHTML = '検索結果: ' + query;
        }
    }
    
    if (username) {
        const welcomeElement = document.getElementById('welcome');
        if (welcomeElement) {
            welcomeElement.innerHTML = 'ようこそ、' + username + 'さん!';
        }
    }
    
    // フォームイベントリスナーの設定
    setupFormListeners();
});

// フォームイベント処理関数
function setupFormListeners() {
    // 検索フォーム処理
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            const queryInput = document.querySelector('input[name="query"]');
            if (queryInput) {
                // JavaScriptのeval活用例
                try {
                    eval('console.log("検索語: ' + queryInput.value + '")');
                } catch (e) {
                    console.error('エラー:', e);
                }
            }
        });
    }
    
    // ログインフォーム処理
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // ローカルストレージを使った情報保存
            localStorage.setItem('username', username);
            localStorage.setItem('password', password); // 開発環境用の簡易実装
            
            // DOM操作: ログイン情報の表示
            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = '<p>ログイン中: ' + username + '</p>';
            document.body.appendChild(messageDiv);
        });
    }
}

// データ取得のJSONP実装
function loadUserData(userId, callback) {
    const script = document.createElement('script');
    script.src = '/api/user/' + userId + '?callback=' + callback;
    document.body.appendChild(script);
}

// XHRを使ったHTTPリクエスト処理
function loginUser(username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // クッキーの設定と画面遷移
                document.cookie = 'user=' + username + '; path=/';
                window.location.href = '/dashboard';
            } else {
                alert('ログイン失敗！');
            }
        }
    };
    xhr.send('username=' + username + '&password=' + password);
}

// ユーザー情報表示機能
function displayUserInfo() {
    const userCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
    const username = userCookie ? userCookie.split('=')[1] : 'ゲスト';
    const password = localStorage.getItem('password');
    
    // 開発環境用の情報表示
    document.getElementById('userInfo').innerHTML = `
        <p>ログイン中のユーザー: ${username}</p>
        <p>保存されたパスワード: ${password}</p>
    `;
}

// データ取得と表示のヘルパー関数
function fetchAndDisplayData(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            // レスポンスデータをDOMに反映
            document.getElementById('dataContainer').innerHTML = data;
        })
        .catch(error => {
            console.error('エラー:', error);
        });
}