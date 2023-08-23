import { createContext, useReducer, useState } from "react"
import { classroomReducer } from "../reducers/classroomReducer"
// @ts-ignore
import { apiUrl } from './contants'
import axios from 'axios'

export const ClassroomContext = createContext()

const ClassroomContextProvider = ({ children }) => {

    const [classroomState, dispatch] = useReducer(classroomReducer, {
        classroom: null,
        classrooms: [],
        classroomsLoading: true
    })

    const [showAddClassroomModal, setShowAddClassroomModal] = useState(false)
    const [showUpdateClassroomModal, setShowUpdateClassroomModal] = useState(false)
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    //get all classroom
    const getClassrooms = async () => {
        try {
            // 
            const response = await axios.get(`/api/Classroom`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'CLASSROOMS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const addClassroom = async newClassroom => {
        try {
            const response = await axios.post(`/api/classroom`, newClassroom)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ADD_CLASSROOM', payload: response.data.data  })
            }
            return response.data;
        } catch (error) {
            return error.response?.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const deleteClassroom = async classroomId => {
        try {
            const response = await axios.delete(`/api/classroom/${classroomId}`)
            if (response.data.type == 0)
                // @ts-ignore
                dispatch({
                    type: 'DELETE_CLASSROOM',
                    payload: classroomId
                })
        } catch (error) {
            console.log(error)
        }
    }

    const findClassroom = classroom => {
        // @ts-ignore
        dispatch({ type: 'FIND_CLASSROOM', payload: classroom })
    }

    const updateClassroom = async updatedClassroom => {
        try {
            const response = await axios.put(`/api/classroom`, updatedClassroom)
            if (response.data.success) {
                // @ts-ignore
                dispatch({ type: 'UPDATE_CLASSROOM', payload: response.data.Classroom })
                return response.data
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const classroomContextData = {
        classroomState,
        getClassrooms,
        showAddClassroomModal,
        setShowAddClassroomModal,
        addClassroom,
        showToast,
        setShowToast,
        deleteClassroom,
        updateClassroom,
        showUpdateClassroomModal,
        setShowUpdateClassroomModal,
        findClassroom
    }

    return (
        <
// @ts-ignore
        div>
            <
// @ts-ignore
            ClassroomContext.Provider value={classroomContextData} >
                {children}
            </ClassroomContext.Provider>
        </div>
    )
}

export default ClassroomContextProvider
