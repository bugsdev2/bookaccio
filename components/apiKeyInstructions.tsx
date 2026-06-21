import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import * as WebBrowser from 'expo-web-browser';

export default function ApiKeyInstructions() {
  const [accentColor] = useAccentColorContext();

  const handleLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <>
      <ScrollView style={[styles.container]}>
        <View style={[styles.section]}>
          <Text style={[styles.title, styles.bold, { color: accentColor }]}>Step-by-Step Instructions for generating a Google Books API</Text>
        </View>
        <View style={[styles.section]}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Prerequisite:</Text> They will need a Google account (like Gmail). This is used to access the Google Cloud Console and manage their keys.
          </Text>
        </View>
        <View style={[styles.section]}>
          <Text style={styles.heading}>Go to the Google Cloud Console</Text>
          <Text style={styles.text}>
            • Open your web browser and go to the
            <Text
              style={{ color: accentColor, fontWeight: 'bold' }}
              onPress={() => handleLink('https://console.cloud.google.com/')}
            >
              {' '}
              Google Cloud Console
            </Text>
            . Make sure you are signed in with your Google account.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Create a New Project</Text>
          <Text style={styles.text}>• In the top navigation bar, click on “Select a project” button.</Text>
          <Text style={styles.text}>• In the window that appears, click "New Project".</Text>
          <Text style={styles.text}>• Give your project a name (e.g., "Bookaccio") and click "Create". Creation takes a few seconds. </Text>
          <Text style={styles.text}>• Once done, make sure this new project is selected in the top bar.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Enable the Google Books API</Text>
          <Text style={styles.text}>• Click on the hamburger menu on the top left corner.</Text>
          <Text style={styles.text}>• From the left-hand menu, navigate to "APIs & Services" &gt; "Library"</Text>
          <Text style={styles.text}>• In the search bar, type "Books API" and click on the "Google Books API" result.</Text>
          <Text style={styles.text}>• On the API page, click the "Enable" button.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Generate Your API Key</Text>
          <Text style={styles.text}>• From the left-hand menu, go to "APIs & Services" &gt; "Credentials" </Text>
          <Text style={styles.text}>• At the top of the page, click "+ Create Credentials" and select "API key" from the dropdown menu.</Text>
          <Text style={styles.text}>• In the pop-up, enter a unique name like “Bookaccio”.</Text>
          <Text style={styles.text}>• In the dropdown menu titled “Select API restrictions”, select “Books API” and then at the bottom, click on create.</Text>
          <Text style={styles.text}>• A pop-up will appear with your newly generated API key. Copy this key immediately and save it somewhere safe. You will not be able to see it again through the console.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Enter the Key in Your App</Text>
          <Text style={styles.text}>• Open your app and find the settings or configuration area where you can enter your new API key.</Text>
          <Text style={styles.text}>• Paste the key you copied and save it.</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '70%',
  },

  section: {
    marginVertical: 5,
  },

  title: {
    textAlign: 'center',
    fontSize: 18,
  },

  bold: {
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  text: {
    fontSize: 15,
  },
});
