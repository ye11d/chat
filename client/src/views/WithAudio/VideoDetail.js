import * as React from 'react';
import { ScrollView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

import BottomControl from '../components/BottomControl'

export default class VideoDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { navigation } = this.props
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, marginBottom: 150 }}>
                    <VideoPlayer
                        source={{ uri: 'https://vjs.zencdn.net/v/oceans.mp4' }}
                    />
                </View>
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
    videoImg: {
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