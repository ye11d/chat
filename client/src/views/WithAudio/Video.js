import * as React from 'react';
import { ScrollView, View, Image, Text, TextInput, Button } from 'react-native';
import VideoPlayer from 'react-native-video-controls';


export default function Video() {
  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <VideoPlayer source={require('../../assets/oceans.mp4')} />
    </View>
  )
}