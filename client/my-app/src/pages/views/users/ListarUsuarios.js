import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

export default function ListarUsuarios(){

    const [usuarios, setUsuarios] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getUsuarios();
    }, []);

    function getUsuarios(){
        axios.get('http://localhost:9000/listar_usuarios')
        .then(
            function(response){
                setUsuarios(response.data);
            }
        );
    }

    const borrarUsuario = (id) => {
        axios.delete(`http://localhost:9000/borrar_usuario/${id}`)
        .then(function(response){
            getUsuarios();
        })
        .catch(function(error){
            console.error("Error al borrar el usuario:", error);
        });
        alert("Usuario borrado");
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
                                <Link to="/productos" className="btn btn-primary me-2">Productos</Link>
                                <Link to="/ventas" className="btn btn-primary me-2">Ventas</Link>
                                <Link to="/informe" className="btn btn-primary me-2">Informe</Link>
                                <button className="btn btn-primary me-2" onClick={cerrarSesion}>Cerrar sesión</button>
                            </div>
                            <h1>Listar Usuarios</h1>
                            <Link to="/crear/usuario" className="btn btn-success">Crear Usuario</Link>
                        </div>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario, key) => 
                                    <tr key={key}>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.rol}</td>
                                        <td>
                                            <Link to={`${usuario.id}/editar`} className="btn btn-success" style={{marginRight: "10px"}}>Editar</Link>
                                            <button onClick={() => borrarUsuario(usuario.id)} className="btn btn-danger">Borrar</button>
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
