import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Header.module.scss';

function Header() {
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Фолбэки на случай, если в базе у юзера какие-то поля не заполнены
    const username = user?.username || 'vlad_dev';
    const email = user?.email || 'user@example.com';
    const avatar = user?.avatar || null;

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftNav}>
                    <span className={styles.logo}>Mana<span className={styles.dot}>.</span>Stack</span>
                    <nav className={styles.navigation}>
                        <a href="/" className={styles.navLink}>Главная</a>
                        <a href="/categories" className={styles.navLink}>Категории</a>
                        <a href="/store" className={styles.navLink}>Магазин</a>
                    </nav>
                </div>

                <div className={styles.rightNav}>
                    {!isLoggedIn ? (
                        <div className={styles.authButtons}>
                            <a href="/login" className={styles.loginBtn}>Вход</a>
                            <a href="/register" className={styles.registerBtn}>Регистрация</a>
                        </div>
                    ) : (
                        <div className={styles.profileWrapper}>
                            {/* НОВЫЙ ВИДЖЕТ ПОЛЬЗОВАТЕЛЯ */}
                            <div
                                className={`${styles.userWidget} ${dropdownOpen ? styles.active : ''}`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className={styles.avatarZone}>
                                    {avatar ? (
                                        <img src={avatar} alt={username} />
                                    ) : (
                                        <div className={styles.avatarFallback}>
                                            {username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.userMeta}>
                                    <span className={styles.username}>{username}</span>
                                    <span className={styles.emailSub}>{email}</span>
                                </div>

                                <svg className={styles.arrowIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>

                            {/* МЕНЮ С КНОПКОЙ ПРОФИЛЯ ВНУТРИ */}
                            {dropdownOpen && (
                                <div className={styles.dropdownMenu} onMouseLeave={() => setDropdownOpen(false)}>
                                    <a href="/profile" className={styles.dropdownItem}>
                                        <span className={styles.accentText}>Профиль пользователя</span>
                                    </a>
                                    <a href="/posts/my-posts" className={styles.dropdownItem}>Мои публикации</a>
                                    <a href="/store/inventory" className={styles.dropdownItem}>Инвентарь</a>
                                    <hr className={styles.divider} />
                                    <button className={styles.logoutBtn} onClick={() => {
                                        logout();
                                        window.location.replace('/');
                                    }}>Выйти</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;