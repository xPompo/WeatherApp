import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import * as Location from "expo-location";

import Navigation from "./navigation/Navigation";

export default function App() {
  const API_KEY = "e9665667721498ca320756a25fad07c5";
  // const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast?";
  const [isReady, setIsReady] = useState(false);
  const [unitSystem, setUnitSystem] = useState("metric");
  const [errMsg, setErrMsg] = useState(null);
  const [weatherData, setWeatherData] = useState();

  useEffect(() => {
    load();
  }, [unitSystem]);

  const load = async () => {
    await Font.loadAsync({
      regular: require("./assets/Fonts/regular.ttf"),
      bold: require("./assets/Fonts/bold.ttf"),
    });
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrMsg("you dont have acess to location  " + status);
      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getLastKnownPositionAsync({ accuracy: 1 });
    console.log(latitude, longitude);
    // fetch data weather  //
    // const URL_FETCH = `${BASE_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${API_KEY}`;
    const URL = `${BASE_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${API_KEY}`;
    const res = await fetch(URL);
    const result = await res.json();
    if (res.ok) {
      setWeatherData(result);
    }
  };
  console.log(weatherData);

  if (!isReady) {
    return (
      <View>
        <AppLoading
          startAsync={load}
          onFinish={() => setIsReady(true)}
          onError={(err) => console.log(err)}
        />
      </View>
    );
  } else {
    return (
      <Navigation
        weatherData={weatherData}
        unitSystem={unitSystem}
        setUnitSystem={setUnitSystem}
      />
    );
  }
}
