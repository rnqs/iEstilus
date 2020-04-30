import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  Extrapolate,
  and,
  block,
  call,
  cond,
  eq,
  interpolate,
  set,
  useCode,
} from "react-native-reanimated";
import {
  onGestureEvent,
  snapPoint,
  timing,
  useValues,
} from "react-native-redash";
import { useMemoOne } from "use-memo-one";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";
import { MaterialIcons } from "@expo/vector-icons";

import {
  backgroundColor,
  backgroundColorLighter,
  backgroundColorDarker,
  textColor,
  tintColor,
  tintColorDarker,
} from "../constants/colors";

const DetailScreen = ({ navigation, route }) => {
  const { id, name, imageUri } = route.params.establishment;
  const [finalPrice, setFinalPrice] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [services, setServices] = useState(
    route.params.establishment.services || []
  );

  const [
    translationX,
    translationY,
    velocityY,
    translateX,
    translateY,
    snapBack,
    state,
  ] = useValues([0, 0, 0, 0, 0, 0, State.UNDETERMINED], []);
  const snapTo = snapPoint(translationY, velocityY, [0, height]);
  const scale = interpolate(translateY, {
    inputRange: [0, height / 2],
    outputRange: [1, 0.75],
    extrapolate: Extrapolate.CLAMP,
  });
  const gestureHandler = useMemoOne(
    () => onGestureEvent({ translationX, translationY, velocityY, state }),
    [state, translationX, translationY, velocityY]
  );

  useCode(
    () =>
      block([
        cond(
          and(eq(state, State.END), eq(snapTo, height), eq(snapBack, 0)),
          set(snapBack, 1)
        ),
        cond(
          snapBack,
          call([], () => navigation.navigate("List")),
          cond(
            eq(state, State.END),
            [
              set(
                translateX,
                timing({ from: translationX, to: 0, duration: 250 })
              ),
              set(
                translateY,
                timing({ from: translationY, to: 0, duration: 250 })
              ),
            ],
            [set(translateX, translationX), set(translateY, translationY)]
          )
        ),
      ]),
    []
  );

  useEffect(() => {
    if (finalPrice > 0) {
      setButtonVisible(true);
    } else {
      setButtonVisible(false);
    }
  }, [finalPrice]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor + "75"}
        translucent={true}
      />
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }, { translateY }, { scale }],
            backgroundColor,
          }}
        >
          <View style={styles.header}>
            <SharedElement id={id}>
              <Image
                style={styles.imageBackground}
                source={{ uri: imageUri }}
                resizeMode="cover"
              />
            </SharedElement>
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => {
                  navigation.navigate("List");
                }}
              >
                <MaterialIcons name="close" size={32} color={textColor} />
              </TouchableOpacity>
              <Text style={styles.name}>{name}</Text>
            </View>
          </View>
          <View style={styles.servicesContainer}>
            <ScrollView style={styles.scrollView}>
              {services.map((service, serviceIndex) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    let newServices = [];
                    services.map((service, index) => {
                      if (index === serviceIndex) {
                        newServices.push({
                          ...service,
                          selected: !service.selected,
                        });
                      } else {
                        newServices.push(service);
                      }
                    });
                    if (newServices[serviceIndex].selected) {
                      setFinalPrice(
                        finalPrice + newServices[serviceIndex].price
                      );
                    } else {
                      setFinalPrice(
                        finalPrice - newServices[serviceIndex].price
                      );
                    }
                    setServices(newServices);
                  }}
                  key={serviceIndex}
                >
                  <View style={styles.serviceContainer}>
                    <View
                      style={[
                        styles.serviceContent,
                        service.selected ? styles.serviceContentSelected : null,
                      ]}
                    >
                      <Text style={styles.serviceText}>{service.name}</Text>
                      <Text style={styles.serviceText}>
                        {service.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
            <TouchableHighlight
              style={buttonVisible ? { display: "flex" } : { display: "none" }}
              onPress={() => {
                alert("Total: " + finalPrice);
              }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Agendar</Text>
                <Text style={styles.buttonText}>
                  {finalPrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    position: "absolute",
    width,
    height: height / 2.11,
  },
  contentContainer: {
    height: height / 2.11,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  buttonClose: {
    position: "absolute",
    marginLeft: 10,
    top: 30,
  },
  servicesContainer: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  serviceContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  serviceContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: backgroundColorLighter,
    height: 90,
    borderRadius: 9,
    marginHorizontal: 12,
    marginTop: 12,
  },
  serviceContentSelected: {
    backgroundColor: tintColorDarker,
  },
  serviceText: {
    fontFamily: "Montserrat-Bold",
    color: textColor,
    fontSize: 18,
  },
  button: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    width,
    height: 80,
    backgroundColor: tintColor,
  },
  buttonText: {
    fontFamily: "Montserrat-Bold",
    color: textColor,
    fontSize: 24,
  },
});

export default DetailScreen;
