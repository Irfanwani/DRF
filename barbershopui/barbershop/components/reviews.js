import * as Animatable from "react-native-animatable";
import { useRef, useEffect } from "react";
import { FlatList, View } from "react-native";
import styles, { styles2 } from "../styles";
import {
	IconButton,
	Title,
	HelperText,
	Surface,
	useTheme,
	Colors,
	Text,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { Rating } from "react-native-ratings";
import { delReview } from "../redux/actions/actions2";

const Reviews = (props) => {
	const { reviews, username } = useSelector((state) => ({
		reviews: state.reviewReducer.reviews,
		username: state.authReducer.user?.username,
	}));

	const { visible, callback } = props;
	const theme = useTheme();

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current && visible) {
			isFirstRender.current = false;
			return;
		}
	}, [visible]);

	const dispatch = useDispatch();

	const deleteReview = (id) => {
		dispatch(delReview(id, callback));
	};

	const renderItem = ({ item }) => {
		return (
			<Surface style={styles.sustyle}>
				<View style={styles.vstyle2}>
					<Title>{item.user}</Title>
					{item.user == username && (
						<IconButton
							icon="delete"
							color={Colors.red500}
							onPress={() => {
								deleteReview(item.id);
							}}
						/>
					)}
				</View>
				<Rating
					imageSize={15}
					style={styles2.rstyle}
					tintColor={theme.colors.background}
					readonly={true}
					startingValue={item.ratings}
				/>
				<HelperText numberOfLines={8} ellipsizeMode="tail">
					{item.comments ? item.comments : "No Comments!"}
				</HelperText>
			</Surface>
		);
	};

	if (!isFirstRender.current) {
		return (
			<Animatable.View
				useNativeDriver={true}
				duration={500}
				animation={visible ? "bounceInUp" : "bounceOutLeft"}
				style={[styles2.Astyle, { backgroundColor: theme.colors.background }]}
			>
				<IconButton icon="close" style={styles2.ibstyle} onPress={callback} />

				<FlatList
					data={reviews}
					renderItem={renderItem}
					keyExtractor={(item) => item.id.toString()}
					ListEmptyComponent={<Text style={styles.tstyle10}>No Reviews!</Text>}
				/>
			</Animatable.View>
		);
	}

	return null;
};

export default Reviews;
