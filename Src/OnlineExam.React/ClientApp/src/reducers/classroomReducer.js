export const classroomReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case 'CLASSROOMS_LOADED_SUCCESS':
            return {
                ...state,
                classrooms: payload,
                classroomsLoading: false
            }
        case 'CLASSROOMS_LOADED_FAIL':
            return {
                ...state,
                classrooms: [],
                classroomsLoading: false
            }

        case 'ADD_CLASSROOM':
            return {
                ...state,
                classrooms: [...state.classrooms, payload],
            }
        case 'DELETE_CLASSROOM':
            return {
                ...state,
                classrooms: state.classrooms.filter(classroom => classroom.id !== payload)
            }
        case 'UPDATE_DANHMUC':
            const newClassrooms = state.classrooms.map(classroom => {
                if (classroom.id === payload.id) return { ...classroom, name: payload.name }
                return classroom
            })
            return {
                ...state,
                classrooms: newClassrooms
            }
        case 'FIND_CLASSROOM':
            return {
                ...state,
                classroom: payload
            }

        default:
            return state
    }
}