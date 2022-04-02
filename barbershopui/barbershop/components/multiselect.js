import React, { useState, useEffect, useRef } from "react";
import { FlatList, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
	Button,
	Colors,
	Divider,
	Modal,
	Portal,
	Text,
	Title,
} from "react-native-paper";
import { backgroundcolor, styles2 } from "../styles";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { barbers } from "../redux/actions/actions";

export const MultiSelect = (props) => {
	const { data, visible, callback, clearSelection, callback2, barbersFilter } =
		props;

	const [selectedItems, setSelectedItems] = useState([]);

	const theme = useTheme();

	const ref = useRef([]);

	const dispatch = useDispatch();

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (clearSelection) {
			setSelectedItems([]);
		}
	}, [clearSelection]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		callback(selectedItems.length);

		if (selectedItems.length > 0 && barbersFilter) {
			dispatch(barbers(null, selectedItems));
		}
	}, [selectedItems]);

	const renderItem = ({ item, index }) => {
		return (
			<BouncyCheckbox
				ref={(rf) => (ref.current[index] = rf)}
				style={{ marginLeft: 5 }}
				iconStyle={{ borderRadius: 4 }}
				fillColor={backgroundcolor}
				textComponent={
					<View style={styles2.vstyle}>
						<Text style={styles2.tstyle}>{item}</Text>
					</View>
				}
				isChecked={selectedItems.includes(item) ? true : false}
			/>
		);
	};

	const applyFilter = () => {
		callback2(false);
		ref.current.map((el, index) => {
			if (el.state.checked) {
				if (!selectedItems.includes(data[index])) {
					setSelectedItems((prev) => [...prev, data[index]]);
				}
			} else {
				setSelectedItems((prev) => prev.filter((el) => el != data[index]));
			}
		});
	};

	const itemSepComp = () => <Divider style={styles2.divider} />;

	const clearFilter = () => {
		callback2(true);
		setSelectedItems([]);
		dispatch(barbers());
	};

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={callback}
				contentContainerStyle={{
					marginVertical: 30,
					backgroundColor: theme.colors.background,
				}}
			>
				<Title>Filter As Per Services Provided</Title>
				<Button
					color={Colors.blue500}
					style={{ alignSelf: "flex-end" }}
					onPress={clearFilter}
				>
					Clear Filters
				</Button>

				<FlatList
					data={data}
					renderItem={renderItem}
					keyExtractor={(item) => data.indexOf(item).toString()}
					ItemSeparatorComponent={itemSepComp}
					ListFooterComponent={<View style={styles2.divider}></View>}
				/>

				<Button
					onPress={applyFilter}
					mode="contained"
					icon="check"
					color={Colors.teal500}
				>
					Apply Filter
				</Button>
			</Modal>
		</Portal>
	);
};
