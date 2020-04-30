import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  tintColor,
  textColor,
  backgroundColor,
  backgroundColorLighter,
} from "../constants/colors";

const NewEstablishmentButton = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.lastItem}>
      <Text style={styles.text}>Tem um salão?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("NewEstablishment");
        }}
      >
        <Text style={styles.buttonText}>Adicione ele aqui</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  lastItem: {
    height: 240,
    marginVertical: 7.5,
    borderWidth: 3,
    borderRadius: 9,
    borderColor: tintColor,
    borderStyle: "dashed",
    marginBottom: 90,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor,
  },
  text: {
    color: textColor,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
  },
  button: {
    borderColor: tintColor,
    borderWidth: 1.75,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: backgroundColorLighter,
  },
  buttonText: {
    color: textColor,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
  },
});

export default NewEstablishmentButton;
