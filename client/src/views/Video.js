import * as React from 'react';
import { ScrollView, View, Image, Text, TextInput, Button } from 'react-native';
// import { Button } from '@ant-design/react-native';
import VideoPlayer from 'react-native-video-controls';

import chat from "../assets/chat.jpg"
export default function Video() {
  return (

      <View style={{ backgroundColor: 'white', flex: 1 }}>
        {/* <VideoPlayer
          source={{ uri: 'https://vjs.zencdn.net/v/oceans.mp4' }}
          // navigator={this.props.navigator}
        />; */}
        <VideoPlayer source={require('../assets/oceans.mp4')} />
        <Image source={chat} style={{ height: 100, width: 100 }} />
        {/* <Button title="播放"></Button> */}
        {/* <Text>1233</Text> */}
        <Button title="播放"></Button>

      </View>
  )
}