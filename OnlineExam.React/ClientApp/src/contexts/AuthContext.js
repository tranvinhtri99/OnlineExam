import { createContext, useReducer, useEffect } from "react"
import { authReducer } from "../reducers/authReducer"
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "./contants"
import axios from 'axios'
import setAuthToken from "../components/utils/setAuthToken"
//import setAuthToken from "../utils/setAuthToken"

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null
    })

    const loadUser = async () => {
        if (!localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
            dispatch({
                type: 'SET_AUTH',
                payload: { isAuthenticated: false, user: null }
            })
        }
        
        setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
        try {
            const response = await axios.get(`/api/Authentication`)
            if (response.data.type == 0) {
                dispatch({
                    type: 'SET_AUTH',
                    payload: { isAuthenticated: true, user: response.data.data.account }
                })
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
            setAuthToken(null)
            dispatch({
                type: 'SET_AUTH',
                payload: { isAuthenticated: false, user: null }
            })
        }
    }

    useEffect(() => loadUser(), [])

    const loginUser = async userForm => {
        try {
            const response = await axios.post(`/api/Authentication/login`, userForm)
            if (response.data.error == null) {
                console.log(response.data)
                console.log(response.data.data)
                console.log(response.data.data.token)
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.data.token)
                await loadUser()
                return response.data
            }
            else {
                console.log(response.data.error.Message)
                return response.data
            }
             
        } catch (error) {
           return { success: false, message: error.message }
        }
    }

    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
        dispatch({
            type: 'SET_AUTH',
            payload: { isAuthenticated: false, user: null }
        })
    }

    const authContextData = { loginUser, authState, logoutUser }

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider