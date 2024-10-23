document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const studentIdInput = document.getElementById('studentId');
    const submitButton = document.getElementById('submitBtn');
    const formContainer = document.getElementById('formContainer');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const backButton = document.getElementById('backButton');

    // 入力をチェックして送信ボタンを有効化
    function checkInputValidity() {
        if (emailInput.value && studentIdInput.value) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    emailInput.addEventListener('input', checkInputValidity);
    studentIdInput.addEventListener('input', checkInputValidity);

    // フォーム送信時の処理
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault(); // デフォルトの送信を無効化

        // フォームを非表示にし、確認メッセージを表示
        formContainer.style.display = 'none';
        confirmationMessage.style.display = 'block';
    });

    // 戻るボタンの処理
    backButton.addEventListener('click', function() {
        confirmationMessage.style.display = 'none';
        formContainer.style.display = 'block';
        emailInput.value = '';
        studentIdInput.value = '';
        submitButton.disabled = true;
    });
});
