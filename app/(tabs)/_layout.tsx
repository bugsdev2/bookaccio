import { Link, Tabs } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Entypo from '@expo/vector-icons/Entypo';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import Modal from 'react-native-modal';
import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TabsLayout = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [modalVisible, setModalVisible] = useState(false);

    const CustomIcon = ({ focused, name, title }: { focused: boolean; name: any; title: string }) => (
        <View>
            <View style={[styles.customIconFill, { backgroundColor: focused ? accentColor : isDarkMode ? Colors.dark : Colors.light }]}>
                <Icon
                    name={name}
                    size={30}
                    color={focused ? Colors.light : isDarkMode ? Colors.light : Colors.gray}
                />
                {focused ? <Text style={{ color: Colors.light, fontWeight: 'bold' }}>{title}</Text> : null}
            </View>
        </View>
    );

    return (
        <>
            <StatusBar style="light" />
            <View style={[styles.header, { backgroundColor: accentColor }]}>
                <View style={styles.headerInner}>
                    <Text style={styles.headerText}>BOOKACCIO</Text>
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        style={styles.headerIconContainer}
                    >
                        <Entypo
                            name="dots-three-vertical"
                            size={22}
                            color="white"
                        />
                    </Pressable>
                    <Modal
                        isVisible={modalVisible}
                        onBackdropPress={() => setModalVisible(false)}
                    >
                        <View style={[styles.modalView, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
                            <Pressable
                                style={[styles.closeBtn]}
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={23}
                                    color={isDarkMode ? Colors.light : accentColor}
                                />
                            </Pressable>
                            <View>
                                <View>
                                    <Link
                                        href={'/(settings)/settings'}
                                        asChild
                                    >
                                        <Pressable
                                            style={styles.linkContainer}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <MaterialIcons
                                                name="settings"
                                                size={22}
                                                color={isDarkMode ? Colors.light : accentColor}
                                            />
                                            <Text style={[styles.linkText, { color: isDarkMode ? Colors.light : accentColor }]}>Settings</Text>
                                        </Pressable>
                                    </Link>
                                </View>
                                <View>
                                    <Link
                                        href={'/(settings)/about'}
                                        asChild
                                    >
                                        <Pressable
                                            style={styles.linkContainer}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <MaterialIcons
                                                name="info"
                                                size={22}
                                                color={isDarkMode ? Colors.light : accentColor}
                                            />
                                            <Text style={[styles.linkText, { color: isDarkMode ? Colors.light : accentColor }]}>About</Text>
                                        </Pressable>
                                    </Link>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: isDarkMode ? Colors.dark : Colors.light,
                        height: 65,
                        borderTopColor: isDarkMode ? Colors.black : Colors.light,
                        elevation: 10,
                    },
                }}
            >
                <Tabs.Screen
                    name="to-read"
                    options={{
                        headerShown: false,
                        headerTitle: 'To Read',
                        tabBarIcon: ({ focused }) => (
                            <CustomIcon
                                name="bookmark"
                                focused={focused}
                                title="For Later"
                            />
                        ),
                        // unmountOnBlur: true,
                    }}
                />
                <Tabs.Screen
                    name="home"
                    options={{
                        headerShown: false,
                        headerTitle: 'Reading',
                        tabBarIcon: ({ focused }) => (
                            <CustomIcon
                                name="book-open"
                                focused={focused}
                                title="Reading"
                            />
                        ),
                        // unmountOnBlur: true,
                    }}
                />
                <Tabs.Screen
                    name="read"
                    options={{
                        headerShown: false,
                        headerTitle: 'Read',
                        tabBarIcon: ({ focused }) => (
                            <CustomIcon
                                name="book"
                                focused={focused}
                                title="Done"
                            />
                        ),
                        // unmountOnBlur: true,
                    }}
                />
            </Tabs>
        </>
    );
};

export default TabsLayout;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 90,
        justifyContent: 'flex-end',
        paddingLeft: 20,
        paddingBottom: 10,
    },

    headerInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerText: {
        fontSize: 25,
        color: 'white',
        // fontWeight: 'bold',
        fontFamily: 'OswaldB',
        // letterSpacing: 0.5,
    },

    brand: {
        width: 160,
        height: 30,
    },

    customIconFill: {
        borderRadius: 30,
        width: 100,
        height: 60,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
    },

    headerIconContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingVertical: 8,
    },

    modalView: {
        height: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        margin: -20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
    },

    linkText: {
        fontSize: 17,
        fontFamily: 'MontB',
    },

    closeBtn: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
});
