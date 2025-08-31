document.addEventListener('DOMContentLoaded', () => {

    const avatarInput = document.getElementById('avatar-input');
    const avatarPreviewImg = document.getElementById('avatar-preview-img');
    const uploadIcon = document.getElementById('upload-icon');
    const uploadText = document.querySelector('.upload-text');
    const changeAvatarButton = document.getElementById('change-avatar-button');
    const removeAvatarButton = document.getElementById('remove-avatar-button');
    const avatarError = document.getElementById('avatar-error');
    const avatarSubmitArea = document.querySelector('.avatar-submit-area');

    const defaultAvatarPath = 'assets/images/image-avatar.jpg';

    const formFields = {
        fullName: { input: document.getElementById('fullName'), error: document.getElementById('fullName-error') },
        email: { input: document.getElementById('email'), error: document.getElementById('email-error') },
        gitUsername: { input: document.getElementById('gitUsername'), error: document.getElementById('gitUsername-error') }
    };
    const submitButton = document.querySelector('.submit-button');

    const ticketPreviewPage = document.querySelector('.ticket-preview-page');
    const avatarImagePreview = document.getElementById('avatar-image');
    const ticketFullName = document.getElementById('ticket-fullName');
    const ticketEmail = document.getElementById('ticket-email');
    const ticketGitUsername = document.getElementById('ticket-gitUsername');
    const displayedEmailSpan = document.getElementById('displayed-email');
    const ticketPreviewTextH2 = document.querySelector('.ticket-preview-text');

    const hideSections = [
        document.querySelector('.main-header'),
        document.querySelector('.avatar-upload'),
        document.querySelector('.forms'),
        document.querySelector('.footer')
    ];

    function showError(errorElement, message, input) {

        errorElement.textContent = message;
        errorElement.style.color = "red";
        errorElement.classList.add('active');
    }


    function clearError(errorEl, inputEl = null) {
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('active');
        }
        if (inputEl) inputEl.classList.remove('error');
    }

    function validateAvatar(file) {
        const MAX_SIZE = 500 * 1024;
        if (!file.type.startsWith('image/')) {
            showError(avatarError, 'Formato inválido. Envie uma imagem.');
            return false;
        }
        if (file.size > MAX_SIZE) {
            showError(avatarError, 'Arquivo muito grande. Máx 500KB.');
            return false;
        }
        clearError(avatarError);
        return true;
    }

    function updateAvatarUI(src = defaultAvatarPath, fileName = '') {
        avatarPreviewImg.src = src;
        avatarPreviewImg.style.display = src === defaultAvatarPath ? 'none' : 'block';
        uploadText.textContent = fileName ? `Arquivo selecionado: ${fileName}` : 'Clique ou arraste um arquivo para enviar';
        [changeAvatarButton, removeAvatarButton].forEach(btn => btn.style.display = src === defaultAvatarPath ? 'none' : 'inline-block');
        if (uploadIcon) uploadIcon.style.display = src === defaultAvatarPath ? 'block' : 'none';
        if (avatarImagePreview) avatarImagePreview.src = src;
    }

    function validateFields(fields) {
        let valid = true;

        const labels = {
            // fullName: "nome",
            fullName: "nome completo",
            email: "email",
            gitUsername: "username do GitHub"
        };

        for (let key in fields) {
            const { input, error } = fields[key];
            const value = input.value.trim();

            if (value === '') {
                showError(error, `Por favor, digite seu ${labels[key] || key}.`);
                input.classList.add('error');
                valid = false;
            } else {
                clearError(error, input);
            }

            if (key === 'email' && value !== '') {
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!pattern.test(value)) {
                    showError(error, 'Email inválido. Ex: exemplo@dominio.com');
                    input.classList.add('error');
                    valid = false;
                }
            }
        }

        return valid;
    }

    updateAvatarUI();

    avatarSubmitArea.addEventListener('click', e => {
        if (!e.target.closest('.avatar-option-button')) avatarInput.click();
    });

    avatarInput.addEventListener('change', () => {
        if (!avatarInput.files[0]) return updateAvatarUI();
        const file = avatarInput.files[0];
        if (!validateAvatar(file)) return updateAvatarUI();
        const reader = new FileReader();
        reader.onload = e => updateAvatarUI(e.target.result, file.name);
        reader.readAsDataURL(file);
    });

    changeAvatarButton.addEventListener('click', () => avatarInput.click());
    removeAvatarButton.addEventListener('click', () => {
        avatarInput.value = '';
        updateAvatarUI();
        clearError(avatarError);
    });

    avatarSubmitArea.addEventListener('dragover', e => {
        e.preventDefault();
        avatarSubmitArea.classList.add('drag-over');
    });
    avatarSubmitArea.addEventListener('dragleave', e => {
        e.preventDefault();
        avatarSubmitArea.classList.remove('drag-over');
    });
    avatarSubmitArea.addEventListener('drop', e => {
        e.preventDefault();
        avatarSubmitArea.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (!validateAvatar(file)) return;

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        avatarInput.files = dataTransfer.files;

        const reader = new FileReader();
        reader.onload = ev => updateAvatarUI(ev.target.result, file.name);
        reader.readAsDataURL(file);
    });

    submitButton.addEventListener('click', e => {
        e.preventDefault();
        let isAvatarValid = avatarInput.files[0] ? validateAvatar(avatarInput.files[0]) : (showError(avatarError, 'Selecione uma foto'), false);
        const areFieldsValid = validateFields(formFields);
        if (!isAvatarValid || !areFieldsValid) return;

        const userData = {};
        for (let key in formFields) userData[key] = formFields[key].input.value;
        localStorage.setItem('userData', JSON.stringify(userData));

        hideSections.forEach(sec => sec.style.display = 'none');
        ticketPreviewPage.style.display = 'block';

        ticketFullName.textContent = userData.fullName;
        ticketEmail.textContent = `Email: ${userData.email}`;
        ticketGitUsername.textContent = `GitHub: ${userData.gitUsername}`;
        displayedEmailSpan.textContent = userData.email;
        ticketPreviewTextH2.textContent = `Parabéns, ${userData.fullName}, seu ticket foi gerado com sucesso!`;

        avatarImagePreview.src = avatarPreviewImg.src || defaultAvatarPath;
    });

    Object.values(formFields).forEach(({ input, error }) => {
        input.addEventListener('input', () => clearError(error, input));
    });

});
