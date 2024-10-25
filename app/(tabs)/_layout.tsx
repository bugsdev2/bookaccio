import { Link, Tabs } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Entypo from '@expo/vector-icons/Entypo';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';

const TabsLayout = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const CustomIcon = ({ focused, name, title }: { focused: boolean; name: any; title: string }) => (
        <View>
            <View style={[styles.customIconFill, { backgroundColor: focused ? Colors.green : isDarkMode ? Colors.dark : Colors.light }]}>
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
            <View style={[styles.header, { backgroundColor: isDarkMode ? Colors.green : Colors.green }]}>
                <View style={styles.headerInner}>
                    <Text style={styles.headerText}>BOOKACCIO</Text>
                    <Link
                        href={'/(settings)/settings'}
                        asChild
                    >
                        <Pressable style={styles.headerIconContainer}>
                            <Entypo
                                name="dots-three-vertical"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                    </Link>
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
});
