import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarProducto(){

    const navigate = useNavigate()

    const [inputs, setInputs] = useState({
        nombre: "",
        descripcion: "",
        modelo: "",
        cantidad_bodega: "",
        valor_venta: ""
    });
    const {id} = useParams()

    useEffect(() => {
        getProducto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getProducto(){
        axios.get(`http://localhost:9000/detalles_producto/${id}`)
        .then(function(response) {
            alert("Producto editado sin problema")
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

        axios.put(`http://localhost:9000/editar_producto/${id}`, inputs)
        .then(function(response){
            alert('producto editado')
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
                    <div className="col-8">
                        <h1>Editar Producto</h1>
                        <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Nombre</label>
                            <input type="text" value={inputs.nombre} className="form-control" name="nombre" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Descripcion</label>
                            <input type="text" value={inputs.descripcion} className="form-control" name="descripcion" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Modelo</label>
                            <input type="text" value={inputs.modelo} className="form-control" name="modelo" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Cantidad Bodega</label>
                            <input type="number" value={inputs.cantidad_bodega} className="form-control" name="cantidad_bodega" onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label>Valor Venta</label>
                            <input type="number" value={inputs.valor_venta} step='0.01' className="form-control" name="valor_venta" onChange={handleChange}/>
                        </div>
                        <button type="submit" name="crear" className="btn btn-primary me-2">Guardar</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
