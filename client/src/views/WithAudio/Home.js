import * as React from 'react';
import { ScrollView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';

import BottomControl from '../components/BottomControl'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  gotoVideo = () => {
    this.props.navigation.navigate('Video')
  }

  gotoMusic = () => {
    this.props.navigation.navigate('Music')
  }

  gotoNews = () => {
    this.props.navigation.navigate('News')
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.home}>
            <TouchableOpacity style={styles.item} onPress={this.gotoNews}>
              <Text style={styles.text}>新闻</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={this.gotoMusic}>
              <Text style={styles.text}>音乐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={this.gotoVideo}>
              <Text style={styles.text}>视频</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomControl navigation={navigation} />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    height: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    margin: 50,
  },
  text: {
    fontSize: 40,
  }
})