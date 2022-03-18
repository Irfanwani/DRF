import React from "react";
import { FlatList, View, TextInput } from "react-native";
import { connect } from "react-redux";
import { IconButton, Text } from "react-native-paper";
import { barbers, tokenCheck } from "../redux/actions/actions";
import { getAppointments } from "../redux/actions/actions2";
import { GET_ERRORS } from "../redux/actions/types";

import { notification_manager } from "../notifications";

import { Barber, HeaderComponent } from "../components/renderItem";

import styles, {
	backgroundcolor,
	headertextcolor,
	darkbackgroundcolor,
} from "../styles";

class Index extends React.PureComponent {
	state = {
		searching: false,
		query: "",
		notification_token: "",
	};

	setSearch = () => {
		this.setState({ searching: true });
	};

	setsearching = () => {
		this.setState({ searching: false, query: "" });
	};

	setQuery = (query) => {
		this.setState({ query });
	};

	search = () => {
		this.setState({ searching: true });
	};

	componentDidMount() {
		this.props.navigation.setOptions({
			headerTitle: "Barbershop",
			headerRight: () => (
				<View style={styles.vstyle2}>
					<IconButton
						icon="magnify"
						color={headertextcolor}
						onPress={this.setSearch}
					/>
				</View>
			),
		});

		this.props.barbers();
		this.props.getAppointments();

		notification_manager(this.props.id, this.props.token)
			.then(() => {})
			.catch((err) => {
				this.props.tokenCheck(err, GET_ERRORS);
			});
	}

	componentDidUpdate() {
		const { searching } = this.state;
		this.props.navigation.setOptions({
			headerTitle: searching ? "" : "Barbershop",
			headerRight: () =>
				searching ? (
					<View style={styles.view1}>
						<IconButton
							color={headertextcolor}
							icon="arrow-left"
							onPress={this.setsearching}
							style={{
								backgroundColor: this.props.darkmode
									? darkbackgroundcolor
									: backgroundcolor,
							}}
						/>
						<TextInput
							placeholderTextColor="lightgrey"
							autoFocus={true}
							style={styles.testyle1}
							autoCapitalize="none"
							returnKeyType="search"
							placeholder="Search"
							value={this.state.query}
							onChangeText={this.setQuery}
						/>
					</View>
				) : (
					<View style={styles.vstyle2}>
						<IconButton
							icon="magnify"
							color={headertextcolor}
							onPress={this.search}
						/>
					</View>
				),
		});
	}

	renderItem = ({ item }) => (
		<Barber item={item} navigation={this.props.navigation} />
	);

	render() {
		const { barberList, barbers, loading } = this.props;
		const { query } = this.state;
		const data = barberList?.filter(
			(barber) =>
				barber.username.toLowerCase().includes(query.toLowerCase()) ||
				barber.location.toLowerCase().includes(query.toLowerCase())
		);
		return (
			<View style={styles.vstyle6}>
				<FlatList
					style={styles.vstyle6}
					refreshing={loading ? loading : false}
					onRefresh={barbers}
					data={data}
					renderItem={this.renderItem}
					keyExtractor={(item) => item.id.toString()}
					ListEmptyComponent={
						<Text style={styles.tstyle10}>No barber found!</Text>
					}
					ListHeaderComponent={<HeaderComponent />}
					ListFooterComponent={
						data?.length != 0 && (
							<Text style={styles.tstyle11}>End Reached!</Text>
						)
					}
				/>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	barberList: state.barbersReducer.barbers,
	loading: state.errorReducer.loading,
	id: state.authReducer.user ? state.authReducer.user.id : null,
	token: state.authReducer.token,
	darkmode: state.themeReducer.darkmode,
});

export default connect(mapStateToProps, {
	barbers,
	getAppointments,
	tokenCheck,
})(Index);
