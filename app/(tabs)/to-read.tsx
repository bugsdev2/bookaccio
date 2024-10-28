import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import BookItem from '@/components/bookItem';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import { getBookList } from '@/helpers/getBookList';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAccentColorContext } from '@/providers/accentColorProvider';

const ToRead = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [hidePlusBtn, setHidePlusBtn] = useState(false);

    const [bookList, setBookList] = useState<BookItem[]>();

    useEffect(() => {
        getBookList().then((data) => {
            setBookList(data);
        });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
            <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={bookList}
                renderItem={({ item }) => <View>{item.state === 'READ_LATER' ? <BookItem data={item} /> : null}</View>}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                // onScrollBeginDrag={() => setHidePlusBtn(true)}
                // onScrollEndDrag={() => setHidePlusBtn(false)}
                onMomentumScrollBegin={() => setHidePlusBtn(true)}
                onMomentumScrollEnd={() => setHidePlusBtn(false)}
            />
            <Pressable style={styles.plusIcon}>
                {hidePlusBtn ? null : (
                    <AntDesign
                        name="pluscircle"
                        size={55}
                        color={accentColor}
                    />
                )}
            </Pressable>
        </View>
    );
};

export default ToRead;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    plusIcon: {
        position: 'absolute',
        right: 30,
        bottom: 20,
    },
});
