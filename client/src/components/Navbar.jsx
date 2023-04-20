import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import UserContext from './context/UserContext'

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username")
    // logout handler function
    function userLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        navigate('/')
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <NavLink to="/profile" className="navbar-brand">Profile</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {!username ? <>
                                <li className="nav-item">
                                    <NavLink to="/register" className="nav-link">Register</NavLink>

                                </li>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link">Login</NavLink>

                                </li>
                            </> :
                                <li className="nav-item">
                                    <a className="nav-link" onClick={userLogout} style={{ cursor: "pointer" }}>Logout</a>
                                </li>
                            }
                        </ul>

                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar