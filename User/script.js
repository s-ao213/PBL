

// DOMコンテンツが全て読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const orderPage = document.getElementById('order-page');
    const errorMessage = document.getElementById('error-message');

    // カートを保持する配列
    let cart = [];

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
        
            // ボタンをmealContainerに追加する
            mealContainer.appendChild(button);
            // order-containerにmealContainerを追加する
            orderContainer.appendChild(mealContainer);
        });
    })
    .catch(error => console.error('Error loading mealList.json:', error));

    // 個数管理の変数を初期化
    let quantity = 1; // 個数を管理する変数を初期化

// ポップアップを開く関数
function openPopup(title, imageUrl, price, description) {
    document.getElementById('popupTitle').textContent = title;
    document.getElementById('popupImage').src = imageUrl;
    document.getElementById('string1').textContent = price;
    document.getElementById('text1').innerHTML = description;

    // 個数の初期化
    quantity = 1; // 値をリセット
    document.getElementById('quantityDisplay').textContent = quantity;

    const addToCartButton = document.getElementById('addToCart');
    addToCartButton.onclick = () => {
        console.log(`商品 ${title} をカートに追加しました。個数: ${quantity}`);
        addToCart(title, imageUrl, price, quantity); // カート追加関数を呼び出す
    };

    // 個数操作ボタンのイベントリスナーを設定
    document.getElementById('increaseQuantity').onclick = (event) => {
        event.stopPropagation(); // イベントのバブリングを防ぐ
        quantity++;
        document.getElementById('quantityDisplay').textContent = quantity; // 個数を更新
    };

    document.getElementById('decreaseQuantity').onclick = (event) => {
        event.stopPropagation(); // イベントのバブリングを防ぐ
        if (quantity > 1) {
            quantity--;
            document.getElementById('quantityDisplay').textContent = quantity; // 個数を更新
        }
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
    // カートに商品を追加する関数
    function addToCart(title, imageUrl, price, quantity) {
        const cartItem = {
            title: title,
            imageUrl: imageUrl,
            price: price,
            quantity: quantity
        };
        cart.push(cartItem); // カートにアイテムを追加
    }

    // ポップアップを閉じる（オーバーレイをクリックしたとき）
    document.getElementById('overlay').addEventListener('click', () => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById("cartButton");
    const cart = document.getElementById("cart");
    const closeCartButton = document.getElementById("closeCart");
    const cartItemsList = document.getElementById("cartItems");
    const totalQuantityDisplay = document.getElementById("totalQuantity");

    // カートの中身を管理する配列
    let cartItems = [];

    // カートのアイテムを追加する関数
    function addToCart(item) {
        // カートにアイテムが既に存在するかチェック
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += item.quantity; // 数量を増やす
        } else {
            cartItems.push(item); // 新しいアイテムを追加
        }
        updateCartDisplay();
    }
    
    // カートの表示を更新する関数
    function updateCartDisplay() {
        cartItemsList.innerHTML = ""; // リストを初期化
        let totalQuantity = 0;


        cartItems.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - ${item.quantity}個`;
            cartItemsList.appendChild(li);
            totalQuantity += item.quantity;
        });

        totalQuantityDisplay.textContent = `合計注文数: ${totalQuantity}個`;
        cartButton.textContent = `カートを見る (${totalQuantity})`;
    }

    // カートボタンのクリックイベント
    cartButton.addEventListener("click", () => {
        cart.classList.toggle("hidden"); // カートの表示を切り替える
        updateCartDisplay();
    });

    closeCartButton.addEventListener("click", () => {
        cart.classList.add("hidden"); // カートを非表示
    });

    // ここで追加ボタンにイベントリスナーを設定
    document.getElementById("addToCart").addEventListener("click", () => {
        const itemName = document.getElementById("popupTitle").textContent; // 例としてポップアップタイトルを商品名とする
        const quantity = parseInt(document.getElementById("quantityDisplay").textContent); // ポップアップで指定された数量
        addToCart({ name: itemName, quantity: quantity }); // アイテムをカートに追加
        document.getElementById("overlay").style.display = "none"; // ポップアップを閉じる
    });
});
