import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PromocaoList from './PromocaoList';
import PromocaoForm from './PromocaoForm';

const AdminPromocoes = () => {
  return (
    <Routes>
      <Route path="/" element={<PromocaoList />} />
      <Route path="/nova" element={<PromocaoForm />} />
      <Route path="/editar/:id" element={<PromocaoForm />} />
    </Routes>
  );
};

export default AdminPromocoes;
