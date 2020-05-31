import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  placeholderTextColor,
  textInputTextColor,
  backgroundColorLighter,
} from "../constants/colors";

const SearchBar = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Procure o que deseja"
        placeholderTextColor={placeholderTextColor}
        style={styles.textInput}
        keyboardAppearance="dark"
        keyboardType="web-search"
        {...props}
      />
      <TouchableOpacity style={[styles.touchableOpacity, { display: "none" }]}>
        <MaterialIcons name="menu" color={textInputTextColor} size={32} />
      </TouchableOpacity>
    </View>
  );
};

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
    zIndex: 1,
  },
  textInput: {
    flex: 1,
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
