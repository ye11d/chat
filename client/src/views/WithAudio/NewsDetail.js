import * as React from 'react';
import { ScrollView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Sound from 'react-native-sound';
import { AudioUtils } from 'react-native-audio';
import RNFS from 'react-native-fs';
import axios from 'axios'

import config from '../../config'
import playImg from "../../assets/play.png"
import stopImg from "../../assets/stop.png"

export default class News extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false, //是否正在播放语音
            audioPath: AudioUtils.DocumentDirectoryPath + '/news.amr', // 语音文件路径
            content: '4月25日，由国家互联网信息办公室、国家发展和改革委员会、工业和信息化部、国务院国有资产监督管理委员会、福建省人民政府共同主办的第四届数字中国建设峰会在福建省福州市顺利开幕。本届峰会以“激发数据要素新动能，开启数字中国新征程”为主题，大专家.COM“宁夏健康管理信息系统”作为宁夏自治区医疗健康数字化优秀示范成果展示应邀参展。大专家.COM是由钟南山、樊代明等领衔75位两院院士于2014年共同发起的基于工业互联网的医疗健康综合服务平台。平台以“传道、授业、解惑”为宗旨，以“服务于医、服务于民”为目标，以“做有意义的人和事”为理念。整合院士专家智慧和现代技术，研发“互联网+医疗健康”综合服务系统——“医生云”，打造人工智能医学大脑“MedBrain”，覆盖万种疾病诊疗和健康管理模型，智能服务医生的医学教育、百姓的健康管理和企业的研发创新等，致力于解决医疗健康痛点问题，助力分级诊疗和健康中国战略实施。',
            // whoosh: {},
        }
    }

    // componentDidMount() {
    //     const { content } = this.state
    //     async function getWhoosh() {
    //         let speech = await this.speechSynthesis(content.slice(0, 50))
    //         let result = await this.writeAudio(speech)
    //         console.log('result', result)
    //         if (result) {
    //             let whoosh = new Sound(this.state.audioPath, '', (err) => {
    //                 if (err) {
    //                     return console.log(err)
    //                 }
    //             })
    //             this.setState({
    //                 whoosh: whoosh,
    //             })
    //         }
    //     }
    //     getWhoosh
    // }

    speechSynthesis = async (data) => {
        let res = await axios.post(config.url + "/speechSynthesis", { content: data })
        let speech = res.data
        return speech
    }

    _audioPlay = async () => {
        let whoosh = new Sound(this.state.audioPath, '', (err) => {
            if (err) {
                return console.log(err)
            }
            whoosh.play(success => {
                if (success) {
                    console.log('success - 播放成功')
                    console.log('path', this.state.audioPath)
                } else {
                    console.log('fail - 播放失败')
                }
            })
        })
    }

    // writeAudio = async (speech) => {
    //     // console.log('write', speech)
    //     return new Promise(async (reslove, reject) => {
    //         RNFS.writeFile(this.state.audioPath, speech, 'base64')
    //             .then((success) => {
    //                 console.log('FILE WRITTEN!')
    //                 reslove(true)
    //             })
    //             .catch((err) => {
    //                 reject(false)
    //                 console.log(err.message)
    //             })
    //     })
    // }

    writeAndPlayAudio = async (speech) => {
        // console.log('write', speech)
        RNFS.writeFile(this.state.audioPath, speech, 'base64')
            .then((success) => {
                console.log('FILE WRITTEN!')
                this._audioPlay()
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    _play = async () => {
        const { content } = this.state
        let currentPos = 0
        let len = content.length
        // this.setState({
        //     isPlaying: true,
        // })
        // while (currentPos < len) {
        let speech = await this.speechSynthesis(content.slice(0, 50))
        this.writeAndPlayAudio(speech)
        // }
    }

    _stop = () => {
        this.setState({
            isPlaying: false,
        })
    }

    render() {
        const { isPlaying, content } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ marginBottom: 150 }}>
                    <Text style={styles.title}>数“智”化助力健康中国建设，大专家.COM亮相第四届数字中国建设峰会</Text>
                    <View style={styles.des}>
                        <Text style={styles.time}>2021-04-25</Text>
                        <Text style={styles.from}>大专家.COM</Text>
                    </View>
                    <Text style={styles.content}>{content}</Text>
                </ScrollView>
                <View style={styles.bottomControl}>
                    {
                        isPlaying ?
                            <TouchableOpacity style={styles.stopControl} onPress={this._stop}>
                                <Image source={stopImg} style={styles.stopImg} />
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.playControl} onPress={this._play}>
                                <Image source={playImg} style={styles.playImg} />
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        margin: 10,
        fontSize: 30,
    },
    des: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'black',
    },
    time: {
        fontSize: 20,
    },
    from: {
        fontSize: 20,
    },
    content: {
        margin: 10,
        fontSize: 20,
        lineHeight: 35,
    },
    bottomControl: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    playControl: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: '#1296db',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopControl: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playImg: {
        marginLeft: 10,
        height: 110,
        width: 110,
    },
    stopImg: {
        height: 70,
        width: 70,
    }
})