import React from "react";
import { ScrollView, View } from "react-native";
import {
  TextInput,
  Text,
  Button,
  Colors,
  Card,
  Avatar,
} from "react-native-paper";

import { connect } from "react-redux";
import { register, logout } from "../redux/actions/actions";

import * as Animatable from "react-native-animatable";

import styles, { backgroundcolor } from "../styles";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordAgain: "",
    passwordMatchError: "",
    hidePassword: true,
  };

  changeUsername = (username) => {
    this.setState({ username });
  };

  changeEmail = (email) => {
    this.setState({ email });
  };

  changePassword = (password) => {
    this.setState({ password });
  };

  changePasswordAgain = (passwordAgain) => {
    this.setState({ passwordAgain });
  };

  hidepass = () => {
    this.setState((prevState) => ({
      hidePassword: !prevState.hidePassword,
    }));
  };

  gotoLogin = () => {
    this.props.navigation.navigate("login");
  };

  submit = () => {
    const { username, email, password, passwordAgain } = this.state;
    if (password !== passwordAgain) {
      this.setState({ passwordMatchError: "Passwords not matching." });
      return;
    }
    this.setState({ passwordMatchError: "" });
    this.props.register({ username, email, password });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordAgain,
      passwordMatchError,
      hidePassword,
    } = this.state;
    const { error } = this.props;
    return (
      <ScrollView style={styles.sstyle} keyboardShouldPersistTaps="always">
        <Animatable.View
          useNativeDriver={true}
          animation="bounceIn"
          style={styles.astyle3}
        >
          <Text style={styles.tag}>Welcome!</Text>
        </Animatable.View>

        <Animatable.View useNativeDriver={true} animation="fadeInUpBig">
          <Card elevation={0} style={styles.cstyle3}>
            <Card.Title
              title="Register"
              titleStyle={styles.title}
              left={() => (
                <Avatar.Icon icon="login" size={30} style={styles.heading} />
              )}
            />
            <View style={styles.vstyle1}>
              <TextInput
                value={username}
                onChangeText={this.changeUsername}
                label="Username"
                left={<TextInput.Icon name="account" />}
                error={error ? (error.username ? true : false) : false}
              />
              <Text style={styles.error}>
                {error ? (error.username ? error.username : "") : ""}
              </Text>

              <TextInput
                value={email}
                onChangeText={this.changeEmail}
                label="Email"
                left={<TextInput.Icon name="at" />}
                error={error ? (error.email ? true : false) : false}
                autoCapitalize="none"
              />
              <Text style={styles.error}>
                {error ? (error.email ? error.email : "") : ""}
              </Text>

              <TextInput
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={this.changePassword}
                label="Password"
                left={<TextInput.Icon name="lock" />}
                right={
                  <TextInput.Icon
                    name={hidePassword ? "eye-off" : "eye"}
                    onPress={this.hidepass}
                  />
                }
                error={error ? (error.password ? true : false) : false}
                autoCapitalize="none"
                keyboardType={hidePassword ? undefined : "visible-password"}
              />
              <Text style={styles.error}>
                {error ? (error.password ? error.password : "") : ""}
              </Text>

              <TextInput
                secureTextEntry={true}
                value={passwordAgain}
                onChangeText={this.changePasswordAgain}
                label="Password Again"
                left={<TextInput.Icon name="lock-check" />}
                error={passwordMatchError ? true : false}
                autoCapitalize="none"
              />
              <Text style={styles.error}>
                {passwordMatchError ? passwordMatchError : ""}
              </Text>

              <Button
                onPress={this.submit}
                style={styles.button}
                mode="contained"
                icon="login"
                color={error ? Colors.red700 : backgroundcolor}
              >
                Register
              </Button>

              <Text style={styles.tstyle5}>Already have an account? </Text>
              <Button onPress={this.gotoLogin} labelStyle={styles.bstyle1}>
                Login Here!
              </Button>
            </View>
          </Card>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.errorReducer.error,
});

export default connect(mapStateToProps, { register, logout })(Register);
