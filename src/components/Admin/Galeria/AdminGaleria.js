import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GaleriaList from './GaleriaList';
import GaleriaForm from './GaleriaForm';

const AdminGaleria = () => {
  return (
    <Routes>
      <Route path="/" element={<GaleriaList />} />
      <Route path="/nova" element={<GaleriaForm />} />
      <Route path="/editar/:id" element={<GaleriaForm />} />
    </Routes>
  );
};

export default AdminGaleria;
