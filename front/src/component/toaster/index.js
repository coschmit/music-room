import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Toast } from "react-native-ui-lib";
import { View } from "react-native";

const Toaster = (props) => {
  const { msg } = props;
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  }, []);

  return (
    <Toast
      message={msg}
      position="bottom"
      backgroundColor="#2A282A"
      visible={visible}
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
