export const accountReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case 'ACCOUNTS_LOADED_SUCCESS':
            return {
                ...state,
                accounts: payload,
                accountsLoading: false
            }
        case 'ACCOUNTS_LOADED_FAIL':
            return {
                ...state,
                accounts: [],
                accountsLoading: false
            }

        case 'ADD_ACCOUNT':
            return {
                ...state,
                accounts: [...state.accounts, payload],
            }
        case 'DELETE_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.filter(account => account.id !== payload)
            }
        case 'UPDATE_DANHMUC':
            const newAccounts = state.accounts.map(account => {
                if (account.id === payload.id) return { ...account, name: payload.name }
                return account
            })
            return {
                ...state,
                accounts: newAccounts
            }
        case 'FIND_ACCOUNT':
            return {
                ...state,
                account: payload
            }

        default:
            return state
    }
}