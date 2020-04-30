import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  placeholderTextColor,
  textInputTextColor,
  backgroundColorLighter,
} from "../constants/colors";

const SearchBar = () => (
  <View style={styles.container}>
    <TextInput
      placeholder="Procure o que deseja"
      placeholderTextColor={placeholderTextColor}
      style={styles.textInput}
    />
    <TouchableOpacity style={styles.touchableOpacity}>
      <MaterialIcons name="menu" color={textInputTextColor} size={32} />
    </TouchableOpacity>
  </View>
);

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    marginVertical: 5,
    marginHorizontal: 12,
    borderRadius: 9,
    backgroundColor: backgroundColorLighter,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 4,
  },
  textInput: {
    width: width - 78,
    height: 50,
    color: textInputTextColor,
    fontFamily: "Montserrat-SemiBold",
    paddingLeft: 25,
    fontSize: 20,
  },
  touchableOpacity: {
    justifyContent: "center",
    alignItems: "center",
    width: 54,
    height: 50,
  },
});

export default SearchBar;
