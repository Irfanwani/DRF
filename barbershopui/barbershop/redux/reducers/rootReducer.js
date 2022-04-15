import { combineReducers } from "redux";

import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import emailReducer from "./emailReducer";
import detailReducer from "./detailReducer";
import barbersReducer from "./barbersReducer";
import appointmentReducer from "./appointmentReducer";
import themeReducer from "./themeReducer";
import newuserReducer from "./newuserReducer";
import compeletionReducer from './compeletionReducer'
import getservicesReducer from "./getservicesReducer";
import reviewReducer from './reviewReducer'

export default combineReducers({
	authReducer,
	errorReducer,
	emailReducer,
	detailReducer,
	barbersReducer,
	appointmentReducer,
	themeReducer,
	newuserReducer,
	compeletionReducer,
	getservicesReducer,
	reviewReducer
});
