import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { SharedElement } from "react-navigation-shared-element";

import {
  backgroundColorLighter,
  backgroundColorDarker,
  textColor,
  tintColor,
} from "../constants/colors";

const ListItem = ({ establishment }) => {
  const [opacity, setOpacity] = useState(1);
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();

  const { id, name, imageUri } = establishment;
  const onPress = () => {
    setOpacity(0);
    navigate("Detail", { establishment });
  };

  useEffect(() => {
    if (isFocused) {
      setOpacity(1);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.descriptionContainer}>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{name}</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>Serviços</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <SharedElement id={id} style={styles.imageContainer}>
        <Image
          style={[styles.imageBackground, { opacity }]}
          source={{ uri: imageUri }}
          resizeMode="cover"
        />
      </SharedElement>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderRadius: 9,
    marginVertical: 7.5,
    backgroundColor: backgroundColorLighter,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  descriptionContainer: {
    zIndex: 2,
    height: 240,
  },
  imageContainer: {
    position: "absolute",
    zIndex: 1,
  },
  imageBackground: {
    width: width - 24,
    height: 240,
    borderRadius: 9,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  name: {
    flex: 1,
    paddingLeft: 15,
    paddingBottom: 10,
    fontFamily: "Montserrat-SemiBold",
    lineHeight: 30,
    fontSize: 22,
    color: textColor,
    textShadowColor: backgroundColorDarker,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
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
    fontWeight: "bold",
    fontSize: 14,
    color: textColor,
  },
});

export default ListItem;
