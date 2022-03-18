import React from "react";
import { Dimensions, ScrollView, View } from "react-native";

import {
	Text,
	TextInput,
	Button,
	Avatar,
	Card,
	FAB,
	Colors,
	ActivityIndicator,
	RadioButton,
	Title,
	IconButton,
} from "react-native-paper";

import { connect } from "react-redux";
import { details } from "../redux/actions/actions";

import DateTimePicker from "@react-native-community/datetimepicker";

import RBSheet from "react-native-raw-bottom-sheet";

import MapView, { Marker } from "react-native-maps";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import * as Animatable from "react-native-animatable";

import TipProvider, { Tip, showTip } from "react-native-tip";

import styles, { backgroundcolor } from "../styles";

class Details extends React.Component {
	state = {
		image: "",
		lat: "",
		lng: "",
		location: "",
		about: "",
		contact: "",
		employee_count: "",
		start_time: "",
		end_time: "",
		userType: "user",
		animating: false,
		addressChanged: false,
		standard: true,
		mapClicked: false,
		showDateTimePicker: false,
		startTimeClock: false,
		currentTime: new Date(),
	};

	componentDidMount() {
		setTimeout(() => {
			showTip("tipid");
		}, 1000);
	}

	changeLocation = (location) => {
		this.setState({ location, addressChanged: true });
	};

	changeAbout = (about) => {
		this.setState({ about });
	};

	changeContact = (contact) => {
		this.setState({ contact });
	};

	changeEmployeeCount = (employee_count) => {
		this.setState({ employee_count });
	};

	changeTime = (event, time) => {
		let parsedTime;
		if (time) {
			parsedTime = time
				.toTimeString()
				.split(" ")[0]
				.split(":")
				.slice(0, 2)
				.join(":");
		} else {
			this.setState({ showDateTimePicker: false });
			return;
		}

		if (this.state.startTimeClock) {
			this.setState({ start_time: parsedTime });
		} else {
			this.setState({ end_time: parsedTime });
		}
		this.setState({
			startTimeClock: false,
			showDateTimePicker: false,
			currentTime: time,
		});
	};

