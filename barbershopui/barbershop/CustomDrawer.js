import { useRef, useEffect, useState } from "react";

import { View, TouchableOpacity, Image } from "react-native";

import {
	IconButton,
	Title,
	HelperText,
	FAB,
	Divider,
	Button,
	Colors,
} from "react-native-paper";

import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import styles, { headertextcolor } from "./styles";

import { useSelector, useDispatch } from "react-redux";
import { CHANGE_THEME } from "./redux/actions/types";
import { useTheme } from "@react-navigation/native";
import { LogoutDialog } from "./options";

const CustomDrawer = (props) => {
	const { image, username, darkmode, contact } = useSelector((state) => ({
		image: state.detailReducer.details?.image,
		username: state.authReducer.user?.username,
		contact: state.detailReducer.details?.contact,
		darkmode: state.themeReducer.darkmode,
	}));

	const [pressed, setPressed] = useState(false);

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		dispatch({ type: CHANGE_THEME });
	}, [pressed]);

	const logoutref = useRef();

	const dispatch = useDispatch();

	const theme = useTheme();

	const gotoProfile = () => {
		props.navigation.navigate("Profile");
	};

	const showlogout = () => {
		logoutref.current.open();
	};

	const changeTheme = () => {
		setPressed((prev) => !prev);
	};

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{ backgroundColor: theme.colors.bgcolor, flex: 1 }}
		>
			<View
				style={{
					padding: 10,
					backgroundColor: theme.colors.bgcolor,
				}}
			>
				<TouchableOpacity onPress={gotoProfile}>
					<Image style={styles.istyle} source={{ uri: image }} />
					<Title style={styles.tstyle}>
						<IconButton icon="account" size={20} color={headertextcolor} />
						{username}
					</Title>
					<HelperText style={styles.hstyle}>
						<IconButton icon="phone" size={15} color={headertextcolor} />
						{contact ? contact : "No contact"}
					</HelperText>
				</TouchableOpacity>
				<FAB
					small={true}
					color={headertextcolor}
					style={[styles.fstyle, { backgroundColor: theme.colors.bgcolor }]}
					icon={darkmode ? "white-balance-sunny" : "weather-night"}
					onPress={changeTheme}
				/>
			</View>
			<View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
				<DrawerItemList {...props} />

				<View style={styles.vstyle}>
					<Divider />
					<Button
						onPress={showlogout}
						icon="logout"
						contentStyle={styles.bustyle}
						color={Colors.red600}
					>
						Sign Out
					</Button>

					<LogoutDialog ref={logoutref} />
				</View>
			</View>
		</DrawerContentScrollView>
	);
};

export default CustomDrawer;
