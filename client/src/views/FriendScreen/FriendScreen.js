import * as React from 'react';
import { StyleSheet, Button, Text, View, ScrollView, Image, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'

import FriendListScreen from './FriendListScreen'
import FindFriendScreen from './FindFriendScreen'

const StackFriend = createStackNavigator();

export default function FriendScreen(props) {
  const { user, setUser, mainNavigation } = props
  // console.log('friendprops', props)
  return (
    <StackFriend.Navigator initialRouteName="FriendList">
      <StackFriend.Screen name="FriendList" options={{ headerShown: false }}>
        {(props) => <FriendListScreen {...props} user={user} setUser={setUser} mainNavigation={mainNavigation} />}
      </StackFriend.Screen>
      <StackFriend.Screen name="FindFriend">
        {(props) => <FindFriendScreen {...props} user={user} setUser={setUser} />}
      </StackFriend.Screen>
    </StackFriend.Navigator>
  );
}