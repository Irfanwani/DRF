import React from "react";
import {
	Dimensions,
	View,
	FlatList,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import {
	Card,
	Text,
	FAB,
	Colors,
	Button,
	Title,
	Divider,
	Portal,
	Modal,
	Headline,
	HelperText,
} from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";

import MapView, { Marker } from "react-native-maps";

import { connect } from "react-redux";
import {
	fixAppointment,
	getAppointments,
	removeErrors,
} from "../redux/actions/actions2";

import { getServices } from "../redux/actions/actions3";

import openMap from "react-native-open-maps";

import { MultiSelect } from "../components/multiselect";

import * as Animatable from "react-native-animatable";

import styles from "../styles";

class Info extends React.PureComponent {
	state = {
		date: "",
		time: "",
		showDTPicker: false,
		mode: "date",
		modalVisible: false,
		mapType: "standard",
		msvisible: false,
		services: null,
		totalcost: 0,
	};

	setDateTime = (event, datetime) => {
		if (!datetime) {
			this.setState({ showDTPicker: false });
			return;
		}
		this.setState({ showDTPicker: false });

		this.setState(
			this.state.mode == "time"
				? {
						time: datetime
							.toTimeString()
							.split(" ")[0]
							.split(":")
							.slice(0, 2)
							.join(":"),
				  }
				: { date: datetime.toDateString() }
		);
	};

	seeAppointments = () => {
		this.Fix.close();
		this.setState({ date: "", time: "" });
		this.props.getAppointments();
		this.props.navigation.navigate("Appointments");
	};

	showmodal = () => {
		this.setState({ modalVisible: true });
	};

	hidemodal = () => {
		this.setState({ modalVisible: false });
	};

	changeMap = () => {
		const { mapType } = this.state;
		this.setState(
			mapType == "standard" ? { mapType: "hybrid" } : { mapType: "standard" }
		);
	};

	showDT1 = () => {
		this.setState({ showDTPicker: true, mode: "time" });
	};

	showItem = ({ item }) => (
		<View>
			<Text>{item}</Text>
			<Divider />
		</View>
	);

	callback = () => {
		this.setState({ msvisible: false });
	};

	callback2 = () => {
		this.Fix.open();
	};

	callback3 = (selectedServices) => {
		let ss = [];
		let total = 0;
		selectedServices.forEach((item) => {
			let items = item.split("Rs.");
			total += parseInt(items[1]);

			ss.push(items[0].trim());
		});
		this.setState({ services: ss.join("|"), totalcost: total });
	};

	render() {
		const {
			date,
			time,
			showDTPicker,
			mode,
			modalVisible,
			mapType,
			msvisible,
			services,
			totalcost,
		} = this.state;
		const {
			id,
			image,
			coords,
			username,
			Distance,
			start_time,
			end_time,
			about,
			contact,
		} = this.props.route.params.props;

		const {
			error,
			loading,
			fixAppointment,
			removeErrors,
			reg_username,
			getServices,
			msdata,
		} = this.props;

		const datetime = `${date} ${time}`;
		const barber = username;

		const coordinates = coords
			? coords.slice(coords.indexOf("(") + 1, coords.indexOf(")")).split(" ")
			: [0, 0];
		return (
			<View style={styles.view3}>
				<View style={styles.infoIntro}>
					<Animatable.Image
						animation="bounceIn"
						useNativeDriver={true}
						style={styles.animatedImage}
						source={{ uri: image }}
					/>

					<View>
						<Headline style={styles.tstyle7}>{username}</Headline>
						<HelperText padding="none">Distance: {Distance} km</HelperText>
						<Button uppercase={false} icon="phone" disabled={true}>
							{contact && `${contact}`}
						</Button>
					</View>
				</View>
				<View style={styles.view4}>
					<Text>
						{about && (
							<View>
								<Title>Bio</Title>
								<ScrollView style={styles.sstyle2}>
									<Text style={styles.text2}>{about}</Text>
								</ScrollView>
							</View>
						)}
					</Text>

					<Title>Working Hours</Title>
					<Text style={styles.text3}>
						{start_time} to {end_time}
					</Text>

					<Title>Location</Title>
					<TouchableOpacity style={styles.tostyle1} onPress={this.showmodal}>
						<MapLocation
							coordinates={coordinates}
							height={Dimensions.get("window").height / 5}
							width={Dimensions.get("window").width - 10}
							mode={mapType}
						/>
					</TouchableOpacity>
				</View>

				<FAB
					color={Colors.green50}
					icon="check"
					style={styles.fstyle7}
					label="fix appointment"
					onPress={() => {
						getServices(id, () => {
							this.setState({ msvisible: true });
						});
					}}
				/>

				<MultiSelect
					title="Select Services"
					subtitle='You can select atmost 3 services'
					data={msdata}
					visible={msvisible}
					callback={this.callback}
					callback2={this.callback2}
					callback3={this.callback3}
					buttonLabel="Proceed"
				/>

				<Portal>
					<Modal visible={modalVisible} onDismiss={this.hidemodal}>
						<MapLocation
							coordinates={coordinates}
							height={Dimensions.get("window").height / 1.3}
							width={Dimensions.get("window").width}
							mode={mapType}
						/>

						<FAB
							onPress={() =>
								openMap({
									query: `${parseFloat(coordinates[1])},${parseFloat(
										coordinates[0]
									)}`,
									end: `${parseFloat(coordinates[1])},${parseFloat(
										coordinates[0]
									)}`,
									navigate: false,
									travelType: "drive",
								})
							}
							small={true}
							style={styles.fstyle8}
							icon="directions"
							color={Colors.blue500}
						/>

						<FAB
							small={true}
							color={Colors.green800}
							style={styles.fstyle9}
							icon={mapType == "standard" ? "earth-box" : "earth"}
							onPress={this.changeMap}
						/>
					</Modal>
				</Portal>
				<RBSheet
					animationType="slide"
					height={Dimensions.get("window").height - 30}
					ref={(ref) => {
						this.Fix = ref;
					}}
					customStyles={{
						container: styles.rbsheet,
					}}
					closeOnDragDown={true}
					dragFromTopOnly={true}
					onClose={() => {
						removeErrors();
						this.setState({ date: "", time: "" });
					}}
				>
					<Card style={styles.cstyle6}>
						<Card.Title
							title="Fix Appointment"
							subtitle={`Fix appointment with ${username}`}
						/>
						<Button
							onPress={() => {
								this.setState({ showDTPicker: true, mode: "date" });
							}}
							style={styles.bstyle4}
							mode="outlined"
							icon="calendar-range"
						>
							{date ? date : "Selected Date will show here."}
						</Button>
						<Button
							onPress={this.showDT1}
							style={styles.bstyle4}
							mode="outlined"
							icon="clock-time-five"
						>
							{time ? time : "Selected Time will show here."}
						</Button>

						{showDTPicker && (
							<DateTimePicker
								minuteInterval={20}
								mode={mode}
								display="default"
								value={new Date()}
								onChange={this.setDateTime}
							/>
						)}

						<Text style={styles.error}>
							{error
								? error.message ||
								  (error.services
										? "Please select some services to proceed"
										: "")
								: ""}
						</Text>

						<View style={styles.view5}>
							<Button
								onPress={() => this.Fix.close()}
								color={Colors.grey600}
								mode="outlined"
								icon="window-close"
							>
								Cancel
							</Button>
							<Button
								onPress={() =>
									fixAppointment({
										reg_username,
										barber,
										datetime,
										services,
										totalcost,
										seeAppointments: this.seeAppointments,
									})
								}
								loading={loading}
								color={Colors.green600}
								style={styles.bstyle5}
								mode="contained"
								icon="check"
							>
								Done
							</Button>
						</View>
						<HelperText>
							NOTE: Time can only be selected in intervals of 20 minutes
						</HelperText>
						<Text>
							{error ? (
								error.takendates ? (
									<Card.Content>
										<Title>Taken Spots</Title>

										<FlatList
											style={styles.flstyle}
											data={error.takendates}
											renderItem={this.showItem}
											keyExtractor={(item, index) => index.toString()}
										/>
									</Card.Content>
								) : (
									""
								)
							) : (
								""
							)}
						</Text>
					</Card>
				</RBSheet>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	error: state.errorReducer.error,
	loading: state.errorReducer.loading,
	reg_username: state.authReducer.user ? state.authReducer.user.username : null,
	msdata: state.getservicesReducer.availableservices,
});

export default connect(mapStateToProps, {
	fixAppointment,
	getAppointments,
	removeErrors,
	getServices,
})(Info);

const MapLocation = (props) => {
	const { coordinates, height, width, mode } = props;
	return (
		<MapView
			mapType={mode}
			style={{ height, width }}
			region={{
				latitude: parseFloat(coordinates[1]),
				longitude: parseFloat(coordinates[0]),
				latitudeDelta: 0.9,
				longitudeDelta: 0.9,
			}}
		>
			<Marker
				coordinate={{
					latitude: parseFloat(coordinates[1]),
					longitude: parseFloat(coordinates[0]),
				}}
			/>
		</MapView>
	);
};
