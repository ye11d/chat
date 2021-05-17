import * as React from 'react';
import { ScrollView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';

import BottomControl from '../components/BottomControl'
import newsImg from "../../assets/news.png"

export default class News extends React.Component {
  constructor(props) {
    super(props)
  }

  gotoNews = () => {
    const { navigation } = this.props
    navigation.navigate('NewsDetail')
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ marginBottom: 150 }}>
          <TouchableOpacity style={styles.item} onPress={this.gotoNews}>
            <Image source={newsImg} style={styles.newsImg} />
            <Text style={styles.text}>75位院士，共做一件事</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={this.gotoNews}>
            <Image source={newsImg} style={styles.newsImg} />
            <Text style={styles.text}>75位院士，共做一件事</Text>
          </TouchableOpacity>
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
  newsImg: {
    width: '100%',
    flex: 1,
    height: 250,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 25,
  },
  text: {
    fontSize: 20,
  }
})