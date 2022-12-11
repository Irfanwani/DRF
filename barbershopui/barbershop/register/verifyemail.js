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
import { verifyEmail, getEmailCode, logout } from "../redux/actions/actions";

import styles, { backgroundcolor } from "../styles";

import * as Animatable from "react-native-animatable";

class VerifyEmail extends React.Component {
  state = {
    code: "",
  };

  changeCode = (code) => {
    this.setState({ code });
  };

  submit = () => {
    this.props.verifyEmail(this.state.code);
  };

  render() {
    const { error, getEmailCode } = this.props;
    return (
      <ScrollView
        style={styles.sstyle}
        contentContainerStyle={styles.sstyle1}
        keyboardShouldPersistTaps="always"
      >
        <Animatable.View
          useNativeDriver={true}
          animation="zoomIn"
          style={styles.vstyle1}
        >
          <Card elevation={0} style={styles.cstyle4}>
            <Card.Title
              title="Verfiy Email"
              titleStyle={styles.title}
              left={() => (
                <Avatar.Icon
                  icon="email-check"
                  size={30}
                  style={styles.heading}
                />
              )}
            />

            <TextInput
              label="Enter Verification code"
              value={this.state.code}
              onChangeText={this.changeCode}
              left={<TextInput.Icon name="qrcode" />}
            />
            <Text style={styles.error}>{error ? error.message : ""}</Text>

            <Button
              style={styles.button}
              onPress={this.submit}
              mode="contained"
              icon="email-check"
              color={error ? Colors.red700 : backgroundcolor}
            >
              Verify Email
            </Button>

            <Button
              style={styles.tstyle5}
              labelStyle={styles.bstyle1}
              onPress={getEmailCode}
            >
              Get verification code!
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

export default connect(mapStateToProps, { verifyEmail, getEmailCode, logout })(
  VerifyEmail
);
