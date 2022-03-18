import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Colors, Text, Button } from "react-native-paper";

import { useDispatch } from "react-redux";

import { LinearGradient } from "expo-linear-gradient";

import { backgroundcolor } from "../styles";

import * as Animatable from "react-native-animatable";

import styles from "../styles";
import { NEW_USER } from "../redux/actions/types";

const App = (props) => {
	const dispatch = useDispatch();

	const gotoRegister = () => {
		dispatch({ type: NEW_USER });
		props.navigation.navigate("register");
	};
	
	return (
		<View style={styles.vstyle6}>
			<Animatable.View
				useNativeDriver={true}
				animation="slideInDown"
				duration={600}
				style={styles.front}
			>
				<LinearGradient
					colors={[backgroundcolor, Colors.green200]}
					style={styles.lgstyle}
				>
					<Text style={styles.tag}>BarberShop</Text>
					<Animatable.View animation="pulse" useNativeDriver={true}>
						<Image
							resizeMode="center"
							source={require("../../assets/barberfront2.png")}
							style={styles.istyle1}
						/>
						<Text style={styles.tstyle3}>
							Save your time by joining with Us!. Fix appoinment with any barber
							at any time!
						</Text>
					</Animatable.View>
				</LinearGradient>
			</Animatable.View>

			<Animatable.View
				useNativeDriver={true}
				animation="bounceIn"
				style={styles.astyle1}
			>
				<LinearGradient
					colors={[Colors.pink200, Colors.pink800]}
					style={styles.start}
				>
					<TouchableOpacity onPress={gotoRegister}>
						<Button
							contentStyle={styles.bustyle}
							color="white"
							uppercase={false}
							icon="arrow-right"
						>
							Let's Start
						</Button>
					</TouchableOpacity>
				</LinearGradient>
			</Animatable.View>
		</View>
	);
};

export default App;
