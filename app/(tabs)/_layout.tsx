import { Link, Tabs } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo, Ionicons } from '@expo/vector-icons/';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import Modal from 'react-native-modal';
import React, { useEffect, useRef, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { useFontsContext } from '@/providers/fontProvider';
import { getBookList } from '@/helpers/getBookList';
import { storeBooks } from '@/helpers/storeBooks';
import { useIsFocused } from '@react-navigation/native';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';

const TabsLayout = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [font, setFont] = useFontsContext();

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [modalVisible, setModalVisible] = useState(false);

  const [isSearchContainer, setIsSearchContainerVisible] = useState(false);

  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const [searchTxt, setSearchTxt] = useState('');

  const textInputRef = useRef<TextInput>(null);

  const isScreenFocused = useIsFocused();

  useEffect(() => {
    if (isScreenFocused && searchTxt !== '') {
      getBookList().then((data: Book[]) => {
        setFullBookList([...data.filter((book) => book.title?.toLowerCase().includes(searchTxt.toLowerCase()) || book?.authors.join(',').toLowerCase().includes(searchTxt.toLowerCase()))]);
      });
    } else {
      getBookList().then((data) => {
        setFullBookList([...data]);
      });
    }
  }, [isScreenFocused]);

  function onSearch(value: string) {
    if (value === '') {
      getBookList().then((data) => {
        setFullBookList(data);
      });
    } else {
      getBookList().then((data: Book[]) => {
        let tempArr = data.filter((book) => {
          return book?.title!.toLowerCase().includes(value.toLowerCase()) || book?.authors.join(',').toLowerCase().includes(value.toLowerCase());
        });
        setFullBookList(tempArr);
      });
    }
  }

  function handleSort(value: string) {
    let tempArr;
    switch (value) {
      case 'title':
        getBookList().then((data: Book[]) => {
          tempArr = data.sort((a, b) => (a?.title! > b?.title! ? 1 : -1));
          setFullBookList([...tempArr]);
          storeBooks([...tempArr]);
          setIsSortModalVisible(false);
          textInputRef.current?.clear();
        });
        break;
      case 'dateAsc':
        getBookList().then((data: Book[]) => {
          tempArr = data.sort((a, b) => a.startDate - b.startDate);
          setFullBookList([...tempArr]);
          storeBooks([...tempArr]);
          setIsSortModalVisible(false);
          textInputRef.current?.clear();
        });
        break;
      case 'dateDesc':
        getBookList().then((data: Book[]) => {
          tempArr = data.sort((a, b) => b.startDate - a.startDate);
          setFullBookList([...tempArr]);
          storeBooks([...tempArr]);
          setIsSortModalVisible(false);
          textInputRef.current?.clear();
        });
        break;
    }
  }

  const CustomIcon = ({ focused, name, title }: { focused: boolean; name: any; title: string }) => (
    <View>
      <View style={[styles.customIconFill, { backgroundColor: focused ? accentColor : isBlackTheme ? Colors.closeBlack : isDarkMode ? Colors.dark : Colors.light }]}>
        <Icon
          name={focused ? name : `${name}-outline`}
          size={30}
          color={focused ? Colors.light : isDarkMode ? Colors.light : Colors.gray}
        />
        {focused ? <Text style={{ color: Colors.light, fontWeight: 'bold' }}>{title}</Text> : null}
      </View>
    </View>
  );

  return (
    <>
      <StatusBar style="light" />
      <View style={[styles.header, { backgroundColor: accentColor }]}>
        <View style={styles.headerInner}>
          <Text style={styles.headerText}>BOOKACCIO</Text>
          <View style={styles.rightContainer}>
            <Pressable
              onPress={() => {
                setIsSearchContainerVisible(true);
                // commenting this out because in phone, sometimes the keyboard doesn't show up
                // textInputRef.current?.focus();
              }}
              style={styles.headerIconContainer}
            >
              <Entypo
                name="magnifying-glass"
                size={22}
                color="white"
              />
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={styles.headerIconContainer}
            >
              <Entypo
                name="dots-three-vertical"
                size={22}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={[styles.secondaryHeaderContainer, { display: isSearchContainer ? 'flex' : 'none', backgroundColor: accentColor }]}>
        <View style={styles.searchContainerInner}>
          <View style={{ justifyContent: 'center' }}>
            <Entypo
              name="magnifying-glass"
              size={24}
              color={accentColor}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              ref={textInputRef}
              value={searchTxt}
              placeholder="search by title or author"
              placeholderTextColor={'#9e9e9e'}
              style={[styles.searchInput, { fontFamily: `${font}B` }]}
              onChangeText={(value) => {
                setSearchTxt(value);
                onSearch(value);
              }}
            />
          </View>
        </View>
        <View style={styles.optionsBtnContainer}>
          <Pressable
            style={{ padding: 2 }}
            onTouchStart={() => setIsSortModalVisible(true)}
          >
            <Ionicons
              name="options-sharp"
              size={24}
              color={Colors.light}
            />
          </Pressable>
          <Pressable
            style={{ padding: 2 }}
            onTouchStart={() => setIsSearchContainerVisible(false)}
          >
            <Ionicons
              name="close"
              size={24}
              color={Colors.light}
            />
          </Pressable>
        </View>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: isBlackTheme ? Colors.closeBlack : isDarkMode ? Colors.dark : Colors.light,
            height: 65,
            borderTopColor: isBlackTheme ? Colors.closeBlack : isDarkMode ? Colors.black : Colors.light,
            elevation: 10,
          },
        }}
      >
        <Tabs.Screen
          name="to-read"
          options={{
            headerShown: false,
            headerTitle: 'To Read',
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                name="bookmark"
                focused={focused}
                title="For Later"
              />
            ),
            // unmountOnBlur: true,
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            headerTitle: 'Reading',
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                name="book-open-page-variant"
                focused={focused}
                title="Reading"
              />
            ),
            // unmountOnBlur: true,
          }}
        />
        <Tabs.Screen
          name="read"
          options={{
            headerShown: false,
            headerTitle: 'Read',
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                name="book"
                focused={focused}
                title="Done"
              />
            ),
            // unmountOnBlur: true,
          }}
        />
      </Tabs>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={[styles.modalView, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
          <Pressable
            style={[styles.closeBtn]}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons
              name="close"
              size={23}
              color={isDarkMode ? Colors.light : accentColor}
            />
          </Pressable>
          <View>
            <View>
              <Link
                href={'/(settings)/settings'}
                asChild
              >
                <Pressable
                  style={styles.linkContainer}
                  onPress={() => setModalVisible(false)}
                >
                  <MaterialIcons
                    name="settings"
                    size={22}
                    color={isDarkMode ? Colors.light : accentColor}
                  />
                  <Text style={[styles.linkText, { color: isDarkMode ? Colors.light : accentColor }]}>Settings</Text>
                </Pressable>
              </Link>
            </View>
            <View>
              <Link
                href={'/(settings)/about'}
                asChild
              >
                <Pressable
                  style={styles.linkContainer}
                  onPress={() => setModalVisible(false)}
                >
                  <MaterialIcons
                    name="info"
                    size={22}
                    color={isDarkMode ? Colors.light : accentColor}
                  />
                  <Text style={[styles.linkText, { color: isDarkMode ? Colors.light : accentColor }]}>About</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isSortModalVisible}
        onBackdropPress={() => setIsSortModalVisible(false)}
      >
        <View style={[styles.sortModal, { backgroundColor: isDarkMode ? Colors.dark : Colors.light }]}>
          <TouchableOpacity
            onPress={() => handleSort('title')}
            style={[styles.sortModalBtn, { backgroundColor: accentColor }]}
          >
            <Text style={[styles.sortModalTxt, { fontFamily: `${font}B` }]}>Sort books by Title</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('dateAsc')}
            style={[styles.sortModalBtn, { backgroundColor: accentColor }]}
          >
            <Text style={[styles.sortModalTxt, { fontFamily: `${font}B` }]}>Sort books by Start Date (Earliest to Latest)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('dateDesc')}
            style={[styles.sortModalBtn, { backgroundColor: accentColor }]}
          >
            <Text style={[styles.sortModalTxt, { fontFamily: `${font}B` }]}>Sort books by Start Date (Latest to Earliest)</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 90,
    justifyContent: 'flex-end',
    paddingLeft: 20,
    paddingBottom: 10,
  },

  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 25,
    color: 'white',
    // fontWeight: 'bold',
    fontFamily: 'OswaldB',
    // letterSpacing: 0.5,
  },

  brand: {
    width: 160,
    height: 30,
  },

  customIconFill: {
    borderRadius: 30,
    width: 100,
    height: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },

  headerIconContainer: {
    paddingLeft: 5,
    paddingRight: 15,
    paddingVertical: 8,
  },

  rightContainer: {
    flexDirection: 'row',
  },

  secondaryHeaderContainer: {
    width: '100%',
    position: 'absolute',
    height: 90,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  searchContainerInner: {
    backgroundColor: Colors.light,
    flexDirection: 'row',
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flex: 1,
  },

  optionsBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 10,
    marginLeft: 10,
    paddingHorizontal: 5,
  },

  searchInput: {
    padding: 5,
    fontSize: 16,
  },

  modalView: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: -20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },

  linkText: {
    fontSize: 17,
    fontFamily: 'MontB',
  },

  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
  },

  sortModal: {
    padding: 15,
    paddingVertical: 35,
    borderRadius: 10,
    gap: 10,
  },

  sortModalBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },

  sortModalTxt: {
    textAlign: 'center',
    color: Colors.light,
  },
});
