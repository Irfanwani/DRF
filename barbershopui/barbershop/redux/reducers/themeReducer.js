import { CHANGE_THEME } from "../actions/types";

initialState = {
	darkmode: null,
};

export default themeReducer = (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_THEME:
			return {
				...state,
				darkmode: !state.darkmode,
			};
		default:
			return state;
	}
};
