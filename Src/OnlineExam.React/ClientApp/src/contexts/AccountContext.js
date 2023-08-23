import { createContext, useReducer, useState } from "react"
import { accountReducer } from "../reducers/accountReducer"
// @ts-ignore
import { apiUrl } from './contants'
import axios from 'axios'

export const AccountContext = createContext()

const AccountContextProvider = ({ children }) => {

    const [accountState, dispatch] = useReducer(accountReducer, {
        account: null,
        accounts: [],
        accountsLoading: true
    })

    const [showAddAccountModal, setShowAddAccountModal] = useState(false)
    const [showUpdateAccountModal, setShowUpdateAccountModal] = useState(false)
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    //get all account
    const getAccounts = async () => {
        try {
            // 
            const response = await axios.get(`/api/Account`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ACCOUNTS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const getAccountsStudent = async () => {
        try {
            // 
            const response = await axios.get(`/api/Account/student`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ACCOUNTS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const addAccountStudent = async newAccount => {
        try {
            const response = await axios.post(`/api/account/student`, newAccount)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ADD_ACCOUNT', payload: response.data.data  })
            }
            return response.data;
        } catch (error) {
            return error.response?.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const addAccountLecture = async newAccount => {
        try {
            const response = await axios.post(`/api/account/lecturer`, newAccount)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ADD_ACCOUNT', payload: response.data.data  })
            }
            return response.data;
        } catch (error) {
            return error.response?.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const deleteAccount = async accountId => {
        try {
            const response = await axios.delete(`/api/account/${accountId}`)
            if (response.data.type == 0)
                // @ts-ignore
                dispatch({
                    type: 'DELETE_ACCOUNT',
                    payload: accountId
                })
        } catch (error) {
            console.log(error)
        }
    }

    const resetPass = async accountId => {
        try {
            const response = await axios.post(`/api/Account/resetpassword?id=${accountId}`)
            if (response.data.type == 0)
                return response.data.data
        } catch (error) {
            console.log(error)
        }
    }

    const updatePass = async (accountId, newpass) => {
        try {
            const response = await axios.post(`/api/Account/updatepassword?id=${accountId}&pass=${newpass}`)
            if (response.data.type == 0)
                return response.data.data
        } catch (error) {
            console.log(error)
        }
    }

    const findAccount = account => {
        // @ts-ignore
        dispatch({ type: 'FIND_ACCOUNT', payload: account })
    }

    const updateAccountStudent = async updatedAccount => {
        try {
            const response = await axios.put(`/api/Account/student`, updatedAccount)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'UPDATE_ACCOUNT', payload: response.data.Account })
                return response.data
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const updateAccountLecture = async updatedAccount => {
        try {
            const response = await axios.put(`/api/Account/lecturer`, updatedAccount)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'UPDATE_ACCOUNT', payload: response.data.Account })
                return response.data
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const accountContextData = {
        getAccountsStudent,
        accountState,
        getAccounts,
        resetPass,
        updatePass,
        showAddAccountModal,
        setShowAddAccountModal,
        addAccountStudent,
        addAccountLecture,
        showToast,
        setShowToast,
        deleteAccount,
        updateAccountStudent,
        updateAccountLecture,
        showUpdateAccountModal,
        setShowUpdateAccountModal,
        findAccount
    }

    return (
        <
// @ts-ignore
        div>
            <
// @ts-ignore
            AccountContext.Provider value={accountContextData} >
                {children}
            </AccountContext.Provider>
        </div>
    )
}

export default AccountContextProvider
