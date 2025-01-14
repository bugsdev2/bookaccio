import { Redirect } from 'expo-router';
import '@/services/i18next';

export default function Index() {
  return <Redirect href={'/(tabs)/home'} />;
}
