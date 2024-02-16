// App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Importa el proveedor de contexto

import ListarProductos from './pages/views/products/ListarProductos';
import CrearProducto from './pages/views/products/CrearProducto';
import EditarProducto from './pages/views/products/EditarProducto';
import Inicio from './pages/views/session/Inicio';
import Login from './pages/views/session/Login';
import Registro from './pages/views/session/Registro';
import ListarUsuarios from './pages/views/users/ListarUsuarios';
import CrearUsuario from './pages/views/users/CrearUsuario';
import EditarUsuario from './pages/views/users/EditarUsuario';
import ListarVentas from './pages/views/sales/ListarVentas';

function App() {
  return (
    <div className='vh-100 gradient-custom'>
      <div className='container'>
        <h1 className='page-header text-center'>Equitel App</h1>

        {/* Envuelve todo el contenido de App con el AuthProvider */}
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Inicio />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Registro />} />
              <Route path='/productos' element={<ListarProductos />} />
              <Route path='/crear/producto' element={<CrearProducto />} />
              <Route path='/productos/:id/editar' element={<EditarProducto />} />
              <Route path='/usuarios' element={<ListarUsuarios />} />
              <Route path='/crear/usuario' element={<CrearUsuario />} />
              <Route path='/usuarios/:id/editar' element={<EditarUsuario />} />
              <Route path='/ventas' element={<ListarVentas />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;
