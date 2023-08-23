import { createContext, useReducer, useState } from "react"
import { questionReducer } from "../reducers/questionReducer"
// @ts-ignore
import { apiUrl } from './contants'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { callbackResponse } from "../helpers/utils";

export const QuestionContext = createContext();

const QuestionContextProvider = ({ children }) => {
    
    const history = useHistory();
    const [questionState, dispatch] = useReducer(questionReducer, {
        question: null,
        questions: [],
        questionsLoading: true
    })

    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false)
    const [showUpdateQuestionModal, setShowUpdateQuestionModal] = useState(false)
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    //get all question
    const getQuestions = async () => {
        try {
            // 
            const response = await axios.get(`/api/Question`)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'QUESTIONS_LOADED_SUCCESS', payload: response.data.data })
            }

        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }

        }
    }

    const addQuestion = async newQuestion => {
        try {
            const response = await axios.post(`/api/question`, newQuestion)
            if (response.data.type == 0) {
                // @ts-ignore
                dispatch({ type: 'ADD_QUESTION', payload: response.data.data  })
            }
            return response.data;
        } catch (error) {
            return error.response?.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const deleteQuestion = async questionId => {
        try {
            const response = await axios.delete(`/api/question/${questionId}`)
            callbackResponse(response.data, v => {
                // @ts-ignore
                dispatch({
                    type: 'DELETE_QUESTION',
                    payload: questionId
                })
            })
                
        } catch (error) {
            console.log(error)
        }
    }

    const findQuestion = question => {
        // @ts-ignore
        dispatch({ type: 'FIND_QUESTION', payload: question })
    }

    const updateQuestion = async updatedQuestion => {
        try {
            const response = await axios.put(`/api/question`, updatedQuestion)
            return callbackResponse(response.data, data => {
                // @ts-ignore
                dispatch({ type: 'UPDATE_QUESTION', payload: data })
            })
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const questionContextData = {
        questionState,
        getQuestions,
        showAddQuestionModal,
        setShowAddQuestionModal,
        addQuestion,
        showToast,
        setShowToast,
        deleteQuestion,
        updateQuestion,
        showUpdateQuestionModal,
        setShowUpdateQuestionModal,
        findQuestion
    }

    return (
        // @ts-ignore
            <QuestionContext.Provider value={questionContextData} >
                {children}
            </QuestionContext.Provider>
    )
}

export default QuestionContextProvider
