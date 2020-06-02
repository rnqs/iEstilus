import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Linking,
  Keyboard,
  Platform,
  Animated,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import formatNumberToReal from "../utils/formatNumberToReal";

import {
  tintColor,
  textColor,
  errorColor,
  placeholderTextColor,
  textInputTextColor,
  backgroundColorDarker,
  backgroundColorLighter,
} from "../constants/colors";

const Scheduling = ({ selectedServices, phoneNumber, whatsappAvailable }) => {
  const [userName, setUserName] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalHeight, setTotalHeight] = useState(80);
  const [showButton, setShowButton] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [inAnimation, setInAnimation] = useState(false);
  const [verifyInputs, setVerifyInputs] = useState(false);
  const [chooseOption, setChooseOption] = useState(false);
  const [showChooseOption, setShowChooseOption] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [whatsappOptionSelected, setWhatsappOptionSelected] = useState(false);
  const [showWhatsappOptionSelected, setShowWhatsappOptionSelected] = useState(
    false
  );

  const buttonAnimation = useRef(new Animated.Value(-totalHeight)).current;
  const whatsappOptionSelectedOpacity = useRef(new Animated.Value(0)).current;
  const schedulingOptionsContainerOpacity = useRef(new Animated.Value(1))
    .current;

  useEffect(() => {
    setTotalPrice(
      selectedServices.reduce(
        (acumulador, currentService) =>
          (Number(acumulador) + Number(currentService.price)).toFixed(2),
        0
      )
    );

    if (selectedServices.length !== 0) {
      setShowButton(true);
      setInAnimation(true);
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 150,
      }).start(() => {
        setInAnimation(false);
      });
    } else {
      setInAnimation(true);
      Animated.timing(buttonAnimation, {
        toValue: -totalHeight,
        duration: 150,
      }).start(() => {
        setInAnimation(false);
        setShowButton(false);
      });
    }

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [selectedServices]);

  const handleChooseOptionAnimation = () => {
    setChooseOption(!chooseOption);
    if (!chooseOption) {
      setTotalHeight(275);
      setInAnimation(true);
      setShowChooseOption(true);
      Animated.timing(buttonAnimation, {
        toValue: -194,
        duration: 0,
      }).start();
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 150,
      }).start(() => {
        setInAnimation(false);
      });
    } else {
      setTotalHeight(80);
      setInAnimation(true);
      Animated.timing(buttonAnimation, {
        toValue: -194,
        duration: 150,
      }).start(() => {
        setInAnimation(false);
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: 0,
        }).start(() => {
          setShowChooseOption(false);
        });
      });
    }
  };

  const handleWhatsappOptionSelectedAnimation = () => {
    setWhatsappOptionSelected(!whatsappOptionSelected);
    if (!whatsappOptionSelected) {
      setTotalHeight(382);
      setInAnimation(true);
      Animated.timing(buttonAnimation, {
        toValue: -107,
        duration: 0,
      }).start();
      setShowWhatsappOptionSelected(true);
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 150,
      }).start();
      Animated.timing(whatsappOptionSelectedOpacity, {
        toValue: 1,
        duration: 150,
      }).start(() => {
        Animated.timing(schedulingOptionsContainerOpacity, {
          toValue: 0,
          duration: 0,
        }).start(() => {
          setInAnimation(false);
        });
      });
    } else {
      setTotalHeight(275);
      setInAnimation(true);
      Animated.timing(buttonAnimation, {
        toValue: -107,
        duration: 150,
      }).start();
      Animated.timing(whatsappOptionSelectedOpacity, {
        toValue: 0,
        duration: 150,
      }).start(() => {
        setShowWhatsappOptionSelected(false);
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: 0,
        }).start();
        Animated.timing(schedulingOptionsContainerOpacity, {
          toValue: 1,
          duration: 0,
        }).start(() => setInAnimation(false));
      });
    }
  };

  const handleSendWhatsappMessage = () => {
    setVerifyInputs(true);
    if (userName && scheduleDate) {
      Linking.openURL(
        (Platform.OS === "ios"
          ? `https://wa.me/${phoneNumber}?`
          : `whatsapp://send?phone=${phoneNumber}&`) +
          `text=Olá, meu nome é ${userName} e gostaria de agendar ${selectedServices
            .map((service) => service.name)
            .join(", ")}, ${scheduleDate}`
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: buttonAnimation,
          display: showButton ? "flex" : "none",
          position: inAnimation || isKeyboardVisible ? "absolute" : "relative",
          marginBottom: Platform.OS === "ios" && isKeyboardVisible ? 343 : 0,
        },
      ]}
    >
      <TouchableHighlight
        onPress={() =>
          whatsappOptionSelected
            ? handleWhatsappOptionSelectedAnimation()
            : handleChooseOptionAnimation()
        }
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Agendar</Text>
          <Text style={styles.buttonText}>
            {formatNumberToReal(totalPrice)}
          </Text>
        </View>
      </TouchableHighlight>
      {showWhatsappOptionSelected ? (
        <View
          style={{
            backgroundColor: backgroundColorDarker,
          }}
        >
          <Animated.View
            style={[
              styles.whatsappOptionsSelectedContainer,
              {
                opacity: whatsappOptionSelectedOpacity,
                display: showWhatsappOptionSelected ? "flex" : "none",
              },
            ]}
          >
            <Text style={[styles.text, { marginVertical: 20 }]}>
              Só mais algumas informações:
            </Text>
            <TextInput
              placeholder="Seu nome"
              placeholderTextColor={placeholderTextColor}
              style={[
                styles.textInput,
                verifyInputs && !userName && styles.textInputError,
              ]}
              keyboardAppearance="dark"
              value={userName}
              onChangeText={(text) => setUserName(text)}
            />
            <TextInput
              placeholder="Quando?"
              placeholderTextColor={placeholderTextColor}
              style={[
                styles.textInput,
                verifyInputs && !scheduleDate && styles.textInputError,
              ]}
              keyboardAppearance="dark"
              value={scheduleDate}
              onChangeText={(text) => setScheduleDate(text)}
            />
            <View style={styles.navigationButtonsContainer}>
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={() => handleWhatsappOptionSelectedAnimation()}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  color={textColor}
                  size={48}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.navigationButton,
                  { backgroundColor: tintColor },
                ]}
                onPress={() => handleSendWhatsappMessage()}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  color={textColor}
                  size={48}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      ) : (
        <Animated.View
          style={[
            styles.schedulingOptionsContainer,
            {
              display: showChooseOption ? "flex" : "none",
              opacity: schedulingOptionsContainerOpacity,
            },
          ]}
        >
          {whatsappAvailable && (
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: "#2E8631" }]}
              onPress={() => handleWhatsappOptionSelectedAnimation()}
            >
              <MaterialCommunityIcons
                name="whatsapp"
                size={28}
                color={textColor}
              />
              <Text style={styles.text}>Agendar por WhatsApp</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: "#1D5AB6" }]}
            onPress={() => Linking.openURL("tel:+" + phoneNumber)}
          >
            <Feather name="phone" size={28} color={textColor} />
            <Text style={styles.text}>Agendar por telefone</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  schedulingOptionsContainer: {
    backgroundColor: backgroundColorDarker,
    paddingVertical: 12.5,
  },
  optionButton: {
    height: 60,
    marginHorizontal: 13,
    marginVertical: 12.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  text: {
    fontFamily: "Montserrat-Bold",
    color: textColor,
    marginLeft: 28,
    fontSize: 18,
  },
  whatsappOptionsSelectedContainer: {
    backgroundColor: backgroundColorDarker,
  },
  textInput: {
    height: 45,
    marginHorizontal: 22,
    marginVertical: 7.5,
    color: textInputTextColor,
    backgroundColor: backgroundColorLighter,
    borderRadius: 12,
    fontFamily: "Montserrat-SemiBold",
    paddingLeft: 25,
    fontSize: 20,
  },
  textInputError: {
    borderColor: errorColor,
    borderWidth: 3,
    borderStyle: "solid",
  },
  navigationButtonsContainer: {
    marginTop: 12.5,
    marginBottom: 25,
    paddingHorizontal: 22,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  navigationButton: {
    backgroundColor: backgroundColorLighter,
    padding: 15,
    borderRadius: 25,
  },
});

export default Scheduling;
