import {
	BANK_SUCCESS,
	COMPELETION_FAIL,
	LOADING,
	BANK_FAIL,
	COMPELETION_SUCCESS,
	GET_ERRORS,
	FIX_FAIL,
	GET_SERVICES,
} from "./types";

import axios from "axios";
import { setConfig, tokenCheck } from "./actions";
import { showMessage } from "react-native-flash-message";

import { styles2 } from "../../styles";

const BASE_URL = "https://barbershopbackend.herokuapp.com/api/accounts";

export const addBankDetails = (data) => (dispatch, getState) => {
	dispatch({
		type: LOADING,
	});

	const config = setConfig(getState);

	const body = JSON.stringify(data);

	axios
		.post(BASE_URL + "/createbank", body, config)
		.then(() => {
			dispatch({
				type: BANK_SUCCESS,
			});
			showMessage({
				message: "Account added successfully!",
				type: "success",
				icon: "success",
			});
		})
		.catch((err) => {
			let check = tokenCheck(err, BANK_FAIL);
			dispatch(check);
		});
};

export const addServicesList =
	({ service_type, services }) =>
	(dispatch, getState) => {
		dispatch({
			type: LOADING,
		});

		const config = setConfig(getState);

		const services_list = Object.values(services);

		if (services_list.length == 0) {
			showMessage({
				message:
					"Please select at least one service and also provide the price",
				type: "default",
				icon: "info",
				position: "bottom",
				style: styles2.flashstyle2,
			});
			dispatch({ type: GET_ERRORS });
			return;
		}

		const body = JSON.stringify({
			service_type: service_type,
			services_list,
		});

		axios
			.post(BASE_URL + "/addservices", body, config)
			.then(() => {
				dispatch({
					type: COMPELETION_SUCCESS,
				});
				showMessage({
					message: "Account Registration Completed!!",
					type: "success",
					icon: "success",
				});
			})
			.catch((err) => {
				let check = tokenCheck(err, COMPELETION_FAIL);
				dispatch(check);
			});
	};

export const getServices = (id, callback) => (dispatch, getState) => {
	dispatch({
		type: LOADING,
	});
	const config = setConfig(getState);

	axios
		.get(BASE_URL + `/addservices?id=${id}`, config)
		.then((res) => {
			if (res.data.length == 0) {
				dispatch({
					type: GET_ERRORS,
				});

				showMessage({
					message: "This service provider has no service details",
					type: 'default',
					icon: 'info',
					position: 'bottom',
					style: styles2.flashstyle2
				})

				return;
			}
			let result = [];
			res.data.forEach((item) => {
				let itm = `${item.service}		Rs.${item.cost}`;
				result.push(itm);
				dispatch({
					type: GET_SERVICES,
					payload: result,
				});
				callback();
			});
		})
		.catch((err) => {
			let check = tokenCheck(err, FIX_FAIL);
			dispatch(check);
		});
};
