import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useDarkModeContext } from '@/providers/themeProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useFullBookListContext } from '@/providers/booksFullListProvider';

const PagesLayout = () => {
  const { bookdetails } = useLocalSearchParams();

  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [fullBookList, _] = useFullBookListContext();

  if (Array.isArray(bookdetails)) throw new Error("bookdetails shouldn't be an array");

  const selectedBook = fullBookList.find((book) => book.id.toString() === bookdetails);

  function handleEditBookPress() {
    router.push({ pathname: '/(editBook)/[editBook]', params: { editBook: selectedBook!.id!.toString() } });
  }

  return (
    <>
      <View style={[styles.header, { backgroundColor: accentColor, borderColor: accentColor }]}>
        <View style={styles.headerInner}>
          <View style={styles.backIconContainer}>
            <Pressable
              style={{ paddingHorizontal: 8 }}
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="chevron-left"
                size={35}
                color={Colors.light}
              />
            </Pressable>
          </View>
          <View style={styles.headerTextContainer}>
            <Text
              style={styles.headerText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedBook?.title}
            </Text>
          </View>
          <View style={styles.editContainer}>
            <Pressable
              style={{ padding: 5, paddingHorizontal: 10 }}
              onPress={handleEditBookPress}
            >
              <MaterialIcons
                name="edit"
                size={22}
                color={Colors.light}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <Stack>
        <Stack.Screen
          name="[bookdetails]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default PagesLayout;

const styles = StyleSheet.create({
  header: {
    height: 90,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },

  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'flex-end',
    width: '100%',
    // borderWidth: 1,
  },

  backIconContainer: {
    flex: 1,
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },

  headerTextContainer: {
    width: '75%',
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    // borderWidth: 1,
  },

  headerText: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'OswaldB',
    textAlign: 'center',
  },

  headerIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 45,
    height: 40,
    bottom: 8,
  },
});
