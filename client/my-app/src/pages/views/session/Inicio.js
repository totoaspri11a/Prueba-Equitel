import React from "react";

import { Link } from "react-router-dom";

export default function Inicio(){
    return(
        <div>
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-12">
                        <h1>Bienvenido a la aplicación</h1>
                        <p><Link to="/login" className="btn btn-success">Login</Link> | 
                        <Link to="/register" className="btn btn-success">Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}