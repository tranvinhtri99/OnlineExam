export const examReducer = (state, action) => {

    const { type, payload } = action
    switch (type) {
        case 'EXAMS_LOADED_SUCCESS':
            return {
                ...state,
                exams: payload,
                examsLoading: false
            }
        case 'EXAMS_LOADED_FAIL':
            return {
                ...state,
                exams: [],
                examsLoading: false
            }

        case 'ADD_EXAM':
            return {
                ...state,
                exams: [...state.exams, payload],
            }
        case 'DELETE_EXAM':
            return {
                ...state,
                exams: state.exams.filter(exam => exam.id !== payload)
            }
        case 'UPDATE_EXAM':
            const newExams = state.exams.map(exam => exam.id === payload.id ? payload : exam)
            return {
                ...state,
                exams: newExams
            }
        case 'FIND_EXAM':
            return {
                ...state,
                exam: payload
            }

        default:
            return state
    }
}