import { DETAIL_FAIL, DETAIL_SUCCESS, LOGOUT_SUCCESS } from "../actions/types";

initialState = {
	details: null,
};

export default detailReducer = (state = initialState, action) => {
	switch (action.type) {
		case DETAIL_SUCCESS:
			return {
				...state,
				details: action.payload.details ? action.payload.details : action.payload,
			};
		case DETAIL_FAIL:
		case LOGOUT_SUCCESS:
			return {
				...state,
				details: null,
			};
		default:
			return state;
	}
};
