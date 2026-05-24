import { useState } from 'react';
import { authService } from '../../services/auth';
import styles from './Register.module.scss';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setpassword_confirm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Валидация на фронтенде перед отправкой на бэк
    if (!username || !email || !password || !password_confirm) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (password !== password_confirm) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      // Отправляем POST-запрос на твой /api/v1/auth/register/
      await authService.register({
        username,
        email,
        password,
        password_confirm
      });

      setSuccess(true);
      // Через 2 секунды перекидываем на страницу входа
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        // Вытаскиваем ошибки валидации от Django (например, если юзер уже существует)
        const data = err.response.data;
        if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          setError(`${firstKey}: ${data[firstKey]}`);
        } else {
          setError(data.detail || 'Ошибка при регистрации');
        }
      } else {
        setError('Сервер не отвечает. Проверь докер-контейнеры.');
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
          <p className={styles.subtitle}>Регистрация нового профиля</p>
        </div>

        {success ? (
          <div className={styles.successBlock}>
            <p>Аккаунт успешно создан!</p>
            <span>Перенаправление на страницу входа...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="username">Имя пользователя *</label>
              <input
                type="text"
                id="username"
                placeholder="vlad_dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                placeholder="vlad@mana.stack"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль *</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password_confirm">Подтверждение пароля *</label>
              <input
                type="password"
                id="password_confirm"
                placeholder="••••••••"
                value={password_confirm}
                onChange={(e) => setpassword_confirm(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        <div className={styles.cardFooter}>
          <span>Уже есть аккаунт?</span> <a href="/login">Войти</a>
        </div>
      </div>
    </div>
  );
}

export default Register;