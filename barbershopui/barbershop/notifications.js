import * as Notifications from "expo-notifications";

import axios from "axios";

import { BASE_URL } from "./redux/actions/actions2";

export const notification_manager = async (id, authToken) => {
	let { status } = await Notifications.requestPermissionsAsync();
	if (status !== "granted") {
		alert(
			"Please provide the notification permissions to get notified whenever a new appointment is fixed with you. You can turn off notifications anytime!"
		);
		let { status } = await Notifications.requestPermissionsAsync();
		if (status !== "granted") {
			return;
		}
	}

	let token = (await Notifications.getExpoPushTokenAsync()).data;

	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${authToken}`,
		},
	};

	const body = JSON.stringify({
		user: id,
		token: token,
	});
	axios
		.post(BASE_URL + "/savetoken", body, config)
		.then(() => {})
		.catch(() => {});
};
