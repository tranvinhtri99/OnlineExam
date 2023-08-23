import { createContext, useReducer, useState } from "react"
import { examReducer } from "../reducers/examReducer"
// @ts-ignore
import { apiUrl } from './contants'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { callbackResponse } from "../helpers/utils";

export const ExamContext = createContext();

const ExamContextProvider = ({ children }) => {
    
    const history = useHistory();
    const [examState, dispatch] = useReducer(examReducer, {
        exam: null,
        exams: [],
        examsLoading: true
    })

    const [showAddExamModal, setShowAddExamModal] = useState(false)
    const [showUpdateExamModal, setShowUpdateExamModal] = useState(false)
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    //get all exam
    const getExams = async () => {
        try {
            // 
            const response = await axios.get(`/api/Exam`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'EXAMS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const examTest = async examId => {
        try {
            // 
            const response = await axios.get(`/api/Exam/examtest/${examId}`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'EXAMS_LOADED_SUCCESS', payload: response.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const getExam = async examId => {
        try {
            // 
            const response = await axios.get(`/api/Exam/${examId}`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'EXAMS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const examJoin = async () => {
        try {
            // 
            const response = await axios.get(`/api/Exam/examJoin`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'EXAMS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const addExam = async newExam => {
        try {
            const response = await axios.post(`/api/exam`, newExam)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ADD_EXAM', payload: response.data.data  })
            }
            return response.data;
        } catch (error) {
            return error.response?.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const deleteExam = async examId => {
        try {
            const response = await axios.delete(`/api/exam/${examId}`)
            callbackResponse(response.data, v => {
                // @ts-ignore
                dispatch({
                    type: 'DELETE_EXAM',
                    payload: examId
                })
            })
                
        } catch (error) {
            console.log(error)
        }
    }

    const findExam = exam => {
        // @ts-ignore
        dispatch({ type: 'FIND_EXAM', payload: exam })
    }

    const updateExam = async updatedExam => {
        try {
            const response = await axios.put(`/api/exam`, updatedExam)
            return callbackResponse(response.data, data => {
                // @ts-ignore
                dispatch({ type: 'UPDATE_EXAM', payload: data })
            })
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const examContextData = {
        examState,
        getExams,
        getExam,
        examJoin,
        examTest,
        showAddExamModal,
        setShowAddExamModal,
        addExam,
        showToast,
        setShowToast,
        deleteExam,
        updateExam,
        showUpdateExamModal,
        setShowUpdateExamModal,
        findExam
    }

    return (
        <
// @ts-ignore
        div>
            <
// @ts-ignore
            ExamContext.Provider value={examContextData} >
                {children}
            </ExamContext.Provider>
        </div>
    )
}

export default ExamContextProvider
