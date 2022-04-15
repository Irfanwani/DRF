import {GET_REVIEWS} from '../actions/types'

const initialState = {
    reviews: []
}

export default reviewReducer = (state=initialState, action) => {
    switch(action.type) {
        case GET_REVIEWS:
            return {
                ...state,
                reviews: action.payload
            }

        default:
            return state
    }
}