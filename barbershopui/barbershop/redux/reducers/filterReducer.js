import { SELECTED_SERVICE_TYPE, REMOVE_FILTERS, SELECTED_SERVICES} from '../actions/types'

const initialState = {
    service_type: null,
    services: null,
}

export default filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECTED_SERVICE_TYPE: 
            return {
                ...state,
                service_type: action.payload,
                services: null
            }
        
        case SELECTED_SERVICES:
            return {
                ...state,
                service_type: null,
                services: true
            }

        case REMOVE_FILTERS:
            return {
                ...state,
                service_type: null,
                services: null
            } 

        default:
            return state
    }
}