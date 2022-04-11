import * as actions from "../actions/types";

initialState = {
	error: null,
	loading: null,
	fetching: false
};

export default errorReducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.LOADING:
			return {
				...state,
				error: null,
				loading: true,
				fetching: false
			};
		case actions.REGISTER_FAIL:
		case actions.EMAIL_UNVERIFIED:
		case actions.LOGIN_FAIL:
		case actions.PASSWORD_RESET_FAIL:
		case actions.DETAIL_FAIL:
		case actions.FIX_FAIL:
		case actions.DETAIL_UPDATE_FAIL:
		case actions.COMPELETION_FAIL:
		case actions.BANK_FAIL:
			return {
				...state,
				error: action.payload,
				loading: null,
				fetching: false
			};

		case actions.EMAIL_SENT:
		case actions.GET_ERRORS:
		case actions.GET_APPOINTMENTS_FAIL:
			return {
				...state,
				error: null,
				loading: null,
				fetching: false
			};

		case actions.FETCHING:
			return {
				...state,
				error: null,
				loading: null,
				fetching: true
			}
		default:
			return {
				...state,
				error: null,
				loading: null,
				fetching: false
			};
	}
};
