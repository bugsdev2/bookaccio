import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import BookItem from '@/components/bookItem';
import { Link } from 'expo-router';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import data from '../../test';
import AntDesign from '@expo/vector-icons/AntDesign';

const Home = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();
    const [hidePlusBtn, setHidePlusBtn] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
            <FlatList
                data={data?.books}
                renderItem={({ item }) => <View>{item.state === 'READING' ? <BookItem data={item} /> : null}</View>}
                // ListFooterComponent={() => <View style={{ height: 100 }} />}
                onScrollBeginDrag={() => setHidePlusBtn(true)}
                onScrollEndDrag={() => setHidePlusBtn(false)}
                onMomentumScrollBegin={() => setHidePlusBtn(true)}
                onMomentumScrollEnd={() => setHidePlusBtn(false)}
            ></FlatList>
            <View style={styles.plusIcon}>
                {hidePlusBtn ? null : (
                    <AntDesign
                        name="pluscircle"
                        size={55}
                        color={Colors.green}
                    />
                )}
            </View>
        </View>
    );
};

export default Home;

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
