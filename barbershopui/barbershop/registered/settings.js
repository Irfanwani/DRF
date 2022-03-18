import { useRef, memo } from "react";
import { TouchableOpacity, View } from "react-native";
import { HelperText, Divider, Avatar, Title, Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { LogoutAllDialog, DeleteDialog } from "../options";

import { useTheme } from "@react-navigation/native";

import styles from "../styles";

const Settings = (props) => {
	const { image, username, location } = useSelector((state) => ({
		image: state.detailReducer.details?.image,
		username: state.authReducer.user?.username,
		location: state.detailReducer.details?.location,
	}));

	const logoutallref = useRef();

	const deleteref = useRef();

	const gotoProfile = () => {
		props.navigation.navigate("Profile");
	};

	const showlogoutall = () => {
		logoutallref.current.open();
	};

	const showdelete = () => {
		deleteref.current.open();
	};

	const theme = useTheme();
	return (
		<View style={styles.vstyle6}>
			<TouchableOpacity onPress={gotoProfile} style={styles.tostyle2}>
				<Avatar.Image source={{ uri: image }} size={80} />
				<View style={styles.view8}>
					<Title>{username}</Title>
					<HelperText numberOfLines={1} ellipsizeMode="tail">
						{location}
					</HelperText>
				</View>
			</TouchableOpacity>
			<Divider />

			<Button
				style={styles.bstyle7}
				color={theme.colors.text}
				icon="logout"
				onPress={showlogoutall}
			>
				Logout From All Devices
			</Button>
			<HelperText>
				This will log you out from all the devices where you were logged in.
			</HelperText>
			<Divider />

			<View style={styles.view9}>
				<Button icon="delete-alert-outline" onPress={showdelete} color="red">
					Delete My Account
				</Button>
				<Divider />
				<HelperText style={styles.tstyle5}>Version 1.0.2</HelperText>
			</View>

			<LogoutAllDialog ref={logoutallref} />
			<DeleteDialog ref={deleteref} />
		</View>
	);
};

export default memo(Settings);
