import React from "react";

import { connect } from "react-redux";
import { Toast } from "react-native-ui-lib";

const Toaster = (props) => {
  const { msg } = props;
  return (
    <Toast
      message={msg}
      position="bottom"
      backgroundColor="#2A282A"
      visible={true}
      actions={[
        {
          label: "Close",
          onPress: () => {
            this.props.dispatch({ type: "client/delNotife" });
          },
        },
      ]}
    />
  );
};

const mapStateToProps = (state) => {
  return { state };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toaster);
