// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import FriendScreen from './FriendScreen/FriendScreen'
import MyScreen from './MyScreen/MyScreen'
import CompassScreen from './CompassScreen/CompassScreen'

import socket from '../utils/socket'
import mystorage from '../utils/storage'


const Tab = createBottomTabNavigator();



export default function Main({navigation}) {
  const [user, setUser] = React.useState('')

  React.useEffect(() => {
    async function readUser() {
      let user = await mystorage.load('user')
      setUser(user)
    }
    readUser()
  }, [user])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === '好友') {
            return <FontAwesome name='address-book' size={size} color={color} />
          } else if (route.name === '发现') {
            return <Feather name='compass' size={size} color={color} />
          } else if (route.name === '我') {
            return <Ionicons name='person' size={size} color={color} />
          }
          // You can return any component that you like here!
          return <AntDesign name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
      initialRouteName="我"
    >
      <Tab.Screen name="好友">{(props) => <FriendScreen {...props} user={user} setUser={setUser} mainNavigation={navigation}/>}</Tab.Screen>
      <Tab.Screen name="发现">{(props) => <CompassScreen {...props} user={user} setUser={setUser} />}</Tab.Screen>
      <Tab.Screen name="我">{(props) => <MyScreen {...props} user={user} setUser={setUser} />}</Tab.Screen>
    </Tab.Navigator>
  );
}