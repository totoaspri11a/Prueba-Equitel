import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../AuthContext';
import axios from "axios";

export default function Login(){

  const { login } = useAuth();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
   
    const navigate = useNavigate();
     
    const logInUser = () => {
        if(email.length === 0){
          alert("No ingresaste una cuenta de correo");
        }
        else if(password.length === 0){
          alert("No ingresaste una contraseña");
        }
        else{
            axios.post('http://localhost:9000/login', {
                email: email,
                password: password
            })
            .then(function (response) {
                login(response.data.rol, response.data.id)
                alert("Ingresaste sin problema")
                if (response.data.rol === 'admin'){
                  navigate("/productos");
                } else {
                  navigate("/ventas")
                }
            })
            .catch(function (error) {
                console.log(error, 'error');
                if (error.response.status === 401) {
                    alert("Credenciales inválidos");
                }
            });
        }
    }
 

    let imgs = [
        'https://as1.ftcdn.net/v2/jpg/03/39/70/90/1000_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg',
      ];

    return (
        <div>
            <div className="container h-100">
                <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-md-9 col-lg-6 col-xl-5">
                <img src={imgs[0]} className="img-fluid" alt="imagen de login"/>
              </div>
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form>
                  <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                    <p className="lead fw-normal mb-0 me-3">Ingresar a tu cuenta</p>
                  </div>
 
                  <div className="form-outline mb-4">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="form3Example3" className="form-control form-control-lg" placeholder="Ingresa un correo válido" />
                    <label className="form-label" htmlFor="form3Example3">Email</label>
                  </div>
 
             
                  <div className="form-outline mb-3">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="form3Example4" className="form-control form-control-lg" placeholder="Ingresa tu contraseña" />
                    <label className="form-label" htmlFor="form3Example4">Password</label>
                  </div>
 
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check mb-0">
                      <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                      <label className="form-check-label" htmlFor="form2Example3">
                        Recuérdame
                      </label>
                    </div>
                    <a href="#!" className="text-body">¿Olvidaste tu contraseña?</a>
                  </div>
 
                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="button" className="btn btn-primary btn-lg" onClick={logInUser} >Ingresar</button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">¿Aún no tienes cuenta? <a href="/register" className="link-danger">Registrarse</a></p>
                  </div>
 
                </form>
              </div>
            </div>
                </div>
            </div>
        </div>
    )
}