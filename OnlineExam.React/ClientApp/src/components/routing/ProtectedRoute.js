import { Route, Redirect, useHistory } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import Spinner from "react-bootstrap/Spinner"
import Header from "../blog/Header"
import { useLocation } from 'react-router-dom'
import React from "react"


const sections = [
    { title: 'HOME', url: '/home' },
    { title: 'EXAM', url: '/cardexam' },
    { title: 'CHECKPOINT', url: '/checkpoint' },
    { title: 'CHANGE PASSWORD', url: '/updatepass' },
  ];

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { authState: { authLoading, isAuthenticated } } = useContext(AuthContext)
    const location = useLocation();
    // if (authLoading)
    //     return (
    //         <div className="spinner-container">
    //             <Spinner animation="border" variant="info" />
    //         </div>
    //     )

    return (
        <Route {...rest} render={props =>
            isAuthenticated ?
                (
                    <>
                    <Header title="ONLINE EXAM" sections={sections}/>
                        <Component {...rest} {...props} />
                    </>
                ) :
                (
                    <Redirect to={location?.pathname ? "/login?redirect=" + encodeURI(location.pathname) : "/login"}  />
                )
        }
        />
    )
}

export default ProtectedRoute
