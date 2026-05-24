import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile'; // Импорт новой страницы

function App() {
  const path = window.location.pathname;

  if (path === '/login') {
    return <Login />;
  }

  if (path === '/register') {
    return <Register />;
  }

  // Принимаем как прямой путь /profile, так и /auth/profile/my
  if (path === '/profile' || path === '/auth/profile/my') {
    return <Profile />;
  }

  return <Home />;
}

export default App;