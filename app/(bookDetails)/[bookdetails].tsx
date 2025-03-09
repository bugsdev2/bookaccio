import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, Alert, Keyboard, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons/';
import { formatDate } from '@/helpers/formatDate';
import GlobalDateTimePicker from 'react-native-global-datetimepicker';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { storeBooks } from '@/helpers/storeBooks';
import { processUrl } from '@/helpers/processUrl';
import { processInterjections } from '@/helpers/processInterjections';
import { processDuration } from '@/helpers/processDuration';
import { getBookList } from '@/helpers/getBookList';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { readingMotivation } from '@/helpers/readingMotivation';
import { BookState } from '@/constants/bookState';
import { useShowAdditionalDetailsContext } from '@/providers/options/showAdditionalDetails';
import { useTranslation } from 'react-i18next';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookDetails = () => {
  const { bookdetails } = useLocalSearchParams();

  if (Array.isArray(bookdetails)) throw new Error("bookdetails should't be an array");

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const book = fullBookList.find((book) => book.id.toString() === bookdetails);

  const [font, setFont] = useFontsContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [additionalDetailsShown, setAdditionalDetailsShown] = useShowAdditionalDetailsContext();

  const [numOfLines, setNumOfLines] = useState(4);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isRatingModalVisible, setIsRatinModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(book?.currentPage);

  const [pageCount, setPageCount] = useState(book?.pageCount);

  const [bookProgress, setBookProgress] = useState(book!.currentPage / book!.pageCount);

  const [startDate, setStartDate] = useState(new Date(book!.startDate));

  const [endDate, setEndDate] = useState(new Date(book!.endDate));

  const [rating, setRating] = useState(book!.rating);

  const { t } = useTranslation();

  const regexNumber = /\d/g;

  function handleTextExpansion() {
    numOfLines !== 0 ? setNumOfLines(0) : setNumOfLines(4);
  }

  useEffect(() => {
    getBookList().then((data) => {
      setFullBookList([...data]);
    });
  }, []);

  const updateBookDetails = ({ id, authors, currentPage, pageCount, categories, description, endDate, publishedDate, publisher, rating, startDate, state, subtitle, title, isbn }: BookOptional) => {
    const updatedBooklist: Book[] = fullBookList.map((book) => {
      if (book.id === id) {
        return {
          ...book,
          authors: authors ? authors : book.authors,
          categories: categories ? categories : book.categories,
          currentPage: currentPage !== undefined ? currentPage : book.currentPage,
          description: description ? description : book.description,
          endDate: endDate ? Date.parse(endDate.toString()) : book.endDate,
          pageCount: pageCount ? pageCount : book.pageCount,
          publishedDate: publishedDate ? publishedDate : book.publishedDate,
          publisher: publisher ? publisher : book.publisher,
          rating: rating !== undefined ? rating : book.rating,
          startDate: startDate ? Date.parse(startDate.toString()) : book.startDate,
          state: state ? state : book.state,
          subtitle: subtitle ? subtitle : book.subtitle,
          title: title ? title : book.title,
          isbn: isbn ? isbn : book.isbn,
        };
      } else {
        return {
          ...book,
        };
      }
    });

    setFullBookList([...updatedBooklist]);

    storeBooks(updatedBooklist);
  };

  function handleProgressDetails(id: number) {
    if (!regexNumber.test(currentPage!.toString()) || !regexNumber.test(pageCount!.toString())) {
      Alert.alert(t('error'), t('invalid-num-msg'));
      setCurrentPage(book?.currentPage || 0);
      setPageCount(book?.pageCount);
      return;
    }

    if (currentPage! > pageCount!) {
      Alert.alert(t('error'), t('warning-current-page'));
      return;
    }

    updateBookDetails({ id, currentPage, pageCount });

    if (book?.state === BookState.READING) {
      updateBookDetails({ id, endDate: new Date(), currentPage, pageCount });
      setEndDate(new Date());
    }

    setBookProgress(currentPage! / pageCount!);

    Keyboard.dismiss();

    if (currentPage === pageCount && book?.state === BookState.READING) {
      Alert.alert(processInterjections(t('interjections', { returnObjects: true })), `${t('fisnish-reading-msg')} '${book.title}'. \n${t('rate-and-move')}`, [
        {
          text: t('yes'),
          onPress: () => {
            setIsRatinModalVisible(true);
          },
        },
        {
          text: t('no'),
          onPress: () => {
            updateBookDetails({ id, endDate: new Date(), currentPage, pageCount });
            setEndDate(new Date());
          },
        },
      ]);
    }

    setIsModalVisible(false);
  }

  // START DATE PICKER //
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);

  const showStartDatePicker = () => {
    setIsStartDatePickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setIsStartDatePickerVisible(false);
  };

  const handleStartDate = ({ id, startDate }: { id: number; startDate: Date }) => {
    if (Date.parse(startDate.toString()) > Date.parse(endDate.toString())) {
      Alert.alert(t('date-error'), t('date-error-how'));
      return;
    }
    setStartDate(startDate);
    updateBookDetails({ id, startDate });
    hideStartDatePicker();
  };

  ///////////////////////

  // END DATE PICKER //

  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

  const showEndDatePicker = () => {
    setIsEndDatePickerVisible(true);
  };

  const hideEndDatePicker = () => {
    setIsEndDatePickerVisible(false);
  };

  const handleEndDate = ({ id, endDate }: { id: number; endDate: Date }) => {
    if (Date.parse(startDate.toISOString()) > Date.parse(endDate.toISOString())) {
      Alert.alert(t('date-error'), t('date-error-how'));
      return;
    }
    setEndDate(endDate);
    updateBookDetails({ id, endDate });
    hideEndDatePicker();
  };

  //////////////////

  function handleRatingValue(value: string) {
    let intValue = parseInt(value);
    if (intValue >= 0) {
      if (intValue <= 5) {
        setRating(intValue);
      } else {
        Alert.alert(t('error'), t('invalid-num-msg'));
      }
    }
  }

  function handleBookRating(id: number) {
    updateBookDetails({ id, rating });
    setIsRatinModalVisible(false);
    if (book?.currentPage === book?.pageCount && book?.state === BookState.READING) {
      updateBookDetails({ id, endDate: new Date(), currentPage, pageCount, state: BookState.READ, rating });
      setEndDate(new Date());
      Alert.alert(t('success'), t('move-to-done-msg'));
    }
  }

  function handleBookRatingStar(rating: number = 0) {
    if (rating === 0) {
      return [...Array(5)].map((_, index) => (
        <MaterialIcons
          key={Math.random() * 5000}
          name="star-outline"
          size={24}
          color={Colors.gray}
        />
      ));
    } else {
      return [
        [...Array(rating)].map((_, index) => (
          <View key={index}>
            <MaterialIcons
              key={Math.random() * 5000}
              name="star"
              size={24}
              color={'gold'}
            />
          </View>
        )),
        [...Array(5 - rating)].map((_, index) => (
          <View key={index}>
            <MaterialIcons
              name="star-outline"
              size={24}
              color={Colors.gray}
            />
          </View>
        )),
      ];
    }
  }

  if (!book) {
    null;
  } else {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <Image
            style={styles.thumbnailImage}
            source={book?.imageLinks.thumbnail !== '' ? { uri: processUrl(book?.imageLinks.thumbnail) } : bookCoverPlaceholder}
          />
        </View>

        <View style={styles.textContainer}>
          <View>
            <Text style={[styles.title, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : accentColor }]}>{book?.title}</Text>
          </View>
          {book?.subtitle && <Text style={[styles.subtitle, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.subtitle}</Text>}
          <Text style={(styles.author, [styles.author, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }])}>{book?.authors[0]}</Text>

          {additionalDetailsShown && (
            <View style={[styles.additionalInfo]}>
              {book?.originalTitle && (
                <Text style={[styles.originalTitle, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>
                  <Text style={styles.smallHeading}>{t('original-title')}: </Text>
                  {book.originalTitle}
                </Text>
              )}
              {book?.translator && (
                <Text style={[styles.originalTitle, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>
                  <Text style={styles.smallHeading}>{t('translator')}: </Text>
                  {book.translator}
                </Text>
              )}
              {book?.isbn && (
                <Text style={[styles.isbn, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>
                  <Text style={styles.smallHeading}>{t('isbn')}: </Text>
                  <Text style={styles.textSpaced}>{book.isbn}</Text>
                </Text>
              )}
              {book?.publishedDate && (
                <Text style={[styles.publishedDate, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>
                  <Text style={styles.smallHeading}>{t('published-year')}: </Text>
                  {book.publishedDate.slice(0, 4)}
                </Text>
              )}
            </View>
          )}

          <Pressable
            onPress={() => setIsRatinModalVisible(true)}
            style={styles.ratingContainer}
          >
            {handleBookRatingStar(rating)}
          </Pressable>
          <Text style={[styles.category, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{[...new Set([...book!.categories!.join(' /').split('/')])].join('/')}</Text>
          {book?.description && (
            <Text
              onPress={handleTextExpansion}
              numberOfLines={numOfLines}
              style={[styles.summary, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
            >
              {book?.description?.replace(/<\/?[^>]+(>|$)/g, '')}
            </Text>
          )}
        </View>

        <View style={styles.progressContainer}>
          {book?.state !== 'READ_LATER' && (
            <Pressable onPress={() => setIsModalVisible(true)}>
              <Progress.Circle
                size={180}
                color={accentColor}
                progress={bookProgress}
                thickness={10}
                borderWidth={1}
                borderColor={isDarkMode ? Colors.light : Colors.dark}
                showsText={true}
                formatText={() => `${Math.round(bookProgress * 100)}%`}
              />
            </Pressable>
          )}
        </View>

        {book.state === BookState.READING && bookProgress < 1 && Date.parse(endDate.toString()) - Date.parse(startDate.toString()) > 86400000 ? (
          <View style={styles.durationContainer}>
            <Text style={[styles.durationMsg, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}>{readingMotivation(book.startDate, book.endDate, t('reading-motivation', { returnObjects: true }), t('less-than-a-day'), t('one-day'), t('days'))}</Text>
          </View>
        ) : null}

        {book.state === BookState.READ && bookProgress === 1 ? (
          <View style={styles.durationContainer}>
            <Text style={[styles.durationMsg, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}>{processInterjections(t('interjections', { returnObjects: true })) + ' ' + t('finished-book-in').replace('_', '') + processDuration(book.startDate, book.endDate, t('less-than-a-day'), t('one-day'), t('days'))}</Text>
          </View>
        ) : null}

        <View style={[styles.dateContainer]}>
          {book?.state !== BookState.READ_LATER && (
            <>
              <TouchableOpacity
                onPress={showStartDatePicker}
                style={[styles.bigBtn, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}
              >
                <Text style={[styles.dateLabel, { fontFamily: `${font}B`, color: isDarkMode ? accentColor : Colors.light, backgroundColor: isBlackTheme ? Colors.white : isDarkMode ? Colors.white : accentColor }]}>{t('start-date')}</Text>
                <Text style={[styles.date, { color: isDarkMode ? Colors.light : Colors.dark }]}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showEndDatePicker}
                style={[styles.bigBtn, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}
              >
                <Text style={[styles.dateLabel, { fontFamily: `${font}B`, color: isDarkMode ? accentColor : Colors.light, backgroundColor: isBlackTheme ? Colors.white : isDarkMode ? Colors.white : accentColor }]}>{t('end-date')}</Text>
                <Text style={[styles.date, { color: isDarkMode ? Colors.light : Colors.dark }]}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {book.review && (
          <View style={[styles.reviewContainer, { borderColor: isDarkMode ? Colors.light : Colors.gray }]}>
            <Text style={[styles.reviewTitle, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, fontFamily: `${font}B`, color: accentColor }]}>{t('review')}</Text>
            <Text style={[styles.reviewTxt, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book.review}</Text>
          </View>
        )}

        {book.notes && (
          <View style={[styles.notesContainer, { borderColor: isDarkMode ? Colors.light : Colors.gray }]}>
            <Text style={[styles.notesTitle, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, fontFamily: `${font}B`, color: accentColor }]}>{t('notes')}</Text>
            <Text style={[styles.notesTxt, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book.notes}</Text>
          </View>
        )}

        <GlobalDateTimePicker
          visible={isStartDatePickerVisible}
          initialDate={startDate}
          onSelect={(selectedDate) => handleStartDate({ id: book.id, startDate: selectedDate })}
          onCancel={() => setIsStartDatePickerVisible(false)}
        />

        <GlobalDateTimePicker
          visible={isEndDatePickerVisible}
          initialDate={endDate}
          onSelect={(selectedDate) => handleEndDate({ id: book.id, endDate: selectedDate })}
          onCancel={() => setIsEndDatePickerVisible(false)}
        />

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>
            <View>
              <Text style={[styles.modalHeader, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : accentColor }]}>Enter Progress</Text>
            </View>
            <View style={[styles.modalInputContainer, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}>
              <Text style={[styles.modalLabel, { fontFamily: `${font}R`, backgroundColor: isDarkMode ? Colors.black : Colors.light, color: isDarkMode ? Colors.light : Colors.dark }]}>Current Page</Text>
              <TextInput
                style={[styles.modalInput, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
                value={currentPage?.toString()}
                inputMode="numeric"
                onChangeText={(value) => setCurrentPage(Number(value))}
                defaultValue={book?.currentPage?.toString()}
                onSubmitEditing={() => handleProgressDetails(book ? book.id : 0)}
              />
            </View>
            <View style={[styles.modalInputContainer, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}>
              <Text style={[styles.modalLabel, { fontFamily: `${font}R`, backgroundColor: isDarkMode ? Colors.black : Colors.light, color: isDarkMode ? Colors.light : Colors.dark }]}>Pages</Text>
              <TextInput
                style={[styles.modalInput, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
                value={pageCount?.toString()}
                inputMode="numeric"
                onChangeText={(value) => setPageCount(Number(value))}
                defaultValue={book?.pageCount.toString()}
                onSubmitEditing={() => handleProgressDetails(book ? book.id : 0)}
              />
            </View>
            <View>
              <Pressable
                onTouchStart={() => handleProgressDetails(book ? book.id : 0)}
                style={[styles.modalBtn, { backgroundColor: isDarkMode ? Colors.light : accentColor }]}
              >
                <Text style={[styles.modalBtnText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.dark : Colors.light }]}>{t('save').toUpperCase()}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isRatingModalVisible}
          onBackdropPress={() => setIsRatinModalVisible(false)}
        >
          <View style={[styles.ratingModalContainer, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>
            <View>
              <Text style={[styles.ratingLabel, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}B` }]}>{t('rating')}</Text>
              <TextInput
                style={[styles.ratingInput, { borderColor: isDarkMode ? Colors.light : Colors.dark, color: isDarkMode ? Colors.light : Colors.dark }]}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => {
                  handleRatingValue(value);
                }}
                onSubmitEditing={(value) => {
                  handleRatingValue(value.nativeEvent.text);
                  handleBookRating(book.id);
                }}
              />
              <Pressable
                onTouchStart={() => handleBookRating(book.id)}
                style={[styles.ratingSaveBtn, { backgroundColor: accentColor }]}
              >
                <Text style={(styles.ratingSaveTxt, { fontFamily: `${font}B` })}>{t('save').toUpperCase()}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
};

export default BookDetails;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  contentContainer: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 50,
  },

  thumbnailImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
  },

  textContainer: {
    marginTop: 15,
    gap: 15,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 18,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  smallHeading: {
    color: Colors.gray,
  },

  isbn: {
    textAlign: 'center',
  },

  publishedDate: {
    textAlign: 'center',
  },

  textSpaced: {
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },

  author: {
    fontSize: 15,
    textAlign: 'center',
  },

  additionalInfo: {
    //
  },

  originalTitle: {
    textAlign: 'center',
  },

  ratingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },

  category: {
    textAlign: 'center',
  },

  durationContainer: {
    paddingBottom: 25,
    paddingHorizontal: 10,
  },

  durationMsg: {
    fontSize: 22,
    textAlign: 'center',
  },

  summary: {
    lineHeight: 24,
    fontSize: 15,
  },

  progressContainer: {
    marginVertical: 20,
    marginBottom: 40,
  },

  reviewContainer: {
    width: '92%',
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    position: 'relative',
  },

  reviewTitle: {
    fontSize: 18,
    position: 'absolute',
    top: -15,
    left: 20,
    paddingHorizontal: 8,
  },

  reviewTxt: {
    fontSize: 16,
  },

  notesContainer: {
    width: '92%',
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    position: 'relative',
  },

  notesTitle: {
    fontSize: 18,
    position: 'absolute',
    top: -15,
    left: 20,
    paddingHorizontal: 8,
  },

  notesTxt: {
    fontSize: 16,
  },

  modalHeader: {
    fontSize: 20,
  },

  modalContainer: {
    padding: 20,
    paddingBottom: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    borderRadius: 15,
  },

  modalInputContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '70%',
  },

  modalLabel: {
    textAlign: 'center',
    fontSize: 15,
    position: 'absolute',
    top: -15,
    left: 15,
    paddingHorizontal: 10,
  },

  modalInput: {
    fontSize: 16,
  },

  modalBtn: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 10,
  },

  modalBtnText: {
    fontSize: 15,
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },

  dateTimePicker: {
    borderRadius: 20,
  },

  bigBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 80,
    borderWidth: 1,
    borderRadius: 10,
    // padding: 10,
  },

  dateLabel: {
    fontSize: 17,
    position: 'absolute',
    top: 0,
    paddingBottom: 2,
    textAlign: 'center',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    width: '100%',
    // paddingHorizontal: 8,
    // borderWidth: 2,
  },

  date: {
    marginTop: 25,
    fontSize: 17,
  },

  ratingModalContainer: {
    padding: 20,
    borderRadius: 10,
  },

  ratingLabel: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },

  ratingInput: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 40,
    textAlign: 'center',
    width: 'auto',
  },

  ratingSaveBtn: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 15,
    borderRadius: 20,
  },

  ratingSaveTxt: {
    fontSize: 18,
  },
});
