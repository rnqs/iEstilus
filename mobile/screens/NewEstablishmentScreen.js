import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import Icon from "@expo/vector-icons/Feather";

import { backgroundColor, tintColor, textColor } from "../constants/colors";

const removeGoogleLoginButton = `
    document.querySelector('.google-register').remove();
    document.querySelector('h3').remove();
`;

const NewEstablishmentScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const webViewRef = useRef();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor + "75"}
        translucent={true}
      />
      <WebView
        source={{ uri: "http://iestilus.com/cadastro" }}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        ref={(ref) => (webViewRef.current = ref)}
        style={styles.webView}
        injectedJavaScript={removeGoogleLoginButton}
      />
      {isLoading && <Loading />}
      {error && <Error webViewRef={webViewRef} setError={setError} />}
    </View>
  );
};

const Loading = () => (
  <View style={styles.absoluteContainer}>
    <ActivityIndicator
      size={Platform.OS === "ios" ? "large" : 60}
      color={tintColor}
    />
  </View>
);

const Error = ({ webViewRef, setError }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.absoluteContainerError}>
      <View style={styles.infoContainer}>
        <Text style={styles.titleText}>Algo deu errado...</Text>
        <Text style={styles.text}>
          Verifique sua conexão com a internet e
          <Text
            style={styles.link}
            onPress={() => {
              webViewRef.current.reload();
              setError(false);
            }}
          >
            {" "}
            tente novamente
          </Text>
          .
        </Text>
        <Text style={styles.text}>
          Se o erro persistir tente cadastrar-se em nosso site.
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("http://iestilus.com/cadastro")}
        >
          iestilus.com/cadastro
        </Text>
      </View>
      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-down" color={textColor} size={48} />
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
  webView: {
    flex: 1,
    backgroundColor,
  },
  absoluteContainer: {
    position: "absolute",
    width,
    height,
    backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteContainerError: {
    position: "absolute",
    width,
    height,
    backgroundColor,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  titleText: {
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    color: textColor,
    fontSize: 22,
    marginHorizontal: 12,
    marginBottom: 40,
  },
  text: {
    fontFamily: "Montserrat",
    textAlign: "center",
    color: textColor,
    fontSize: 18,
    marginHorizontal: 18,
    marginTop: 18,
  },
  link: {
    fontFamily: "Montserrat-SemiBold",
    color: tintColor,
    fontSize: 18,
    textAlign: "center",
  },
  returnButton: {
    backgroundColor: tintColor,
    padding: 15,
    borderRadius: 25,
  },
});

export default NewEstablishmentScreen;
