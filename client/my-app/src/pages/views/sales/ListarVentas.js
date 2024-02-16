import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';

export default function ListarVentas(){

    const { userRole, userId } = useAuth()

    const [ventas, setVentas] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getVentas();
    }, []);

    function getVentas(){
        axios.get(`http://localhost:9000/listar_ventas?id=${userId}&rol=${userRole}`)
            .then(
                function(response){
                    setVentas(response.data);
                }
            )
            .catch(error => {
                console.error("Error al obtener las ventas:", error);
            });
    }

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
                                <Link to="/productos" className="btn btn-primary me-2">Productos</Link>
                                <Link to="/informe" className="btn btn-primary me-2">Informe</Link>
                                <button className="btn btn-primary me-2" onClick={cerrarSesion}>Cerrar sesión</button>
                            </div>
                            <h1>Listar Ventas</h1>
                            <Link to="/crear/venta" className="btn btn-success">Crear Venta</Link>
                        </div>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Id Usuario</th>
                                    <th>Fecha</th>
                                    <th>Total Venta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map((venta, key) => 
                                    <tr key={key}>
                                        <td>{venta.id}</td>
                                        <td>{venta.id_usuario}</td>
                                        <td>{venta.fecha}</td>
                                        <td>{venta.total_venta}</td>
                                        <td>
                                            <Link to={`detalles_venta/${venta.id}`} className="btn btn-info" style={{marginRight: "10px"}}>Detalles</Link>
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
