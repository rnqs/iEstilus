import React from "react";
import {
  Platform,
  View,
  Text,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Svg, Rect, Path } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

import {
  tintColor,
  backgroundColor,
  backgroundColorDarker,
} from "../constants/colors";

const WebHeader = () => {
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Svg
          style={styles.logo}
          viewBox="0 0 126 126"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Rect width="125.25" height="125.25" rx="22.7273" fill="#F6A821" />
          <Path
            d="M79.641 91.443C79.0827 100.349 71.6843 107.399 62.6378 107.399C53.5914 107.399 46.1929 100.349 45.6346 91.443H79.641Z"
            fill="white"
          />
          <Path
            d="M80.2542 91.4427H45.0215C43.3527 91.4427 42 90.09 42 88.4213C42 86.7525 43.3527 85.3998 45.0215 85.3998H80.2542C81.923 85.3998 83.2757 86.7525 83.2757 88.4213C83.2757 90.09 81.923 91.4427 80.2542 91.4427Z"
            fill="white"
          />
          <Path
            d="M79.0299 72.2868V59.1703L52.8003 85.4002H65.9166L79.0299 72.2868Z"
            fill="white"
          />
          <Path
            d="M79.03 39.4986H72.4688L46.246 65.7214V78.8378L79.03 46.0537V39.4986Z"
            fill="white"
          />
          <Path
            d="M46.246 39.4986V52.6051L59.3523 39.4986H46.246Z"
            fill="white"
          />
          <Path
            d="M80.2542 33.456H45.0215C43.3527 33.456 42 34.8087 42 36.4774C42 38.1462 43.3527 39.4989 45.0215 39.4989H80.2542C81.923 39.4989 83.2757 38.1462 83.2757 36.4774C83.2757 34.8087 81.923 33.456 80.2542 33.456Z"
            fill="white"
          />
          <Path
            d="M79.641 33.4562C79.0827 24.5506 71.6843 17.5 62.6378 17.5C53.5914 17.5 46.1929 24.5506 45.6346 33.4562H79.641Z"
            fill="white"
          />
          <Path
            d="M79.641 91.443C79.0827 100.349 71.6843 107.399 62.6378 107.399C53.5914 107.399 46.1929 100.349 45.6346 91.443H79.641Z"
            fill="white"
          />
          <Path
            d="M80.2542 91.4427H45.0215C43.3527 91.4427 42 90.09 42 88.4213C42 86.7525 43.3527 85.3998 45.0215 85.3998H80.2542C81.923 85.3998 83.2757 86.7525 83.2757 88.4213C83.2757 90.09 81.923 91.4427 80.2542 91.4427Z"
            fill="white"
          />
          <Path
            d="M79.0299 72.2868V59.1703L52.8003 85.4002H65.9166L79.0299 72.2868Z"
            fill="white"
          />
          <Path
            d="M79.03 39.4986H72.4688L46.246 65.7214V78.8378L79.03 46.0537V39.4986Z"
            fill="white"
          />
          <Path
            d="M46.246 39.4986V52.6051L59.3523 39.4986H46.246Z"
            fill="white"
          />
          <Path
            d="M80.2542 33.456H45.0215C43.3527 33.456 42 34.8087 42 36.4774C42 38.1462 43.3527 39.4989 45.0215 39.4989H80.2542C81.923 39.4989 83.2757 38.1462 83.2757 36.4774C83.2757 34.8087 81.923 33.456 80.2542 33.456Z"
            fill="white"
          />
          <Path
            d="M79.641 33.4562C79.0827 24.5506 71.6843 17.5 62.6378 17.5C53.5914 17.5 46.1929 24.5506 45.6346 33.4562H79.641Z"
            fill="white"
          />
        </Svg>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL("https://iestilus.com")}
        >
          <Feather name="arrow-left" color={tintColor} size={24} />
          <Text style={styles.textButton}>Voltar para o site</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: backgroundColorDarker,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 614,
    paddingHorizontal: 14,
  },
  logo: {
    marginVertical: 5,
    width: 42,
    height: 42,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  textButton: {
    fontFamily: "Montserrat-SemiBold",
    lineHeight: 24,
    fontSize: 16,
    marginLeft: 8,
    color: tintColor,
  },
});

export default WebHeader;
