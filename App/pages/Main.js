import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Title from '../components/Title';
import Button from '../components/Button';
import LargeButton from '../components/LargeButton';
import Tts from 'react-native-tts';
import RecordSpeech from '../components/RecordSpeechMain';

no_nut_regexp = [ /nut(\s|-)free/i ];
nut_regexp = [/(\s|,)(peanut|almond|nut|pecan|walnut)s?(,|\.|\s|$)/i, ];
caffeine_regexp = [/caffeine content:\s+([1-9]\d*)(mg|%)/i, /,\s+caffeine(,|\.)/i];
no_caffeine_regexp = [/caffeine free/i, /decaf/i];
no_sugar_regexp = []
sugar_regexp = [/(sugar|sugars)\s+([1-9]\d*)\s*(mg|g|%)/i, /:\ssugars?/i,  /sugar compound/i, /sugar,/i ];
no_salt_regexp = [] 
salt_regexp = [/sodium\s+\(?([1-9]\d*)\s*(mg|g|%)/i, /low sodium/i, /(and|,)?\s*salt(,|.)/i];

const Utterances = {
  'take a ' : '',
  'i want to take a ' : '',
  'i wanna take a ' : '',
  'can you take a ' : '',
  'can i set  ' : '',
  'can you check ' : '',
}

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wheat: false,
      sugar: false,
      salt: false,
      caffeine: false,
      action: '',
    }  
    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    //Tts.addEventListener('tts-finish', (event) => this.navigate());
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

    if (props.navigation && props.navigation.state && props.navigation.state.params) {
      this.state.wheat = props.navigation.state.params.wheat;
      this.state.sugar = props.navigation.state.params.sugar;
      this.state.salt = props.navigation.state.params.salt;
      this.state.caffeine = props.navigation.state.params.caffeine;
    } 
      
    Tts.setDefaultLanguage('en-US')
    Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact')

    if (this.state.wheat == "") {
      Tts.speak('You can take photos to read ')
      //Tts.speak('Or set the list of ingredients you want to restrict.')
    } else {
      Tts.speak('You can now take photos of food ingredients to check.')
    }
  }

  handleFood = () => {
    Tts.speak('Please take a photo of the food to analyze.')
    const { navigate } = this.props.navigation 
    navigate('PhotoToAnalyze', 
      { wheat: this.state.wheat, salt: this.state.salt, 
        caffeine: this.state.caffeine, sugar: this.state.sugar})
  }

  handleReading = () => {
    Tts.speak('Please take a photo to read.')
    const { navigate } = this.props.navigation 
    navigate('PhotoToRead', { })
  }
  
  handleSetting = () => {
    console.log("settingss")
    const { navigate } = this.props.navigation 
    navigate('Settings', 
      { nuts: this.state.nuts, salt: this.state.salt, 
        caffeine: this.state.caffeine, sugar: this.state.sugar})
  }

  transformResult(result) {
    let r = result.toLowerCase()
    for(const [key, value] of Object.entries(Utterances)) {
        r = r.replace(key, value)
    }
    console.log("utterance: " + r)
    return r
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Title style={{marginBottom : 50}}/>
        <LargeButton title='Read' onPress={this.handleReading} style={{marginBottom : 15}}/> 
        <LargeButton title='Analyze' onPress={this.handleFood} style={{marginBottom : 15}}/>       
        <LargeButton title='Settings' onPress={this.handleSetting} style={{marginBottom : 15}}/>     
        
        <View style={styles.content}>
                <RecordSpeech style={styles.recordButton}
                ref = {ref => this.recordSpeechRef = ref}
                onResult = {result => this.setState({ action : result})}
                transformResult = {this.transformResult}
                />   
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop : 100,
    backgroundColor : 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',      
    marginBottom: 0,  
},
});

export default Main;