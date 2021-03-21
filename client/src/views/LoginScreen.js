import * as React from 'react';
import { ScrollView, View, Image, Text, TextInput, Button } from 'react-native';
// import { Button } from '@ant-design/react-native';
import axios from 'axios';
import config from '../config'
import socket from '../utils/socket'
import mystorage from '../utils/storage'

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  React.useEffect(() => {
    socket.on('login', async (user) => {
      mystorage.save('user', user)
      navigation.navigate('Main')
    })
  }, [])

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Text style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', marginRight: 20, height: 100, lineHeight: 100 }}>
        <Image source={require("../assets/chat.jpg")} style={{ height: 100, width: 100 }} />
        <Text>Chat</Text>
      </Text>
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="用户名"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="密码"
          type="password"
          value={password}
          onChangeText={setPassword}
        />
        <Button title="注册/登录"
            onPress={()=>{
              let postData = {username: username, password: password}
              socket.emit('login', postData)
            }}
        />
      </View>
    </View>
  )
}