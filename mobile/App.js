import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "@use-expo/font";
import { AppLoading, Linking } from "expo";

const prefix = Linking.makeUrl("/");

import ListScreen from "./screens/ListScreen";
import DetailScreen from "./screens/DetailScreen";
import NewEstablishmentScreen from "./screens/NewEstablishmentScreen";

import WebHeader from "./components/WebHeader";

const Stack = createSharedElementStackNavigator();

const App = () => {
  let [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  const linking = {
    prefixes: [prefix],
    config: {
      List: "list",
      Detail: "detail",
    },
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <WebHeader />
      <NavigationContainer linking={linking} fallback={<AppLoading />}>
        <Stack.Navigator initialRouteName="List" headerMode="none" mode="modal">
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            sharedElementsConfig={(route) => {
              return [route.params.establishment.id];
            }}
            options={{
              cardStyleInterpolator: ({ current: { progress: opacity } }) => {
                return { cardStyle: { opacity } };
              },
              gestureEnabled: false,
              cardStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
          <Stack.Screen
            name="NewEstablishment"
            component={NewEstablishmentScreen}
            options={{ gestureEnabled: true, gestureDirection: "horizontal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
