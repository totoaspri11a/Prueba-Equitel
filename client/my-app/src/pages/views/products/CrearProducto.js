import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearProducto(){

    const navigate = useNavigate()

    const [inputs, setInputs] = useState([])

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        axios.post('http://localhost:9000/crear_producto', inputs)
        .then(function(response){
            alert('producto creado')
            navigate('/productos')
        })
    }

    const handleCancelar = () => {
        navigate('/productos')
    }

    return(
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8"></div>
                    <h1>Crear Producto</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Nombre</label>
                            <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Descripcion</label>
                            <input type="text" className="form-control" name="descripcion" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Modelo</label>
                            <input type="text" className="form-control" name="modelo" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Cantidad Bodega</label>
                            <input type="number" className="form-control" name="cantidad_bodega" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Valor Venta</label>
                            <input type="number" step='0.01' className="form-control" name="valor_venta" onChange={handleChange}/>
                        </div>
                        <button type="submit" name="crear" className="btn btn-primary me-2">Guardar</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
                    </form>
                </div>
                <div className="col-2"></div>
            </div>
        </div>
    )
}