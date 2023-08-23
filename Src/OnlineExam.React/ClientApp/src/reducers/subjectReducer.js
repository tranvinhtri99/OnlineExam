export const subjectReducer = (state, action) => {

    const { type, payload } = action
    switch (type) {
        case 'SUBJECTS_LOADED_SUCCESS':
            return {
                ...state,
                subjects: payload,
                subjectsLoading: false
            }
        case 'SUBJECTS_LOADED_FAIL':
            return {
                ...state,
                subjects: [],
                subjectsLoading: false
            }

        case 'ADD_SUBJECT':
            return {
                ...state,
                subjects: [...state.subjects, payload],
            }
        case 'DELETE_SUBJECT':
            return {
                ...state,
                subjects: state.subjects.filter(subject => subject.id !== payload)
            }
        case 'UPDATE_SUBJECT':
            const newSubjects = state.subjects.map(subject => subject.id === payload.id ? payload : subject)
            return {
                ...state,
                subjects: newSubjects
            }
        case 'FIND_SUBJECT':
            return {
                ...state,
                subject: payload
            }

        default:
            return state
    }
}