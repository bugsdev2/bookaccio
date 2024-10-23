import { Tabs } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const CustomIcon = ({ focused, name }: { focused: boolean; name: any }) => (
    <View>
        <View style={{ backgroundColor: focused ? '#1c1c1c' : 'white', borderRadius: 30, width: 100, height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Icon
                name={name}
                size={30}
                color={focused ? 'white' : 'gray'}
            />
        </View>
    </View>
);

const TabsLayout = () => {
    return (
        <>
            <StatusBar style="dark" />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: 'blue',
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: 'white',
                        height: 70,
                        margin: 20,
                        borderRadius: 50,
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
                            />
                        ),
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
                            />
                        ),
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
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
};

export default TabsLayout;
