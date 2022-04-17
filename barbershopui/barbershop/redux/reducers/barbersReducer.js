import { FETCH_MORE, GET_BARBERS, LOGOUT_SUCCESS } from "../actions/types";

initialState = {
	barbers: [],
};

export default barbersReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_BARBERS:
			return {
				...state,
				barbers: action.payload,
			};
		
		case FETCH_MORE:
			return {
				...state,
				barbers: [...state.barbers, ...action.payload]
			}
		case LOGOUT_SUCCESS:
			return {
				...state,
				barbers: [],
			};
		default:
			return state;
	}
};
