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

    // mealList.jsonのデータを取得する
    fetch('mealList.json')
    .then(response => response.json())
    .then(mealList => {
        // 取得したmealListをorder-containerに表示する
        const orderContainer = document.getElementById('order-container');
        
        mealList.forEach(meal => {
        // 各mealに対してボタン要素を作成する
        const mealContainer = document.createElement('div'); // ボタンを囲むコンテナ
        mealContainer.classList.add('meal-item'); // CSSクラスを追加

        const button = document.createElement('button');
        button.id = meal.id;
        button.innerHTML = `
            <img src="${meal.image}" alt="${meal.alt}" width="40%" height="auto">
            <br>
            <h4>￥${meal.price}</h4>
        `;
        
        // ボタンがクリックされたらポップアップを開くイベントを追加する
        button.addEventListener('click', () => {
            openPopup(meal.alt, meal.image, `￥${meal.price}`, meal.description);
        });
        // const addToCartButton = document.createElement
        // addToCartButton.innerHTML = '追加';
        // addToCartButton.classLi
        // st.add('add-to-cart-btn'); // CSSクラスを追加
        // addToCartButton.addEventListener('click', () => {
        //     console.log(`商品 ${meal.id} (${meal.alt}) をカートに追加しました`);
        //     // カートに商品を追加する処理をここに書く
        // });

        // ボタンをmealContainerに追加する
        mealContainer.appendChild(button);
        // mealContainer.appendChild(addToCartButton);

        // order-containerにボタンを追加する
        orderContainer.appendChild(button);
        });
    })
    .catch(error => console.error('Error loading mealList.json:', error));

    // ポップアップを開く関数
    function openPopup(title, imageUrl, price, description) {
        document.getElementById('popupTitle').textContent = title;
        document.getElementById('popupImage').src = imageUrl;
        document.getElementById('string1').textContent = price;
        document.getElementById('text1').innerHTML = description;

        const addToCartButton = document.getElementById('addToCart');
        addToCartButton.onclick = () => {
            console.log(`商品 ${mealId} (${title}) をカートに追加しました`);
            // カートに商品を追加する処理をここに書く
        };

        // オーバーレイとポップアップを表示
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    }

    // ポップアップを閉じる（オーバーレイをクリックしたとき）
    document.getElementById('overlay').addEventListener('click', () => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    });

});
