// Entry point — redirect to onboarding on first launch.
// In production you'd check stored auth state here.
import { Redirect } from 'expo-router';

export default function Entry() {
  return <Redirect href="/onboarding" />;
}
