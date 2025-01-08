import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import CustomInput from '@/components/customInput';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import bookCoverPlaceholder from '../../assets/images/others/book-cover-placeholder.png';

import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { storeBooks } from '@/helpers/storeBooks';
import { processUrl } from '@/helpers/processUrl';
import { getBookList } from '@/helpers/getBookList';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';

const AddNewBook = () => {
  const { editBook } = useLocalSearchParams();

  if (Array.isArray(editBook)) {
    throw new Error("Custom addBook mustn't be an Array Error");
  }

  const [font, setFont] = useFontsContext();

  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [isFirstModalVisible, setIsFirstModalVisible] = useState(false);

  const [isUrlModalVisible, setIsUrlModalVisible] = useState(false);

  const [imgUrl, setImgUrl] = useState('');

  const selectedBook = fullBookList.find((book) => book.id.toString() === editBook);

  useEffect(() => {
    getBookList().then((data) => {
      setFullBookList([...data]);
    });
  }, []);

  const [bookDetails, setBookDetails] = useState<Book>({
    id: selectedBook!.id,
    title: selectedBook!.title,
    subtitle: selectedBook!.subtitle,
    authors: selectedBook!.authors,
    categories: selectedBook!.categories,
    pageCount: selectedBook!.pageCount,
    description: selectedBook!.description,
    imageLinks: {
      thumbnail: selectedBook?.imageLinks.thumbnail,
    },
    currentPage: selectedBook!.currentPage,
    state: selectedBook?.state,
    startDate: selectedBook!.startDate,
    endDate: selectedBook!.endDate,
    publishedDate: selectedBook!.publishedDate,
    language: selectedBook!.language,
    publisher: selectedBook!.publisher,
    isbn: selectedBook!.isbn,
  });

  const statusData: { title: string; value: 'READ' | 'READING' | 'READ_LATER' }[] = [
    { title: 'Reading', value: 'READING' },
    { title: 'Read Later', value: 'READ_LATER' },
    { title: 'Read', value: 'READ' },
  ];

  function selectedText() {
    switch (bookDetails.state) {
      case 'READ':
        return 'Read';
        break;
      case 'READING':
        return 'Reading';
        break;
      case 'READ_LATER':
        return 'Read Later';
        break;
    }
  }

  function handleImageChange() {
    setBookDetails({ ...bookDetails, imageLinks: { thumbnail: imgUrl } });
    setIsUrlModalVisible(false);
  }

  async function handleGalleryImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      aspect: [11, 16],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImgUrl(result.assets[0].uri);
      setBookDetails({ ...bookDetails, imageLinks: { thumbnail: result.assets[0].uri } });
    }
  }

  function handleEditBook() {
    if (bookDetails.title === '' || bookDetails.authors[0] === '' || bookDetails.pageCount === 0) {
      Alert.alert('Title, Author and Pages are mandatory fields');
      return;
    }

    const updatedBookList = fullBookList.map((book) => {
      if (book.id === bookDetails.id) {
        return (book = { ...bookDetails });
      }
      return book;
    });

    setFullBookList([...updatedBookList]);

    storeBooks(updatedBookList);

    router.back();
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        <TouchableOpacity onPress={() => setIsFirstModalVisible(true)}>
          <Image
            style={styles.image}
            source={imgUrl !== '' ? { uri: processUrl(imgUrl) } : selectedBook?.imageLinks.thumbnail && selectedBook?.imageLinks.thumbnail !== '' ? { uri: processUrl(selectedBook.imageLinks.thumbnail) } : bookCoverPlaceholder}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.detailsContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
        <View>
          <CustomInput
            label="Title"
            value={bookDetails.title !== undefined ? bookDetails.title : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, title: value })}
          />
        </View>
        <View>
          <CustomInput
            label="Author"
            value={bookDetails.authors[0]}
            onChangeText={(value) => setBookDetails({ ...bookDetails, authors: [value] })}
          />
        </View>

        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { fontFamily: `${font}B`, backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, color: accentColor, zIndex: 1 }]}>Status</Text>
          <Dropdown
            style={[styles.dropDownField, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, borderColor: isDarkMode ? Colors.gray : Colors.dark }]}
            labelField={'title'}
            valueField={'value'}
            data={statusData}
            onChange={(selectedItem) => setBookDetails({ ...bookDetails, state: selectedItem.value })}
            placeholder={selectedText()}
            placeholderStyle={[styles.dropDownView, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}B` }]}
            selectedTextStyle={[styles.dropDownView, { color: isDarkMode ? Colors.dark : Colors.light, fontFamily: `${font}B` }]}
          />
        </View>
      </View>
      <View style={[styles.detailsContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
        <View>
          <Text style={[styles.title, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Optional Details</Text>
        </View>
        <View>
          <CustomInput
            label="ISBN"
            value={bookDetails.isbn ? bookDetails.isbn : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, isbn: value })}
            inputMode="numeric"
          />
        </View>
        <View>
          <CustomInput
            label="Subtitle"
            value={bookDetails.subtitle ? bookDetails.subtitle : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, subtitle: value })}
          />
        </View>
        <View>
          <CustomInput
            label="Category"
            value={bookDetails.categories ? [...new Set([...bookDetails.categories!.join(' /').split('/')])].join('/') : ['']}
            onChangeText={(value) => {
              setBookDetails({ ...bookDetails, categories: [value.split(',').join('/')] });
            }}
          />
        </View>
        <View>
          <CustomInput
            label="Description"
            value={bookDetails.description ? bookDetails.description : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, description: value })}
            multiline={true}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={handleEditBook}
          style={[styles.bigBtn, { backgroundColor: accentColor }]}
        >
          <View>
            <Text style={[styles.btnTxt, { fontFamily: `${font}B` }]}>Update</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isFirstModalVisible}
        onBackdropPress={() => setIsFirstModalVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: accentColor }]}>
          <View style={[styles.largeBtnContainer]}>
            <TouchableOpacity
              style={[styles.largeBtn]}
              onPress={() => {
                setIsFirstModalVisible(false);
                setIsUrlModalVisible(true);
              }}
            >
              <Text style={[styles.largeBtnTxt, { fontFamily: `${font}B` }]}>Set Image using URL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.largeBtn]}
              onPress={() => {
                setIsFirstModalVisible(false);
                handleGalleryImage();
              }}
            >
              <Text style={[styles.largeBtnTxt, { fontFamily: `${font}B` }]}>Select Image from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isUrlModalVisible}
        onBackdropPress={() => setIsUrlModalVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, borderColor: isBlackTheme ? Colors.gray : '', borderWidth: isBlackTheme ? 1 : 0 }]}>
          <CustomInput
            label="Image URL"
            value={imgUrl}
            onChangeText={(value) => setImgUrl(value)}
          />
          <TouchableOpacity
            onPress={handleImageChange}
            style={[styles.bigBtn, { backgroundColor: accentColor, alignSelf: 'center' }]}
          >
            <Text style={[styles.btnTxt, { fontFamily: `${font}B` }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddNewBook;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },

  contentContainer: {
    gap: 20,
    paddingBottom: 40,
  },

  image: {
    width: 80,
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
  },

  title: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 10,
  },

  detailsContainer: {
    gap: 20,
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
  },

  dropDownField: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },

  dropDownView: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },

  statusContainer: {
    position: 'relative',
  },

  statusText: {
    fontSize: 18,
    position: 'absolute',
    top: -18,
    left: 18,
    paddingHorizontal: 5,
  },

  btnContainer: {
    alignSelf: 'center',
  },

  bigBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 50,
    // borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },

  btnTxt: {
    fontSize: 16,
    color: Colors.light,
  },

  modal: {
    margin: 'auto',
    width: '90%',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 15,
  },

  largeBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  largeBtn: {
    height: 125,
    width: 125,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },

  largeBtnTxt: {
    fontSize: 17,
    textAlign: 'center',
  },
});
