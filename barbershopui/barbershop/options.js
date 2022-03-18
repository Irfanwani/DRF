import { forwardRef } from "react";
import { useDispatch } from "react-redux";

import {
	logout,
	deleteAccount,
	logoutAll,
	tokenCheck,
} from "./redux/actions/actions";

import * as Notifications from "expo-notifications";

import styles, { styles2 } from "./styles";
import AlertPro from "react-native-alert-pro";
import { LOADING, GET_ERRORS } from "./redux/actions/types";

export const LogoutAllDialog = forwardRef((props, ref) => {
	const dispatch = useDispatch();

	const closealertpro = () => {
		ref.current.close();
	};

	const logoutall = () => {
		dispatch(logoutAll());
		closealertpro();
	};

	return (
		<AlertPro
			ref={ref}
			useNativeDriver={true}
			title="Logout from all devices"
			message="This will log you out from all the devices where you were logged in.Are you sure?"
			onCancel={closealertpro}
			onConfirm={logoutall}
			textCancel="Cancel"
			textConfirm="Logout All"
			customStyles={{
				container: styles2.container,
				title: styles2.title2,
				buttonCancel: styles2.buttonCancel,
				buttonConfirm: styles.fstyle3,
			}}
		/>
	);
});

export const DeleteDialog = forwardRef((props, ref) => {
	const dispatch = useDispatch();

	const closealertpro = () => {
		ref.current.close();
	};

	const deleteaccount = () => {
		dispatch(deleteAccount());
		closealertpro();
	};
	return (
		<AlertPro
			ref={ref}
			useNativeDriver={true}
			title="Account Deletion Alert!"
			message="This action cannot be reverted.All of your details, appointments and other information will be permanently deleted and cannot be retreived. Are you sure?"
			onCancel={closealertpro}
			onConfirm={deleteaccount}
			textCancel="Cancel"
			textConfirm="Delete Account"
			customStyles={{
				container: styles2.container,
				title: styles2.title2,
				buttonCancel: styles2.buttonCancel,
				buttonConfirm: styles2.buttonConfirm,
			}}
		/>
	);
});

export const LogoutDialog = forwardRef((props, ref) => {
	const dispatch = useDispatch();

	const getNtk = async () => {
		let token = (await Notifications.getExpoPushTokenAsync()).data;
		dispatch(logout(token));
	};

	const closealertpro = () => {
		ref.current.close();
	};

	const signout = () => {
		dispatch({ type: LOADING });
		getNtk()
			.then(() => {})
			.catch((err) => {
				let check = tokenCheck(err, GET_ERRORS);
				dispatch(check);
			});

		closealertpro();
	};

	return (
		<AlertPro
			ref={ref}
			useNativeDriver={true}
			title="Logout"
			message="Are you sure?"
			onCancel={closealertpro}
			onConfirm={signout}
			textCancel="Cancel"
			textConfirm="Logout"
			customStyles={{
				container: styles2.container,
				title: styles2.title2,
				buttonCancel: styles2.buttonCancel,
				buttonConfirm: styles.fstyle3,
			}}
		/>
	);
});
