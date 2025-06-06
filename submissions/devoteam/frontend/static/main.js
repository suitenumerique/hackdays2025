// Form elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const switchToRegisterBtn = document.getElementById('switchToRegister');
const switchToLoginBtn = document.getElementById('switchToLogin');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');

// Form switching
function showLoginForm() {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  authTitle.textContent = 'Connexion';
  authSubtitle.textContent = 'Accédez à votre espace personnel';
}

function showRegisterForm() {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  authTitle.textContent = 'Créer un compte';
  authSubtitle.textContent = 'Rejoignez-nous pour bénéficier de tous nos services';
}

switchToRegisterBtn.addEventListener('click', showRegisterForm);
switchToLoginBtn.addEventListener('click', showLoginForm);

// Form validation
function showError(inputId, message) {
  const errorElement = document.getElementById(`${inputId}Error`);
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

function clearError(inputId) {
  const errorElement = document.getElementById(`${inputId}Error`);
  errorElement.classList.add('hidden');
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Login form handling
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let isValid = true;

  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const rememberMe = document.getElementById('remember_me');

  // Clear previous errors
  clearError('email');
  clearError('password');

  // Validate email
  if (!email.value) {
    showError('email', 'L\'email est obligatoire');
    isValid = false;
  } else if (!validateEmail(email.value)) {
    showError('email', 'Format d\'email invalide');
    isValid = false;
  }

  // Validate password
  if (!password.value) {
    showError('password', 'Le mot de passe est obligatoire');
    isValid = false;
  }

  if (isValid) {
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Connexion en cours...';
    submitButton.disabled = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login submitted:', {
        email: email.value,
        rememberMe: rememberMe.checked
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }
});

// Register form handling
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let isValid = true;

  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('registerEmail');
  const password = document.getElementById('registerPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const terms = document.getElementById('terms');

  // Clear previous errors
  clearError('firstName');
  clearError('lastName');
  clearError('registerEmail');
  clearError('registerPassword');
  clearError('confirmPassword');
  clearError('terms');

  // Validate fields
  if (!firstName.value.trim()) {
    showError('firstName', 'Le prénom est obligatoire');
    isValid = false;
  }

  if (!lastName.value.trim()) {
    showError('lastName', 'Le nom est obligatoire');
    isValid = false;
  }

  if (!email.value) {
    showError('registerEmail', 'L\'email est obligatoire');
    isValid = false;
  } else if (!validateEmail(email.value)) {
    showError('registerEmail', 'Format d\'email invalide');
    isValid = false;
  }

  if (!password.value) {
    showError('registerPassword', 'Le mot de passe est obligatoire');
    isValid = false;
  } else if (password.value.length < 8) {
    showError('registerPassword', 'Le mot de passe doit contenir au moins 8 caractères');
    isValid = false;
  }

  if (password.value !== confirmPassword.value) {
    showError('confirmPassword', 'Les mots de passe ne correspondent pas');
    isValid = false;
  }

  if (!terms.checked) {
    showError('terms', 'Vous devez accepter les conditions d\'utilisation');
    isValid = false;
  }

  if (isValid) {
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Inscription en cours...';
    submitButton.disabled = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registration submitted:', {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }
});