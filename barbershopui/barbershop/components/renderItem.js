import React, { memo, useState, forwardRef, useEffect, useRef } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";

import {
	TextInput,
	Text,
	Card,
	Avatar,
	Divider,
	Modal,
	Portal,
	HelperText,
	Title,
	Button,
	Colors,
} from "react-native-paper";

import { useDispatch } from "react-redux";

import { barbers } from "../redux/actions/actions";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import styles, { backgroundcolor, styles2 } from "../styles";

const RenderItemComponent = forwardRef(({ item, index, callback }, ref) => {
	const [cost, setCost] = useState();
	const [editable, setEditable] = useState(false);
	const [submit, setSubmit] = useState(false);

	const isFirstRender = useRef([true, true]);

	useEffect(() => {
		if (isFirstRender.current[0]) {
			isFirstRender.current[0] = false;
			return;
		}
		if (editable) {
			ref.current[index].focus();
		} else {
			ref.current[index].blur();
		}
	}, [editable]);

	useEffect(() => {
		if (isFirstRender.current[1]) {
			isFirstRender.current[1] = false;
			return;
		}
		callback({ service: item, cost }, editable);
	}, [submit]);

	const setRef = (rf) => {
		ref.current[index] = rf;
	};

	const getCost = (cost) => {
		setCost(cost);
	};

	const done = () => {
		setSubmit((prev) => !prev);
	};

	const checkBoxAlter = (isChecked) => {
		setEditable(isChecked);
		if (!isChecked) {
			setSubmit((prev) => !prev);
		}
	};

	return (
		<BouncyCheckbox
			fillColor={backgroundcolor}
			textComponent={
				<View style={styles2.vstyle}>
					<Text style={styles2.tstyle}>{item}</Text>
					<TextInput
						ref={setRef}
						value={editable ? cost : null}
						onChangeText={getCost}
						keyboardType="numeric"
						style={styles2.tistyle}
						placeholder="Price"
						left={<TextInput.Icon name="currency-inr" disabled={true} />}
						editable={editable}
						onBlur={done}
						error={!cost && editable}
					/>
				</View>
			}
			onPress={checkBoxAlter}
		/>
	);
});

export default memo(RenderItemComponent);

// Individual barber card
export const Barber = memo((props) => {
	const [visible, setVisible] = useState(false);

	const gotoInfo = () => {
		props.navigation.navigate("Info", { props: props.item });
	};

	const changeVisible = () => {
		setVisible(true);
	};

	const closeModal = () => {
		setVisible(false);
	};

	return (
		<Card>
			<View style={styles.view2}>
				{props.item.image ? (
					<TouchableOpacity onPress={changeVisible}>
						<Avatar.Image
							source={{ uri: props.item.image }}
							size={70}
							style={styles.dp}
						/>
					</TouchableOpacity>
				) : (
					<Avatar.Icon
						icon="account"
						size={70}
						style={styles.dp}
						color="lightgrey"
					/>
				)}

				<Portal>
					<Modal visible={visible} onDismiss={closeModal}>
						<Image
							resizeMode="contain"
							source={{ uri: props.item.image }}
							style={styles.istyle2}
						/>
					</Modal>
				</Portal>

				<TouchableOpacity onPress={gotoInfo} style={styles.tostyle}>
					<Title style={styles.text1}>{props.item.username}</Title>
					<Text numberOfLines={1} ellipsizeMode="tail">
						Address:- {props.item.location}
					</Text>
					<HelperText>Distance:- {props.item.Distance} km</HelperText>
				</TouchableOpacity>
			</View>
			<Divider inset />
		</Card>
	);
});

// filtering component
export const HeaderComponent = memo((props) => {
	const { removeFilters, callback, callback2 } = props;

	const [selected, setSelected] = useState(null);

	const dispatch = useDispatch();

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (removeFilters) {
			setSelected(null);
			return;
		}
	}, [removeFilters]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (!removeFilters) {
			dispatch(barbers(selected));
		}
	}, [selected]);

	const select = (type) => {
		callback(false);
		callback2(type);
		if (selected !== type) {
			setSelected(type);
		} else {
			setSelected(null);
		}
	};

	return (
		<ScrollView horizontal>
			<Button
				icon="content-cut"
				color={Colors.teal500}
				mode={selected == "barbershop" ? "contained" : "outlined"}
				style={styles2.filterstyles}
				onPress={() => select("barbershop")}
			>
				Barbershops
			</Button>
			<Button
				icon="hair-dryer-outline"
				color={Colors.teal500}
				mode={selected == "hair_salon" ? "contained" : "outlined"}
				style={styles2.filterstyles}
				onPress={() => select("hair_salon")}
			>
				Hair Salons
			</Button>
			<Button
				icon="chair-rolling"
				color={Colors.teal500}
				mode={selected == "beauty_salon" ? "contained" : "outlined"}
				style={styles2.filterstyles}
				onPress={() => select("beauty_salon")}
			>
				Beauty Salons
			</Button>
			<Button
				icon="store"
				color={Colors.teal500}
				mode={selected == "full_service_salon" ? "contained" : "outlined"}
				style={styles2.filterstyles}
				onPress={() => select("full_service_salon")}
			>
				Full-Service Salons
			</Button>
			<Button
				icon="magnify"
				color={Colors.teal500}
				mode={selected == "other" ? "contained" : "outlined"}
				style={styles2.filterstyles}
				onPress={() => select("other")}
			>
				Others
			</Button>
		</ScrollView>
	);
});
