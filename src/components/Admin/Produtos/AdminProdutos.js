import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProdutoList from './ProdutoList';
import ProdutoForm from './ProdutoForm';

const AdminProdutos = () => {
  return (
    <Routes>
      <Route path="/" element={<ProdutoList />} />
      <Route path="/novo" element={<ProdutoForm />} />
      <Route path="/editar/:id" element={<ProdutoForm />} />
    </Routes>
  );
};

export default AdminProdutos;
