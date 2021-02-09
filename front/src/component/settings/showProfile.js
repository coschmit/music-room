import React, { useEffect, useState } from "react";

import { View, Text } from "react-native-ui-lib";

import { callApi } from "../../utils/callApi";
import jwtDecode from "jwt-decode";

const ShowProfile = (props) => {
  const [user, setUser] = useState({});
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    console.log("useEffect", props.email);
    callApi(`user/${props.email}`, "get").then((body) => {
      console.log("callApi then");
      const user01 = jwtDecode(body.token);
      const index = user01.friends.findIndex((e) => e === this.props.myEmail);
      let isFriend01 = false;
      if (index !== -1 || user01.isPrivateInfo) {
        isFriend01 = true;
      }
      console.log("user01 isFriend01", user01, isFriend01);

      setUser(user01);
      setIsFriend(isFriend01);
    });
  }, []);
  return (
    <View style={{ height: "90%", width: "100%" }}>
      {!!user && isFriend ? (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 50,
          }}
        >
          <Text>{`Name: ${user.firstName}`}</Text>
          <Text>{`Last Name: ${user.lastName}`}</Text>
          <Text>{`Email: ${user.email}`}</Text>
          <Text>{`MusicTag: ${user.musicTags}`}</Text>
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 50,
          }}
        >
          <Text>
            {"This user is not ready to share is private information"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ShowProfile;
