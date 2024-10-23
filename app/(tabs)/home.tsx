import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import BookItem from '@/components/bookItem';

const Home = () => {
    return (
        <SafeAreaView>
            <Text>Home</Text>
            <BookItem />
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({});
