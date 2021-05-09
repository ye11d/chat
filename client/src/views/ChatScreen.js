import * as React from 'react';
import { StyleSheet, Button, Text, View, ScrollView, Image, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';

// import moment from 'moment'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import socket from '../utils/socket'
import mystorage from '../utils/storage'

export default function ChatScreen({ route, navigation }) {
  const [ toUser, setToUser ] = React.useState(route.params.toUser)
  const [ fromUser, setFromUser ] = React.useState(route.params.fromUser)
  const [ inputText, setInputText] = React.useState('Useless Placeholder');
  const [ msglist, setMsglist ] = React.useState('')

  React.useEffect(() => {
    socket.on('singlechat', async (msg) => {
      console.log('socketid', socket.id)
      console.log('服务端发来的msg', msg, msg.to, msg.from, msg.to == msg.from)
      let storagename = `${msg.from}`
      let msgstorage
      try {
        msgstorage = await mystorage.load(storagename)
      } catch (err) {
        console.log('error', err)
        msgstorage = {
          msglist: []
        }
      }

      msg.type = 'receive'
      msg.differentid = msg.type + msg.time
      msgstorage.msglist.push(msg)
      msgstorage.lastmsg = msg
      await mystorage.save('msgstorage', msgstorage)
      msgstorage = await mystorage.load(storagename)
      console.log('存储recevie new storage:', msgstorage)
      setMsglist(msgstorage.msglist)
      // console.log('\nmsglist:\n', msglist)
    })
  }, [])


  React.useEffect(() => {
    console.log('调用了Effect2')
    async function readMsg() {
      console.log('to', toUser.username)
      let msgstorage = await mystorage.load(toUser.username)
      setMsglist(msgstorage.msglist)
      console.log('\nmsglist:\n', msglist)
    }
    readMsg()
  }, [msglist])

  // console.log('toUser', toUser, route.params.toUser)
  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: toUser.headimg }} style={styles.headimg}></Image>
          <Text style={{ fontSize: 40 }}>{ toUser.username }</Text>
        </View>
        <View style={styles.main}>
          <ScrollView style={styles.msglist}>
            {
              msglist.length > 0 && msglist.map(function (msg) {
                return (
                  <View style={styles.msgitem} key={msg.differentid}>
                    {
                      msg.type == "send" ?
                        <View style={styles.rightMsgItem}>
                          <View style={styles.rightMsgBorder}>
                            <Text style={styles.rightMsgText}>{msg.data}</Text>
                          </View>
                          <Image source={{ uri: fromUser.headimg }} style={styles.MsgImg}/>
                        </View>
                        :
                        <View style={styles.leftMsgItem}>
                          <Image source={{ uri: toUser.headimg }} style={styles.MsgImg}/>
                          <View style={styles.leftMsgBorder}>
                            <Text style={styles.leftMsgText}>{msg.data}</Text>
                          </View>
                        </View>
                    }
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
        <View style={styles.bottom}>
          <MaterialCommunityIcons name="microphone-outline" size={30} color="black" />
          <View style={styles.textinputborder}>
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => {
                setInputText(text)
              }}
              value={inputText}
            />
          </View>
          <MaterialCommunityIcons name="emoticon-happy-outline" style={{ marginRight: 10 }} size={30} color="black" />
          {inputText !== "" ?
            <Button title="发送"
              onPress={async ()=>{
                // console.log('\n要发送的', inputText, '\n发送给', toUser, '\n发送者', fromUser)
                let msg = {
                  data: inputText,
                  to: toUser.username,
                  from: fromUser.username,
                  time: new Date().getTime(),
                  type: 'send',
                }

                msg.differentid = msg.type + msg.time
                // console.log('改了之后的msg', msg)
                //读取并存储msg
                let storagename = `${msg.to}`
                let msgstorage
                try {
                  msgstorage = await mystorage.load(storagename)
                } catch (err) {
                  msgstorage = {
                    msglist: []
                  }
                }
                // //清空一下storage
                // msgstorage = {
                //   msglist: []
                // }
                msgstorage.msglist.push(msg)
                msgstorage.lastmsg = msg
                await mystorage.save(storagename, msgstorage)
                msgstorage = await mystorage.load(storagename)
                console.log('存储send时new storage:', msgstorage)
                //向服务端发送msg
                socket.emit('singlechat', msg)
                setInputText('')
              }}
            />
            :
            <Ionicons name="ios-add-circle-outline" style={{ marginRight: 14 }} size={30} color="black" />
          }
        </View>
      </View>
  );
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // height: ,
  },
  headimg: {
    width: 80,
    height: 80,
  },

  main: {
    flex: 1,
  },
  rightMsgItem: {
    display: 'flex',
    // height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  leftMsgItem: {
    display: 'flex',
    // height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  leftMsgBorder: {
    backgroundColor: '#DCDCDC',
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 120,
  },
  rightMsgBorder: {
    backgroundColor: '#87CEFA',
    borderRadius: 20,
    marginRight: 5,
    marginLeft: 120,
  },
  rightMsgText: {
    margin: 15,
    fontSize: 25,
  },
  leftMsgText: {
    margin: 15,
    fontSize: 25,
  },
  MsgImg: {
    width: 60,
    height: 60
  },

  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 8,
    marginRight: 12,
  },
  textinputborder: {
    height: 40,
    backgroundColor: 'white',
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 50,
  },
  textinput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  }
})