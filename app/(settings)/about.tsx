import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useDarkModeContext } from '@/providers/themeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import * as WebBrowser from 'expo-web-browser';

const About = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    function handleLink(url: string) {
        WebBrowser.openBrowserAsync(url);
    }

    const Link = ({ text, url }: { text: string; url: string }) => {
        return (
            <Text
                onPress={() => handleLink(url)}
                style={[styles.linkText, { color: accentColor }]}
            >
                {` ${text} `}
            </Text>
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={[styles.headerTitle, { color: accentColor }]}>About</Text>
                </View>
                <View>
                    <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>BookAccio is your ultimate book tracking companion. Add, organize, and manage your reading list with ease using data from the Google Books API. Track reading progress, update book details, and export your library with one tap!</Text>
                </View>
                <View>
                    <Text style={[styles.headerTitle, { color: accentColor }]}>Bookaccio?</Text>
                    <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>The name "Bookaccio" can be pronounced in two different ways: </Text>
                    <Text style={[styles.textStrong, { color: isDarkMode ? Colors.white : Colors.dark }]}>
                        Bu-kah-ch(ee)oh <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>(IPA: /bʊˈkɑːtʃ(i)oʊ/)</Text>
                    </Text>
                    <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>
                        This app is inspired by
                        <Link
                            text="Dante Book Tracker"
                            url="https://github.com/shockbytes/DanteX"
                        />
                        app created by
                        <Link
                            text="Martin Macheiner "
                            url="https://github.com/shockbytes"
                        />
                        . Since there have been no recent developments in that app, I thought of making my own with my limited knowledge of React Native.
                    </Text>
                    <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>
                        The name 'Bookaccio' is a nod to one of Italy’s most influential writers
                        <Link
                            text="Giovanni Boccaccio"
                            url="https://en.wikipedia.org/wiki/Giovanni_Boccaccio"
                        />
                        who was a contemporary of
                        <Link
                            text="Dante Alighieri"
                            url="https://en.wikipedia.org/wiki/Dante_Alighieri"
                        />
                        . While the Dante Book Tracker app made no explicit connections to Dante Alighieri, I enjoy thinking of this small connection between my "Booccaccio" and Martin's "Dante"
                    </Text>
                    <Text style={[styles.textStrong, { color: isDarkMode ? Colors.white : Colors.dark }]}>
                        Book-ack-ee-oh <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>(IPA: /bʊ'kækioʊ/)</Text>
                    </Text>
                    <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>This pronunciation is most probably the one you're likely to think of when you see the name for the first time.</Text>
                    <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>
                        It is inspired by the summoning spell
                        <Link
                            text='"Accio"'
                            url="https://harrypotter.fandom.com/wiki/Summoning_Charm"
                        />
                        from the Harry Potter series, used to magically call objects to you just like how the app helps you “summon” books and organize them.
                    </Text>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        //
    },

    contentContainer: {
        padding: 10,
    },

    headerContainer: {
        padding: 10,
        marginBottom: 10,
    },

    headerTitle: {
        fontSize: 25,
        textAlign: 'center',
        fontFamily: 'MontB',
    },

    text: {
        fontFamily: 'MontR',
        fontSize: 15,
        textAlign: 'justify',
        lineHeight: 30,
        padding: 10,
    },

    textStrong: {
        fontSize: 18,
        fontFamily: 'MontB',
        paddingHorizontal: 10,
    },

    link: {
        position: 'relative',
    },

    linkText: {
        fontWeight: 'bold',
    },
});
