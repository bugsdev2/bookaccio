import { Pressable, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useDarkModeContext } from '@/providers/themeProvider';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { Colors } from '@/constants/Colors';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { cryptoList } from '@/constants/cryptoAddressList';
import * as Clipboard from 'expo-clipboard';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';

const CryptoAddress = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [copiedMsg, setCopiedMsg] = useState(false);

  const { t } = useTranslation();

  const LinkItem = ({ name, address, code, icon, offIcon }: CryptoDetails) => {
    return (
      <View>
        <View>
          <Text style={[styles.cryptoName, { color: isDarkMode ? Colors.gray : Colors.dark }]}>
            {name} - {code}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.cryptoContainer, { backgroundColor: isDarkMode ? Colors.gray : Colors.light, borderColor: Colors.dark }]}
          onPress={async () => {
            await Clipboard.setStringAsync(address);
            setCopiedMsg(true);
            setTimeout(() => {
              setCopiedMsg(false);
            }, 1000);
          }}
        >
          <View style={styles.innerContainer}>
            <Image
              source={offIcon}
              style={{ width: 40, height: 40 }}
            />
            <Text style={[styles.cryptoTxt, { color: isDarkMode ? Colors.fullBlack : Colors.dark }]}>{address}</Text>
            <TouchableOpacity
              style={[styles.copyIconContainer]}
              onPress={async () => {
                await Clipboard.setStringAsync(address);
                setCopiedMsg(true);
                setTimeout(() => {
                  setCopiedMsg(false);
                }, 1000);
              }}
            >
              <Feather
                name="copy"
                size={25}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.dark : Colors.light }]}>
      <View style={styles.headingContainer}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={styles.backIcon}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color={accentColor}
          />
        </Pressable>
        <Text style={[styles.heading, { color: accentColor }]}>{t('addresses')}</Text>
        <View style={{ flex: 1 }} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {cryptoList?.map((item) => {
          return (
            <LinkItem
              key={item.code}
              name={item.name}
              address={item.address}
              code={item.code}
              icon={item.icon}
              offIcon={item.offIcon}
            />
          );
        })}
      </ScrollView>
      <Modal isVisible={copiedMsg}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTxt}>{t('address-copied')}</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CryptoAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headingContainer: {
    paddingVertical: 5,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heading: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'MontB',
  },

  backIcon: {
    flex: 1,
    paddingLeft: 10,
  },

  contentContainer: {
    gap: 20,
    alignItems: 'center',
    paddingVertical: 15,
  },

  innerContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cryptoContainer: {
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
  },

  cryptoName: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'MontB',
    paddingBottom: 5,
  },

  cryptoTxt: {
    fontSize: 15,
    fontFamily: 'MontR',
    width: '65%',
  },

  copyIconContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
  },

  modalContainer: {
    margin: 'auto',
    padding: 20,
    backgroundColor: Colors.light,
    minWidth: '80%',
    borderRadius: 10,
  },

  modalTxt: {
    fontSize: 16,
    fontFamily: 'MontB',
  },
});
