import { useDarkModeContext } from '@/providers/themeProvider';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '../constants/Colors';
import { useFontsContext } from '@/providers/fontProvider';
import { setData } from '@/helpers/storage';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { useLanguageContext } from '@/providers/languageProvider';
import i18n from '@/services/i18next';
import { languageList } from '../constants/languageList';
import { useTranslation } from 'react-i18next';

const SettingItem = ({ label, data }: SettingItemProps) => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [font, setFont] = useFontsContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [language, setLanguage] = useLanguageContext();

  const { t } = useTranslation();

  const selectedText = () => {
    switch (label) {
      case t('theme'):
        return isDarkMode ? 'Dark' : 'Light';
      case t('font'):
        return font;
      case t('accent-color'):
        return data.filter((item) => item.value === accentColor)[0].title;
      case t('language'):
        return languageList[language].nativeName;
    }
  };

  const handleSelectedItem = (value: any) => {
    switch (label) {
      case t('theme'):
        if (!value) {
          setIsBlackTheme(value);
          setData('isBlackTheme', value);
        }
        setIsDarkMode(value);
        setData('theme', value);
        break;
      case t('font'):
        setFont(value);
        setData('font', value);
        break;
      case t('accent-color'):
        setAccentColor(value);
        setData('accentColor', value);
        break;
      case t('language'):
        setLanguage(value);
        setData('language', value);
        i18n.changeLanguage(value);
        break;
    }
  };

  return (
    <View style={styles.themeContainer}>
      <Text style={[styles.themeLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>{label}</Text>
      <View style={[styles.themeSelect]}>
        <Dropdown
          style={[styles.dropDownView, { backgroundColor: isDarkMode ? Colors.light : accentColor }]}
          data={data}
          onChange={(selectedItem) => handleSelectedItem(selectedItem.value)}
          labelField={'title'}
          placeholder={selectedText()}
          placeholderStyle={[styles.dropDownView, { color: isDarkMode ? Colors.dark : Colors.light }]}
          selectedTextStyle={[styles.dropDownView, { color: isDarkMode ? Colors.dark : Colors.light }]}
          valueField={'value'}
          itemTextStyle={styles.dropDownText}
        />
      </View>
    </View>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  themeContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  themeLabel: {
    fontSize: 15,
    flex: 1,
    fontFamily: 'MontB',
  },

  themeSelect: {
    flex: 3,
  },

  themeSelectInner: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },

  themeSelectText: {
    fontSize: 15,
    fontFamily: 'MontB',
  },

  chevronContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropDownView: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    fontFamily: 'MontR',
  },

  dropDownText: {
    fontFamily: 'MontR',
  },
});
