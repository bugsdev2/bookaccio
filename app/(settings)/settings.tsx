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

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [ratingShown, setRatingShown] = useRatingShownContext();

  const [pageNumberShown, setPageNumberShown] = usePageNumberShownContext();

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
    }
  };

  const handleImport = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      try {
        const data = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const fileData: Book[] = JSON.parse(await data);
        if (fileData[0].id && fileData[0].title) {
          Alert.alert('Warning!', 'This will remove all existing books from your library and add the new list', [
            {
              text: 'Okay',
              onPress: () => (setFullBookList([...fileData]), storeBooks(fileData), Alert.alert('Success', 'File successfully imported')),
            },
            {
              text: 'Cancel',
            },
          ]);
        } else {
          throw new Error('You might have provided a different file. You can use only a bookaccio export file');
        }
      } catch (err) {
        Alert.alert('Error', 'You might have provided a different file. You can use only a bookaccio export file');
        console.log(err);
      }
    } else {
      Alert.alert('Cancelled', 'You have cancelled the import');
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
          Alert.alert('Success', `Export file saved successfully`);
        })
        .catch((e) => {
          Alert.alert('Error', `Error saving file: ${e}`);
          console.log(e);
        });
    } else {
      Alert.alert('Cancelled', 'You have cancelled the export');
    }
  };

  return (
    <ScrollView
      style={[{ backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: accentColor }]}>Settings</Text>
        </View>
        <View style={{ gap: 20 }}>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Colors</Text>
            <SettingItem
              label="Accent Color"
              data={accentColors}
            />
            <SettingItem
              label="Theme"
              data={theme}
            />
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Fonts</Text>
            <SettingItem
              label="Font"
              data={fonts}
            />
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Options</Text>
            <View style={{ gap: 15 }}>
              <View style={[styles.switchContainer]}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>Show Page No. in 'Reading' Section</Text>
                <Switch
                  trackColor={{ false: Colors.gray, true: accentColor }}
                  thumbColor={Colors.light}
                  value={pageNumberShown}
                  onValueChange={(value) => handleOptions('pageNumber', value)}
                />
              </View>
              <View style={[styles.switchContainer]}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>Show Rating in 'Done' Section</Text>
                <Switch
                  trackColor={{ false: Colors.gray, true: accentColor }}
                  thumbColor={Colors.light}
                  value={ratingShown}
                  onValueChange={(value) => handleOptions('rating', value)}
                />
              </View>
            </View>
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Import/Export</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: accentColor }]}
                onPress={handleImport}
              >
                <Text style={styles.text}>Import</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: accentColor }]}
                onPress={handleExport}
              >
                <Text style={styles.text}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? 'rgba(15,15,15,0.3)' : 'rgba(200,200,200,0.3)' }]}>
            <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Report a Bug</Text>
            <View style={{ flexDirection: 'column', gap: 15 }}>
              <TouchableOpacity
                onPress={() => handleLink('https://t.me/+2qtifdFNRv00Y2M9')}
                style={[styles.btn, { backgroundColor: accentColor }]}
              >
                <Text style={styles.text}>Join the Official Telegram Group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLink('https://github.com/bugsdev2/bookaccio/issues')}
                style={[styles.btn, { backgroundColor: accentColor }]}
              >
                <Text style={styles.text}>Create a New Issue via Github</Text>
              </TouchableOpacity>
            </View>
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
  },

  switchLabel: {
    fontFamily: 'MontB',
    fontSize: 15,
    flex: 1,
  },
});
