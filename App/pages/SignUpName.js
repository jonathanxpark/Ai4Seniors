import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import base64 from 'base-64'
import KeyboardAwareView from '../components/KeyboardAwareView';
import DropdownInput from '../components/DropdownInput';
import { apiClient } from '../services/api';
import { SafeAreaView } from 'react-navigation';
import Header from '../components/Header';
import TextInputComp from '../components/TextInputComp';
import FooterButtonNext from '../components/FooterButtonNext';
import SelectInput from '../components/SelectInput';
import OptionModal from '../components/OptionModal';
import Tts from 'react-native-tts';
import RecordSpeech from '../components/RecordSpeech';
import Voice from 'react-native-voice'

const Names = {
    'my name is ': '',
    'is my name' : '',
}

class SignUpName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            ageGroup: '',
            password: '',
            //securityAnswer : null,
            modal : false,
            //securityQuestion : null,
            //timezone : null,
            skypeId : '',
            hidePassword: false,
        };
        // this.modalDivision = null;
        console.log("signup name")
        //Tts.addEventListener('tts-start', (event) => console.log("start", event));
        //Tts.addEventListener('tts-finish', (event) => this.navigate());
        //Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

        Tts.speak('I would like to help you with your registration.')
        Tts.speak('First, can you please tell me your name?');
        Tts.speak('Please click the microphone on the screen before you talk.');
    }

    handleNextPage = () => {
        this.recordSpeechRef.stopRecording()
        Tts.stop()
        const { navigate } = this.props.navigation 
        navigate('SignUpEmail', 
                { name: this.state.name})
    }

    transformResult(result) {
        let r = result.toLowerCase();
        for(const [key, value] of Object.entries(Names)) {
            r = r.replace(key, value)
        }
        return r
    }

    render() {
        //console.log(this.state)
        //const { goBack } = this.props.navigation
        return (
            <SafeAreaView style={styles.container}>
            <Header
                title='Name'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  50}}/>
                <KeyboardAwareView>
                    <View style={styles.content}>
                        <TextInputComp
                            placeholder='Name'
                            type='default'
                            icon='ios-person-outline'
                            //showMic={true}
                            onChangeText={(text) => this.setState({ name : text})}
                            //transformResult={(result) => result.replace("My name is ", "")}
                            value={this.state.name}/>
                        <RecordSpeech style={styles.recordButton}
                            ref = {ref => this.recordSpeechRef = ref}
                            onResult = {result => this.setState({ name : result})}
                            transformResult = {this.transformResult}
                        />    
                    </View>
                </KeyboardAwareView>
                <FooterButtonNext disable={false} onPress={this.handleNextPage}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor : 'white',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',        
    },
    recordButton: {
        marginTop: 50, 
    }
})

SignUpName.navigationOptions = {
    gesturesEnabled: false,
}

export default SignUpName;