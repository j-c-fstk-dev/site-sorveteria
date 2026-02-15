import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UnidadeList from './UnidadeList';
import UnidadeForm from './UnidadeForm';

const AdminUnidades = () => {
  return (
    <Routes>
      <Route path="/" element={<UnidadeList />} />
      <Route path="/nova" element={<UnidadeForm />} />
      <Route path="/editar/:id" element={<UnidadeForm />} />
    </Routes>
  );
};

export default AdminUnidades;
