import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
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

import api from "../services/api";

const ListScreen = () => {
  const [establishments, setEstablishments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEstablishmentsData();
  }, []);

  const fetchEstablishmentsData = async () => {
    if (refreshing) {
      return;
    }

    if (total > 0 && establishments.length === total) {
      return;
    }

    setRefreshing(true);

    const response = await api.get("establishments", {
      params: { page },
    });

    setEstablishments([...establishments, ...response.data]);
    setTotal(Number(response.headers["x-total-count"]));
    setPage(page + 1);
    setRefreshing(false);
  };

  const refreshEstablishmentsData = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    const response = await api.get("establishments");

    setEstablishments(response.data);
    setTotal(response.headers["x-total-count"]);
    setPage(page + 1);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent={true}
      />
      <SafeAreaView>
        <SearchBar />
        <FlatList
          data={establishments}
          style={styles.flatList}
          keyExtractor={(establishment) => String(establishment._id)}
          showsVerticalScrollIndicator={false}
          onEndReached={fetchEstablishmentsData}
          onEndReachedThreshold={0.2}
          onRefresh={refreshEstablishmentsData}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshEstablishmentsData}
              progressBackgroundColor={backgroundColorDarker}
              colors={[tintColor]}
              tintColor={tintColor}
              progressViewOffset={67}
            />
          }
          renderItem={({ item }) => (
            <ListItem
              establishment={{
                id: String(item._id),
                name: item.name,
                description: item.description,
                address: item.address,
                coordinate: item.coordinate,
                photo_url: item.photo_url,
                phone_number: item.phone_number,
              }}
            />
          )}
          ListFooterComponent={<NewEstablishmentButton />}
        />
        <NewEstablishmentButton />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
  flatList: {
    height: "100%",
    zIndex: -1,
    top: -48,
    paddingTop: 48,
    marginHorizontal: 12,
  },
});

export default ListScreen;
