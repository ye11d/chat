import * as React from 'react';
import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'

import Home from './WithAudio/Home'
import Video from './WithAudio/Video'
import News from './WithAudio/News'
import Music from './WithAudio/Music'
import VideoDetail from './WithAudio/VideoDetail'
import NewsDetail from './WithAudio/NewsDetail'
import MusicDetail from './WithAudio/MusicDetail'

export default class MainWithAudio extends React.Component {
  render() {
    const StackAudio = createStackNavigator();
    return (
      <StackAudio.Navigator initialRouteName="Home">
        <StackAudio.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false
          }}
        />
        <StackAudio.Screen
          name="Video"
          component={Video}
          options={{
            // headerShown: false
            headerTitle: '视频页',
          }}
        />
        <StackAudio.Screen
          name="Music"
          component={Music}
          options={{
            // headerShown: false
            headerTitle: '音乐页',
          }}
        />
        <StackAudio.Screen
          name="News"
          component={News}
          options={{
            // headerShown: false
            headerTitle: '新闻页',
          }}
        />
        <StackAudio.Screen
          name="VideoDetail"
          component={VideoDetail}
          options={{
            // headerShown: false
            headerTitle: '视频',
          }}
        />
        <StackAudio.Screen
          name="MusicDetail"
          component={MusicDetail}
          options={{
            // headerShown: false
            headerTitle: '音乐',
          }}
        />
        <StackAudio.Screen
          name="NewsDetail"
          component={NewsDetail}
          options={{
            // headerShown: false
            headerTitle: '新闻',
          }}
        />
      </StackAudio.Navigator>
    )
  }
}