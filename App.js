import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';

import Login from "./src/screens/login";
import SeccionFotos from './src/screens/seccionfotos';
import MenuPrincipal from './src/screens/menuprincipal';
import Historial from './src/screens/historial';
import MiPerfil from './src/screens/miperfil';
import ConsultaDetalle from './src/screens/consultadetalle';

import { UserProvider } from '../DermiApp/src/usuario/UserContext';


import { useFonts } from 'expo-font';
import { Raleway_400Regular, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';


const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    DMSans_400Regular,
    DMSans_700Bold,
  });

  // Oculta la pantalla de carga cuando las fuentes estén listas
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Muestra una pantalla vacía hasta que las fuentes estén cargadas
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="menuprincipal" component={MenuPrincipal} options={{ headerShown: false }} />
          <Stack.Screen name="SeccionFotos" component={SeccionFotos} options={{ headerShown: false }} />
          <Stack.Screen name="Historial" component={Historial} options={{ headerShown: false }}/>
          <Stack.Screen name="MiPerfil" component={MiPerfil} options={{ headerShown: false }} />
          <Stack.Screen name="ConsultaDetalle" component={ConsultaDetalle} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfc',
  },
});
