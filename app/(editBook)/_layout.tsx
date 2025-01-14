import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useTranslation } from 'react-i18next';

const PagesLayout = () => {
  const [accentColor, setAccentColor] = useAccentColorContext();

  const { t } = useTranslation();
  return (
    <>
      <View style={[styles.header, { backgroundColor: accentColor, borderColor: accentColor }]}>
        <View style={styles.headerInner}>
          <View style={{ flex: 1 }}>
            <Pressable onPress={() => router.back()}>
              <MaterialIcons
                name="chevron-left"
                size={40}
                color={Colors.light}
              />
            </Pressable>
          </View>
          <View style={styles.headerTextContainer}>
            <Text
              style={styles.headerText}
              numberOfLines={1}
              ellipsizeMode="tail"
              allowFontScaling={false}
              adjustsFontSizeToFit={false}
              lineBreakMode="tail"
              textBreakStrategy="highQuality"
              minimumFontScale={12}
            >
              {t('edit-book')}
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
      </View>
      <Stack>
        <Stack.Screen
          name="[editBook]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default PagesLayout;

const styles = StyleSheet.create({
  header: {
    height: 90,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },

  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    // borderWidth: 1,
  },

  headerTextContainer: {
    width: '75%',
  },

  headerText: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'OswaldB',
    textAlign: 'center',
  },

  headerIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 45,
    height: 40,
    bottom: 8,
    // borderWidth: 1,
  },
});
