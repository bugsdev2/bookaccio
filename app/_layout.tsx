import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import Providers from '@/providers/providers';

export default function RootLayout() {
  const [loaded] = useFonts({
    LibreB: require('../assets/fonts/LibreBaskerville-Bold.ttf'),
    LibreR: require('../assets/fonts/LibreBaskerville-Regular.ttf'),
    LoraB: require('../assets/fonts/Lora-Bold.ttf'),
    LoraR: require('../assets/fonts/Lora-Regular.ttf'),
    MontB: require('../assets/fonts/Montserrat-Bold.ttf'),
    MontR: require('../assets/fonts/Montserrat-Regular.ttf'),
    NunitoB: require('../assets/fonts/Nunito-Bold.ttf'),
    NunitoR: require('../assets/fonts/Nunito-Regular.ttf'),
    OswaldB: require('../assets/fonts/Oswald-Bold.ttf'),
    OswaldR: require('../assets/fonts/Oswald-Regular.ttf'),
    PlayFairB: require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    PlayFairR: require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    PoppinsB: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsL: require('../assets/fonts/Poppins-Light.ttf'),
    PoppinsR: require('../assets/fonts/Poppins-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    QuicksandB: require('../assets/fonts/Quicksand-Bold.ttf'),
    QuicksandR: require('../assets/fonts/Quicksand-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(settings)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(bookDetails)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(addBook)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(editBook)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(scanner)"
          options={{ headerShown: false }}
        />
      </Stack>
    </Providers>
  );
}
