import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  tintColor,
  backgroundColor,
  backgroundColorDarker,
} from "../constants/colors";
import NewEstablishmentButton from "../components/NewEstablishmentButton";
import SearchBar from "../components/SearchBar";
import ListItem from "../components/ListItem";

const establishments = [
  {
    id: "1",
    name: "Barbearia do Seu Jorge",
    description:
      "Lorem ipsum dolor sit amet, nsectetur adipiscing elit. Suspendisse et lentesque nibh. Cras tempus lectus. 1 ",
    coordinate: {
      x: -3.8709,
      y: -8.6001,
    },
    address: "Brazil",
    imageUri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.polishperfect.co%2Fwp-content%2Fuploads%2F2016%2F09%2Fblow-dry-bar-del-mar-chairs-counter-853427.jpg&f=1&nofb=1",
    services: [
      {
        name: "Corte Simples",
        price: 12.99,
      },
      {
        name: "Moicano",
        price: 18.99,
        photoUrl: "",
      },
    ],
  },
  {
    id: "2",
    name: "Barbearia do Seu Jorge",
    description:
      "Lorem ipsum dolor sit amet, nsectetur adipiscing elit. Suspendisse et lentesque nibh. Cras tempus lectus. ",
    imageUri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.polishperfect.co%2Fwp-content%2Fuploads%2F2016%2F09%2Fblow-dry-bar-del-mar-chairs-counter-853427.jpg&f=1&nofb=1",
  },
  {
    id: "3",
    name: "Barbearia do Seu Jorge",
    imageUri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.polishperfect.co%2Fwp-content%2Fuploads%2F2016%2F09%2Fblow-dry-bar-del-mar-chairs-counter-853427.jpg&f=1&nofb=1",
  },
  {
    id: "4",
    name: "Barbearia do Seu Jorge",
    imageUri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.polishperfect.co%2Fwp-content%2Fuploads%2F2016%2F09%2Fblow-dry-bar-del-mar-chairs-counter-853427.jpg&f=1&nofb=1",
  },
];

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const ListScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(500).then(() => setRefreshing(false));
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent={true}
      />
      <SafeAreaView>
        <SearchBar />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressBackgroundColor={backgroundColorDarker}
              colors={[tintColor]}
              tintColor={tintColor}
              progressViewOffset={67}
            />
          }
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {establishments.map((establishment, index) => (
            <ListItem key={index} {...{ establishment }} />
          ))}
          <NewEstablishmentButton />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
  scrollView: {
    zIndex: -1,
    top: -48,
    paddingTop: 48,
    marginHorizontal: 12,
  },
});

export default ListScreen;
