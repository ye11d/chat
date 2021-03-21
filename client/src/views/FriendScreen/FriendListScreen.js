import * as React from 'react';
import { StyleSheet, Button, Text, View, ScrollView, Image, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import socket from '../../utils/socket';

function FriendList(props) {
  const [users, setUsers] = React.useState('')
  // console.log('fprops main', props)
  // console.log('parse', props.currentuser.friends.length, JSON.parse(props.currentuser.friends).length)

  React.useEffect(() => {
    if (props.currentuser.friends !== "") {
      socket.emit('findfriend', JSON.parse(props.currentuser.friends))
    }
  }, [props.currentuser.friends])

  React.useEffect(() => {
    socket.on('findfriend', function (userlist) {
      setUsers(userlist)
      console.log('userlist', userlist)
    })
  }, [users])

  return (
    <View style={styles.userlist}>
      {
        users.length > 0 && users.map(function (user) {
          return (
            <TouchableOpacity style={styles.useritem} key={user.username}
              onPress={()=>{
                console.log('点击了2')
                props.mainNavigation.navigate('Chat', {
                  toUser: user,
                  fromUser: props.currentuser
                })
              }}
            >
              <Image source={{ uri: user.headimg }} style={styles.useritemImg}></Image>
              <View style={styles.useritemCenter}>
                <Text style={styles.useritemName}>{user.username}</Text>
                {/* <Text style={styles.useritemSaying}>最后说的话</Text> */}
                {user.isOnline?
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{backgroundColor: 'green', height: 20, width: 20, borderRadius: 50, marginRight: 5}}></View>
                    <Text style={{ fontSize: 20 }}>online</Text>
                  </View>
                  :
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'red', height: 20, width: 20, borderRadius: 50, marginRight: 5 }}></View>
                    <Text style={{ fontSize: 20 }}>offline</Text>
                  </View>
                }
              </View>
              {/* <Text style={styles.useritemTime}>time</Text> */}
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
}


export default function FriendListScreen(props, { navigation }) {
  const { user, setUser } = props
  // console.log('friendlistScreen', props)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: props.user.headimg }} style={styles.headimg}></Image>
        <Text style={{ fontSize: 20 }}>好友</Text>
        <AntDesign name="adduser" size={40} color="#87CEFA"
          onPress={() => {
            props.navigation.navigate('FindFriend')
          }}
        />
      </View>
      <FriendList
        {...props} currentuser={user} setUser={setUser}
      />
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  headimg: {
    width: 60,
    height: 60,
  },
  userlist: {
    flex: 1,
  },
  useritem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
  useritemImg: {
    width: 100,
    height: 100
  },
  useritemCenter: {
    marginLeft: 15,
    flex: 1,
  },
  useritemName: {
    fontSize: 25,
    marginBottom: 10,
  },
  useritemSaying: {
    fontSize: 15,
    color: 'gray',
  },
  useritemTime: {
    marginTop: 40,
    marginRight: 15,
    alignSelf: 'flex-start',
  }
})