// src/components/PerfilUsuario.jsx
import React, { useState } from 'react';
import { ref as dbRef, get, update } from 'firebase/database';
import { database } from '../firebase/firebase';

const PerfilUsuario = ({ usuario, onLogout }) => {
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleGuardarPassword = async () => {
    setMensaje('');
    setError('');

    if (!nuevaPassword.trim() || !confirmarPassword.trim()) {
      setError('Ambos campos son obligatorios.');
      return;
    }

    if (nuevaPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setGuardando(true);
    try {
      const usuariosRef = dbRef(database, 'usuarios');
      const snapshot = await get(usuariosRef);

      if (snapshot.exists()) {
        const usuarios = snapshot.val();
        const idUsuario = Object.keys(usuarios).find(
          (key) => usuarios[key].email === usuario.email
        );

        if (idUsuario) {
          const usuarioRef = dbRef(database, `usuarios/${idUsuario}`);
          await update(usuarioRef, { password: nuevaPassword });
          setMensaje('Contraseña actualizada correctamente.');
        } else {
          setError('Usuario no encontrado.');
        }
      }
    } catch (error) {
      console.error('Error actualizando la contraseña:', error);
      setError('Hubo un error al actualizar la contraseña.');
    } finally {
      setGuardando(false);
      setNuevaPassword('');
      setConfirmarPassword('');
    }
  };

  return (
    <section className="p-5 text-center bg-white">
      <h2>Perfil del Usuario</h2>
      <img
        src={usuario.fotoURL || 'https://via.placeholder.com/150'}
        alt="Foto de perfil"
        className="rounded-circle mb-3"
        width="150"
        height="150"
      />
      <h4>{usuario.nombre} {usuario.apellido}</h4>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>País:</strong> {usuario.pais}</p>

      <button className="btn btn-danger my-3" onClick={onLogout}>Cerrar sesión</button>

      <hr />
      <div className="mt-4">
        <h5>Cambiar Contraseña</h5>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          className="form-control w-50 mx-auto my-2"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          className="form-control w-50 mx-auto my-2"
        />
        <button className="btn btn-primary" onClick={handleGuardarPassword} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Actualizar contraseña'}
        </button>

        {mensaje && <p className="mt-2 text-success">{mensaje}</p>}
        {error && <p className="mt-2 text-danger">{error}</p>}
      </div>
    </section>
  );
};

export default PerfilUsuario;
