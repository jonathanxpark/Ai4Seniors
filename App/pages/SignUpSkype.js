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
import FooterButton from '../components/FooterButton';
import SelectInput from '../components/SelectInput';
import OptionModal from '../components/OptionModal';
import Tts from 'react-native-tts';
import RecordSpeech from '../components/RecordSpeech';

const Skypeid = {
    'my skype id is ': '',
    'it is ' : '',
    'i do not have skype id': '',
}

class SignUpSkype extends React.Component {
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
        this.modalDivision = null;
        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            this.state.email = props.navigation.state.params.email;
            this.state.password = props.navigation.state.params.password;
            this.state.name = props.navigation.state.params.name;
            this.state.ageGroup = props.navigation.state.params.ageGroup;
        }
        console.log("** skype; email: " + this.state.email + ", password:" + this.state.password + ", name:" + 
        this.state.name + ', age;' + this.state.ageGroup); 

        Tts.speak(this.state.name);
        Tts.speak('This is the last question.');
        Tts.speak('Could you input your Skype ID?');
    }

    validatePassword = (text) => {
        const password = this.state.password
        if(password !== text) {
            return "Not the same password"
        }
    }

    makeHandler = (name) => (text) => {
        this.setState({ [name]: text })
    }

    handleSignUp = async () => {
        this.recordSpeechRef.stopRecording()
        const user = Object.assign({}, this.state)
        console.log("user;", user)
        user.password = base64.encode(user.password)

        const response = await apiClient('user', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })

        if (!response.ok) {
            // Display error message
            console.log("sign up error")
            return
        }
        console.log("signup done")

        const { navigate } = this.props.navigation
        navigate('LogIn', { email: user.email })
    }
    transformResult(result) {
        let r = result.toLowerCase();
        for(const [key, value] of Object.entries(Skypeid)) {
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
                title='Skype ID'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  50}}/>
                <KeyboardAwareView>    
                    <View style={styles.content}>          
                        <TextInputComp
                            placeholder='Skype ID'
                            type='default'
                            icon='ios-information-circle-outline'
                            //showMic={true}
                            onChangeText={(text) => this.setState({ skypeId : text})}
                            value={this.state.skypeId}/>   
                        <RecordSpeech style={styles.recordButton}
                            ref = {ref => this.recordSpeechRef = ref}
                            onResult = {result => this.setState({ skypeId : result})}
                            transformResult = {this.transformResult}
                        />     
                     </View>                                            
                </KeyboardAwareView>
                <FooterButton disable={false} onPress={this.handleSignUp}/>
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

SignUpSkype.navigationOptions = {
    gesturesEnabled: false,
}

export default SignUpSkype;