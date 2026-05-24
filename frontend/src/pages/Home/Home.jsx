import { useEffect, useState } from 'react';
import { postService } from '../../services/posts'; // Вот этот импорт исправит ошибку!
import Header from '../../layout/Header/Header';
import PostCard from '../../components/PostCard/PostCard';
import styles from './Home.module.scss';

function Home() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    // Безопасный вызов через наш новый сервисный слой
    postService.getPopular()
      .then(res => setPopularPosts(res.data.results || res.data || []))
      .catch(err => console.error("Ошибка популярных постов:", err))
      .finally(() => setLoadingPosts(false));

    postService.getRecent()
      .then(res => setRecentPosts(res.data.results || res.data || []))
      .catch(err => console.error("Ошибка новых постов:", err));

    postService.getCategories()
      .then(res => {
        setCategories(res.data.results || res.data || []);
        setCategoriesError(null);
      })
      .catch(err => {
        console.error("Ошибка категорий:", err);
        setCategoriesError("Ошибка авторизации / СУБД (500)");
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.mainContent}>
        
        {/* ВЕРХНИЙ БЛОК: Featured Posts */}
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Posts</h2>
            <a href="/posts" className={styles.allPostsLink}>
              Все посты
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          {loadingPosts ? (
            <p className={styles.emptyMessage}>Загрузка публикаций...</p>
          ) : popularPosts.length === 0 ? (
            <p className={styles.emptyMessage}>Нет популярных публикаций в базе данных.</p>
          ) : (
            <div className={styles.horizontalGrid}>
              {popularPosts.slice(0, 3).map(post => (
                <div key={post.id} className={styles.greenCardPatch}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* СРЕДНИЙ БЛОК: Лидерборды */}
        <section className={styles.leaderboards}>
          <div className={styles.boardColumn}>
            <h3 className={styles.boardTitle}>🔥 Top 10 Views</h3>
            {loadingPosts ? (
              <p className={styles.emptyMessage}>Синхронизация...</p>
            ) : popularPosts.length === 0 ? (
              <p className={styles.emptyMessage}>Статистика просмотров пуста.</p>
            ) : (
              <div className={styles.list}>
                {popularPosts.slice(0, 10).map((post, index) => (
                  <div key={post.id} className={styles.listItem}>
                    <span className={styles.rank}>{index + 1}</span>
                    <div className={styles.listMeta}>
                      <h4>{post.title}</h4>
                      <p>@{post.author || 'anonymous'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.boardColumn}>
            <h3 className={styles.boardTitle}>⚡ Recent Posts</h3>
            {loadingPosts ? (
              <p className={styles.emptyMessage}>Синхронизация...</p>
            ) : recentPosts.length === 0 ? (
              <p className={styles.emptyMessage}>В ленте ещё нет ни одного поста.</p>
            ) : (
              <div className={styles.list}>
                {recentPosts.slice(0, 10).map(post => (
                  <div key={post.id} className={styles.listItem}>
                    <span className={styles.dot}></span>
                    <div className={styles.listMeta}>
                      <h4>{post.title}</h4>
                      <p>@{post.author || 'anonymous'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* НИЖНИЙ БЛОК: Категории */}
        <section className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>Categories</h2>
          {loadingCategories ? (
            <p className={styles.emptyMessage}>Загрузка категорий...</p>
          ) : categoriesError ? (
            <p className={styles.emptyMessage} style={{ color: '#e63946' }}>{categoriesError}</p>
          ) : categories.length === 0 ? (
            <p className={styles.emptyMessage}>Категории еще не созданы.</p>
          ) : (
            <div className={styles.categoriesGrid}>
              {categories.map(cat => (
                <a href={`/category/${cat.slug}`} key={cat.id} className={styles.pinkCardPatch}>
                  <h3>{cat.title}</h3>
                  <span>{cat.post_count || 0}</span>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;