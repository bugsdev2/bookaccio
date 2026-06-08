import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useDarkModeContext } from '@/providers/themeProvider';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { Colors } from '@/constants/Colors';
import { useFontsContext } from '@/providers/fontProvider';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';

type Stats = {
  totalBooksRead: number;
  totalBooksReadThisYear: number;
  totalBooksReading: number;
  totalBooksToRead: number;
  totalPagesRead: number;
  totalPagesReadThisYear: number;
  authorsRead: string[];
  authourCount: { author: string; count: number }[];
};

const Statistics = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();
  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();
  const [font, setFont] = useFontsContext();
  const [fullBookList, setFullBookList] = useFullBookListContext();
  const [accentColor, setAccentColor] = useAccentColorContext();

  const stats: Stats = {
    totalBooksRead: 0,
    totalBooksReadThisYear: 0,
    totalBooksReading: 0,
    totalBooksToRead: 0,
    totalPagesRead: 0,
    totalPagesReadThisYear: 0,
    authorsRead: [],
    authourCount: [],
  };

  fullBookList.forEach((book) => {
    if (book.state === 'READ') {
      stats.totalBooksRead++;

      if (new Date(book.endDate).getFullYear() === new Date().getFullYear()) {
        stats.totalBooksReadThisYear++;
      }
    }
    if (book.state === 'READING') {
      stats.totalBooksReading++;
    }
    if (book.state === 'READ_LATER') {
      stats.totalBooksToRead++;
    }

    if (book.state === 'READ') {
      stats.totalPagesRead += book.pageCount;
      if (new Date(book.endDate).getFullYear() === new Date().getFullYear()) {
        stats.totalPagesReadThisYear += book.pageCount;
      }
    }

    if (book.state === 'READING') {
      stats.totalPagesRead += book.currentPage || 0;
      if (new Date(book.endDate).getFullYear() === new Date().getFullYear()) {
        stats.totalPagesReadThisYear += book.currentPage || 0;
      }
    }

    stats.authorsRead.push(...book.authors.map((author) => author));
  });

  let count = 0;

  for (let author of stats.authorsRead) {
    console.log(stats.authorsRead.includes(author));
    if (stats.authorsRead.includes(author)) {
      stats.authourCount.push({ author: author, count: count++ });
    } else {
      stats.authourCount.push({ author: author, count: 0 });
    }
  }

  console.log(stats.authorsRead.map((author) => author.replaceAll(' ', '').replaceAll('.', '').replaceAll("'", '').toLowerCase()).sort());

  console.log(stats.authourCount);

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: isBlackTheme ? Colors.closeBlack : isDarkMode ? Colors.black : Colors.light }]}>
        <ScrollView>
          <View style={styles.section}>
            <Text style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'B' }]}>Reading Statistics</Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.bigNumber, { color: accentColor }]}>{stats.totalBooksReadThisYear}</Text>
            <Text style={[styles.text, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'B' }]}>Books Read This Year</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* <SafeAreaView style={[styles.container, { backgroundColor: isBlackTheme ? Colors.closeBlack : isDarkMode ? Colors.black : Colors.light }]}>
        <ScrollView>
          <View style={styles.section}>
            <Text style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'B' }]}>Reading Statistics</Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.bigNumber, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'R' }]}>Total Books Read: {stats.totalBooksRead}</Text>
            <Text style={[styles.bigNumber, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'R' }]}>Total Books Reading: {stats.totalBooksReading}</Text>
            <Text style={[styles.bigNumber, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'R' }]}>Total Books To Read: {stats.totalBooksToRead}</Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.bigNumber, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'R' }]}>Total Pages Read: {stats.totalPagesRead}</Text>
            <Text style={[styles.bigNumber, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: font + 'R' }]}>Total Pages Read This Year: {stats.totalPagesReadThisYear}</Text>
          </View>
        </ScrollView>
      </SafeAreaView> */}
    </>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
  },

  section: {
    marginVertical: 10,
  },

  title: {
    textAlign: 'center',
    fontSize: 24,
  },

  bigNumber: {
    fontSize: 152,
    textAlign: 'center',
  },

  text: {
    fontSize: 30,
    textAlign: 'center',
  },
});
