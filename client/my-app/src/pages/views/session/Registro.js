import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
 
export default function Registro(){
 
    const [nombre, setNombre] = useState('')
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [rol, setRol] = useState('')
   
    const navigate = useNavigate();
     
    const registrarUsuario = () => {
        axios.post('http://localhost:9000/signup', {
            nombre: nombre,
            email: email,
            password: password,
            rol: rol
        })
        .then(function (response) {
            alert("Registro realizado con éxito")
            navigate("/Login");
        })
        .catch(function (error) {
            console.log(error, 'error');
            if (error.response.status === 401) {
                alert("Credenciales inválidas");
            }
        });
    };
     
    let imgs = [
      'https://as2.ftcdn.net/v2/jpg/03/39/70/91/1000_F_339709132_H9HSSTtTmayePcbARkTSB2qoZTubJ6bR.jpg',
    ];
     
  return (
    <div>
        <div className="container h-100">
          <div className="container-fluid h-custom">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form>
                  <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                    <p className="lead fw-normal mb-0 me-3">Crea tu cuenta</p>
                  </div>

                  <div className="form-outline mb-2">
                    <input type="email" value={nombre} onChange={(e) => setNombre(e.target.value)} id="form3Example2" className="form-control form-control-lg" placeholder="Ingresa tu nombre" />
                    <label className="form-label" htmlFor="form3Example2">Nombre</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="form3Example3" className="form-control form-control-lg" placeholder="Ingresa un email válido" />
                    <label className="form-label" htmlFor="form3Example3">Email</label>
                  </div>
 
             
                  <div className="form-outline mb-3">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="form3Example4" className="form-control form-control-lg" placeholder="Ingresa una contraseña" />
                    <label className="form-label" htmlFor="form3Example4">Password</label>
                  </div>

                  <div className="form-outline mb-5">
                    <input type="text" value={rol} onChange={(e) => setRol(e.target.value)} id="form3Example5" className="form-control form-control-lg" placeholder="Ingresa el rol de admin o vendedor" />
                    <label className="form-label" htmlFor="form3Example5">Rol</label>
                  </div>
 
                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => registrarUsuario()} >Sign Up</button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">Ingresa con tu cuenta si ya tienes <a href="/login" className="link-danger">Login</a></p>
                  </div>
 
                </form>
              </div>
              <div className="col-md-9 col-lg-6 col-xl-5">
                <img src={imgs[0]} className="img-fluid" alt="Imagen de registro"/>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}