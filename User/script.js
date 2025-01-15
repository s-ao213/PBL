document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const orderPage = document.getElementById('order-page');
    const errorMessage = document.getElementById('error-message');

    // カートを保持する配列
    let cart = [];

    // ログイン処理
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const studentId = document.getElementById('student-id').value;
        const password = document.getElementById('password').value;

        // テスト用アカウントの場合
        if (studentId === '123' && password === '456') {
            loginContainer.style.display = 'none';
            orderPage.style.display = 'block';
            errorMessage.textContent = '';
            loadMenu();
            return;
        }

        // try {
        //     const response = await fetch('http://localhost:3000/api/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ studentId, password })
        //     });

        //     const result = await response.json();

        //     if (result.success) {
        //         // ユーザー情報をセッションストレージに保存
        //         sessionStorage.setItem('userId', result.user.id);
        //         sessionStorage.setItem('studentId', result.user.studentId);
        //         sessionStorage.setItem('userName', result.user.name);

        //         loginContainer.style.display = 'none';
        //         orderPage.style.display = 'block';
        //         errorMessage.textContent = '';
                
        //         // メニューを読み込む
        //         loadMenu();
        //     } else {
        //         errorMessage.textContent = '学籍番号またはパスワードが無効です';
        //     }
        // } 
        // catch (error) {
        //     console.error('Login error:', error);
        //     errorMessage.textContent = 'ログインに失敗しました。もう一度お試しください。';
        // }
    });

    // メニュー読み込み
    async function loadMenu() {
        try {
            const response = await fetch('mealList.json');
            const mealList = await response.json();
            displayMenu(mealList);
        } catch (error) {
            console.error('Error loading menu:', error);
        }
    }

    // メニュー表示
    function displayMenu(mealList) {
        const orderContainer = document.getElementById('order-container');
        orderContainer.innerHTML = '';
        
        mealList.forEach(meal => {
            const mealContainer = document.createElement('div');
            mealContainer.classList.add('meal-item');
            
            const button = document.createElement('button');
            button.id = meal.id;  // _idではなくidを使用
            const altText = meal.alt.replace('サンプル', '') // 「サンプル」を削除
            button.innerHTML = `
                <h3 style='font-size: 1.5em;'>${altText}</h3>
                <img src="${meal.image}" alt="${meal.alt}" width="100%" height="auto">
                <br>
                <h4 style='font-size: 1.5em;'>￥${meal.price}</h4>
            `;
            
            button.addEventListener('click', () => {
                openPopup(meal);
            });

            const quickAddButton = document.createElement('button');
            quickAddButton.textContent = '1つカートに追加';
            quickAddButton.classList.add('quick-add-button');
            
            quickAddButton.addEventListener('click', () => {
                addToCart(meal, 1);
                updateCartDisplay();
            });
        
            mealContainer.appendChild(button);
            mealContainer.appendChild(quickAddButton);
            orderContainer.appendChild(mealContainer);
        });
    }

    // アレルゲン情報を設定する関数
    function setAllergenInfo(allergens) {
        const allergiesElement = document.getElementById('allergies');
        allergiesElement.textContent = `${allergens.join(', ')}`;
    }

    // ポップアップを開く
    function openPopup(meal) {
        document.getElementById('popupTitle').textContent = meal.alt;
        document.getElementById('popupImage').src = meal.image;
        document.getElementById('string1').textContent = `￥${meal.price}`;
        document.getElementById('text1').innerHTML = meal.description;
        // document.getElementById('allergies').textContent = setAllergenInfo(meal.allergies);

        let quantity = 1;
        document.getElementById('quantityDisplay').textContent = quantity;

        const addToCartButton = document.getElementById('addToCart');
        addToCartButton.onclick = () => {
            addToCart(meal, quantity);
            document.getElementById('overlay').style.display = 'none';
            updateCartDisplay();
        };

        document.getElementById('increaseQuantity').onclick = (event) => {
            event.stopPropagation();
            quantity++;
            document.getElementById('quantityDisplay').textContent = quantity;
        };

        document.getElementById('decreaseQuantity').onclick = (event) => {
            event.stopPropagation();
            if (quantity > 1) {
                quantity--;
                document.getElementById('quantityDisplay').textContent = quantity;
            }
        };
        document.getElementById('popup').style.display = 'block';  // この行を追加
        document.getElementById('overlay').style.display = 'block';
    }

    // カートに商品を追加
    function addToCart(meal, quantity) {
        const existingItem = cart.find(item => item.id === meal._id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: meal._id,
                name: meal.alt,
                price: meal.price,
                quantity: quantity
            });
        }
        updateCartDisplay();
    }

    // カート表示を更新
    function updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const totalQuantityDisplay = document.getElementById('totalQuantity');
        cartItems.innerHTML = '';
        
        let totalQuantity = 0;
        let totalAmount = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.quantity}個 - ￥${item.price * item.quantity}`;
            
            // 削除ボタンを追加
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.classList.add('delete-item-button');
            deleteButton.onclick = () => removeFromCart(item.id);
            li.appendChild(deleteButton);
            
            cartItems.appendChild(li);
            totalQuantity += item.quantity;
            totalAmount += item.price * item.quantity;
        });

        totalQuantityDisplay.textContent = `合計: ￥${totalAmount} (${totalQuantity}個)`;
        document.getElementById('cartButton').textContent = `カート (${totalQuantity})`;
    }

    // カートから商品を削除
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartDisplay();
    }

    // 注文確定処理
    async function submitOrder() {
        if (cart.length === 0) {
            alert('カートが空です');
            return;
        }

        try {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                alert('セッションが切れました。再度ログインしてください。');
                location.reload();
                return;
            }

            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    items: cart,
                    totalAmount: calculateTotalAmount()
                })
            });

            const result = await response.json();

            if (result.success) {
                alert('注文が完了しました！');
                cart = [];
                updateCartDisplay();
                document.getElementById('cart').classList.add('hidden');
            } else {
                alert('注文に失敗しました。もう一度お試しください。');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            alert('注文に失敗しました。もう一度お試しください。');
        }
    }

    // 合計金額計算
    function calculateTotalAmount() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // カートボタンのイベントリスナー
    document.getElementById('cartButton').addEventListener('click', () => {
        document.getElementById('cart').classList.toggle('hidden');
    });

    // カートを閉じるボタンのイベントリスナー
    document.getElementById('closeCart').addEventListener('click', () => {
        document.getElementById('cart').classList.add('hidden');
    });

    // 注文確定ボタンのイベントリスナー
    document.getElementById('submitOrder').addEventListener('click', submitOrder);

    // ポップアップを閉じる
    document.getElementById('overlay').addEventListener('click', (e) => {
        if (e.target.id === 'overlay' || e.target.id === 'closePopup') {
            document.getElementById('overlay').style.display = 'none';
        }
    });

    // 営業時間チェック
    function checkBusinessHours() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        let statusText = '';
        const openHours = '平日 9:00 - 14:00';

        if (day >= 1 && day <= 5) {
            if (hour >= 9 && hour < 14) {
                statusText = `現在営業中です - ${openHours}`;
                document.getElementById('businessHours').className = 'business-hours open';
                enableOrdering(true);
            } else {
                const nextOpen = hour < 9 ? '次の営業日は今日の9:00です。' : '次の営業日は明日の9:00です。';
                statusText = `現在営業時間外です - ${nextOpen}`;
                document.getElementById('businessHours').className = 'business-hours closed';
                enableOrdering(false);
            }
        } else {
            const nextOpen = '次の営業日は月曜日の9:00です。';
            statusText = `現在営業時間外です - ${nextOpen}`;
            document.getElementById('businessHours').className = 'business-hours closed';
            enableOrdering(false);
        }

        document.getElementById('businessHours').textContent = statusText;
    }

    // 注文の有効/無効を切り替える
    function enableOrdering(enable) {
        const buttons = document.querySelectorAll('.meal-item button, #addToCart, #submitOrder');
        buttons.forEach(button => {
            button.disabled = !enable;
            if (!enable) {
                button.title = '営業時間外です';
            } else {
                button.title = '';
            }
        });
    }

    // 初期化時の処理
    checkBusinessHours();
    setInterval(checkBusinessHours, 60000); // 1分ごとに更新
});
