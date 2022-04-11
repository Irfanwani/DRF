import axios from "axios";
import RazorpayCheckout from "react-native-razorpay";
import { setConfig, tokenCheck } from "./actions";
import { GET_ERRORS, LOADING } from "./types";

import { getAppointments } from "./actions2";
import { showMessage } from "react-native-flash-message";

import { styles2 } from "../../styles";

const BASE_URL = "https://barbershopbackend.herokuapp.com/api/payments";

export const checkout =
	({ amount, currency, email, apnt_id }) =>
	(dispatch, getState) => {
		dispatch({
			type: LOADING,
		});

		const config = setConfig(getState);

		const body = JSON.stringify({ amount, currency });

		axios
			.post(BASE_URL + "/createorder", body, config)
			.then((res) => {
				
				var options = {
					description: "Make payment",
					currency,
					key: "rzp_test_msI2vQZUsGutaR",
					amount: res.data.amount,
					name: "Barbershop",
					order_id: res.data.id,
					prefill: {
						email,
					},
					theme: { color: "#0ea258" },
				};
				RazorpayCheckout.open(options)
					.then((data) => {
						// handle success

						const dt = JSON.stringify({ ...data, apnt_id });
						axios
							.put(BASE_URL + "/createorder", dt, config)
							.then(() => {
								dispatch(getAppointments());

								showMessage({
									message: "Payment Done!",
									type: "success",
									icon: "success",
								});
							})
							.catch((err) => {
								let check = tokenCheck(err, GET_ERRORS);
								dispatch(check);
							});
					})
					.catch((error) => {
						// handle failure
						showMessage({
							message: JSON.parse(error.description).error.description,
							type: "default",
							icon: "info",
							position: "bottom",
							duration: 3000,
							style: styles2.flashstyle2,
						});
					});
			})
			.catch((err) => {
				let check = tokenCheck(err, GET_ERRORS);
				dispatch(check);
			});
	};
