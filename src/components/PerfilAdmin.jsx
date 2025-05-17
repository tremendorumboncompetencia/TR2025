import React, { useState, useEffect } from 'react';
import { database } from '../firebase/firebase';
import { ref, push, onValue, remove, update } from 'firebase/database';
import { Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';

const PerfilAdmin = ({ admin, onLogout }) => {
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);

  // Leer categorías al cargar el componente
  useEffect(() => {
    const categoriasRef = ref(database, 'categorias');
    const unsubscribe = onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, categoria]) => ({
            id,
            ...categoria,
          }))
        : [];
      setCategorias(lista);
    });

    return () => unsubscribe();
  }, []);

  // Agregar nueva categoría
  const handleAgregarCategoria = () => {
    if (nuevaCategoria.trim() === '') return;

    const categoriasRef = ref(database, 'categorias');
    const nuevoOrden = categorias.length + 1;

    push(categoriasRef, {
      nombre: nuevaCategoria,
      fechaCreacion: new Date().toISOString(),
      orden: nuevoOrden,
    })
      .then(() => {
        setNuevaCategoria('');
      })
      .catch((error) => {
        console.error('Error al agregar categoría:', error);
      });
  };

  // Eliminar categoría
  const handleEliminarCategoria = (id) => {
    const categoriaRef = ref(database, `categorias/${id}`);
    remove(categoriaRef).catch((error) =>
      console.error('Error al eliminar categoría:', error)
    );
  };

  // Mover categoría (intercambiar orden)
  const moverCategoria = (indiceActual, direccion) => {
    const nuevaLista = [...categorias].sort((a, b) => a.orden - b.orden);
    const nuevoIndice = indiceActual + direccion;

    // Evitar mover fuera de límites
    if (nuevoIndice < 0 || nuevoIndice >= nuevaLista.length) return;

    const actual = nuevaLista[indiceActual];
    const otra = nuevaLista[nuevoIndice];

    // Intercambiar orden en la base de datos
    const updates = {};
    updates[`categorias/${actual.id}/orden`] = otra.orden;
    updates[`categorias/${otra.id}/orden`] = actual.orden;

    update(ref(database), updates).catch((error) =>
      console.error('Error al mover categoría:', error)
    );
  };

  return (
    <section className="p-5 text-center bg-white">
      <h2>Perfil de Administrador</h2>
      <h4>{admin.nombre}</h4>
      <p><strong>Email:</strong> {admin.email}</p>

      <div className="d-flex justify-content-center align-items-center gap-2 my-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Nombre de la nueva categoría"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAgregarCategoria}>
          <Plus size={20} />
        </button>
      </div>

      {categorias.length > 0 ? (
        <table className="table table-striped table-bordered w-75 mx-auto">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Fecha de Creación</th>
              <th>Orden</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[...categorias]
              .sort((a, b) => a.orden - b.orden)
              .map((categoria, index, arr) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>{new Date(categoria.fechaCreacion).toLocaleString()}</td>
                  <td>{categoria.orden}</td>
                  <td className="d-flex justify-content-center gap-1">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => moverCategoria(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => moverCategoria(index, 1)}
                      disabled={index === arr.length - 1}
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleEliminarCategoria(categoria.id)}
                    >
                      <Minus size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No hay categorías registradas.</p>
      )}

      <button className="btn btn-danger mt-4" onClick={onLogout}>
        Cerrar sesión
      </button>
    </section>
  );
};

export default PerfilAdmin;
