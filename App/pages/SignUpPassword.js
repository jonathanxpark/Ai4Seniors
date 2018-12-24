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

class SignUpPassword extends React.Component {
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
            this.state.name = props.navigation.state.params.name;
            this.state.email = props.navigation.state.params.email;
        }
        Tts.speak(this.state.name);
        Tts.speak('Could you type in your password?');
    }

    validatePassword = (text) => {
        const password = this.state.password
        if(password !== text) {
            return "Not the same password"
        }
    }
    
    handleNextPage = () => {
        Tts.stop()
        const { navigate } = this.props.navigation 
        navigate('SignUpAge', 
              { email: this.state.email, password: this.state.password, name: this.state.name})
    }

    render() {
        //console.log(this.state)
        const { goBack } = this.props.navigation
        return (
            <SafeAreaView style={styles.container}>
            <Header
                title='Password'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  50}}/>
                <KeyboardAwareView>
                    <TextInputComp
                        placeholder='Password'
                        type='email-address'
                        icon='ios-lock-outline'
                        onChangeText={(text) => this.setState({ password : text})}
                        //transformResult={(result) => result.replace(" at ", "@")}
                        value={this.state.password}
                        isSecure={this.state.hidePassword}
                        />
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
})

SignUpPassword.navigationOptions = {
    gesturesEnabled: false,
}

export default SignUpPassword;