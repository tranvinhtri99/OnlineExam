export const questionReducer = (state, action) => {

    const { type, payload } = action
    switch (type) {
        case 'QUESTIONS_LOADED_SUCCESS':
            return {
                ...state,
                questions: payload,
                questionsLoading: false
            }
        case 'QUESTIONS_LOADED_FAIL':
            return {
                ...state,
                questions: [],
                questionsLoading: false
            }

        case 'ADD_QUESTION':
            return {
                ...state,
                questions: [...state.questions, payload],
            }
        case 'DELETE_QUESTION':
            return {
                ...state,
                questions: state.questions.filter(question => question.id !== payload)
            }
        case 'UPDATE_QUESTION':
            const newQuestions = state.questions.map(question => question.id === payload.id ? payload : question)
            return {
                ...state,
                questions: newQuestions
            }
        case 'FIND_QUESTION':
            return {
                ...state,
                question: payload
            }

        default:
            return state
    }
}