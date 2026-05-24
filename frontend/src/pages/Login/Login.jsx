import { useState, useContext } from 'react';
import { authService } from '../../services/auth';
import { AuthContext } from '../../context/AuthContext';
import styles from './Login.module.scss';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(false);

    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      // ... внутри handleSubmit после успешного ответа:
      const accessToken = response.data?.access || response.data?.token || response.data?.accessToken;
      const refreshToken = response.data?.refresh;
      
      // Вытаскиваем инфу о юзере из ответа бэка, либо генерируем дефолт из email
      const userData = response.data?.user || {
        email: email,
        username: email.split('@')[0], // из vlad@mana.stack сделает "vlad"
        avatar: response.data?.avatar || null
      };

      if (accessToken) {
        login(accessToken, refreshToken, userData); // Передаем данные в контекст
        window.location.replace('/');
      } else {
        setError('Ошибка: токен не найден в ответе сервера.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.logo}>Mana<span>.</span>Stack</h1>
          <p className={styles.subtitle}>Вход в панель управления</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              id="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Авторизация...' : 'Войти в систему'}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <span>Нет аккаунта?</span> <a href="/register">Регистрация</a>
        </div>
      </div>
    </div>
  );
}

export default Login;