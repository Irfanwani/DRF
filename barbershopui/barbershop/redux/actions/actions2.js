import axios from "axios";
import { showMessage } from "react-native-flash-message";
import * as actions from "./types";
import { setConfig, tokenCheck } from "./actions";

import * as Notifications from "expo-notifications";

export const BASE_URL = "https://barbershopbackend.herokuapp.com/api/haircut";

// fixing appointments
export const fixAppointment =
	({ reg_username, barber, datetime, services, totalcost, seeAppointments }) =>
	(dispatch, getState) => {
		dispatch({
			type: actions.LOADING,
		});

		const config = setConfig(getState);

		const currentdatetime = new Date()
			.toString()
			.split(" ")
			.slice(0, 5)
			.join(" ")
			.split(":")
			.slice(0, 2)
			.join(":");

		const body = JSON.stringify({ barber, currentdatetime, datetime, services, totalcost });
		axios
			.post(BASE_URL + "/appointments", body, config)
			.then((res) => {
				showMessage({
					message: res.data.message,
					type: "success",
					icon: "success",
				});
				dispatch({
					type: actions.GET_ERRORS,
				});

				const config = {
					headers: {
						Accept: "application/json",
						"Accept-encoding": "gzip, deflate",
						"Content-Type": "application/json",
					},
				};

				const body = JSON.stringify({
					to: res.data.tokenlist,
					title: "New Appointment Fixed!",
					body: `${reg_username} fixed an appointment with you!`,
					sound: "default",
					priority: "high",
					data: { screen: "Appointments" },
				});
				axios
					.post("https://exp.host/--/api/v2/push/send", body, config)
					.then(() => {})
					.catch(() => {});

				seeAppointments();

				(async () => {
					const trigger = new Date(datetime);
					trigger.setMinutes(trigger.getMinutes() - 15);
					await Notifications.scheduleNotificationAsync({
						content: {
							title: `Appointment alert!`,
							body: `You have an appointment with ${barber} after 15 Minutes`,
							data: { screen: "Appointments" },
						},
						trigger,
					});
				})();
			})
			.catch((err) => {
				console.log(err.response.data)
				let check = tokenCheck(err, actions.FIX_FAIL);
				dispatch(check);
			});
	};

// Getting appointments
export const getAppointments = () => (dispatch, getState) => {
	dispatch({
		type: actions.LOADING,
	});
	const config = setConfig(getState);

	axios
		.get(BASE_URL + "/appointments", config)
		.then((res) => {
			dispatch({
				type: actions.GET_APPOINTMENTS,
				payload: res.data,
			});
		})
		.catch((err) => {
			let check = tokenCheck(err, actions.GET_APPOINTMENTS_FAIL);
			dispatch(check);
		});
};

// Completing/deleting appointment
export const removeAppointment =
	(type, id, refreshPage) => (dispatch, getState) => {
		dispatch({
			type: actions.LOADING,
		});

		const config = setConfig(getState);

		axios
			.delete(`${BASE_URL}/cancelappointment/${id}`, config)
			.then(() => {
				refreshPage();
				showMessage({
					message: `Appointment ${type} successfully`,
					type: "success",
					icon: "success",
				});
			})
			.catch((err) => {
				let check = tokenCheck(err, actions.GET_ERRORS);
				dispatch(check);
			});
	};

// Clearing the errors
export const removeErrors = () => ({
	type: actions.GET_ERRORS,
});
