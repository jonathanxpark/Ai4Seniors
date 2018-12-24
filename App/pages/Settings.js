import React, { Component } from 'react';
import Button from '../components/Button';
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import { SafeAreaView } from 'react-navigation';
import Tts from 'react-native-tts';
import {CheckBox} from 'react-native-elements';
import FooterButtonUpdate from '../components/FooterButtonUpdate';
import RecordSpeech from '../components/RecordSpeech';

const Utterances = {
    'i want to check ' : '',
    'i want to analyze ' : '',
    'i want to know ' : '',
    ' and ' : '',
    'can you check ' : '',
}

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nuts: false,
            wheat: false,
            milk: false,
            egg: false,
            fish: false,
            soy: false,
            shellfish: false,
        }  
        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            this.state.nuts = props.navigation.state.params.nuts;
            this.state.wheat = props.navigation.state.params.wheat;
            this.state.milk = props.navigation.state.params.milk;
            this.state.egg = props.navigation.state.params.egg;
            this.state.fish = props.navigation.state.params.fish;
            this.state.shellfish = props.navigation.state.params.shellfish;
            this.state.soy = props.navigation.state.params.soy;
        }    
        // console.log("** Main: nuts: " + this.state.nuts, 
        // ", sugar: " + this.state.sugar + ", salt:" + this.state.salt +
        // ", caffeine:" + this.state.caffeine); 

        Tts.speak('What ingredients would you like to restrict?');
    }   

    transformResult = (result) => {
        let r = result.toLowerCase();
        console.log('text: ', r)
        // for(const [key, value] of Object.entries(Utterances)) {
        //     r = r.replace(key, value)
        // }
        if (r.indexOf('nuts') !== -1 || r.indexOf(' nut') !== -1) {
            this.setState({ nuts : true });
        } 
         if (r.indexOf('wheat') !== -1) {
            this.setState({ wheat : true });
        } 
        if (r.indexOf('soy') !== -1) {
            this.setState({ soy : true });
        }
        if (r.indexOf('milk') !== -1) {
            this.setState({ milk : true });
        }
        if (r.indexOf('egg') !== -1) {
            this.setState({ egg : true });
        }
        if (r.indexOf('shellfish') !== -1) {
            this.setState({ shellfish : true });
        } else if (r.indexOf('fish') !== -1) {
            this.setState({ fish : true });
        }
        //this.recordSpeechRef.stopRecording()
        return r
    }

    handleUpdate = async () => {
        this.recordSpeechRef.stopRecording()
        Tts.stop()       
        Tts.speak('I have updated your settings.');
        const { navigate } = this.props.navigation
        navigate('Main', 
                { nuts: this.state.nuts, egg: this.state.egg, 
                  wheat: this.state.wheat, soy: this.state.soy,
                  fish: this.state.fish, shellfish: this.state.shellfish,
                  milk: this.state.milk,
                })
    }

    render() {
      const { goBack } = this.props.navigation;
      return (
        <SafeAreaView style={styles.container}>
            <Header
                title='Select ingredients'
                mode='home'
                //onPress={() => this.props.navigation.goBack(null)}
                style={{marginBottom :  10}}/> 
          <CheckBox title='Egg' size={40}
                checked={this.state.egg}
                textStyle={styles.text}
                containerStyle={styles.checkbox}
                onPress={() => { this.setState({ egg : !this.state.egg }) }} />
            <CheckBox title='Fish' size={40}
                checked={this.state.fish}
                textStyle={styles.text}
                containerStyle={styles.checkbox}
                onPress={() => { this.setState({ fish : !this.state.fish }) }} />                       
           <CheckBox title='Milk' size={40}
                checked={this.state.milk}
                textStyle={styles.text}
                containerStyle={styles.checkbox}
                onPress={() => { this.setState({ milk : !this.state.milk }) }} />   
            <CheckBox title='Nuts' size={40}
                checked={this.state.nuts}
                textStyle={styles.text}
                containerStyle={styles.checkbox}
                onPress={() => { this.setState({ nuts : !this.state.nuts }) }} />            
            <CheckBox title='Shellfish' size={40}
                checked={this.state.shellfish}
                textStyle={styles.text}
                containerStyle={styles.checkbox}
                onPress={() => { this.setState({ shellfish : !this.state.shellfish }) }} />    
            <CheckBox title='Soy' size={40}
                checked={this.state.soy}
                textStyle={styles.text}
                containerStyle={styles.checkbox}
                onPress={() => { this.setState({ soy : !this.state.soy }) }} />   
            <CheckBox title='Wheat' size={40}
                checked={this.state.wheat}
                textStyle={styles.text}
                containerStyle={styles.checkbox}
                onPress={() => { this.setState({ wheat : !this.state.wheat }) }} />            
                    
            <View style={styles.content}>
                <RecordSpeech style={styles.recordButton}
                ref = {ref => this.recordSpeechRef = ref}
                onResult = {result => {}}
                transformResult = {this.transformResult}
                />   
            </View>                 
            {/* <FooterButtonUpdate disable={false} onPress={this.handleUpdate}/>                                    */}
            <View style={ styles.bottomBar }>
                <TouchableOpacity style={ [styles.goBackBtn, styles.Btn] } onPress={ () => goBack() }>
                <Image source={require("../../assets/images/left-arrow.png")}
                    style={ styles.icon } />
                <Text style={ styles.btnTxt }>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Btn}>
                <RecordSpeech style={styles.recordButton}
                ref = {ref => this.recordSpeechRef = ref}
                onResult = {result => {}}
                transformResult = {this.transformResult}
                />   
                <Text style={ styles.btnTxt }>Speak</Text>
                 </TouchableOpacity>
                <TouchableOpacity style={ [styles.submitBtn, styles.Btn] }
                onPress={ this.handleUpdate }>
                <Image source={require("../../assets/images/refresh.png")}
                        style={ styles.icon } />
                <Text style={ styles.btnTxt }>Update</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
      )
    }
}

Settings.navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-settings-outline" size={30} color={tintColor} />
    ),
    tabBarLabel : 'Settings',
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        textAlign: "center",
        //color: "#ffffff"
        backgroundColor : 'white',
      },
    checkbox: {
        backgroundColor : 'white',
    },
    text : {
        fontSize: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',      
        marginBottom: 0,  
    },
    bottomBar: {
        backgroundColor: "#4a90e2",
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 80,
        width: '100%'  
    },
    Btn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 60,
        marginTop: 10,
        marginRight: 50,
      },
    goBackBtn: {
        marginLeft: 50
    },
    icon: {
        height: 25,
        width: 25
    },
    btnTxt: {
        color: 'white',
        fontSize: 24,
    },
})

export default Settings;
