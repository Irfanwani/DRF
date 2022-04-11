import { showMessage } from "react-native-flash-message";

import * as actions from "./types";
import axios from "axios";
import FormData from "form-data";
import mime from "mime";
import { styles2 } from "../../styles";

const BASE_URL = "https://barbershopbackend.herokuapp.com/api/accounts";

// full authentication including email verification and details check
export const authenticate = () => (dispatch, getState) => {
	const config = setConfig(getState);
	axios
		.get(BASE_URL + "/authenticateuser", config)
		.then((res) => {
			if (res.data.verified) {
				dispatch({
					type: actions.EMAIL_VERIFIED,
					payload: res.data,
				});
			} else {
				dispatch({
					type: actions.EMAIL_UNVERIFIED,
					payload: "",
				});
			}

			if (res.data.details) {
				dispatch({
					type: actions.DETAIL_SUCCESS,
					payload: res.data,
				});
			} else {
				dispatch({
					type: actions.DETAIL_FAIL,
					payload: "",
				});
			}

			if (res.data.services_added) {
				dispatch({
					type: actions.COMPELETION_SUCCESS,
				});
			} else {
				dispatch({
					type: actions.COMPELETION_FAIL,
				});
			}

			if (res.data.account_added) {
				dispatch({
					type: actions.BANK_SUCCESS,
				});
			} else {
				dispatch({
					type: actions.BANK_FAIL,
				});
			}
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.GET_ERRORS);
			dispatch(check);
		});
};

// Registration action
export const register =
	({ username, email, password }) =>
	(dispatch) => {
		dispatch({
			type: actions.LOADING,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const body = JSON.stringify({ username, email, password });

		axios
			.post(BASE_URL + "/register", body, config)
			.then((res) => {
				showMessage({
					message: "Registration Success! Please verify your email.",
					type: "success",
					icon: "success",
				});

				dispatch({
					type: actions.REGISTER_SUCCESS,
					payload: res.data,
				});
			})
			.catch((err) => {
				let check = tokenCheck(err, actions.REGISTER_FAIL);
				dispatch(check);
			});
	};

// Email verification action
export const verifyEmail = (code) => (dispatch, getState) => {
	dispatch({
		type: actions.LOADING,
	});
	const config = setConfig(getState);

	const body = JSON.stringify({ code });

	axios
		.post(BASE_URL + "/verifyemail", body, config)
		.then((res) => {
			showMessage({
				message: res.data.message,
				type: "info",
				icon: "success",
				duration: 2500,
			});

			dispatch({
				type: actions.EMAIL_VERIFIED,
				payload: res.data,
			});
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.EMAIL_UNVERIFIED);
			dispatch(check);
		});
};

// Get email verification code action
export const getEmailCode = () => (dispatch, getState) => {
	dispatch({
		type: actions.LOADING,
	});

	const config = setConfig(getState);

	axios
		.get(BASE_URL + "/verifyemail", config)
		.then((res) => {
			showMessage({
				message: res.data.message,
				type: "info",
				icon: "success",
			});

			if (res.data.verified) {
				dispatch({
					type: actions.EMAIL_VERIFIED,
					payload: res.data,
				});
			} else {
				dispatch({
					type: actions.EMAIL_SENT,
				});
			}
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.GET_ERRORS);
			dispatch(check);
		});
};

