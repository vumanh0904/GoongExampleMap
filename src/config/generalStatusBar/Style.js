import { StyleSheet, Platform, StatusBar } from "react-native";
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 0 : 0;
export default StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,

  },
});
