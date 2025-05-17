import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import RegistroForm from './components/RegistroForm';
import LoginForm from './components/LoginForm';
import PerfilUsuario from './components/PerfilUsuario';
import PerfilAdmin from './components/PerfilAdmin';
import Header from './components/Header';
import Principal from './components/Principal'; // ✅ Nuevo import

const App = () => {
  const [view, setView] = useState('inicio');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [adminLogueado, setAdminLogueado] = useState(null);

  const renderContent = () => {
    if (adminLogueado) {
      return <PerfilAdmin admin={adminLogueado} onLogout={handleLogout} />;
    }

    if (usuarioLogueado) {
      return <PerfilUsuario usuario={usuarioLogueado} onLogout={handleLogout} />;
    }

    switch (view) {
      case 'registro':
        return <RegistroForm />;
      case 'acceder':
        return (
          <LoginForm
            onLogin={(user) => {
              setUsuarioLogueado(user);
              setView('perfil');
            }}
            onLoginAdmin={(admin) => {
              setAdminLogueado(admin);
              setView('admin');
            }}
          />
        );
      default:
        return <Principal />; // ✅ Uso del nuevo componente
    }
  };

  const handleLogout = () => {
    setUsuarioLogueado(null);
    setAdminLogueado(null);
    setView('acceder');
  };

  return (
    <>
      <Sidebar onSelect={setView} />
      <Header />
      {renderContent()}
      <Footer />
    </>
  );
};

export default App;
