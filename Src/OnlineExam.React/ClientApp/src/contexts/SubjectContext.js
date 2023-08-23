import { createContext, useReducer, useState } from "react"
import { subjectReducer } from "../reducers/subjectReducer"
// @ts-ignore
import { apiUrl } from './contants'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { callbackResponse } from "../helpers/utils";

export const SubjectContext = createContext();

const SubjectContextProvider = ({ children }) => {
    
    const history = useHistory();
    const [subjectState, dispatch] = useReducer(subjectReducer, {
        subject: null,
        subjects: [],
        subjectsLoading: true
    })

    const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
    const [showUpdateSubjectModal, setShowUpdateSubjectModal] = useState(false)
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    //get all subject
    const getSubjects = async () => {
        try {
            // 
            const response = await axios.get(`/api/Subject`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'SUBJECTS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const getoneSubjects = async subjectId => {
        try {
            // 
            const response = await axios.get(`/api/Subject/${subjectId}`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'SUBJECTS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const addSubject = async newSubject => {
        try {
            const response = await axios.post(`/api/subject`, newSubject)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ADD_SUBJECT', payload: response.data.data  })
            }
            return response.data;
        } catch (error) {
            return error.response?.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const deleteSubject = async subjectId => {
        try {
            const response = await axios.delete(`/api/subject/${subjectId}`)
            callbackResponse(response.data, v => {
                // @ts-ignore
                dispatch({
                    type: 'DELETE_SUBJECT',
                    payload: subjectId
                })
            })
                
        } catch (error) {
            console.log(error)
        }
    }

    const findSubject = subject => {
        // @ts-ignore
        dispatch({ type: 'FIND_SUBJECT', payload: subject })
    }

    const updateSubject = async updatedSubject => {
        try {
            const response = await axios.put(`/api/subject`, updatedSubject)
            return callbackResponse(response.data, data => {
                // @ts-ignore
                dispatch({ type: 'UPDATE_SUBJECT', payload: data })
            })
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const subjectContextData = {
        subjectState,
        getSubjects,
        showAddSubjectModal,
        setShowAddSubjectModal,
        getoneSubjects,
        addSubject,
        showToast,
        setShowToast,
        deleteSubject,
        updateSubject,
        showUpdateSubjectModal,
        setShowUpdateSubjectModal,
        findSubject
    }

    return (
        <
// @ts-ignore
        div>
            <
// @ts-ignore
            SubjectContext.Provider value={subjectContextData} >
                {children}
            </SubjectContext.Provider>
        </div>
    )
}

export default SubjectContextProvider
