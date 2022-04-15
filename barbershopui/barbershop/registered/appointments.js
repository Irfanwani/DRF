import React, { useRef, useState } from "react";
import { View, SectionList } from "react-native";
import {
	Text,
	Colors,
	Divider,
	Card,
	IconButton,
	Button,
	Title,
	HelperText,
	Surface,
} from "react-native-paper";

import { useSelector, useDispatch } from "react-redux";
import { getAppointments, removeAppointment } from "../redux/actions/actions2";

import styles, { styles2 } from "../styles";

import AlertPro from "react-native-alert-pro";

import { checkout } from "../redux/actions/actions4";

import Ratings from "../components/ratings";
import { addReview } from "../redux/actions/actions2";

const Appointments = () => {
	const { appointments, username, fetching, email } = useSelector((state) => ({
		appointments: state.appointmentReducer.appointments,
		username: state.authReducer.user?.username,
		email: state.authReducer.user?.email,
		fetching: state.errorReducer.fetching,
	}));

	const [visible, setVisible] = useState(false);
	const [id, setId] = useState(null);
	const [barber, setBarber] = useState(null);

	const dispatch = useDispatch();
	const alertprocomp = useRef([]);
	const alertprodel = useRef([]);

	const refreshPage = () => {
		dispatch(getAppointments());
	};

	const closealertcomp = (id) => {
		alertprocomp.current[id].close();
	};

	const closealertdel = (id) => {
		alertprodel.current[id].close();
	};

	const completeApnt = (id, barber) => {
		setVisible(true);
		setId(id);
		setBarber(barber);
		closealertcomp(id);
	};

	const callback2 = (id, barber, ratings, comments) => {
		dispatch(removeAppointment("completed", id, refreshPage));
		dispatch(addReview(barber, ratings, comments));
	};

	const deleteApnt = (id) => {
		dispatch(removeAppointment("deleted", id, refreshPage));
		closealertdel(id);
	};

	const showComp = (id) => {
		alertprocomp.current[id].open();
	};

	const showDel = (id) => {
		alertprodel.current[id].open();
	};

	const callback = () => {
		setVisible(false);
	};

	const ActionDialogComp = (props) => {
		const { id, barber } = props;
		return (
			<AlertPro
				useNativeDriver={true}
				ref={(ref) => (alertprocomp.current[id] = ref)}
				title="Complete Appointment!"
				message="Appointments marked as completed are deleted automatically. Are you sure?"
				textCancel="Cancel"
				textConfirm="Complete"
				onCancel={() => closealertcomp(id)}
				onConfirm={() => completeApnt(id, barber, username)}
				customStyles={{
					container: styles2.container,
					buttonCancel: styles2.buttonCancel,
					buttonConfirm: styles.fstyle1,
					title: styles2.title,
				}}
			/>
		);
	};

	const ActionDialogDel = (props) => {
		const { id } = props;
		return (
			<AlertPro
				useNativeDriver={true}
				ref={(ref) => (alertprodel.current[id] = ref)}
				title="Cancel Appointment!"
				message="This action cannot be reverted.Are you sure?"
				textCancel="Cancel"
				textConfirm="Delete"
				onCancel={() => closealertdel(id)}
				onConfirm={() => deleteApnt(id)}
				customStyles={{
					container: styles2.container,
					buttonCancel: styles2.buttonCancel,
					buttonConfirm: styles.fstyle3,
					title: styles2.title2,
				}}
			/>
		);
	};

	const renderAppointment = ({ item }) => (
		<View animation="bounceIn" useNativeDriver>
			<Surface style={styles.sustyle}>
				<Title>{item.user == username ? item.barber : item.user}</Title>
				<HelperText>{item.datetime}</HelperText>
				<Text>Services Selected</Text>
				{item.services.split("|").map((service, index) => (
					<HelperText key={index}>{service}</HelperText>
				))}
				<View style={styles.vstyle11}>
					<Title style={styles.tistyle}>₹{item.totalcost}</Title>
					{item.user == username &&
						(!item.paid ? (
							<Button
								onPress={() => {
									dispatch(
										checkout({
											amount: item.totalcost,
											currency: "INR",
											barber: item.barber,
											email: email,
											apnt_id: item.id,
										})
									);
								}}
								mode="contained"
								color="teal"
							>
								PAY
							</Button>
						) : null)}

					{item.paid && (
						<Button color="grey" icon="check" compact>
							PAID
						</Button>
					)}
				</View>
				<View style={styles.vstyle12}>
					<Divider />
					<Text style={styles.tstyle7}>Booking ID: #{item.bookingID}</Text>
				</View>

				{item.user == username && item.paid && (
					<View style={styles.vstyle13}>
						<IconButton
							icon="check-bold"
							color={Colors.green600}
							onPress={() => showComp(item.id)}
						/>

						<IconButton
							icon="delete"
							color={Colors.red600}
							onPress={() => showDel(item.id)}
						/>
					</View>
				)}
			</Surface>

			<ActionDialogComp id={item.id} barber={item.barber} />
			<ActionDialogDel id={item.id} />
		</View>
	);

	const ListEmptyComponent = () => {
		return <Text style={styles.tstyle8}>No appointment fixed!</Text>;
	};

	const renderSectionHeader = (section) => {
		return (
			<Card style={styles.cstyle5}>
				<Text style={styles.tstyle9}>{section.title.toUpperCase()}</Text>
			</Card>
		);
	};

	const ListFooter = () => <View style={{ padding: 20 }}></View>;

	const data = [
		{
			title: "Appointments fixed by you.",
			data: appointments
				? appointments.filter((apnt) => apnt.user == username)
				: [],
		},
		{
			title: "Appointments fixed with you.",
			data: appointments
				? appointments.filter(
						(apnt) => apnt.barber == username && apnt.user !== username
				  )
				: [],
		},
	];

	const emptyCheck = (data) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].data.length > 0) {
				return data;
			}
		}
		return [];
	};

	return (
		<View style={styles.vstyle6}>
			<SectionList
				sections={emptyCheck(data)}
				renderItem={renderAppointment}
				ListEmptyComponent={ListEmptyComponent}
				keyExtractor={(item) => item.id.toString()}
				refreshing={fetching}
				onRefresh={refreshPage}
				renderSectionHeader={({ section }) =>
					section.data.length > 0 ? renderSectionHeader(section) : null
				}
				ListFooterComponent={ListFooter}
			/>

			<Ratings
				visible={visible}
				id={id}
				barber={barber}
				callback={callback}
				callback2={callback2}
			/>
		</View>
	);
};

export default Appointments;