	galleryAsync = async () => {
		let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== "granted") {
			alert("Media library permissions denied!");
			return;
		}
		let image = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
		});

		if (!image.cancelled) {
			this.setState({ image });
			this.ImageRBSheet.close();
		}
	};

	cameraAsync = async () => {
		let { status } = await ImagePicker.requestCameraPermissionsAsync();

		if (status !== "granted") {
			alert("Camera permissions denied!");
			return;
		}
		let image = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
		});

		if (!image.cancelled) {
			this.setState({ image });
			this.ImageRBSheet.close();
		}
	};

	removeImage = () => {
		this.setState({ image: "" });
		this.ImageRBSheet.close();
	};

	getLocationAsync = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			alert("Location permissions denied");
			return;
		}

		this.setState({ animating: true });
		let location = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.BestForNavigation,
		});

		const { latitude, longitude } = location.coords;
		this.setState({ lat: latitude, lng: longitude }, this.reverseGeoCodeAsync);
		this.setState({ animating: false });
	};

	reverseGeoCodeAsync = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			alert("Location permissions denied");
			return;
		}

		let location = await Location.reverseGeocodeAsync({
			latitude: this.state.lat,
			longitude: this.state.lng,
		});

		let loc = Object.values(location[0]).join(" ");

		let modifiedLoc = Array.from(new Set(loc.split(" "))).join(" ");
		this.setState({ location: modifiedLoc });
	};

	geoCodeAsync = async () => {
		if (this.state.addressChanged && this.state.location.length > 0) {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				alert("Location permissions denied");
				return;
			}
			this.setState({ animating: true });
			let coords = await Location.geocodeAsync(this.state.location);

			if (coords.length > 0) {
				const { latitude, longitude } = coords[0];
				this.setState({
					lat: latitude,
					lng: longitude,
				});
			} else {
				alert("Please provide a valid address.");
			}
			this.setState({ animating: false, addressChanged: false });
		}
	};

	onCloseMapSheet = () => {
		if (this.state.mapClicked) {
			this.reverseGeoCodeAsync();
			this.setState({ mapClicked: false });
		}
	};

	submit = () => {
		const {
			image,
			lat,
			lng,
			location,
			about,
			contact,
			employee_count,
			start_time,
			end_time,
			userType,
		} = this.state;

		const profile = {
			lat,
			lng,
			location,
			about,
			contact,
			employee_count,
			start_time,
			end_time,
		};

		this.props.details(image, profile, userType);
	};

	render() {
		const {
			image,
			lat,
			lng,
			location,
			about,
			contact,
			employee_count,
			start_time,
			end_time,
			userType,
			animating,
			standard,
			showDateTimePicker,
			currentTime,
		} = this.state;

		const { error } = this.props;
		return (
			<ScrollView style={styles.sstyle} keyboardShouldPersistTaps="always">
				<Animatable.View
					useNativeDriver={true}
					animation="bounceIn"
					style={styles.astyle}
				>
					<Text style={styles.tstyle1}>Last step and you are DONE!</Text>
				</Animatable.View>
				<Animatable.View useNativeDriver={true} animation="fadeInUpBig">
					<Card style={styles.cstyle1} elevation={0}>
						<View style={styles.vstyle1}>
							<Card.Title
								title="Profile"
								titleStyle={styles.title}
								left={() => (
									<Avatar.Icon
										icon="card-account-details"
										size={30}
										style={styles.heading}
									/>
								)}
							/>

							<View>
								{(image && (
									<Avatar.Image
										source={{ uri: image.uri }}
										size={150}
										style={styles.avatar}
									/>
								)) || (
									<Avatar.Icon
										size={150}
										icon="account"
										style={styles.avatar}
									/>
								)}

								<FAB
									onPress={() => this.ImageRBSheet.open()}
									icon="camera"
									style={styles.fab}
								/>
							</View>
							<RBSheet
								animationType="slide"
								ref={(ref) => {
									this.ImageRBSheet = ref;
								}}
								height={Dimensions.get("window").height / 4}
								closeOnDragDown={true}
								customStyles={{
									container: styles.rbsheet,
								}}
							>
								<Card style={styles.rbsheet}>
									<Card.Title
										title="Add Profile photo"
										titleStyle={{ color: "cyan" }}
									/>
									<Card.Content style={styles.ccstyle}>
										<FAB
											onPress={this.galleryAsync}
											icon="image"
											style={styles.fstyle1}
										/>
										<FAB
											onPress={this.cameraAsync}
											icon="camera"
											style={styles.fstyle2}
										/>
										<FAB
											onPress={this.removeImage}
											icon="delete"
											style={styles.fstyle3}
										/>
									</Card.Content>
								</Card>
							</RBSheet>

							<Text style={styles.tstyle2}>
								{error ? (error.image ? error.image : "") : ""}
							</Text>

							<View>
								<View
									style={{
										alignSelf: "flex-end",
									}}
								>
									<Tip
										id="tipid"
										body="Click this icon to get your location automatically"
									>
										<IconButton />
									</Tip>
								</View>
								<View>
									<TextInput
										mode="outlined"
										value={location}
										onChangeText={this.changeLocation}
										label="Address details"
										left={<TextInput.Icon name="map-marker" />}
										right={
											<TextInput.Icon
												name={animating ? "" : "crosshairs-gps"}
												onPress={this.getLocationAsync}
											/>
										}
										onBlur={this.geoCodeAsync}
										error={error ? (error.location ? true : false) : false}
									/>

									<ActivityIndicator
										style={animating ? styles.astyleA : styles.astyleD}
									/>
								</View>
							</View>
							<View style={styles.vstyle2}>
								<Text style={styles.error}>
									{error ? (error.location ? error.location : "") : ""}
								</Text>
								<FAB
									onPress={() => this.MapRBSheet.open()}
									color="white"
									icon="map-search"
									label="Show Map"
									style={styles.fstyle4}
								/>
							</View>

							<RBSheet
								animationType="slide"
								ref={(ref) => {
									this.MapRBSheet = ref;
								}}
								height={Dimensions.get("window").height}
								closeOnDragDown={true}
								dragFromTopOnly={true}
								customStyles={{
									container: styles.rbsheet,
								}}
								onClose={this.onCloseMapSheet}
							>
								<MapView
									onPress={(e) => {
										this.setState({
											mapClicked: true,
											lat: e.nativeEvent.coordinate.latitude,
											lng: e.nativeEvent.coordinate.longitude,
										});
									}}
									mapType={standard ? "standard" : "hybrid"}
									style={styles.map}
								>
									<Marker
										coordinate={{
											latitude: lat ? lat : 0,
											longitude: lng ? lng : 0,
										}}
									/>
								</MapView>
								<FAB
									onPress={() =>
										this.setState((prevState) => ({
											standard: !prevState.standard,
										}))
									}
									color={Colors.cyan100}
									icon={standard ? "map" : "earth"}
									style={styles.fstyle5}
								/>

								<FAB
									onPress={() => this.MapRBSheet.close()}
									color="white"
									icon="check"
									label="Done"
									style={styles.fstyle6}
								/>
							</RBSheet>

							<TextInput
								maxLength={1000}
								mode="outlined"
								value={about}
								onChangeText={this.changeAbout}
								label="About"
								left={<TextInput.Icon name="information-variant" />}
								right={<TextInput.Affix text={`${1000 - about.length}/1000`} />}
								multiline
								numberOfLines={5}
								error={error ? (error.about ? true : false) : false}
							/>
							<Text style={styles.error}>
								{error ? (error.about ? error.about : "") : ""}
							</Text>

							<TextInput
								mode="outlined"
								value={contact}
								onChangeText={this.changeContact}
								label="Contact"
								left={<TextInput.Icon name="card-account-phone" />}
								error={error ? (error.contact ? true : false) : false}
							/>
							<Text style={styles.error}>
								{error ? (error.contact ? error.contact : "") : ""}
							</Text>

							<RadioButton.Group
								onValueChange={(userType) => this.setState({ userType })}
								value={userType}
							>
								<Title>Login As:</Title>
								<View style={styles.vstyle3}>
									<View style={styles.vstyle4}>
										<Text>Client</Text>
										<RadioButton value="user" />
									</View>
									<View style={styles.vstyle4}>
										<Text>Service Provider</Text>
										<RadioButton value="barber" />
									</View>
								</View>
							</RadioButton.Group>

							{userType == "barber" && (
								<View>
									<TextInput
										keyboardType="numeric"
										mode="outlined"
										value={employee_count}
										onChangeText={this.changeEmployeeCount}
										label="Number of Employees (Including you)"
										left={<TextInput.Icon name="briefcase" />}
										error={
											error ? (error.employee_count ? true : false) : false
										}
									/>
									<Text style={styles.error}>
										{error
											? error.employee_count
												? error.employee_count
												: ""
											: ""}
									</Text>

									<View style={styles.vstyle5}>
										<FAB
											label={start_time ? start_time : "opening"}
											onPress={() =>
												this.setState({
													showDateTimePicker: true,
													startTimeClock: true,
												})
											}
											icon="timer"
											style={styles.fstyle1}
										/>

										<FAB
											label={end_time ? end_time : "closing"}
											onPress={() =>
												this.setState({ showDateTimePicker: true })
											}
											icon="timer-off"
											style={styles.fstyle3}
										/>

										{showDateTimePicker && (
											<DateTimePicker
												testID="dateTimePicker"
												value={currentTime}
												mode="time"
												display="default"
												onChange={this.changeTime}
											/>
										)}
									</View>
									<Text style={styles.error}>
										{error
											? error.start_end_error
												? error.start_end_error
												: ""
											: ""}
									</Text>
								</View>
							)}

							<Text style={styles.error}>
								{error ? (error.message ? error.message : "") : ""}
							</Text>
							<Button
								onPress={() => this.submit()}
								mode="contained"
								icon="login"
								style={styles.button}
								color={error ? Colors.red700 : backgroundcolor}
							>
								Complete Registration
							</Button>
						</View>
					</Card>
				</Animatable.View>
				<TipProvider darkMode={true} />
			</ScrollView>
		);
	}
}

const mapStateToProps = (state) => ({
	error: state.errorReducer.error,
});

export default connect(mapStateToProps, { details })(Details);
