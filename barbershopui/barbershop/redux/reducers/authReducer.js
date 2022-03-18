import * as actions from "../actions/types";

initialState = {
	user: null,
	token: null,
};

export default authReducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.REGISTER_SUCCESS:
		case actions.LOGIN_SUCCESS:
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
			};
		case actions.LOGOUT_SUCCESS:
			return {
				...state,
				user: null,
				token: null
			}
		default:
			return state
	}
};
