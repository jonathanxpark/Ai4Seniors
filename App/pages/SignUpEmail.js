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

const Emails = {
    'my email is ': '',
    ' at ': '@',
    'my email address is ' : '',
}

async function valideUsername(username) {
    const url = `auth/validate?username=${username}`
    const response = await apiClient(url, {
        method: "GET",  
    })
    if(!response.ok) {
        return 'Username already taken'
    } 
    return null
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = re.test(email.toLowerCase())

    if(email === '') { 
        return null 
    }
    if(!valid) {
        return "Not a valid email"
    }

    return null
}

class SignUpEmail extends React.Component {
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
        //this.modalDivision = null;
        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            this.state.name = props.navigation.state.params.name;
        }
        console.log('name; ', this.state.name)
        console.log('email; ', this.state.email)
        Tts.speak('Thanks, ' + this.state.name);
        Tts.speak('Could you please let me know your email address?');
    }

    handleNextPage = () => {
        this.recordSpeechRef.stopRecording()
        Tts.stop()
        const { navigate } = this.props.navigation 
        navigate('SignUpPassword', 
              { name: this.state.name, email: this.state.email.toLowerCase()})
    }

    transformResult(result) {
        let r = result.toLowerCase();
        for(const [key, value] of Object.entries(Emails)) {
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
                title='Email'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  50}}/>
                <KeyboardAwareView>
                    <View style={styles.content}>
                        <TextInputComp
                            placeholder='Email here'
                            type='email-address'
                            //showMic={true}
                            icon='ios-mail-outline'
                            onChangeText={(text) => this.setState({ email : text})}
                            //transformResult={(result) => result.replace(" at ", "@")}
                            value={this.state.email}/>
                        <RecordSpeech style={styles.recordButton}
                            ref = {ref => this.recordSpeechRef = ref}
                            onResult = {result => this.setState({ email : result})}
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

SignUpEmail.navigationOptions = {
    gesturesEnabled: false,
}

export default SignUpEmail;