import { useState, useRef, useEffect, memo } from "react";
import { View, FlatList } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, Title, HelperText, Button, FAB } from "react-native-paper";

import { useSelector, useDispatch } from "react-redux";
import styles, { backgroundcolor, styles2 } from "../styles";

import { addServicesList } from "../redux/actions/actions3";

import RenderItemComponent from "../components/renderItem";

const AddServices = () => {
	const { darkmode, loading, error } = useSelector((state) => ({
		darkmode: state.themeReducer.darkmode,
		loading: state.errorReducer.loading,
		error: state.errorReducer.error?.error,
	}));

	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{ label: "Barbershop", value: "barbershop" },
		{ label: "Hair Salon", value: "hair_salon" },
		{ label: "Beauty Salon", value: "beauty_salon" },
		{ label: "Full-Service Salon", value: "full_service_salon" },
		{ label: "Other", value: "other" },
	]);

	const [services, setServices] = useState({});

	const [serviceDetails, setServiceDetails] = useState({
		ind: null,
		service: null,
		editable: null,
	});

	const istRender = useRef(true);

	useEffect(() => {
		if (istRender.current) {
			istRender.current = false;
			return;
		}
		const { ind, service, editable } = serviceDetails;
		if (editable) {
			setServices((prev) => ({ ...prev, [ind]: service }));
		} else {
			setServices((prev) => {
				const obj = { ...prev };
				delete obj[ind];
				return obj;
			});
		}
	}, [serviceDetails]);

	const refs = useRef([]);

	const submit = () => {
		const data = {
			service_type: value,
			services,
		};
		dispatch(addServicesList(data));
	};

	const renderItem = ({ item, index }) => {
		const ind = `s${index}`;
		const callback = (service, editable) => {
			setServiceDetails({ ind, service, editable });
		};

		return (
			<RenderItemComponent
				item={item}
				index={index}
				callback={callback}
				ref={refs}
			/>
		);
	};

	const listHeader = () => (
		<View>
			<HelperText>
				Select the services which your provide with respective Prices.
			</HelperText>
			<View style={styles.vstyle9}>
				<Title>Service</Title>
				<Title>Cost (in Rs.)</Title>
			</View>
		</View>
	);

	const listFooter = () => (
		<View style={styles2.footerstyle}>
			<HelperText type="error">{error ? error : ""}</HelperText>
			<Button
				loading={loading}
				mode="contained"
				style={styles.bstyle2}
				color={backgroundcolor}
				icon="check"
				onPress={submit}
			>
				Submit
			</Button>
		</View>
	);

	return (
		<View style={styles.vstyle10}>
			<DropDownPicker
				placeholder="Service Type"
				open={open}
				value={value}
				items={items}
				setOpen={setOpen}
				setValue={setValue}
				setItems={setItems}
				listMode="SCROLLVIEW"
				theme={darkmode ? "DARK" : "LIGHT"}
			/>

			<FlatList
				keyboardShouldPersistTaps="always"
				initialNumToRender={7}
				data={data}
				keyExtractor={(item) => data.indexOf(item).toString()}
				renderItem={renderItem}
				ListHeaderComponent={listHeader}
				ListFooterComponent={listFooter}
				ItemSeparatorComponent={() => <Divider />}
			/>
		</View>
	);
};

export default memo(AddServices);

const data = [
	"Haircuts and trims",
	"Haircuts with clippers",
	"Formal hairstyles",
	"Basic hairstyles",
	"Shaves",
	"Custom shave designs",
	"Braids",
	"Facial hair grooming, cutting, and styling",
	"Colors and highlights",
	"Basic manicures",
	"Single-process color",
	"Double-process color",
	"Highlights (cap or foil)",
	"Straightening treatments",
	"Perms",
	"Relaxers",
	"Hair extensions",
	"Blowouts",
	"Waxing",
	"Makeup application",
	"Tanning",
	"Spray tanning",
	"Manicures",
	"Pedicures",
	"Acrylic nail and tip application",
	"Massage",
	"Facials",
	"Skincare consultation",
	"Lash extensions",
	"Electrolysis hair removal",
	"Fillers and injections",
];