// Login action
export const login =
	({ username, password }) =>
	(dispatch) => {
		dispatch({
			type: actions.LOADING,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const body = JSON.stringify({ username, password });

		axios
			.post(BASE_URL + "/login", body, config)
			.then((res) => {
				showMessage({
					message: "Login success!",
					type: "success",
					icon: "success",
				});

				if (res.data.verified) {
					dispatch({
						type: actions.EMAIL_VERIFIED,
						payload: res.data,
					});

					if (res.data.details) {
						dispatch({
							type: actions.DETAIL_SUCCESS,
							payload: res.data,
						});
					}

					if (res.data.services_added) {
						dispatch({
							type: actions.COMPELETION_SUCCESS,
						});
					}
					if (res.data.account_added) {
						dispatch({
							type: actions.BANK_SUCCESS,
						});
					}
				}

				dispatch({
					type: actions.LOGIN_SUCCESS,
					payload: res.data,
				});
			})
			.catch((err) => {
				let check = tokenCheck(err, actions.LOGIN_FAIL);
				dispatch(check);
			});
	};

// password reset code
export const passwordResetCode =
	({ email }) =>
	(dispatch) => {
		dispatch({
			type: actions.LOADING,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const body = JSON.stringify({ email });

		axios
			.post(BASE_URL + "/passwordreset", body, config)
			.then((res) => {
				showMessage({
					message: res.data.message,
					type: "success",
					icon: "success",
				});

				dispatch({
					type: actions.EMAIL_SENT,
				});
			})
			.catch((err) => {
				let check = tokenCheck(err, actions.PASSWORD_RESET_FAIL);
				dispatch(check);
			});
	};

// Password reset
export const passwordReset =
	({ email, code, password }) =>
	(dispatch) => {
		dispatch({
			type: actions.LOADING,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const body = JSON.stringify({ email, code, password });

		axios
			.put(BASE_URL + "/passwordreset", body, config)
			.then((res) => {
				showMessage({
					message: "Password reset success! You are logged in now!",
					type: "success",
					icon: "success",
				});

				if (res.data.verified) {
					dispatch({
						type: actions.EMAIL_VERIFIED,
						payload: res.data,
					});
					if (res.data.details) {
						dispatch({
							type: actions.DETAIL_SUCCESS,
							payload: res.data,
						});
					}

					if (res.data.services_added) {
						dispatch({
							type: actions.COMPELETION_SUCCESS,
						});
					}
					if (res.data.account_added) {
						dispatch({
							type: actions.BANK_SUCCESS,
						});
					}
				}

				dispatch({
					type: actions.LOGIN_SUCCESS,
					payload: res.data,
				});
			})
			.catch((err) => {
				let check = tokenCheck(err, actions.PASSWORD_RESET_FAIL);
				dispatch(check);
			});
	};

// Logout action
export const logout = (ntk) => (dispatch, getState) => {
	const config = setConfig(getState);

	const body = JSON.stringify({
		token: ntk,
	});
	axios
		.post(
			"https://barbershopbackend.herokuapp.com/api/haircut/removetoken",
			body,
			config
		)
		.then(() => {
			axios
				.post(BASE_URL + "/logout/", null, config)
				.then(() => {
					showMessage({
						message: "Logout Success!",
						type: "default",
						icon: "success",
					});

					dispatch({
						type: actions.LOGOUT_SUCCESS,
					});
				})
				.catch((err) => {
					let check = tokenCheck(err, actions.GET_ERRORS);
					dispatch(check);
				});
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.GET_ERRORS);
			dispatch(check);
		});
};

// details action
export const details = (image, profile, userType) => (dispatch, getState) => {
	dispatch({
		type: actions.LOADING,
	});

	const config = {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	};

	const token = getState().authReducer.token;

	if (token) {
		config.headers["Authorization"] = `Token ${token}`;
	}

	const data = new FormData();

	image &&
		data.append("image", {
			uri: image.uri,
			type: mime.getType(image.uri),
			name: image.uri.split("/").pop(),
		});

	Object.keys(profile).forEach((key) => {
		data.append(key, profile[key]);
	});

	axios
		.post(BASE_URL + `/${userType}details`, data, config)
		.then((res) => {
			showMessage({
				message: "Profile saved successfully!",
				type: "success",
				icon: "success",
			});
			dispatch({
				type: actions.DETAIL_SUCCESS,
				payload: res.data,
			});
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.DETAIL_FAIL);
			dispatch(check);
		});
};

// get barbers
export const barbers = (selected, services) => (dispatch, getState) => {
	dispatch({
		type: actions.FETCHING,
	});

	const config = setConfig(getState);
	let body = null;

	if (selected) {
		body = JSON.stringify({ service_type: selected });
	} else if (services?.length > 0) {
		body = JSON.stringify({ services });
	} else {
		body = null;
	}

	axios
		.post(BASE_URL + "/filterbarbers", body, config)
		.then((res) => {
			dispatch({
				type: actions.GET_BARBERS,
				payload: res.data,
			});
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.GET_ERRORS);
			dispatch(check);
		});
};

// update details
export const updateDetails =
	(image, newDetails, employee_count) => (dispatch, getState) => {
		dispatch({
			type: actions.LOADING,
		});

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};

		const token = getState().authReducer.token;

		if (token) {
			config.headers["Authorization"] = `Token ${token}`;
		}

		const data = new FormData();

		image &&
			data.append("image", {
				uri: image.uri,
				type: mime.getType(image.uri),
				name: image.uri.split("/").pop(),
			});

		Object.keys(newDetails).forEach((key) => {
			data.append(key, newDetails[key]);
		});

		const userType = employee_count ? "barber" : "user";

		axios
			.put(BASE_URL + `/${userType}details`, data, config)
			.then((res) => {
				showMessage({
					message: "Profile updated successfully!",
					type: "success",
					icon: "success",
				});
				dispatch({
					type: actions.DETAIL_SUCCESS,
					payload: res.data,
				});
			})
			.catch((err) => {
				let check = tokenCheck(err, actions.DETAIL_UPDATE_FAIL);
				dispatch(check);
			});
	};

// Delete account
export const deleteAccount = () => (dispatch, getState) => {
	dispatch({
		type: actions.LOADING,
	});

	const config = setConfig(getState);

	axios
		.delete(BASE_URL + `/deleteuser/${getState().authReducer.user?.id}`, config)
		.then(() => {
			showMessage({
				message: "Account deleted successfully!",
				type: "info",
				icon: "info",
			});
			dispatch({
				type: actions.LOGOUT_SUCCESS,
			});
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.GET_ERRORS);
			dispatch(check);
		});
};

// Logout all
export const logoutAll = () => (dispatch, getState) => {
	dispatch({
		type: actions.LOADING,
	});

	const config = setConfig(getState);

	axios
		.put(
			"https://barbershopbackend.herokuapp.com/api/haircut/removetoken",
			null,
			config
		)
		.then(() => {
			axios
				.post(BASE_URL + "/logoutall/", null, config)
				.then(() => {
					showMessage({
						message: "Success! Logged out of all devices.",
						type: "default",
						icon: "success",
					});
					dispatch({
						type: actions.LOGOUT_SUCCESS,
					});
				})
				.catch((err) => {
					let check = tokenCheck(err, actions.GET_ERRORS);
					dispatch(check);
				});
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.GET_ERRORS);
			dispatch(check);
		});
};

// Config function
export const setConfig = (getState) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	const token = getState().authReducer.token;

	if (token) {
		config.headers["Authorization"] = `Token ${token}`;
	}

	return config;
};

// check for invalid tokens
export const tokenCheck = (err, type) => {
	try {
		if (parseInt(err.response.status) == 401) {
			showMessage({
				message: "Token expired! Please login again.",
				type: "info",
				icon: "info",
			});
			return {
				type: actions.LOGOUT_SUCCESS,
			};
		} else {
			return {
				type: type,
				payload: err.response.data,
			};
		}
	} catch (error) {
		showMessage({
			message: "No internet connection",
			type: "default",
			icon: "info",
			position: "bottom",
			duration: 3000,
			style: styles2.flashstyle2,
		});
		return {
			type: actions.GET_ERRORS,
		};
	}
};
