import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from "react-native"
import HomeScreen from '../Screens/HomeScreen'
import SplashScreen from "../Screens/SplashScreen";



const Stack = createStackNavigator();

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
])

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen} />
                <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}