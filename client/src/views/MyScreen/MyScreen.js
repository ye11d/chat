import * as React from 'react';
import { Button, Text, View, Image } from 'react-native';
import config from '../../config'
import mystorage from '../../utils/storage'

export default function MyScreen(props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>我</Text>
      <Text>{props.user.username}</Text>
      <Image source={{ uri: props.user.headimg }} style={{ width: 200, height: 200 }}></Image>
      <Button title="show me"
        onPress={() => {
          console.log('点击了')
          let user = { "headimg": "http://10.0.2.2:3200/headimg/abc.jpg", "id": 2, "isOnlice": 1, "password": "123", "username": "改名卡" }
          props.setUser(user)
        }}
      />
    </View>
  );
}