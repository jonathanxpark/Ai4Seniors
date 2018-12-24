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
import FooterButtonUpdate from '../components/FooterButtonUpdate';
import SelectInput from '../components/SelectInput';
import OptionModal from '../components/OptionModal';
import Tts from 'react-native-tts';
import RecordSpeech from '../components/RecordSpeech';

const Hobbies = {
    'my hobby is ' : '',
    'my hobbies are ' : '',
}

class SettingProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            hobby: '',
            name: '',
        };

        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            this.state.id = props.navigation.state.params.id;
            this.state.email = props.navigation.state.params.email;
        }
        this.loadItems()

        Tts.addEventListener('tts-start', (event) => console.log("start", event));
        Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));
    }

    loadItems = async () => {
        console.log("setting for ", this.state.email)
        let userId = this.state.email
        const response = await apiClient(`user/${userId}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        })  
        // console.log("Response : ", response)
        if(!response.ok || response.status === 204) {
            console.log("Error to get user info : " , response)
            return
        } 
        const user = await response.json()
        //console.log("user : ", user)
        this.setState(
            {
             name : user.name,
             id: user.id,
            })

        Tts.speak(this.state.name + "!!!");
        Tts.speak('I would like to help you to set up your profile.')
        Tts.speak('What is your hobby?');           
    }

    handleUpdate = async () => {
        Tts.speak('I have updated your hobby');  
        const { goBack } = this.props.navigation
        goBack(null)
    }
    transformResult(result) {
        let r = result.toLowerCase();
        for(const [key, value] of Object.entries(Hobbies)) {
            r = r.replace(key, value)
        }
        return r
    }

    render() {
        //console.log(this.state)
        const { goBack } = this.props.navigation
        return (
            <SafeAreaView style={styles.container}>
            <Header
                title='Profile Setting'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  50}}/>
                <KeyboardAwareView>
                    <View style={styles.content}>                    
                        <TextInputComp
                            placeholder='Hobby'
                            type='default'
                            icon='ios-person-outline'
                           // showMic={true}
                            onChangeText={(text) => this.setState({ hobby : text})}
                            //transformResult={(result) => result.replace("My hobby is ", "")}
                            value={this.state.hobby}/>
                        <RecordSpeech style={styles.recordButton}
                            onResult = {result => this.setState({ hobby : result})}
                            transformResult = {this.transformResult}
                        />
                    </View>
                </KeyboardAwareView>
                <FooterButtonUpdate disable={false} onPress={this.handleUpdate}/>
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

SettingProfile.navigationOptions = {
    gesturesEnabled: false,
}

export default SettingProfile;