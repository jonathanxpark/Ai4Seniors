import React, { Component } from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import Voice from 'react-native-voice'
import Tts from 'react-native-tts';

class RecordSpeech extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRecording: false,
        }
    }
    static propTypes = {
        onResult: PropTypes.func,
        transformResult: PropTypes.func,
        style: PropTypes.object,
    }

    static defaultProps = {
        transformResult: (result) => result
    }

    onSpeechResults = (event) => {
        const transformedText = this.props.transformResult(event.value[0])
        this.props.onResult(transformedText)
    }

    stopRecording = async () => {
        this.setState({isRecording: false})
        await Voice.stop();
        delete Voice.onSpeechResults
    }

    startRecording = async () => {
        this.setState({isRecording: true})
        Tts.stop()
        // this.setState({
        //     results: [],
        // })
        Voice.onSpeechResults = this.onSpeechResults;
        await Voice.start('en-US')
    }

    handlePress = async (event) => {
        event.preventDefault()
        if(this.state.isRecording) {
            await this.stopRecording()
            // this.props.onResult(this.state.results[0])
            // console.log("isRecording State: ", this.state.results[0])
        } else {
            await this.startRecording()
            this.props.onResult('')
            // console.log("isNotRecording State: ", this.state.results[0])
        }
    }

    render() {
        // if(!this.props.isFocused && !this.state.isRecording) {
        //     return null
        // } 
        return(
            <TouchableOpacity
            style={[styles.touchableOpacity, this.props.style]}
            onPress={this.handlePress}>
                {(this.state.isRecording)
                    ? <Icon name='ios-mic-off' size={40} color='#FF9882'/>
                    : <Icon name='ios-mic' size={40} color='#FFFFFF'/>                
                    // ? <Icon name='ios-mic-off' size={60} color='#FF9882'/>
                    // : <Icon name='ios-mic' size={60} color='#9b9b9b'/>
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    touchableOpacity: {
        paddingLeft: 16,
        paddingRight: 16,
    }
})

export default RecordSpeech