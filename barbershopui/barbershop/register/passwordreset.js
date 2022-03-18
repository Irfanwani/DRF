import React from "react";
import { ScrollView } from "react-native";
import {
	Text,
	TextInput,
	Button,
	Card,
	Colors,
	Avatar,
} from "react-native-paper";
import { connect } from "react-redux";
import { passwordResetCode, passwordReset } from "../redux/actions/actions";

import styles, { backgroundcolor } from "../styles";

import * as Animatable from "react-native-animatable";

class PasswordReset extends React.Component {
	state = {
		email: "",
		code: "",
		password: "",
		hidePassword: true,
	};

	changeEmail = (email) => {
		this.setState({ email });
	};

	changeCode = (code) => {
		this.setState({ code });
	};

	changePassword = (password) => {
		this.setState({ password });
	};

	hidepass = () => {
		this.setState((prevState) => ({
			hidePassword: !prevState.hidePassword,
		}));
	};

	render() {
		const { error } = this.props;
		const { email, code, password, hidePassword } = this.state;
		return (
			<ScrollView
				contentContainerStyle={styles.sstyle1}
				style={styles.sstyle}
				keyboardShouldPersistTaps="always"
			>
				<Animatable.View animation="bounceIn" useNativeDriver={true}>
					<Card style={styles.cstyle2} elevation={0}>
						<Card.Title
							title="Password Reset"
							titleStyle={styles.title}
							left={() => (
								<Avatar.Icon
									icon="lock-reset"
									size={30}
									style={styles.heading}
								/>
							)}
						/>

						<Text style={styles.error}>
							{error ? (error.message ? error.message : "") : ""}
						</Text>

						<TextInput
							autoCapitalize="none"
							value={email}
							onChangeText={this.changeEmail}
							label="Registered email"
							left={<TextInput.Icon name="at" />}
							error={error ? (error.email_error ? true : false) : false}
						/>
						<Text style={styles.error}>
							{error ? (error.email_error ? error.email_error : "") : ""}
						</Text>

						<Button
							color={backgroundcolor}
							onPress={() => this.props.passwordResetCode({ email })}
							icon="qrcode-plus"
						>
							Get Verification code
						</Button>

						<TextInput
							autoCapitalize="none"
							value={code}
							onChangeText={this.changeCode}
							label="Verification code"
							left={<TextInput.Icon name="qrcode" />}
							error={error ? (error.code ? true : false) : false}
						/>
						<Text style={styles.error}>
							{error ? (error.code ? error.code : "") : ""}
						</Text>

						<TextInput
							autoCapitalize="none"
							secureTextEntry={hidePassword}
							value={password}
							onChangeText={this.changePassword}
							label="New password"
							left={<TextInput.Icon name="lock-reset" />}
							right={
								<TextInput.Icon
									name={hidePassword ? "eye-off" : "eye"}
									onPress={this.hidepass}
								/>
							}
							keyboardType={hidePassword ? undefined : "visible-password"}
						/>

						<Button
							onPress={() =>
								this.props.passwordReset({ email, code, password })
							}
							icon="lock-reset"
							mode="contained"
							style={styles.button}
							color={error ? Colors.red700 : backgroundcolor}
						>
							Reset password
						</Button>
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

const mapStateToProps = (state) => ({
	error: state.errorReducer.error,
});

export default connect(mapStateToProps, { passwordResetCode, passwordReset })(
	PasswordReset
);
