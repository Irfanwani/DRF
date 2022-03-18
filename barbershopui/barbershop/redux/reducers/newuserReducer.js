import {NEW_USER} from '../actions/types'

initialState = {
    newUser: true
}

export default NewUserReducer = (state = initialState, action) => {
    switch(action.type) {
        case NEW_USER:
            return {
                ...state,
                newUser: false
            }

        default:
            return state
    }
}