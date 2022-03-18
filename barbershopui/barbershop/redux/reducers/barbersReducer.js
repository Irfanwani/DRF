import { GET_BARBERS, LOGOUT_SUCCESS } from "../actions/types";

initialState = {
	barbers: null,
};

export default barbersReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_BARBERS:
			return {
				...state,
				barbers: action.payload,
			};
		case LOGOUT_SUCCESS:
			return {
				...state,
				barbers: null,
			};
		default:
			return state;
	}
};
