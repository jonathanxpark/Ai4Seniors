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
import Label from '../components/Label';
import FooterButtonNext from '../components/FooterButtonNext';
import SelectInput from '../components/SelectInput';
import OptionModal from '../components/OptionModal';
import Tts from 'react-native-tts';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { color, fonts } from '../setting';

class SignUpAge extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            ageGroup: '55 or more',
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
        }
        console.log("** email: " + this.state.email + ", password:" + this.state.password + ", name:" + 
        this.state.name); 

        Tts.speak(this.state.name);
        Tts.speak('If you are older than 55, click yes. Otherwise, click no.');
    }

    modalClose = (item) => {
        if(item != 'none'){
            if(this.modalDivision == 'securityQuestion'){
                this.setState({ securityQuestion : item });
            }else if( this.modalDivision == 'ageGroup' ){
                this.setState({ ageGroup : item });
            }else if( this.modalDivision == 'timezone'){
                this.setState({ timezone : item });
            }
        }
        this.setState({ modal : false });
    }

    modalOpen = (division) => {
        this.modalDivision = division;
        this.setState({
            modal : true
        });
    }

    handleNextPage = () => {
        Tts.stop()
        const { navigate } = this.props.navigation 
        navigate('SignUpSkype', 
              { email: this.state.email, password: this.state.password, name: this.state.name,
                ageGroup: this.state.ageGroup })
    }

    render() {
        var radio_props = [
            {label: 'Yes', value: '55 or more' },
            {label: 'No', value: 'less than 55' }
          ];
        //console.log(this.state)
        const { goBack } = this.props.navigation
        return (
            <SafeAreaView style={styles.container}>
            <Header
                title='Age group'
                mode='normal'
                onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  50}}/>
                <KeyboardAwareView>
                    {/* <SelectInput
                        icon='ios-person-add-outline'
                        placeholder='Age group'
                        onPress={() => this.modalOpen('ageGroup')}
                        value={this.state.ageGroup}/>                    */}
                    {/* <Label text='Are you older than 55?'/>  */}
                    <Text style={styles.text}>Are you older than 55?</Text>   
                    <RadioForm
                        radio_props={radio_props}
                        initial={0}
                        buttonSize={30}
                        buttonOuterSize={50}
                        labelStyle={{fontSize: 20}}
                        onPress={(value) => {this.setState({ageGroup:value})}}
                    />    
                </KeyboardAwareView>
                <FooterButtonNext disable={false} onPress={this.handleNextPage}/>
                <OptionModal
                    visible={this.state.modal}
                    division={this.modalDivision}
                    onClose={this.modalClose}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor : 'white',
    },
    text: {
        fontFamily: fonts.regular,
        fontSize: 25,
        textAlign: "center",
        marginBottom : 20,
    }
})

SignUpAge.navigationOptions = {
    gesturesEnabled: false,
}

export default SignUpAge;