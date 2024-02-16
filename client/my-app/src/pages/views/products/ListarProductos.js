import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

export default function ListarProductos(){

    const [productos, setProductos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getProductos();
    }, []);

    function getProductos(){
        axios.get('http://localhost:9000/listar_productos')
        .then(
            function(response){
                setProductos(response.data);
            }
        ).catch(error => {
            console.error("Error al obtener los productos", error)
        });
    }

    const borrarProducto = (id) => {
        axios.delete(`http://localhost:9000/borrar_producto/${id}`)
        .then(function(response){
            getProductos();
        })
        .catch(function(error){
            console.error("Error al borrar el producto:", error);
        });
        alert("Producto borrado");
    };

    const cerrarSesion = () => {
        alert("Cerraste sesión correctamente")
        navigate("/");
    };

    return (
        <div>
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <Link to="/usuarios" className="btn btn-primary me-2">Usuarios</Link>
                                <Link to="/ventas" className="btn btn-primary me-2">Ventas</Link>
                                <Link to="/informe" className="btn btn-primary me-2">Informe</Link>
                                <button className="btn btn-primary me-2" onClick={cerrarSesion}>Cerrar sesión</button>
                            </div>
                            <h1>Listar Productos</h1>
                            <Link to="/crear/producto" className="btn btn-success">Crear Producto</Link>
                        </div>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre</th>
                                    <th>Descripcion</th>
                                    <th>Modelo</th>
                                    <th>Cantidad Bodega</th>
                                    <th>Valor Venta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto, key) => 
                                    <tr key={key}>
                                        <td>{producto.id}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>{producto.modelo}</td>
                                        <td>{producto.cantidad_bodega}</td>
                                        <td>{producto.valor_venta}</td>
                                        <td>
                                            <Link to={`${producto.id}/editar`} className="btn btn-success" style={{marginRight: "10px"}}>Editar</Link>
                                            <button onClick={() => borrarProducto(producto.id)} className="btn btn-danger">Borrar</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
