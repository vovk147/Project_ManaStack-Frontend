import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/auth';
import { postService } from '../../services/posts';
import { socialService } from '../../services/social';
import { storeService } from '../../services/store';
import Header from '../../layout/Header/Header';
import PostCard from '../../components/PostCard/PostCard';
import styles from './Profile.module.scss';

function Profile() {
  const { token, isLoggedIn } = useContext(AuthContext);
  
  // Данные и табы
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); 
  
  // Списки данных из СУБД
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Стейты для редактирования профиля (PATCH)
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Системные стейты
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      window.location.href = '/login';
      return;
    }

    let userId = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.user_id || payload.id;
    } catch (e) {
      setError("Не удалось распознать токен авторизации");
      setLoading(false);
      return;
    }

    // Загружаем всё параллельно
    Promise.all([
      authService.getProfile(userId),
      postService.getMyPosts(),
      socialService.getMyComments(),
      socialService.getFollowers(),
      storeService.getInventory()
    ])
      .then(([profRes, postsRes, commRes, followRes, invRes]) => {
        setProfileData(profRes.data);
        setBio(profRes.data.bio || '');
        setFirstName(profRes.data.first_name || '');
        setLastName(profRes.data.last_name || '');

        setMyPosts(postsRes.data.results || postsRes.data || []);
        setMyComments(commRes.data.results || commRes.data || []);
        setFollowers(followRes.data.results || followRes.data || []);
        setInventory(invRes.data.results || invRes.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Ошибка обмена данными с ManaStack API");
      })
      .finally(() => setLoading(false));
  }, [token, isLoggedIn]);

  // ЭКШЕН 1: Реальная отправка данных в базу данных PostgreSQL через Django API
  const handleSaveProfile = async () => {
    setActionLoading(true);
    try {
      // Формируем тело запроса строго по твоей Swagger/OpenAPI схеме
      const requestBody = {
        first_name: firstName,
        last_name: lastName,
        bio: bio,
        avatar: profileData?.avatar || "" // Передаем текущую строку аватара
      };

      // Делаем реальный PATCH запрос на /api/v1/auth/profile/{id}/
      const response = await authService.patchProfile(profileData.id, requestBody);
      
      // Если бэк пропустил — обновляем интерфейс чистыми данными из базы
      setProfileData(response.data);
      
      // Синхронизируем базовую инфу в контексте, чтобы Хедер тоже обновился
      const currentAuthUser = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('userData', JSON.stringify({
        ...currentAuthUser,
        username: response.data.first_name || currentAuthUser.username,
        bio: response.data.bio
      }));

      setIsEditing(false);
      alert("Данные успешно сохранены в базу данных!");

    } catch (err) {
      console.error("Критический сбой при сохранении в БД:", err);
      
      // Вытаскиваем детальную ошибку от Django, чтобы понимать, что происходит
      if (err.response && err.response.data) {
        const bdError = err.response.data;
        if (typeof bdError === 'object' && !bdError.detail) {
          const msg = Object.entries(bdError)
            .map(([field, e]) => `${field}: ${Array.isArray(e) ? e.join(', ') : e}`)
            .join('\n');
          alert(`Бэкенд отклонил запись в БД:\n${msg}`);
        } else {
          alert(`Ошибка СУБД: ${bdError.detail || "Внутренняя ошибка сервера (500)"}`);
        }
      } else {
        alert("Не удалось достучаться до сервера. Проверь сеть.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ЭКШЕН 2: Удаление своего поста (DELETE /api/v1/posts/{slug}/)
  const handleDeletePost = async (slug) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту публикацию?")) return;
    
    try {
      await postService.deletePost(slug);
      // Убираем пост из стейта на фронте, чтобы он исчез сразу
      setMyPosts(myPosts.filter(post => post.slug !== slug));
    } catch (err) {
      alert("Ошибка при делении поста");
    }
  };

  // ЭКШЕН 3: Закрепить / Открепить пост (POST /api/v1/store/pin_post/)
  const handleTogglePin = async (postId, isPinned) => {
    try {
      if (isPinned) {
        await storeService.unpinPost(postId);
        alert("Пост откреплен");
      } else {
        await storeService.pinPost(postId);
        alert("Пост успешно закреплен через функционал магазина!");
      }
      // Перезапрашиваем список постов, чтобы обновить флаги закрепа
      const postsRes = await postService.getMyPosts();
      setMyPosts(postsRes.data.results || postsRes.data || []);
    } catch (err) {
      alert("Недостаточно маны или ошибка выполнения операции");
    }
  };

  if (loading) return <div className={styles.loadingWrapper}><div className={styles.spinner}></div></div>;
  if (error) return <div className={styles.errorWrapper}><p>{error}</p></div>;

  return (
    <div className={styles.wrapper}>
      <Header />

      <div className={styles.container}>
        {/* СИДБАР: Теперь с поддержкой inline-редактирования */}
        <aside className={styles.sidebar}>
          <div className={styles.avatarBlock}>
            {profileData?.avatar ? (
              <img src={profileData.avatar} alt="" />
            ) : (
              <div className={styles.fallbackAvatar}>
                {(profileData?.full_name || profileData?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className={styles.rankBadge}>
              Rank {profileData?.rank} — {profileData?.rank_name || 'User'}
            </div>
          </div>

          <div className={styles.userInfo}>
            {!isEditing ? (
              <>
                <h1>{profileData?.full_name || profileData?.email.split('@')[0]}</h1>
                <p className={styles.emailText}>{profileData?.email}</p>
                {profileData?.bio && <p className={styles.bioText}>{profileData.bio}</p>}
                <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Редактировать</button>
              </>
            ) : (
              <div className={styles.editForm}>
                <input 
                  type="text" 
                  placeholder="Имя" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Фамилия" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                />
                <textarea 
                  placeholder="О себе (bio)..." 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                />
                <div className={styles.editActions}>
                  <button className={styles.saveBtn} onClick={handleSaveProfile} disabled={actionLoading}>
                    {actionLoading ? '...' : 'Сохранить'}
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Отмена</button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue} style={{ color: '#e63946' }}>{profileData?.mana}</span>
              <span className={styles.statLabel}>Мана</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{profileData?.posts_count || myPosts.length}</span>
              <span className={styles.statLabel}>Посты</span>
            </div>
          </div>

          <div className={styles.systemMeta}>
            <span>ID профиля: {profileData?.id}</span>
            <span>Создан: {new Date(profileData?.created_at).toLocaleDateString()}</span>
          </div>
        </aside>

        {/* КОНТЕНТ-ЗОНА: Твои публикации и управление ими */}
        <main className={styles.contentArea}>
          <nav className={styles.tabsNav}>
            <button className={activeTab === 'posts' ? styles.activeTab : ''} onClick={() => setActiveTab('posts')}>
              Публикации ({myPosts.length})
            </button>
            <button className={activeTab === 'comments' ? styles.activeTab : ''} onClick={() => setActiveTab('comments')}>
              Комментарии ({myComments.length})
            </button>
            <button className={activeTab === 'followers' ? styles.activeTab : ''} onClick={() => setActiveTab('followers')}>
              Подписчики ({followers.length})
            </button>
            <button className={activeTab === 'inventory' ? styles.activeTab : ''} onClick={() => setActiveTab('inventory')}>
              Карточки ({inventory.length})
            </button>
          </nav>

          <div className={styles.tabContent}>
            {/* ТАБ 1: ПОСТЫ + Управление */}
            {activeTab === 'posts' && (
              <div className={styles.postsGrid}>
                {myPosts.length === 0 ? (
                  <p className={styles.emptyText}>У вас нет постов.</p>
                ) : (
                  myPosts.map(post => (
                    <div key={post.id} className={styles.manageCardWrapper}>
                      <PostCard post={post} />
                      <div className={styles.managementBar}>
                        <button 
                          className={post.is_pinned ? styles.pinnedBtn : styles.pinBtn} 
                          onClick={() => handleTogglePin(post.id, post.is_pinned)}
                        >
                          {post.is_pinned ? 'Открепить' : 'Закрепить'}
                        </button>
                        <button className={styles.deleteBtn} onClick={() => handleDeletePost(post.slug)}>
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ТАБ 2: КОММЕНТАРИИ */}
            {activeTab === 'comments' && (
              <div className={styles.commentsList}>
                {myComments.length === 0 ? (
                  <p className={styles.emptyText}>Нет комментариев.</p>
                ) : (
                  myComments.map(c => (
                    <div key={c.id} className={styles.commentCard}>
                      <div className={styles.commentHead}>
                        <span>Пост ID: {c.post}</span>
                        <span className={styles.commentDate}>{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p>{c.text || c.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ТАБ 3: ПОДПИСЧИКИ */}
            {activeTab === 'followers' && (
              <div className={styles.followersGrid}>
                {followers.length === 0 ? (
                  <p className={styles.emptyText}>Нет подписчиков.</p>
                ) : (
                  followers.map(f => (
                    <div key={f.id} className={styles.followerCard}>
                      <div className={styles.followerAvatar}>U</div>
                      <div>
                        <h4>{f.username || 'User'}</h4>
                        <p>{f.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ТАБ 4: ИНВЕНТАРЬ КАРТОЧЕК */}
            {activeTab === 'inventory' && (
              <div className={styles.inventoryGrid}>
                {inventory.length === 0 ? (
                  <p className={styles.emptyText}>Инвентарь пуст.</p>
                ) : (
                  inventory.map((item, idx) => (
                    <div key={item.id || idx} className={styles.inventoryCard}>
                      <div className={styles.itemBadge}>Кол-во: {item.card_count || 1}</div>
                      <h3 className={styles.itemName}>{item.card || 'Кастомная карточка'}</h3>
                      <div className={styles.itemFooter}><span>ID предмета: {item.id}</span></div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;