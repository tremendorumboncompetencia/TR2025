// src/components/Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleClick = (view) => {
    onSelect(view);
    setOpen(false);
  };

  return (
    <>
      <button className="btn btn-secondary m-3" onClick={() => setOpen(!open)}>
        ☰ Menú
      </button>
      <div className={`sidebar ${open ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>×</button>
        <a href="#" onClick={() => handleClick('inicio')}>Inicio</a>
        <a href="#" onClick={() => handleClick('registro')}>Registro</a>
        <a href="#" onClick={() => handleClick('acceder')}>Acceder</a>
      </div>
    </>
  );
};

export default Sidebar;
