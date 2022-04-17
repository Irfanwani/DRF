import React from "react";
import { FlatList, View, TextInput } from "react-native";
import { connect } from "react-redux";
import {
	FAB,
	IconButton,
	Text,
	Badge,
	ActivityIndicator,
} from "react-native-paper";
import { barbers, tokenCheck } from "../redux/actions/actions";
import { getAppointments } from "../redux/actions/actions2";
import { FETCH_MORE, GET_ERRORS } from "../redux/actions/types";

import { notification_manager } from "../notifications";

import { Barber, HeaderComponent } from "../components/renderItem";

import { MultiSelect } from "../components/multiselect";

import { data as serviceList } from "./addservices";

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
		visible: false,
		filterCount: 0,
		clearSelection: false,
		removeFilters: false,
		getMoreData: false,
		start: 10,
		end: 20,
		filterType: null,
		selectedServiceFilters: null,
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

	callback = (...rest) => {
		this.setState(rest[0] ? { filterCount: rest[0] } : { filterCount: 0 });
		this.setState({ visible: false });
	};

	callback2 = (cl) => {
		this.setState({ clearSelection: cl, removeFilters: true });
	};

	callback3 = (selectedServiceFilters) => {
		this.setState({ selectedServiceFilters });
	};

	cbfun = (val) => {
		this.setState({ removeFilters: val, clearSelection: true });
	};

	cbfun2 = (filterType) => {
		this.setState({ filterType });
	};

	refresh = () => {
		this.props.barbers();
		this.setState({
			removeFilters: true,
			clearSelection: true,
			filterType: null,
			selectedServiceFilters: null,
		});
	};

	reachedEnd = () => {
		const { getMoreData, start, end, filterType, selectedServiceFilters } =
			this.state;
		if (getMoreData) {
			this.setState(
				(prev) => ({ getMoreData: false, start: prev.end, end: prev.end + 10 }),
				() => {
					this.props.barbers(
						filterType,
						selectedServiceFilters,
						start,
						end,
						FETCH_MORE
					);
				}
			);
		}
	};

	startScroll = () => {
		this.setState({ getMoreData: true });
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

	data = () => {
		const { barberList } = this.props;
		const { query } = this.state;
		if (query) {
			const dt =
				barberList?.length > 0
					? barberList.filter(
							(barber) =>
								barber.username.toLowerCase().includes(query.toLowerCase()) ||
								barber.location.toLowerCase().includes(query.toLowerCase())
					  )
					: [];
			return dt;
		}
		return barberList;
	};

	render() {
		const { fetching } = this.props;
		const { visible, filterCount, clearSelection, removeFilters } = this.state;
		return (
			<View style={styles.vstyle6}>
				<FlatList
					style={styles.vstyle6}
					refreshing={fetching}
					onRefresh={this.refresh}
					data={this.data()}
					renderItem={this.renderItem}
					keyExtractor={(item) => item.id.toString()}
					ListEmptyComponent={
						<Text style={styles.tstyle10}>No barber found!</Text>
					}
					ListHeaderComponent={
						<HeaderComponent
							removeFilters={removeFilters}
							callback={this.cbfun}
							callback2={this.cbfun2}
						/>
					}
					ListFooterComponent={
						this.data()?.length != 0 &&
						(!fetching ? (
							<Text style={styles.tstyle11}>End Reached!</Text>
						) : (
							<ActivityIndicator color="orange" style={styles.tstyle11} />
						))
					}
					onEndReached={this.reachedEnd}
					onEndReachedThreshold={0.1}
					onScrollBeginDrag={this.startScroll}
				/>

				<View style={styles.fab2}>
					<FAB
						icon="filter-outline"
						color="white"
						style={styles.fab3}
						onPress={() => this.setState({ visible: true })}
					/>
					<Badge style={styles.badge}>{filterCount}</Badge>
				</View>
				<MultiSelect
					title="Filter As per Services provided"
					data={serviceList}
					visible={visible}
					callback={this.callback}
					callback2={this.callback2}
					callback3={this.callback3}
					clearSelection={clearSelection}
					barbersFilter={true}
					buttonLabel="Apply Filter"
				/>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	barberList: state.barbersReducer.barbers,
	fetching: state.errorReducer.fetching,
	id: state.authReducer.user ? state.authReducer.user.id : null,
	token: state.authReducer.token,
	darkmode: state.themeReducer.darkmode,
});

export default connect(mapStateToProps, {
	barbers,
	getAppointments,
	tokenCheck,
})(Index);
