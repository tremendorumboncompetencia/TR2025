import React, { useState, useEffect } from 'react';
import { ref as dbRef, get, set, child } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebase/firebase';

const RegistroForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    pais: '',
    foto: null,
    password: '',
    confirmPassword: '',
  });

  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((res) => res.json())
      .then((data) => {
        const nombres = data
          .map((pais) => pais.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setPaises(nombres);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      setSubmitting(false);
      return;
    }

    try {
      const usuariosRef = dbRef(database, 'usuarios');
      const snapshot = await get(usuariosRef);

      // ⚠️ Verificar si ya existe ese email
      if (snapshot.exists()) {
        const usuarios = snapshot.val();
        const emailYaExiste = Object.values(usuarios).some(
          (usuario) => usuario.email === formData.email
        );

        if (emailYaExiste) {
          alert('Ya existe un usuario con ese correo electrónico');
          setSubmitting(false);
          return;
        }
      }

      let fotoURL = '';
      if (formData.foto) {
        const fileRef = storageRef(storage, `fotos/${Date.now()}_${formData.foto.name}`);
        const snapshot = await uploadBytes(fileRef, formData.foto);
        fotoURL = await getDownloadURL(snapshot.ref);
      }

      const datosUsuario = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        pais: formData.pais,
        fotoURL,
        password: formData.password, // ⚠️ No recomendado guardar en texto plano.
      };

      const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      const newUserKey = `usuario${count}`;

      await set(child(usuariosRef, newUserKey), datosUsuario);

      alert('Registro exitoso');

      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        pais: '',
        foto: null,
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Hubo un error al registrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-5 bg-white">
      <h2>Registro</h2>
      <form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">País</label>
          <select className="form-select" name="pais" value={formData.pais} onChange={handleChange} required>
            <option value="">Seleccione un país</option>
            {paises.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Foto de perfil</label>
          <input type="file" className="form-control" name="foto" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </section>
  );
};

export default RegistroForm;
