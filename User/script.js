// DOMコンテンツが全て読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const orderPage = document.getElementById('order-page');
    const errorMessage = document.getElementById('error-message');

    // ログイン処理
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // デフォルトのフォーム送信を防ぐ

        const studentId = document.getElementById('student-id').value;
        const password = document.getElementById('password').value;

        // 簡易的な認証チェック
        if (studentId === '123' && password === '456') {
            // 認証成功
            loginContainer.style.display = 'none';
            orderPage.style.display = 'block';
            errorMessage.textContent = ''; // エラーメッセージをクリア
        } else {
            // 認証失敗
            errorMessage.textContent = '学籍番号またはパスワードが無効です';
        }
    });

    // 営業時間確認処理
    function checkBusinessHours() {
        const now = new Date();
        const day = now.getDay(); // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
        const hour = now.getHours();

        let statusText = '';
        const openHours = '平日 9:00 - 14:00';

        if (day >= 1 && day <= 5) { // 月曜日から金曜日
            if (hour >= 9 && hour < 14) {
                statusText = `現在営業中です - ${openHours}`;
                document.getElementById('businessHours').className = 'business-hours open';
            } else {
                const nextOpen = hour < 9 ? '次の営業日は今日の9:00です。' : '次の営業日は明日の9:00です。';
                statusText = `現在営業時間外です - ${nextOpen}`;
                document.getElementById('businessHours').className = 'business-hours closed';
            }
        } else {
            // 土日祝は閉店
            const nextOpen = '次の営業日は月曜日の9:00です。';
            statusText = `現在営業時間外です - ${nextOpen}`;
            document.getElementById('businessHours').className = 'business-hours closed';
        }

        document.getElementById('businessHours').textContent = statusText;
    }

    checkBusinessHours(); // ページが読み込まれたときに営業状態をチェック

    // ポップアップを表示する関数
    function openPopup(title, imageUrl, price, description) {
        document.getElementById('popupTitle').textContent = title;
        document.getElementById('popupImage').src = imageUrl;
        document.getElementById('string1').textContent = price;
        document.getElementById('text1').innerHTML = description;

        // オーバーレイとポップアップを表示
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    }

    // ボタンのクリックイベントリスナー追加
    document.getElementById('openPopup1').addEventListener('click', function() {
        openPopup('牛丼', '牛丼.jpg', '￥430', 'これは牛丼でアレルギー品目は<a href="">アレルギーリストを見て</a>');
    });

    document.getElementById('openPopup2').addEventListener('click', function() {
        openPopup('パスタ', 'パスタ.jpg', '￥480', 'これはパスタでアレルギー品目は<a href="">アレルギーリストを見て</a>');
    });

    document.getElementById('openPopup3').addEventListener('click', function() {
        openPopup('ポテト', 'ポテト.jpg', '￥400', 'これはポテトでアレルギー品目は<a href="">アレルギーリストを見て</a>');
    });

    // 戻るボタンにイベントリスナーを追加
    document.getElementById('closePopup').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    });
});
