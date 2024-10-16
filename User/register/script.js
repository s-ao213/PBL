const form = document.getElementById('registration-form');
const submitBtn = document.getElementById('submit-btn');
const inputs = form.querySelectorAll('input');

// 入力が変更されたときにボタンの状態を確認
inputs.forEach(input => {
    input.addEventListener('input', checkInputs);
});

// 入力フィールドを検証する関数
function checkInputs() {
    let allFilled = true;

    // 各フィールドをチェックして、未入力があればフラグを変更
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });

    // すべてが埋まっていればボタンを有効化
    submitBtn.disabled = !allFilled;
}

// 登録ボタンがクリックされたときの動作
submitBtn.addEventListener('click', function() {
    alert('登録ボタンが押されましたが、何も行われません。');
});

// ページが更新される前にアラートを表示する処理
window.addEventListener('beforeunload', function(event) {
    const confirmationMessage = '画面を更新すると、今までの入力内容が消えます。';
    event.returnValue = confirmationMessage;  // クロスブラウザ互換性のため
    return confirmationMessage;  // Firefox 用
});

// ページが読み込まれた後、全ての入力内容をクリア
window.addEventListener('load', function() {
    inputs.forEach(input => {
        input.value = ''; // 読み込まれた際に入力内容をクリア
    });
});