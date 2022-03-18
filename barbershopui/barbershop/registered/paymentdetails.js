import { useState } from "react";
import { View, ScrollView } from "react-native";
import {
	TextInput,
	Title,
	HelperText,
	Headline,
	Checkbox,
	Button,
} from "react-native-paper";

import DropDownPicker from "react-native-dropdown-picker";

import { useSelector, useDispatch } from "react-redux";

import { addBankDetails } from "../redux/actions/actions3";
import styles, { backgroundcolor } from "../styles";

const PaymentDetails = () => {
	const { darkmode, username, email, error, loading } = useSelector(
		(state) => ({
			darkmode: state.themeReducer.darkmode,
			username: state.authReducer.user?.username,
			email: state.authReducer.user?.email,
			error: state.errorReducer.error?.error,
			loading: state.errorReducer.loading,
		})
	);

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{ label: "Individual", value: "individual" },
		{ label: "Partnership", value: "partnership" },
		{ label: "Proprietorship", value: "proprietorship" },
		{ label: "Not Yet Registered", value: "not_yet_registered" },
	]);

	const [openA, setOpenA] = useState(false);
	const [valueA, setValueA] = useState(null);
	const [itemsA, setItemsA] = useState([
		{ label: "Current", value: "current" },
		{ label: "Savings", value: "savings" },
	]);

	const [account_name, setAccName] = useState(username);

	const [business_name, setBusName] = useState("");

	const [acc_number, setAccNumber] = useState("");
	const [ifsc_code, setIfsc] = useState("");

	const [tnc, setTnc] = useState(false);

	const dispatch = useDispatch();

	const submit = () => {
		const data = {
			name: account_name,
			email: email,
			tnc_accepted: tnc,
			account_details: {
				business_name,
				business_type: value,
			},
			bank_account: {
				ifsc_code,
				beneficiary_name: account_name,
				account_type: valueA,
				account_number: acc_number,
			},
		};

		dispatch(addBankDetails(data));
	};

	const setbusinessname = (name) => {
		setBusName(name);
	};

	const setaccname = (name) => {
		setAccName(name);
	};

	const setaccnum = (number) => {
		setAccNumber(number);
	};

	const setifsccode = (code) => {
		setIfsc(code);
	};

	const settnc = () => {
		setTnc(!tnc);
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="always"
			contentContainerStyle={styles.sstyle3}
		>
			<View>
				<Headline>Payment Account Details</Headline>
				<HelperText>
					These Details are taken so that clients can pay you online. These
					credentials are kept confidential!
				</HelperText>
				<View></View>
				<View style={styles.bstyle4}>
					<Title>Business Details</Title>
					<TextInput
						style={styles.testyle2}
						label="Business Name"
						value={business_name}
						onChangeText={setbusinessname}
						left={<TextInput.Icon name="store-outline" />}
					/>

					<DropDownPicker
						placeholder="Business Type"
						listMode="SCROLLVIEW"
						open={open}
						value={value}
						items={items}
						setOpen={setOpen}
						setValue={setValue}
						setItems={setItems}
						theme={darkmode ? "DARK" : "LIGHT"}
					/>
				</View>

				<View>
					<Title>Bank Details</Title>
					<TextInput
						label="Beneficiary Name (your name in bank)"
						value={account_name}
						onChangeText={setaccname}
						left={<TextInput.Icon name="account-outline" />}
					/>
					<TextInput
						label="Account Number"
						value={acc_number}
						onChangeText={setaccnum}
						keyboardType="numeric"
						left={<TextInput.Icon name="bank-outline" />}
					/>
					<TextInput
						label="IFSC code"
						value={ifsc_code}
						onChangeText={setifsccode}
						left={<TextInput.Icon name="qrcode" />}
						style={styles.testyle2}
					/>

					<DropDownPicker
						placeholder="Account Type (optional)"
						listMode="SCROLLVIEW"
						open={openA}
						value={valueA}
						items={itemsA}
						setOpen={setOpenA}
						setValue={setValueA}
						setItems={setItemsA}
						theme={darkmode ? "DARK" : "LIGHT"}
					/>
				</View>
				<View style={styles.view6}>
					<Checkbox
						color={backgroundcolor}
						onPress={settnc}
						status={tnc ? "checked" : "unchecked"}
					/>

					<HelperText style={styles.hestyle}>
						I agree to the Terms and Conditions.
					</HelperText>
				</View>
				<HelperText type="error">{error ? error : ""}</HelperText>
				<Button
					loading={loading}
					icon="check"
					style={styles.bstyle6}
					mode="contained"
					color="teal"
					onPress={submit}
				>
					Submit
				</Button>
			</View>
		</ScrollView>
	);
};

export default PaymentDetails;
