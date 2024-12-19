import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyleSheet } from '../defaultStyleSheet';
import { Colors } from '@/constants/Colors';
import { getBookDetails } from '@/helpers/getBookDetails';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const BarcodeScanner = () => {
  const { barcodeScanner }: { barcodeScanner: 'READ' | 'READING' | 'READ_LATER' } = useLocalSearchParams();
  const [permission, requestPermissions] = useCameraPermissions();

  const [selectedBook, setSelectedBook] = useSelectedBookContext();

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
        Alert.alert('Error', 'Book not found. Please use the search feature or add the book manually');
      }
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[defaultStyleSheet.container, styles.container]}>
        <View style={[styles.boxContainer]}>
          <Text style={styles.heading}>Permission Required</Text>
          <Text>Bookaccio requests permission to use the device camera for using the barcode scanner.</Text>
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
        onBarcodeScanned={({ data }) => {
          if (!codeLock) {
            setCodeLock(true);
            handleGetBookDetails(data, barcodeScanner);
          }
        }}
      ></CameraView>
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
    fontSize: 18,
    fontWeight: 'bold',
  },

  cameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
