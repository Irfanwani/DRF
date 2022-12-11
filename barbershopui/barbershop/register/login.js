import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  TextInput,
  Text,
  Button,
  Colors,
  Card,
  Avatar,
} from "react-native-paper";

import { connect } from "react-redux";
import { login } from "../redux/actions/actions";

import styles, { backgroundcolor } from "../styles";

import * as Animatable from "react-native-animatable";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    hidePassword: true,
  };

  changeUsername = (username) => {
    this.setState({ username });
  };

  changePassword = (password) => {
    this.setState({ password });
  };

  submit = () => {
    const { username, password } = this.state;
    this.props.login({ username, password });
  };

  gotoPasswordReset = () => {
    this.props.navigation.navigate("passwordreset");
  };

  gotoRegister = () => {
    this.props.navigation.navigate("register");
  };

  render() {
    const { username, password, hidePassword } = this.state;
    const { error } = this.props;
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.sstyle}>
        <Animatable.View
          useNativeDriver={true}
          animation="bounceIn"
          style={styles.astyle2}
        >
          <Avatar.Image
            style={styles.sstyle}
            source={require("../../assets/icon.png")}
            size={150}
          />
        </Animatable.View>

        <Animatable.View useNativeDriver={true} animation="fadeInUpBig">
          <Card elevation={0} style={styles.card}>
            <Card.Title
              title="Login"
              titleStyle={styles.title}
              left={() => (
                <Avatar.Icon icon="login" size={30} style={styles.heading} />
              )}
            />
            <View style={styles.vstyle1}>
              <Text style={styles.error}>
                {error
                  ? error.non_field_errors
                    ? error.non_field_errors
                    : ""
                  : ""}
              </Text>

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
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={this.changePassword}
                label="Password"
                left={<TextInput.Icon name="lock" />}
                right={
                  <TextInput.Icon
                    name={hidePassword ? "eye-off" : "eye"}
                    onPress={() =>
                      this.setState((prevState) => ({
                        hidePassword: !prevState.hidePassword,
                      }))
                    }
                  />
                }
                error={error ? (error.password ? true : false) : false}
                keyboardType={hidePassword ? undefined : "visible-password"}
              />

              <View style={styles.vstyle2}>
                <Text style={styles.error}>
                  {error ? (error.password ? error.password : "") : ""}
                </Text>

                <TouchableOpacity
                  onPress={this.gotoPasswordReset}
                  style={styles.forgot}
                >
                  <Text style={styles.tstyle4}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <Button
                onPress={this.submit}
                style={styles.button}
                mode="contained"
                icon="login"
                color={error ? Colors.red700 : backgroundcolor}
              >
                Login
              </Button>

              <Text style={styles.tstyle5}>Don't have an account? </Text>
              <Button onPress={this.gotoRegister} labelStyle={styles.bstyle1}>
                Register Here!
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

export default connect(mapStateToProps, { login })(Login);
