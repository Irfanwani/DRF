import { COMPELETION_FAIL, LOGOUT_SUCCESS,COMPELETION_SUCCESS, BANK_SUCCESS, BANK_FAIL } from '../actions/types'

const initialState = {
    account_added: null,
    services_added: null
}

export default compeletionReducer = (state = initialState, action) => {
    switch(action.type) {
        case BANK_SUCCESS:
            return {
                ...state,
                account_added: true,
            }

        case COMPELETION_SUCCESS:
            return {
                ...state,
                account_added: true,
                services_added: true,
            }

        case COMPELETION_FAIL:
            return {
                ...state,
                services_added: false
            }
        case BANK_FAIL:
        case LOGOUT_SUCCESS:
            return {
                ...state,
                account_added: false,
                services_added: false
            }

        default:
            return state
    }
}