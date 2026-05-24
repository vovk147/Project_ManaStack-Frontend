![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD627)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
# 🌌 Project_ManaStack — Frontend

Клиентская часть платформы ManaStack. Разработано как SPA (Single Page Application) с адаптивным интерфейсом, кастомной стилизацией и динамическим управлением состояниями.

> 🛠 **Бэкенд проекта:** Этот фронтенд работает в связке с REST API. Полный исходный код серверной части находится в репозитории соавтора проекта: **[Project_ManaStack Backend](https://github.com/Vladyslav147/Project_ManaStack)**.

---

## 👥 Команда проекта (Team)

* **Dafforn** ([@vovk147](https://github.com/vovk147)) — **Frontend Developer** (Архитектура клиента, UI/UX, интеграция API, управление стейтом, кастомизация компонентов).
* **Sttimson** ([@Vladyslav147](https://github.com/Vladyslav147)) — **Backend Developer** (Проектирование базы данных PostgreSQL, Django REST Framework API, фоновые задачи Celery, Docker-окружение).

---

## 🚀 Стек технологий (Tech Stack)

* **Core:** React 18+, Vite
* **Стилизация:** CSS / TailwindCSS (адаптивная вёрстка)
* **Сеть:** Axios (интеграция с DRF API, перехватчики для автоматического обновления JWT-токенов)
* **Инструменты:** ESLint, Docker (для контейнеризации фронтенд-сервиса)

---
## 📂 Архитектура фронтенда (Project Structure)

В основе проекта лежит модульная структура со строгим разделением ответственности:

```text
src/
├── assets/          # Статические ресурсы (логотипы, иконки, глобальные стили)
├── components/      # Глобальные UI-компоненты многократного использования (PostCard, Loader)
├── context/         # React Context для управления глобальным стейтом (AuthContext)
├── layout/          # Элементы каркаса страниц (Header, Sidebar, Footer)
├── pages/           # Основные экраны приложения (Home, Profile, Login, Store)
├── services/        # Слой для работы с сетью и API бэкенда (axios инстанс, эндпоинты)
├── App.jsx          # Корневой компонент, роутинг приложения
└── main.jsx         # Точка входа в приложение

## 🔧 Локальный запуск (How to run)

1. Клонировать репозиторий:
```bash
   git clone [https://github.com/vovk147/Project_ManaStack-Frontend.git](https://github.com/vovk147/Project_ManaStack-Frontend.git)
   cd Project_ManaStack-Frontend
