import { Button, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { BarcodeScanner } from 'rn-barcode-zxing';
import React, { useEffect, useRef, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useDarkModeContext } from '@/providers/themeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBookByIsbn } from '@/helpers/getBookByIsbn';

const Scanner = () => {
  const { barcodeScanner }: { barcodeScanner: 'READ' | 'READING' | 'READ_LATER' } = useLocalSearchParams();

  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [torch, setTorch] = useState(false);

  const [selectedBook, setSelectedBook] = useSelectedBookContext();

  const [codeLock, setCodeLock] = useState(false);

  useEffect(() => {
    if (codeLock) {
      setTimeout(() => {
        setCodeLock(false);
      }, 5000);
    }
  }, [codeLock]);

  async function handleBarcodeScan(value: string, state: 'READ' | 'READ_LATER' | 'READING') {
    try {
      const response = await getBookByIsbn(value);
      if (response) {
        setSelectedBook(response?.volumeInfo);
        router.replace({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
      } else {
        throw new Error('CustomErr: Either not connected to internet or the book is not found');
      }
    } catch (err) {
      if (err) {
        console.log(err);
        Alert.alert('Error', 'Book not found. Please use the search feature or add the book manually');
      }
    }
  }

  return (
    <>
      <BarcodeScanner
        style={styles.cameraView}
        torch={torch ? 'on' : 'off'}
        onBarcodesDetected={({ code }: { code: string[] }) => {
          if (!codeLock) {
            setCodeLock(true);
            handleBarcodeScan(code[0], barcodeScanner);
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
      </BarcodeScanner>
    </>
  );
};

export default Scanner;

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
