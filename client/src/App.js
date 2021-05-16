// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native'

import Main from './views/Main'
import LoginScreen from './views/LoginScreen'
import ChatScreen from './views/ChatScreen'
import Audio from './views/Audio'
import Video from './views/Video'

const Stack = createStackNavigator();

function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Video">
        <Stack.Screen name="Login" component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Main" options={{ headerShown: false }} component={Main}
        />
        <Stack.Screen name="Chat" component={ChatScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Audio"
          component={Audio}
        />
        <Stack.Screen
          name="Video"
          component={Video}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;