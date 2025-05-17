// src/components/Principal.jsx
import React, { useEffect, useState } from 'react';
import { database } from '../firebase/firebase';
import { ref, onValue } from 'firebase/database';

const Principal = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const categoriasRef = ref(database, 'categorias');
    const unsubscribe = onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, cat]) => ({
            id,
            nombre: cat.nombre,
          }))
        : [];
      setCategorias(lista);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="text-center mt-4">
      <h2>Bienvenido a nuestra página de competencia.</h2>

      {/* Lista de categorías */}
      {categorias.length > 0 ? (
        <div className="mt-3">
          <h5>Categorías disponibles:</h5>
          <ul className="list-unstyled">
            {categorias.map((categoria) => (
              <li key={categoria.id}>{categoria.nombre}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-muted">No hay categorías disponibles aún.</p>
      )}
    </div>
  );
};

export default Principal;
