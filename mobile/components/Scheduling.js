import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import formatNumberToReal from "../utils/formatNumberToReal";

import {
  tintColor,
  textColor,
  placeholderTextColor,
  textInputTextColor,
  backgroundColorLighter,
} from "../constants/colors";

const Scheduling = ({ selectedServices }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(
      selectedServices.reduce(
        (acumulador, currentService) =>
          (Number(acumulador) + Number(currentService.price)).toFixed(2),
        0
      )
    );
  }, [selectedServices]);

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={
          selectedServices.length !== 0
            ? { display: "flex" }
            : { display: "none" }
        }
        onPress={() => {
          alert("Total: " + totalPrice);
        }}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Agendar</Text>
          <Text style={styles.buttonText}>
            {formatNumberToReal(totalPrice)}
          </Text>
        </View>
      </TouchableHighlight>
      <View style={styles.schedulingOptionsContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  schedulingContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    height: 80,
    backgroundColor: tintColor,
  },
  buttonText: {
    fontFamily: "Montserrat-Bold",
    color: textColor,
    fontSize: 24,
  },
});

export default Scheduling;
