export const authTranslations = {
  ru: {
    titleLogin: 'Вход в систему',
    titleRegister: 'Регистрация',
    subtitle: 'Конструктор ATM модулей',
    placeholders: {
      name: 'ФИО',
      login: 'Логин',
      pass: 'Пароль',
      newPass: 'Пароль'
    },
    errors: {
      password: 'Пароль должен содержать минимум 8 символов и латинские буквы (a-z)',
      passwordInvalid: 'Пароль должен содержать минимум 8 символов и латинские буквы (a-z)',
      userExists: 'Пользователь с таким логином уже существует',
      invalidAuth: 'Неверный логин или пароль',
      unknown: 'Произошла ошибка. Попробуйте снова',
      emptyFullName: 'Введите ФИО',
      emptyLogin: 'Введите логин',
      emptyPassword: 'Введите пароль'
    },
    buttons: {
      login: 'ВОЙТИ',
      register: 'СОЗДАТЬ АККАУНТ',
      forgot: 'Забыли пароль?',
      switchToRegister: 'Нет аккаунта? Зарегистрироваться',
      switchToLogin: 'Уже есть аккаунт? Войти'
    }
  },

  en: {
    titleLogin: 'Sign in',
    titleRegister: 'Registration',
    subtitle: 'ATM module constructor',
    placeholders: {
      name: 'Full name',
      login: 'Login',
      pass: 'Password',
      newPass: 'Password'
    },
    errors: {
      password: 'Password must contain at least 8 characters and Latin letters (a-z)',
      passwordInvalid: 'Password must contain at least 8 characters and Latin letters (a-z)',
      userExists: 'A user with this login already exists',
      invalidAuth: 'Invalid login or password',
      unknown: 'Something went wrong. Try again',
      emptyFullName: 'Enter full name',
      emptyLogin: 'Enter login',
      emptyPassword: 'Enter password'
    },
    buttons: {
      login: 'SIGN IN',
      register: 'CREATE ACCOUNT',
      forgot: 'Forgot password?',
      switchToRegister: 'No account? Register',
      switchToLogin: 'Already have an account? Sign in'
    }
  }
};
