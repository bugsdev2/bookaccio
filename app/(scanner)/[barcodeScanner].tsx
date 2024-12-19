import { Button, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyleSheet } from '../defaultStyleSheet';
import { Colors } from '@/constants/Colors';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useDarkModeContext } from '@/providers/themeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BarcodeScanner = () => {
  const { barcodeScanner }: { barcodeScanner: 'READ' | 'READING' | 'READ_LATER' } = useLocalSearchParams();

  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [torch, setTorch] = useState(false);

  const [selectedBook, setSelectedBook] = useSelectedBookContext();

  const [permission, requestPermissions] = useCameraPermissions();

  const [codeLock, setCodeLock] = useState(false);

  useEffect(() => {
    if (codeLock) {
      setTimeout(() => {
        setCodeLock(false);
      }, 5000);
    }
  }, [codeLock]);

  async function handleGetBookDetails(value: string, state: 'READ' | 'READ_LATER' | 'READING') {
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${value}`);
      const selected: BookSearchResultProp = res.data?.items[0];
      const response = (await axios.get(selected.selfLink)).data;
      setSelectedBook(response.volumeInfo);
      router.replace({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
    } catch (err) {
      if (err) {
        console.log(err);
        Alert.alert('Error', 'Book not found. Please use the search feature or add the book manually');
      }
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[defaultStyleSheet.container, styles.container, { backgroundColor: isDarkMode ? Colors.dark : Colors.light }]}>
        <View style={[styles.boxContainer, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}>
          <Text style={[styles.heading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Permission Required</Text>
          <Text style={[styles.message, { color: isDarkMode ? Colors.light : Colors.dark }]}>Bookaccio requests permission to use the device camera for using the barcode scanner.</Text>
          <Button
            title="Grant Permission"
            onPress={requestPermissions}
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <CameraView
        style={[styles.cameraView]}
        facing="back"
        autofocus="on"
        enableTorch={torch}
        onBarcodeScanned={({ data }) => {
          if (!codeLock) {
            setCodeLock(true);
            handleGetBookDetails(data, barcodeScanner);
          }
        }}
      >
        <TouchableOpacity
          onPress={() => setTorch(torch ? false : true)}
          style={[styles.flashBtn]}
        >
          <MaterialCommunityIcons
            name={torch ? 'flashlight' : 'flashlight-off'}
            size={25}
            color={Colors.black}
          />
        </TouchableOpacity>
      </CameraView>
    </>
  );
};

export default BarcodeScanner;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },

  boxContainer: {
    padding: 20,
    gap: 20,
    borderWidth: 1,
    margin: 20,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 14,
  },

  cameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  flashBtn: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 30,
    bottom: 100,
    borderRadius: 100,
  },
});
