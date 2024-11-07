import { StyleSheet, Text, View, Pressable, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import bookCoverPlaceholder from '../assets/images/others/book-cover-placeholder.png';
import { useFontsContext } from '@/providers/fontProvider';
import axios from 'axios';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { processUrl } from '@/helpers/processUrl';

const BookSearchItem = ({ book, onPress }: { book: BookSearchResultProp; onPress: any }) => {
    const [font, setFont] = useFontsContext();

    return (
        <>
            <TouchableOpacity
                key={book.selfLink}
                onPress={onPress}
            >
                <View style={styles.modalBookItem}>
                    <Image
                        style={styles.modalImage}
                        source={book?.volumeInfo?.imageLinks && book?.volumeInfo?.imageLinks?.thumbnail !== '' ? { uri: processUrl(book?.volumeInfo?.imageLinks?.thumbnail) } : bookCoverPlaceholder}
                    />
                    <View style={{ width: '70%' }}>
                        <Text style={[styles.modalBookTitle, { fontFamily: `${font}B` }]}>{book?.volumeInfo?.title}</Text>
                        <Text style={[styles.modalBookDetails, { fontFamily: `${font}R` }]}>{book?.volumeInfo?.subtitle}</Text>
                        <Text style={[styles.modalBookDetails, { fontFamily: `${font}R` }]}>{book?.volumeInfo?.authors !== undefined ? book?.volumeInfo?.authors[0] : ''}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default BookSearchItem;

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
