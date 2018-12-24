import React, { Component } from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import Voice from 'react-native-voice'

class RecordButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRecording: false,
            results: [],
        }
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
    }
    static propTypes = {
        isFocused: PropTypes.bool,
        onResult: PropTypes.func,
        transformResult: PropTypes.func,
    }

    static defaultProps = {
        transformResult: (result) => result
    }

    onSpeechResults(event) {
        const transformedText = this.props.transformResult(event.value[0])
        this.props.onResult(transformedText)
    }

    async stopRecording() {
        await Voice.stop();
    }

    async startRecording() {
        this.setState({
            results: [],
        })
        await Voice.start('en-US')
    }

    handlePress = async (event) => {
        event.preventDefault()
        if(this.state.isRecording) {
            this.setState({isRecording: false})
            await this.stopRecording()
            this.props.onResult(this.state.results[0])
            console.log("isRecording State: ", this.state.results[0])
        } else {
            this.setState({isRecording: true})
            await this.startRecording()
            this.props.onResult('')
            console.log("isNotRecording State: ", this.state.results[0])
        }

    }

    render() {
        // if(!this.props.isFocused && !this.state.isRecording) {
        //     return null
        // } 
        return(
            <TouchableOpacity
            stlye={styles.touchableOpacity}
            onPress={this.handlePress}>
                {(this.state.isRecording)
                    ? <Icon name='ios-square' size={30} color='#FF9882'/>
                    : <Icon name='ios-mic' size={30} color='#9b9b9b'/>
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

export default RecordButton