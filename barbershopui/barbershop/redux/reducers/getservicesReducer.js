import {GET_SERVICES} from '../actions/types'

const initialState = {
    availableservices: [],
}

export default getservicesReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_SERVICES:
            return {
                ...state,
                availableservices: action.payload
            }

        default:
            return {
                ...state,
                availableservices: []
            }
    }
}