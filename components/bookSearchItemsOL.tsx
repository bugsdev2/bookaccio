import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import bookCoverPlaceholder from '../assets/images/others/book-cover-placeholder.png';
import { useFontsContext } from '@/providers/fontProvider';

const BookSearchItemOL = ({ book, onPress }: { book: OLBookSearchResults; onPress: any }) => {
  const [font, setFont] = useFontsContext();

  return (
    <>
      <TouchableOpacity
        key={book.key}
        onPress={onPress}
      >
        <View style={styles.modalBookItem}>
          <Image
            style={styles.modalImage}
            source={book.cover_i ? { uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` } : bookCoverPlaceholder}
          />
          <View style={{ width: '70%' }}>
            <Text style={[styles.modalBookTitle, { fontFamily: `${font}B` }]}>{book.title}</Text>
            {/* <Text style={[styles.modalBookDetails, { fontFamily: `${font}R` }]}>{book.isbn}</Text> */}
            <Text style={[styles.modalBookDetails, { fontFamily: `${font}R` }]}>{Array.isArray(book?.author_name) ? book.author_name.slice(0, 2).join(', ') : book.author_name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default BookSearchItemOL;

const styles = StyleSheet.create({
  modalBookItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    padding: 15,
    width: '100%',
    borderRadius: 10,
  },

  modalBookTitle: {
    fontSize: 15,
  },

  modalBookDetails: {
    fontSize: 15,
  },

  modalImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
});
