import React, { useState } from 'react';
import { get, ref as dbRef } from 'firebase/database';
import { database } from '../firebase/firebase';
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

const LoginForm = ({ onLogin, onLoginAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const snapshotUsuarios = await get(dbRef(database, 'usuarios'));
      const snapshotAdmin = await get(dbRef(database, 'admin')); // 🔄 aquí está el cambio

      // Validación de usuario normal
      if (snapshotUsuarios.exists()) {
        const usuarios = snapshotUsuarios.val();
        const user = Object.values(usuarios).find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          onLogin(user);
          return;
        }
      }

      // Validación de admin
      if (snapshotAdmin.exists()) {
        const admins = snapshotAdmin.val();
        const admin = Object.values(admins).find(
          (a) => a.email === email && a.password === password
        );
        if (admin) {
          onLoginAdmin(admin);
          return;
        }
      }

      alert('Credenciales inválidas');
    } catch (err) {
      console.error(err);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <section className="p-5 bg-light">
      <h2>Acceder</h2>
      <form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <div className="input-group">
            <input
              type={mostrarPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              {mostrarPassword ? <IoEyeOff />: <FaEye />}
            </button>
          </div>
        </div>
        <button className="btn btn-success" type="submit">Ingresar</button>
      </form>
    </section>
  );
};

export default LoginForm;
