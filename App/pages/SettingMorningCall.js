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

const lettersToNumbers = {
    'i want to get it at ' : '',
    'i would like to get it at ' : '',
    'please ' : '',
}

class SettingMorningCall extends React.Component {
    constructor(props) {
        super(props)
        const now = new Date();
        this.state = {
            email: '',
            startTime: '',
            isSenior: false,
            studentId: '',
            teacherId: '',
            date: now,
            endTime: new Date(now.getTime() + 30 * 60 * 1000),
            active: true,
        };

        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            this.state.id = props.navigation.state.params.id;
            this.state.email = props.navigation.state.params.email;
            this.state.isSenior = props.navigation.state.params.isSenior;
            this.state.teacherId = props.navigation.state.params.teacherId;
            this.state.studentId = props.navigation.state.params.studentId;
        }
        //this.loadItems()

        Tts.addEventListener('tts-start', (event) => console.log("start", event));
        Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

        Tts.speak('What time do you want to get your morning call?');
    }

    transformResult(result) {
        let r = result.toLowerCase();
        for(const [key, value] of Object.entries(lettersToNumbers)) {
            r = r.replace(key, value)
        }
        return r
    }

    handleUpdate = async () => {
        const regex = /^(\d{1,2})[\s:](\d{1,2})?\s?(am|pm)/
        const tokens = regex.exec(this.state.startTime)
        let hours = parseInt(tokens[1])
        const minutes = tokens[2] ? parseInt(tokens[2]) : 0
        const meridiem = tokens[3]

        if(meridiem === 'pm' && hours !== 12) {
            hours += 12
        }
        if(meridiem === 'am' && hours === 12) {
            hours = 0;
        }
        const startTime = new Date()
        startTime.setHours(hours)
        startTime.setMinutes(minutes)
        startTime.setSeconds(0)

        const endPoint = this.state.isSenior ? 'TeacherAvailability' : 'StudentAvailability'
         
        const DAYS_TO_REPEAT = 2;
    
        //Only prints for the next day
        for(let i = 0; i < DAYS_TO_REPEAT; i++) {
            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)
            console.log('starttime; ', startTime)
            const response = await apiClient(endPoint, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...this.state,
                    startTime,
                    endTime,
                }),
            })
            startTime.setDate(startTime.getDate() + 1);
        }

        Tts.speak('I have updated your preferences on morning calls.');

        // const { goBack } = this.props.navigation
        // goBack(null)

        const { navigate } = this.props.navigation
        navigate('Settings', 
                { name: this.state.name, id: this.state.id, email: this.state.email, isSenior: this.state.isSenior,
                  teacherId: this.state.teacherId, studentId: this.state.studentId})
    }

    render() {
        //console.log(this.state)
        const { goBack } = this.props.navigation
        return (
            <SafeAreaView style={styles.container}>
            <Header
                title='Morning Call Setting'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  50}}/>
                <KeyboardAwareView>
                    <View style={styles.content}>
                        <TextInputComp
                            placeholder='Morning call time'
                            type='default'
                            icon='ios-time-outline'
                            //showMic={true}
                            onChangeText={(text) => this.setState({ startTime : text})}
                            // transformResult={this.transformResult}
                            value={this.state.startTime}/>
                        <RecordSpeech style={styles.recordButton}
                            onResult = {result => this.setState({ startTime : result})}
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

SettingMorningCall.navigationOptions = {
    gesturesEnabled: false,
}

export default SettingMorningCall;