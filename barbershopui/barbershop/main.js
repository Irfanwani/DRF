import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import {
	ProgressBar,
	Provider as PaperProvider,
	DarkTheme as PaperDarkTheme,
	DefaultTheme as PaperDefaultTheme,
	IconButton,
	Text,
	Badge,
	Portal,
	Modal,
} from "react-native-paper";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";

// unregistered screens
import LandingPage from "./register/landingPage";
import Register from "./register/register";
import VerifyEmail from "./register/verifyemail";
import Login from "./register/login";
import PasswordReset from "./register/passwordreset";
import Details from "./register/details";

// registered screens
import Index from "./registered/index";
import Info from "./registered/info";
import Appointments from "./registered/appointments";
import Profile from "./registered/profile";
import PaymentDetails from "./registered/paymentdetails";
import Settings from "./registered/settings";
import AddServices from "./registered/addservices";

import FlashMessage from "react-native-flash-message";

import {
	NavigationContainer,
	DarkTheme,
	DefaultTheme,
	useTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawer from "./CustomDrawer";

import { authenticate } from "./redux/actions/actions";

import styles, {
	backgroundcolor,
	darkbackgroundcolor,
	headertextcolor,
	styles2,
} from "./styles";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

const CustomDefaultTheme = {
	...DefaultTheme,
	...PaperDefaultTheme,
	colors: {
		...DefaultTheme.colors,
		...PaperDefaultTheme.colors,
		bgcolor: backgroundcolor,
	},
};

const CustomDarkTheme = {
	...DarkTheme,
	...PaperDarkTheme,
	colors: {
		...DarkTheme.colors,
		...PaperDarkTheme.colors,
		background: "#222223",
		text: "#ffffff",
		bgcolor: darkbackgroundcolor,
	},
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerScreens = (props) => {
	const { appointments } = useSelector((state) => ({
		appointments: state.appointmentReducer.appointments,
	}));

	const theme = useTheme();

	const lastNR = Notifications.useLastNotificationResponse();

	useEffect(() => {
		if (
			lastNR &&
			lastNR.notification.request.content.data.screen &&
			lastNR.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
		) {
			props.navigation.navigate(
				lastNR.notification.request.content.data.screen
			);
		}
	}, [lastNR]);

	return (
		<Drawer.Navigator
			screenOptions={{
				drawerLabelStyle: styles.dlstyle,
				drawerType: "slide",
				drawerActiveBackgroundColor: backgroundcolor,
				drawerActiveTintColor: headertextcolor,
				headerStyle: { backgroundColor: theme.colors.bgcolor },
				headerTintColor: headertextcolor,
			}}
			drawerContent={(props) => <CustomDrawer {...props} />}
			useLegacyImplementation={true}
			initialRouteName='Home'
		>
			<Drawer.Screen
				options={{
					title: "Home",
					drawerIcon: () => <IconButton icon="home-outline" />,
				}}
				name="index"
				component={Index}
			/>
			<Drawer.Screen
				options={{
					drawerIcon: () => <IconButton icon="briefcase-clock-outline" />,
					drawerLabel: () => (
						<View style={styles.dlstyle}>
							<Text>Appointments</Text>
							<Badge style={styles.bastyle}>
								{appointments ? appointments.length : 0}
							</Badge>
						</View>
					),
				}}
				name="Appointments"
				component={Appointments}
			/>
			<Drawer.Screen
				options={{
					drawerIcon: () => <IconButton icon="account-details-outline" />,
				}}
				name="Profile"
				component={Profile}
			/>
			<Drawer.Screen
				options={{
					drawerIcon: () => <IconButton icon="cog-outline" />,
				}}
				name="Settings"
				component={Settings}
			/>
		</Drawer.Navigator>
	);
};

const UnRegisteredStack = () => {
	const [mounted, setMounted] = useState(false);

	const {
		token,
		verified,
		loading,
		details,
		darkmode,
		newUser,
		account_added,
		services_added,
	} = useSelector((state) => ({
		token: state.authReducer.token,
		verified: state.emailReducer.verified,
		loading: state.errorReducer.loading,
		details: state.detailReducer.details,
		darkmode: state.themeReducer.darkmode,
		newUser: state.newuserReducer.newUser,
		account_added: state.compeletionReducer.account_added,
		services_added: state.compeletionReducer.services_added,
	}));

	const dispatch = useDispatch();

	if (!mounted) {
		if (token) {
			dispatch(authenticate());
		}
	}
	useEffect(() => {
		setMounted(true);
	}, [dispatch]);

	return (
		<PaperProvider theme={darkmode ? CustomDarkTheme : CustomDefaultTheme}>
			
				<Portal>
					<Modal visible={loading} dismissable={false}>
						<ActivityIndicator color='orange' size='large' />
					</Modal>
				</Portal>
			
			<NavigationContainer
				theme={darkmode ? CustomDarkTheme : CustomDefaultTheme}
			>
				{token == null ? (
					<Stack.Navigator
						initialRouteName={newUser ? "landingpage" : "login"}
						screenOptions={{
							headerShown: false,
							animationTypeForReplace: "push",
							animation: "fade_from_bottom",
						}}
					>
						<Stack.Screen name="landingpage" component={LandingPage} />
						<Stack.Screen name="login" component={Login} />
						<Stack.Screen name="register" component={Register} />
						<Stack.Screen name="passwordreset" component={PasswordReset} />
					</Stack.Navigator>
				) : (
					<Stack.Navigator
						initialRouteName="verifyemail"
						screenOptions={{
							headerShown: false,
							animationTypeForReplace: "push",
							animation: "slide_from_right",
						}}
					>
						{verified == null ? (
							<Stack.Screen name="verifyemail" component={VerifyEmail} />
						) : (
							<>
								{details == null ? (
									<Stack.Screen name="details" component={Details} />
								) : (
									<>
										{details?.employee_count && !account_added ? (
											<Stack.Screen
												name="paymentdetails"
												component={PaymentDetails}
											/>
										) : details?.employee_count && !services_added ? (
											<Stack.Screen
												name="addservices"
												component={AddServices}
											/>
										) : (
											<>
												<Stack.Screen
													name="drawerscreens"
													component={DrawerScreens}
												/>
												<Stack.Screen name="Info" component={Info} />
											</>
										)}
									</>
								)}
							</>
						)}
					</Stack.Navigator>
				)}
			</NavigationContainer>
		</PaperProvider>
	);
};

export default Main = () => {
	return (
		<Provider store={store}>
			<PersistGate
				loading={
					<View style={styles.mview}>
						<ActivityIndicator size="large" color="black" />
					</View>
				}
				persistor={persistor}
			>
				<StatusBar backgroundColor="transparent" translucent={true} />
				<UnRegisteredStack />
				<FlashMessage position="top" style={styles2.flashstyle} />
			</PersistGate>
		</Provider>
	);
};
