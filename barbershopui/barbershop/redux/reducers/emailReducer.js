import * as actions from "../actions/types";

initialState = {
	verified: null,
	message: null,
};

export default emailReducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.EMAIL_VERIFIED:
			return {
				...state,
				verified: action.payload.verified,
				message: action.payload.message,
			};
		case actions.LOGOUT_SUCCESS:
		case actions.EMAIL_UNVERIFIED:
			return {
				...state,
				verified: null,
				message: null,
			};
		default:
			return state;
	}
};
