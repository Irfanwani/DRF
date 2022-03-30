import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "react-native-paper";

export const backgroundcolor = Colors.teal500;
export const headertextcolor = "white";
export const darkbackgroundcolor = Colors.blueGrey900;

const styles = StyleSheet.create({
	view: {
		justifyContent: "center",
		marginHorizontal: 10,
	},
	heading: {
		backgroundColor: Colors.blueGrey700,
	},
	title: {
		color: Colors.blueGrey500,
		fontSize: 25,
	},
	button: {
		margin: 20,
	},
	error: {
		color: "red",
		fontSize: 10,
		marginBottom: 10,
	},
	forgot: {
		fontSize: 10,
		fontWeight: "100",
	},
	avatar: {
		backgroundColor: "grey",
		alignSelf: "center",
		marginVertical: 10,
		borderColor: "#6b6b47",
		borderWidth: 2,
		overflow: "hidden",
	},
	fab: {
		position: "absolute",
		right: 90,
		bottom: 0,
	},

	fab2: {
		position: "absolute",
		right: 30,
		bottom: 30,
	},

	fab3: {
		backgroundColor: Colors.teal500,
	},

	badge: {
		position: "absolute",
		elevation: 8,
	},

	rbsheet: {
		backgroundColor: "black",
		borderTopEndRadius: 10,
		borderTopStartRadius: 10,
	},
	map: {
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
	},
	dp: {
		margin: 10,
		borderColor: "#6b6b47",
		borderWidth: 1,
		overflow: "hidden",
		backgroundColor: "grey",
	},
	surface: {
		borderRadius: 20,
		padding: 8,
		maxWidth: 200,
		alignItems: "center",
		justifyContent: "center",
		elevation: 8,
	},

	card: {
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		height: (2 * Dimensions.get("window").height) / 3,
	},
	tag: {
		fontFamily: "monospace",
		fontWeight: "bold",
		color: headertextcolor,
		fontSize: 20,
		marginLeft: 10,
		marginTop: 30,
	},
	start: {
		borderRadius: 30,
		padding: 5,
		overflow: "hidden",
		width: 150,
		elevation: 5,
	},
	front: {
		flex: 0.85,
		width: Dimensions.get("window").width * 1.4,
		borderBottomRightRadius: 1000,
		elevation: 3,
	},
	animatedImage: {
		width: "30%",
		height: "100%",
		borderRadius: 10,
		backgroundColor: "lightgrey",
	},
	infoIntro: {
		flexDirection: "row",
		justifyContent: "space-around",
		height: "20%",
		marginVertical: 20,
	},
	dtitle: { color: Colors.red700 },
	bstyle: { marginLeft: 5 },
	dlstyle: { marginLeft: -25 },
	bastyle: { position: "absolute" },
	mview: {
		justifyContent: "center",
		marginHorizontal: 10,
		flex: 1,
	},
	cstyle: {
		position: "absolute",
		width: Dimensions.get("window").width,
		top: 30,
	},
	istyle: {
		height: 80,
		width: 80,
		borderRadius: 40,
		backgroundColor: "grey",
	},
	tstyle: { color: headertextcolor },
	hstyle: { padding: 0, color: headertextcolor },
	fstyle: {
		position: "absolute",
		top: 10,
		right: 10,
		elevation: 0,
	},
	vstyle: {
		position: "absolute",
		bottom: 5,
		width: "100%",
		alignContent: "center",
	},
	bustyle: { flexDirection: "row-reverse" },
	sstyle: { backgroundColor: backgroundcolor },
	astyle: {
		height: Dimensions.get("window").height / 6 + 32,
	},
	tstyle1: {
		fontFamily: "monospace",
		fontWeight: "bold",
		color: headertextcolor,
		fontSize: 20,
		marginLeft: 10,
		marginTop: 30,
		textAlign: "center",
	},
	cstyle1: { borderTopRightRadius: 30, borderTopLeftRadius: 30 },
	vstyle1: { marginHorizontal: 10 },
	ccstyle: {
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	fstyle1: { backgroundColor: Colors.green600 },
	fstyle2: { backgroundColor: Colors.pink800 },
	fstyle3: { backgroundColor: Colors.red600 },
	fstyle4: {
		alignSelf: "flex-end",
		backgroundColor: Colors.pink300,
		marginTop: 10,
	},
	fstyle5: {
		position: "absolute",
		right: 20,
		bottom: 20,
		backgroundColor: Colors.blueGrey800,
	},
	fstyle6: {
		position: "absolute",
		bottom: 20,
		alignSelf: "center",
		backgroundColor: Colors.green600,
	},

	tstyle2: {
		color: "red",
		fontSize: 10,
		marginBottom: 10,
		alignSelf: "center",
	},

	astyleA: { position: "absolute", right: 13, top: 18, zIndex: 1 },
	astyleD: { display: "none" },

	vstyle2: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	vstyle3: {
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	vstyle4: { flexDirection: "row", alignItems: "center" },
	vstyle5: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 10,
	},
	vstyle6: { flex: 1 },
	lgstyle: { flex: 1, borderBottomRightRadius: 1000 },

	istyle1: { width: Dimensions.get("window").width },

	tstyle3: {
		textAlign: "center",
		color: "white",
		position: "absolute",
		bottom: "10%",
		textAlignVertical: "center",
		width: "60%",
		marginLeft: "5%",
	},

	astyle1: { position: "absolute", bottom: 40, right: 20 },

	astyle2: {
		height: Dimensions.get("window").height / 3 + 32,
		alignItems: "center",
		justifyContent: "center",
	},

	tstyle4: { color: Colors.blue500 },
	tstyle5: { alignSelf: "center" },

	bstyle1: { fontSize: 10 },

	sstyle1: { justifyContent: "center", flex: 1 },

	cstyle2: { borderRadius: 30, marginHorizontal: 5 },

	astyle3: {
		height: Dimensions.get("window").height / 6 + 32,
		marginLeft: 10,
	},

	cstyle3: {
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		height: (2 * Dimensions.get("window").height) / 3,
		height: Dimensions.get("window").height / 1.2,
	},

	cstyle4: { borderRadius: 30 },

	vstyle7: {
		padding: 5,
		flexDirection: "row",
		justifyContent: "space-between",
	},

	vstyle8: { flexDirection: "row", flexShrink: 1 },

	tstyle6: { paddingVertical: 10, flexShrink: 1 },

	testyle: { width: 100 },

	vstyle9: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 10,
	},

	vstyle10: { paddingBottom: 50, paddingTop: 30 },

	bstyle2: { marginBottom: 40, marginTop: 10, alignSelf: "center" },

	bstyle3: { marginRight: 3 },

	sustyle: {
		padding: 10,
		margin: 10,
		borderRadius: 10,
		height: Dimensions.get("window").height / 3.5,
	},

	vstyle11: { position: "absolute", top: 5, right: 5 },

	tistyle: { marginBottom: 3 },

	vstyle12: { position: "absolute", bottom: 5, left: 5, width: "100%" },

	tstyle7: { fontWeight: "bold" },

	vstyle13: {
		position: "absolute",
		flexDirection: "row",
		bottom: 15,
		right: 5,
	},

	tstyle8: { color: Colors.grey400, alignSelf: "center", marginTop: 30 },

	cstyle5: { justifyContent: "center", paddingVertical: 10 },

	tstyle9: {
		alignSelf: "center",
		color: backgroundcolor,
		fontWeight: "bold",
	},

	view1: {
		flexDirection: "row",
		width: Dimensions.get("window").width - 10,
	},

	testyle1: {
		color: headertextcolor,
		width: Dimensions.get("window").width,
	},

	tstyle10: {
		alignSelf: "center",
		marginTop: 30,
		color: Colors.grey400,
	},

	tstyle11: { color: Colors.grey500, alignSelf: "center", marginBottom: 30 },

	view2: { flexDirection: "row", justifyContent: "flex-start" },

	istyle2: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").width,
	},

	tostyle: { justifyContent: "center", flexShrink: 1 },

	text1: { color: backgroundcolor },

	view3: { flex: 1, paddingTop: 20 },

	view4: { margin: 10 },

	sstyle2: { height: Dimensions.get("window").height / 7 },

	text2: {
		marginVertical: 5,
		marginLeft: 5,
		width: Dimensions.get("window").width / 1.2,
	},

	text3: { marginVertical: 5, marginLeft: 5 },

	tostyle1: {
		alignItems: "center",
		borderRadius: 15,
		overflow: "hidden",
		elevation: 3,
	},

	fstyle7: {
		alignSelf: "center",
		margin: 10,
		backgroundColor: Colors.green800,
	},

	fstyle8: {
		position: "absolute",
		bottom: 120,
		right: 10,
		backgroundColor: "lightgrey",
	},

	fstyle9: {
		position: "absolute",
		bottom: 70,
		right: 10,
		backgroundColor: "lightgrey",
	},

	cstyle6: {
		justifyContent: "center",
		marginHorizontal: 10,
		padding: 10,
		flex: 0.95,
	},

	bstyle4: { marginVertical: 10 },
	bstyle5: { marginHorizontal: 5 },

	view5: { flexDirection: "row", justifyContent: "flex-end" },

	flstyle: { height: 250 },

	sstyle3: {
		paddingBottom: 20,
		paddingTop: 30,
		marginHorizontal: 5,
	},

	testyle2: { marginBottom: 5 },

	view6: { flexDirection: "row", alignSelf: "center" },

	hestyle: { paddingVertical: 10 },

	bstyle6: { marginTop: 5, alignSelf: "center" },

	view7: { marginBottom: 20 },

	ctstyle: { color: "cyan" },

	tostyle2: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		padding: 20,
	},

	view8: { width: "70%" },

	bstyle7: { alignSelf: "flex-start" },

	view9: { position: "absolute", bottom: 5, width: "100%" },
});

export default styles;

export const styles2 = StyleSheet.create({
	container: {
		elevation: 5,
	},
	buttonCancel: {
		backgroundColor: "grey",
	},

	buttonConfirm: { ...styles.fstyle3, paddingHorizontal: 5 },

	title: { color: Colors.green600 },
	title2: { color: Colors.red600 },

	flashstyle: { paddingTop: 40 },

	flashstyle2: { marginHorizontal: 30, marginBottom: 10, borderRadius: 10 },

	footerstyle: { paddingBottom: 50 },

	vstyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
		flexShrink: 1,
		marginHorizontal: 5,
	},

	tstyle: { flexShrink: 1 },

	tistyle: { width: 100 },

	filterstyles: {
		margin: 3,
	},

	divider: { marginVertical: 5 }
});
