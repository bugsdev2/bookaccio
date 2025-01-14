import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import SettingItem from '@/components/settingItem';
import { theme } from '@/constants/theme';
import { fonts } from '@/constants/fonts';
import { accentColors } from '@/constants/accentColors';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { getBookList } from '@/helpers/getBookList';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { storeBooks } from '@/helpers/storeBooks';
import * as WebBrowser from 'expo-web-browser';
import { setData } from '@/helpers/storage';
import { useRatingShownContext } from '@/providers/options/showRatingProvider';
import { usePageNumberShownContext } from '@/providers/options/showPageNumberProvider';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { usePreventScreenShotContext } from '@/providers/options/preventScreenShotProvider';
import { useUnfinishedContext } from '@/providers/options/showUnfinishedProvider';
import { useShowAdditionalDetailsContext } from '@/providers/options/showAdditionalDetails';
import { languages } from '@/constants/languages';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [ratingShown, setRatingShown] = useRatingShownContext();

  const [pageNumberShown, setPageNumberShown] = usePageNumberShownContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [isScreenShotDisabled, setIsScreenShotDisabled] = usePreventScreenShotContext();

  const [showUnfinished, setShowUnfinished] = useUnfinishedContext();

  const [additionalDetailsShown, setAdditionalDetailsShown] = useShowAdditionalDetailsContext();

  const { t } = useTranslation();

  function handleLink(url: string) {
    WebBrowser.openBrowserAsync(url);
  }

  const handleOptions = (title: string, value: boolean) => {
    switch (title) {
      case 'pageNumber':
        setPageNumberShown(value);
        setData('pageNumberShown', value);
        break;
      case 'rating':
        setRatingShown(value);
        setData('ratingShown', value);
        break;
      case 'screenshots':
        setIsScreenShotDisabled(value);
        setData('isScreenShotDisabled', value);
        break;
      case 'unfinished':
        setShowUnfinished(value);
        setData('showUnfinished', value);
        break;
      case 'additionalDetails':
        setAdditionalDetailsShown(value);
        setData('additionalDetails', value);
        break;
    }
  };

  const handleImport = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      try {
        const data = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const fileData: Book[] = JSON.parse(await data);
        if (fileData[0].id && fileData[0].title) {
          Alert.alert(t('warning'), t('warning-clear-books'), [
            {
              text: t('okay'),
              onPress: () => (setFullBookList([...fileData]), storeBooks(fileData), Alert.alert(t('success'), t('success-import-file'))),
            },
            {
              text: t('cancel'),
            },
          ]);
        } else {
          throw new Error('You might have provided a different file. You can use only a bookaccio export file');
        }
      } catch (err) {
        Alert.alert(t('error'), t('wrong-import-file'));
        console.log(err);
      }
    } else {
      Alert.alert(t('cancelled'), t('cancel-import'));
    }
  };

  const exportDate = () => {
    const date = new Date().toISOString();
    return date.slice(0, date.indexOf('T'));
  };

  const handleExport = async () => {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      let dirUrl = permissions.directoryUri;
      getBookList().then((data) => {
        setFullBookList(data);
      });

      await FileSystem.StorageAccessFramework.createFileAsync(dirUrl, `Bookaccio-Export-${exportDate()}`, 'application/json')
        .then(async (fileUri) => {
          await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(fullBookList), { encoding: FileSystem.EncodingType.UTF8 });
          Alert.alert(t('success'), t('export-saved'));
        })
        .catch((e) => {
          Alert.alert(t('error'), `${e}`);
          console.log(e);
        });
    } else {
      Alert.alert(t('cancelled'), t('cancel-export'));
    }
  };

  return (
    <ScrollView
      style={[{ backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light }]}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: accentColor }]}>{t('settings')}</Text>
        </View>
        <View style={{ gap: 20 }}>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('colors')}</Text>
            <SettingItem
              label={t('accent-color')}
              data={accentColors}
            />
            <SettingItem
              label={t('theme')}
              data={theme}
            />
            {isDarkMode && (
              <View style={{ gap: 15, flexDirection: 'row', justifyContent: 'flex-end', marginRight: -15, marginTop: 5 }}>
                <Text style={{ color: isDarkMode ? Colors.light : Colors.dark, fontFamily: 'MontB', alignSelf: 'center' }}>{t('use-amoled-black')}</Text>
                <BouncyCheckbox
                  style={{ display: 'flex' }}
                  fillColor={accentColor}
                  iconStyle={{ borderRadius: 5 }}
                  innerIconStyle={{ borderRadius: 5 }}
                  isChecked={isBlackTheme}
                  onPress={(ischecked) => {
                    setIsBlackTheme(ischecked);
                    setData('isBlackTheme', ischecked);
                  }}
                />
              </View>
            )}
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('fonts')}</Text>
            <SettingItem
              label={t('font')}
              data={fonts}
            />
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('language')}</Text>
            <SettingItem
              label={t('language')}
              data={languages}
            />
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('options')}</Text>
            <View style={{ gap: 15 }}>
              <View style={[styles.switchContainer]}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('show-page-number')}</Text>
                <Switch
                  trackColor={{ false: Colors.gray, true: accentColor }}
                  thumbColor={Colors.light}
                  value={pageNumberShown}
                  onValueChange={(value) => handleOptions('pageNumber', value)}
                />
              </View>
              <View style={[styles.switchContainer]}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('show-rating')}</Text>
                <Switch
                  trackColor={{ false: Colors.gray, true: accentColor }}
                  thumbColor={Colors.light}
                  value={ratingShown}
                  onValueChange={(value) => handleOptions('rating', value)}
                />
              </View>
              <View style={[styles.switchContainer]}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('show-unfinished')}</Text>
                <Switch
                  trackColor={{ false: Colors.gray, true: accentColor }}
                  thumbColor={Colors.light}
                  value={showUnfinished}
                  onValueChange={(value) => handleOptions('unfinished', value)}
                />
              </View>
              <View style={[styles.switchContainer]}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('show-additional-details')}</Text>
                <Switch
                  trackColor={{ false: Colors.gray, true: accentColor }}
                  thumbColor={Colors.light}
                  value={additionalDetailsShown}
                  onValueChange={(value) => handleOptions('additionalDetails', value)}
                />
              </View>
              <View style={[styles.switchContainer]}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('disable-screenshots')}</Text>
                <Switch
                  trackColor={{ false: Colors.gray, true: accentColor }}
                  thumbColor={Colors.light}
                  value={isScreenShotDisabled}
                  onValueChange={(value) => handleOptions('screenshots', value)}
                />
              </View>
            </View>
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('import-export')}</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: accentColor }]}
                onPress={handleImport}
              >
                <Text style={styles.text}>{t('import')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: accentColor }]}
                onPress={handleExport}
              >
                <Text style={styles.text}>{t('export')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('report-bug')}</Text>
            <TouchableOpacity
              onPress={() => handleLink('https://t.me/+2qtifdFNRv00Y2M9')}
              style={[styles.btn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.text}>{t('join-tg-group')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLink('https://github.com/bugsdev2/bookaccio/issues')}
              style={[styles.btn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.text}>{t('create-issue-github')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>{t('donate')}</Text>
            <TouchableOpacity
              onPress={() => handleLink('https://buymeacoffee.com/bugsdev2')}
              style={[styles.btn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.text}>{t('buy-coffee')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLink('https://github.com/sponsors/bugsdev2')}
              style={[styles.btn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.text}>{t('github-sponsor')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLink('https://github.com/bugsdev2/bookaccio/issues')}
              style={[styles.btn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.text}>{t('donate-crypto')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    paddingBottom: 50,
  },

  headerContainer: {
    padding: 10,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'MontB',
  },

  sectionContainer: {
    gap: 15,
    padding: 10,
    paddingVertical: 25,
    borderRadius: 10,
  },

  subheading: {
    textAlign: 'center',
    fontFamily: 'MontB',
    fontSize: 18,
  },

  btnContainer: {
    flexDirection: 'row',
    gap: 50,
    margin: 'auto',
  },

  btn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },

  modalContainer: {
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 25,
  },

  text: {
    color: Colors.light,
    fontFamily: 'MontR',
    textAlign: 'center',
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  switchLabel: {
    fontFamily: 'MontB',
    fontSize: 15,
    flex: 1,
  },
});
