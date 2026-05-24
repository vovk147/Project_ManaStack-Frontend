import styles from './PostCard.module.scss';

function PostCard({ post }) {
  // Добавляем views (или views_count, проверь как в твоей модели Django)
  const { title, description, author, created_at, slug, views } = post;

  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <span className={styles.author}>@{author || 'anonymous'}</span>
          
          <div className={styles.metaRight}>
            <span className={styles.views}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {views ?? 0}
            </span>
            <span className={styles.date}>
              {new Date(created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      
      <div className={styles.footer}>
        <a href={`/posts/${slug}`} className={styles.link}>
          Читать
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </article>
  );
}

export default PostCard;