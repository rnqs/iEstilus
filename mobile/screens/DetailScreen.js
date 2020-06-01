import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Linking,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
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
import { MaterialIcons, Feather } from "@expo/vector-icons";

import formatNumberToReal from "../utils/formatNumberToReal";

import Scheduling from "../components/Scheduling";

import api from "../services/api";

import {
  backgroundColor,
  backgroundColorLighter,
  backgroundColorDarker,
  textColor,
  tintColor,
  tintColorDarker,
} from "../constants/colors";

const DetailScreen = ({ navigation, route }) => {
  const {
    id,
    name,
    description,
    address,
    coordinate,
    photo_url,
    phone_number,
    whatsapp_available,
  } = route.params.establishment;
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

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
    if (services.length === 0) {
      fetchServicesData();
    }
  }, []);

  const fetchServicesData = async () => {
    const response = await api.get(`/establishments/${id}/services`);

    setServices(response.data);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor + "75"}
        translucent={true}
      />
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX }, { translateY }, { scale }],
          backgroundColor,
        }}
      >
        <PanGestureHandler {...gestureHandler}>
          <Animated.View style={styles.header}>
            <SharedElement id={id}>
              <Image
                style={styles.imageBackground}
                source={{ uri: photo_url }}
                resizeMode="cover"
              />
            </SharedElement>
            <View style={styles.contentContainer}>
              <View style={styles.contentTop}>
                <Text style={styles.name}>{name}</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => {
                    navigation.navigate("List");
                  }}
                >
                  <MaterialIcons name="close" size={32} color={textColor} />
                </TouchableOpacity>
              </View>
              <View style={styles.contentBottom}>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.containerIcons}>
                  <TouchableOpacity
                    style={styles.buttonClose}
                    onPress={() => {
                      Linking.openURL("tel:+" + phone_number);
                    }}
                  >
                    <Feather name="phone" size={28} color={textColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonClose}
                    onPress={() => {
                      Linking.openURL(
                        Platform.OS === "android"
                          ? `http://www.google.com/maps/place/${address}/@${coordinate.longitude},${coordinate.latitude},10z`
                          : `http://maps.apple.com/?q=${address}&sll=${coordinate.longitude},${coordinate.latitude}&z=10`
                      );
                    }}
                  >
                    <Feather name="map-pin" size={28} color={textColor} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
        <View style={styles.servicesContainer}>
          {services.length === 0 ? (
            <ActivityIndicator
              color={tintColor}
              size={"large"}
              style={{ marginVertical: "50%" }}
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              {services.map((service) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    const isSelected =
                      selectedServices.length !== 0 &&
                      selectedServices.find(
                        (selectedService) => selectedService === service
                      );

                    if (!isSelected) {
                      setSelectedServices([...selectedServices, service]);
                    } else {
                      setSelectedServices(
                        selectedServices.filter(
                          (selectedService) => selectedService !== service
                        )
                      );
                    }
                  }}
                  key={service._id}
                >
                  <View style={styles.serviceContainer}>
                    <View
                      style={[
                        styles.serviceContent,
                        selectedServices.find(
                          (selectedService) => selectedService === service
                        ) && styles.serviceContentSelected,
                      ]}
                    >
                      {service.photo_url && (
                        <Image
                          style={styles.serviceImage}
                          source={{ uri: service.photo_url }}
                          resizeMode="cover"
                        />
                      )}
                      <Text
                        style={[
                          styles.serviceText,
                          service.photo_url && { marginRight: "auto" },
                        ]}
                      >
                        {service.name}
                      </Text>
                      <Text style={styles.serviceText}>
                        {formatNumberToReal(service.price)}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          )}
          <Scheduling
            phoneNumber={phone_number}
            whatsappAvailable={whatsapp_available}
            {...{ selectedServices }}
          />
        </View>
      </Animated.View>
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
    height: height / 2.75,
    zIndex: -1,
  },
  contentContainer: {
    top: 0,
    height: height / 2.75,
    justifyContent: "space-between",
    zIndex: 2,
  },
  contentTop: {
    marginTop: 35,
    flexDirection: "row",
  },
  buttonClose: {
    marginRight: 16,
  },
  contentBottom: {
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  description: {
    maxWidth: width - 44,
    paddingLeft: 16,
    alignSelf: "center",
    fontFamily: "Montserrat-SemiBold",
    color: textColor,
    fontSize: 16,
  },
  containerIcons: {
    height: 90,
    justifyContent: "space-around",
  },
  servicesContainer: {
    flex: 1,
    zIndex: 2,
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
    backgroundColor: backgroundColorLighter,
    height: 90,
    borderRadius: 9,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  serviceContentSelected: {
    backgroundColor: tintColorDarker,
  },
  serviceText: {
    fontFamily: "Montserrat-Bold",
    color: textColor,
    marginHorizontal: 15,
    fontSize: 18,
  },
  serviceImage: {
    borderBottomLeftRadius: 9,
    borderTopLeftRadius: 9,
    width: "25%",
    height: "100%",
    backgroundColor: backgroundColorDarker,
  },
});

export default DetailScreen;
