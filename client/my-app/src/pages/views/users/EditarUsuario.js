import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarUsuario(){

    const navigate = useNavigate()

    const [inputs, setInputs] = useState({
        nombre: "",
        email: "",
        rol: ""
    });
    const {id} = useParams()

    useEffect(() => {
        getUsuario()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getUsuario(){
        axios.get(`http://localhost:9000/detalles_usuario/${id}`)
        .then(function(response) {
            setInputs(response.data)
        })
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        axios.put(`http://localhost:9000/editar_usuario/${id}`, inputs)
        .then(function(response){
            alert("Usuario editado sin problema")
            navigate('/usuarios')
        }).catch(function(error){
            console.error('Error al editar el usuario:', error);
            alert("Error al editar el usuario");
        });
    }

    const handleCancelar = () => {
        navigate('/usuarios')
    }

    return(
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <h1>Editar Usuario</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Nombre</label>
                                <input type="text" value={inputs.nombre} className="form-control" name="nombre" onChange={handleChange}/>
                            </div>

                            <div className="mb-3">
                                <label>Email</label>
                                <input type="email" value={inputs.email} className="form-control" name="email" onChange={handleChange}/>
                            </div>

                            <div className="mb-3">
                                <label>Rol</label>
                                <input type="text" value={inputs.rol} className="form-control" name="rol" onChange={handleChange}/>
                            </div>

                            <button type="submit" className="btn btn-primary me-2">Guardar</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
