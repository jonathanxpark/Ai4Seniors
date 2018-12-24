import React from 'react';
import { StyleSheet, Text, View, Picker, DatePickerIOS, Dimensions } from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import base64 from 'base-64'
import StyleDatePicker from '../components/DatePicker'
import KeyboardAwareView from '../components/KeyboardAwareView';
import DropdownInput from '../components/DropdownInput';
import { apiClient } from '../services/api';
import { SafeAreaView } from 'react-navigation';
import Header from '../components/Header';
import TextInputComp from '../components/TextInputComp';
import FooterButton from '../components/FooterButtonMeeting';
import SelectInput from '../components/SelectInput';
import OptionModal from '../components/OptionModal';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import Label from '../components/Label';
import { color, fonts } from '../setting';

const { width, height } = Dimensions.get('window');

class AddAvailability extends React.Component {
    constructor(props) {
        super(props)
        const now = new Date();
        this.state = {
            email: '',
            isSenior: false,
            studentId: '',
            teacherId: '',
            date: now,
            startTime: now,
            endTime: new Date(now.getTime() + 30 * 60 * 1000),
            active: true,
        };
        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            this.state.email = props.navigation.state.params.email;
            this.state.isSenior = props.navigation.state.params.isSenior;
            this.state.teacherId = props.navigation.state.params.teacherId;
            this.state.studentId = props.navigation.state.params.studentId;
        }
        console.log("** Add Ava: teacherId: " + this.state.teacherId, 
        ", studentId: " + this.state.studentId + ", isSenior:" + this.state.isSenior + ", email:" + 
        this.state.email, ", id:", this.state.id);        
    }

    handleScheduling = async () => {
        // bug fix: need to change the date for startTime and endTime.
        const availability = Object.assign({}, this.state)
        if (availability.email == '') {
            console.log("invalid email : email is empty")
            return
        }
        
        console.log("Avaliability : " , availability)
        const table_name = isSenior ? 'TeacherAvailability' : 'StudentAvailability'
        const response = await apiClient(table_name, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(availability),
        })

        if (!response.ok) {
            // Display error message
            console.log("Response : " , response)
            console.log("AddAvaliability error")
            return
        }
        console.log("AddAvaliability done")

        const { navigate } = this.props.navigation
        navigate('Availability', 
                { id: this.state.id, email: this.state.email, isSenior: this.state.isSenior,
                  teacherId: this.state.teacherId, studentId: this.state.studentId})
    }

    render() {
        console.log(this.state)
        const { goBack } = this.props.navigation
        return (
            <SafeAreaView style={styles.container}>
            <Header
                title='Add Availability'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  150}}/>
                <KeyboardAwareView style={styles.picker}>
                    <StyleDatePicker
                        defaulttext='Date:          '
                        mode='date'
                        format='YYYY-MM-DD'
                        onDateChange={(_, date) => this.setState({ date : date})}
                        date={this.state.date}/>

                    <StyleDatePicker
                        defaulttext='Start time:'
                        mode='time'
                        format='h:mm a'
                        onDateChange={(_, date) => this.setState({ startTime : date})}
                        date={this.state.startTime}/>
                      
                      <StyleDatePicker
                        defaulttext='End time:  '
                        mode='time'
                        format='h:mm a'
                        onDateChange={(_, date) => this.setState({ endTime : date})}
                        date={this.state.endTime}/>         
                </KeyboardAwareView>

                <FooterButton disable={false} onPress={this.handleScheduling}/>
               
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor : 'white',
        justifyContent: 'center',
    },
    picker : {
        marginTop : 100,
        //marginBottom : 50,
        //paddingLeft: 30,
    },
    pickInput : {
        flex : 1,
        lineHeight : 30,
        fontFamily: fonts.regular,
        fontSize: 19,
        color: "black", //"#9b9b9b",
        marginLeft : 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickContainer : {
        
    }
})

AddAvailability.navigationOptions = {
    gesturesEnabled: false,
}

export default AddAvailability;