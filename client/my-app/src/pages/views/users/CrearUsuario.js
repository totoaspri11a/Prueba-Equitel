import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearUsuario(){

    const navigate = useNavigate()

    const [inputs, setInputs] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: ""
    })

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        axios.post('http://localhost:9000/crear_usuario', inputs)
        .then(function(response){
            alert("Usuario creado sin problemas")
            navigate('/usuarios')
        })
    }

    const handleCancelar = () => {
        navigate('/usuarios')
    }

    return(
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8"></div>
                    <h1>Crear Usuario</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Nombre</label>
                            <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" name="email" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control" name="password" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Rol</label>
                            <input type="text" className="form-control" name="rol" onChange={handleChange}/>
                        </div>

                        <button type="submit" className="btn btn-primary me-2">Guardar</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
                    </form>
                </div>
                <div className="col-2"></div>
            </div>
        </div>
    )
}
