const form = document.getElementById('registration-form');
const submitBtn = document.getElementById('submit-btn');
const inputs = form.querySelectorAll('input');
const gradeSelect = document.getElementById('grade');
const classSelect = document.getElementById('class');
const studentIdInput = document.getElementById('student-id');
const studentIdError = document.getElementById('student-id-error'); 
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phone-error'); 
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error'); 
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error'); 
const globalError = document.getElementById('global-error');


// 入力が変更されたときにボタンの状態を確認
inputs.forEach(input => {
    input.addEventListener('input', checkInputs);
});

// 学年またはクラスが変更されたときにボタンの状態を確認
[gradeSelect, classSelect].forEach(select => {
    select.addEventListener('change', checkInputs);
});

// 学籍番号の入力フィールドでの検証を設定
studentIdInput.addEventListener('input', function() {
    const studentIdValid = /^[a-zA-Z0-9]+$/.test(studentIdInput.value.trim());
    if (!studentIdValid) {
        studentIdError.textContent = '学籍番号は半角英数字で入力してください。';
        studentIdError.style.display = 'block'; // エラーメッセージを表示
    } else {
        studentIdError.style.display = 'none'; // 有効であればメッセージを非表示
    }
});

// パスワードの検証を追加
passwordInput.addEventListener('input', function() {
    const password = passwordInput.value;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
    if (!passwordPattern.test(password)) {
        passwordError.textContent = '半角英数字のみ、8文字以上16文字以下、英語数字両方を含めてください。';
        passwordError.style.display = 'block'; // エラーメッセージを表示
    } else {
        passwordError.style.display = 'none'; // 有効であればメッセージを非表示
    }
});

// 確認パスワードの検証を追加
confirmPasswordInput.addEventListener('input', function() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordError.textContent = 'パスワードが一致しません。';
        confirmPasswordError.style.display = 'block'; // エラーメッセージを表示
    } else {
        confirmPasswordError.style.display = 'none'; // 一致していればメッセージを非表示
    }
});

// 電話番号の検証
phoneInput.addEventListener('input', function() {
    const phoneValid = /^\d+$/.test(phoneInput.value.trim());
    if (!phoneValid) {
        phoneError.textContent = '電話番号は半角数字で入力してください。';
        phoneError.style.display = 'block'; // エラーメッセージを表示
    } else {
        phoneError.style.display = 'none'; // 有効であればメッセージを非表示
    }
});

// メールアドレスの検証
emailInput.addEventListener('input', function() {
    const emailValid = /^[a-zA-Z0-9@.]+$/.test(emailInput.value.trim());
    if (!emailValid) {
        emailError.textContent = 'メールアドレスは半角英数字で入力してください。';
        emailError.style.display = 'block'; // エラーメッセージを表示
    } else {
        emailError.style.display = 'none'; // 有効であればメッセージを非表示
    }
});

// 登録ボタンがクリックされたときの動作
submitBtn.addEventListener('click', async function(event) {
    event.preventDefault();
    let valid = checkInputs();
    
    if (!valid) {
        globalError.style.display = 'block';
    } else {
        globalError.style.display = 'none';
        
        try {
            const userData = {
                studentId: document.getElementById('student-id').value,
                name: document.getElementById('name').value,
                grade: document.getElementById('grade').value.toString(), // 文字列に変換
                class: document.getElementById('class').value.toString(), // 文字列に変換
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (result.success) {
                form.style.display = 'none';
                document.getElementById('home-screen').style.display = 'block';
            } else {
                globalError.textContent = '登録に失敗しました。もう一度お試しください。';
                globalError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            globalError.textContent = '登録に失敗しました。もう一度お試しください。';
            globalError.style.display = 'block';
        }
    }
});

// 全ての入力が埋まっているか確認
function checkInputs() {
    let allFilled = true;

    // 各フィールドをチェックして、未入力があればフラグを変更
    inputs.forEach(input => {
        if (input.value.trim() === '' && input !== studentIdInput && input !== phoneInput && input !== emailInput && input !== passwordInput && input !== confirmPasswordInput) {
            allFilled = false;
        }
    });

    // 学年とクラスが選択されていることを確認
    const gradeSelected = gradeSelect.value.trim() !== '';
    const classSelected = classSelect.value.trim() !== '';

    // 学籍番号、電話番号、メールアドレスのバリデーション(要変更)
    const studentIdValid = /^[a-zA-Z0-9]+$/.test(studentIdInput.value.trim());
    const phoneValid = /^\d+$/.test(phoneInput.value.trim());
    const emailValid = /^[a-zA-Z0-9@.]+$/.test(emailInput.value.trim());

    // パスワードのバリデーション
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
    const passwordValid = passwordPattern.test(passwordInput.value);
    const confirmPasswordValid = passwordInput.value === confirmPasswordInput.value;

    // 各エラーメッセージをリセット
    globalError.style.display = 'none'; // グローバルエラーを初期化

    // 追加: ボタンの有効/無効を制御
    if (allFilled && gradeSelected && classSelected && studentIdValid && phoneValid && emailValid && passwordValid && confirmPasswordValid) {
        submitBtn.disabled = false; // ボタンを有効に
        submitBtn.style.opacity = '1'; // ボタンの透明度を通常状態に戻す
    } else {
        submitBtn.disabled = true; // ボタンを無効に
        submitBtn.style.opacity = '0.5'; // ボタンを薄く表示
    }

    // すべてが埋まっていてかつ有効であれば結果を返す
    return allFilled && gradeSelected && classSelected && studentIdValid && phoneValid && emailValid && passwordValid && confirmPasswordValid;
}

// ページが更新される前にアラートを表示する処理
window.addEventListener('beforeunload', function(event) {
    const confirmationMessage = '画面を更新すると、今までの入力内容が消えます。';
    event.returnValue = confirmationMessage; // Chrome 用
    return confirmationMessage; // Firefox 用
});

// ページが読み込まれた後、全ての入力内容をクリア
window.addEventListener('load', function() {
    inputs.forEach(input => {
        input.value = ''; // 読み込まれた際に入力内容をクリア
    });
    gradeSelect.selectedIndex = 0; // 学年の選択肢をリセット
    classSelect.selectedIndex = 0; // クラスの選択肢をリセット
});
