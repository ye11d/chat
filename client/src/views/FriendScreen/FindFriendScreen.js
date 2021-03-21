import * as React from 'react';
import { StyleSheet, Button, Text, View, ScrollView, Image, TextInput } from 'react-native';
// import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

import socket from '../../utils/socket'
import mystorage from '../../utils/storage'

function AddFriendList(props) {
  const [users, setUsers] = React.useState('')
  // console.log('addFriendprops', props)
  // console.log('parse', props.currentuser)
  React.useEffect(() => {
    socket.on('finduser', function (userlist) {
      setUsers(userlist)
    })
  }, [users])

  return (
    <View>
      {
        users.length > 0 && users.map(function (user) {
          return (
            <View style={styles.header} key={user.username}>
              <Image source={{ uri: user.headimg }} style={styles.headimg}></Image>
              <Text style={ styles.headtext }>{user.username}</Text>
              {props.currentuser.friends !== "" && props.currentuser.friends.indexOf(user.username)!==-1 ?
                <Ionicons name="checkmark" size={100} color="#87CEFA"
                  onPress={() => {
                    console.log('已添加')
                  }}
                />
                :
                <Ionicons name="add" size={100} color="#87CEFA"
                  onPress={() => {
                    console.log('addFriend emit event')
                    socket.emit('addFriend', {
                      from: props.currentuser.username,
                      to: user.username
                    })
                    socket.on('addFriendOk', (data) => {
                      console.log('new user', data)
                      mystorage.save('user', data)
                      props.setUser(data)
                    })
                  }}
                />
              }
            </View>
          )
        })
      }
    </View>
  )
}

export default function FindFriendScreen(props) {
  const { user, setUser } = props
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{
        height: 50,
        backgroundColor: 'white',
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 10
      }}>
        <TextInput
          placeholder="搜索12"
          style={{
            marginLeft: 20,
          }}
          onChangeText={(data) => {
            if (data) {
              // console.log('data不为空', data, )
              socket.emit('finduser', data)

            } else {
              console.log('data为空')
            }
          }}
        />
      </View>
      <AddFriendList currentuser={user} setUser={setUser}/>
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
  headtext: {
    fontSize: 40
  },
  headimg: {
    width: 100,
    height: 100,
  }
})