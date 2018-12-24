import React, { Component } from "react";
import {
AppRegistry,
View,
Text,
Image,
ImageBackground,
TouchableOpacity,
ActivityIndicator,
Picker,
StyleSheet,
StatusBar,
Dimensions,
Keyboard
} from "react-native";
import { NavigationActions } from "react-navigation";
import Camera from "react-native-camera";
//import Key from '../../../assets/key/key';
import languages from '../../assets/languages/languages';
import RNFS from 'react-native-fs';
import Spinner from 'react-native-spinkit';
import Tts from 'react-native-tts';
// import ImagePicker from 'react-native-image-crop-picker';

KEY = 'AIzaSyBHUisq1h709pEYI0rFWQ1iUTJIM2KaaZU'

no_wheat_regexp = [ /gluteen(\s|-)free/i ];
wheat_regexp = [/(\s|,)(WHEAT)s?(,|\.|\s|$)/i, ];
caffeine_regexp = [/caffeine content:\s+([1-9]\d*)(mg|%)/i, /,\s+caffeine(,|\.)/i];
no_caffeine_regexp = [/caffeine free/i, /decaf/i];
no_sugar_regexp = []
sugar_regexp = [/(sugar|sugars)\s+([1-9]\d*)\s*(mg|g|%)/i, /:\ssugars?/i,  /sugar compound/i, /sugar,/i ];
no_salt_regexp = [] 
salt_regexp = [/sodium\s+\(?([1-9]\d*)\s*(mg|g|%)/i, /low sodium/i, /(and|,)?\s*salt(,|.)/i];

export default class LabelDetection extends Component {
constructor(props) {
  super(props)
  this.state = {
    loading: false,
    translate: false,
    selectedLanguage: 'ko',
    picker: false,
    detectedText: '',
    detectedLang: '',
    imgPath: props.navigation.state.params.path, 
    read: false,
    wheat: false,
    sugar: false,
    salt: false,
    caffeine: false,
    ingredients: '',
  }

  if (props.navigation && props.navigation.state && props.navigation.state.params) {
    this.state.wheat = props.navigation.state.params.wheat;
    this.state.sugar = props.navigation.state.params.sugar;
    this.state.salt = props.navigation.state.params.salt;
    this.state.caffeine = props.navigation.state.params.caffeine;
    // get the list of ingreient user chose in the setting.
    ingredients = []
    if (this.state.caffeine) ingredients.push('caffeine')
    if (this.state.wheat) ingredients.push('wheat')
    if (this.state.salt) ingredients.push('salt')
    if (this.state.sugar) ingredients.push('sugar')
    this.state.ingredients = this.getText(ingredients)

    console.log(ingredients)
    console.log(this.state.ingredients)
  } 

  console.log("** LabelDetection: wheat: " + this.state.wheat, 
  ", sugar: " + this.state.sugar + ", salt:" + this.state.salt +
  ", caffeine:" + this.state.caffeine + ", ingredients:" + this.state.ingredients);  
}

getText(texts) {
  str = ''
  for (i = 0; i < texts.length; i++) {
    str = str.concat(texts[i])
    if (i < texts.length - 2) {
      str = str.concat(', ')
    } else if (i == texts.length - 2) {
      str = str.concat(' and ')
    }
  }  
  return str
}
static navigationOptions = {
  title: "Verify",
  header: null
};

componentWillMount() {
  StatusBar.setHidden(true);
}

togglePicker() {
 this.setState({
   picker: !this.state.picker
 })
}

translateText(text) {
 //console.log("translating Text..")
 fetch(`https://translation.googleapis.com/language/translate/v2?key=${KEY}`, {
   method: 'POST',
   headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     q: text,
     target: this.state.selectedLanguage
   })
 })
 .then(data => data.json())
 .then(res => this.cleanTranslatedText(res))
 .catch(err => console.log(err))
}

speak(text) {
 this.setState({
   loading: false
 }) 
 console.log("speak:", text)
 console.log("Translate: ", this.state.translate)
 if (this.state.translate) {
   //Tts.setDefaultLanguage(this.state.selectedLanguage);
   //Tts.setDefaultLanguage('zh*');
 } else {
   //console.log("Went here")
   //Tts.setDefaultLanguage(this.state.detectedLang);
 }
 Tts.speak(text)

 this.props.navigation.navigate('ImageResult', {
   path: text,
   homeKey: this.props.navigation.state.params.homeKey,
   cameraKey: this.props.navigation.state.key
 })
}

cleanTranslatedText(res) {
 const text = res.data.translations[0].translatedText
 this.analyze(text)
}

cleanData(res) {
  //console.log("Lang detection: ", res.data.detections[0])
  var lang = 'en'
  const text = JSON.parse(res._bodyText).responses[0].fullTextAnnotation.text
  // for (const result of res.data.detections[0]){
  //   //console.log("Result : ", result)
  //  lang = result['language']
  //  break
  // }
  console.log("text: ", text)

  this.setState({
    detectedLang: lang,
    detectedText: text,
  })
  console.log("DetectedLang : ", this.state.detectedLang)
  // If translation is needed, replace cleanedData with translated one.
  if (this.state.translate) {
    console.log("translate to ", this.state.selectedLanguage)
    this.translateText(this.state.detectedText)
    return
  }
  this.analyze(this.state.detectedText)
}

getMatchedText(text, regexp) {
  var matched_segment = '';
  for (j = 0; j < regexp.length; j++) {
    matches = text.match(regexp[j]);
    if (matches != null) {
      matched_segment = matches[0]
      break;
    }
  }
  return matched_segment;
}

findMatch(text, negative_regexp, positive_regexp) {
    negative_segment = this.getMatchedText(text, negative_regexp);
    positive_segment = this.getMatchedText(text, positive_regexp);
    if (negative_segment.length > 0) {
      console.log('NO (negative match)')   
    } else if (positive_segment.length > 0) {
      console.log('YES (', positive_segment, ')')
      return true
    } else {
      console.log('no match)')   
    }
    return false
}

analyze = (text) => {
  output = []
  console.log('wheat: ' + this.state.wheat)
  if (this.state.wheat && this.findMatch(text, no_wheat_regexp, wheat_regexp)) {
    output.push('wheat')
  }
  if (this.state.sugar && this.findMatch(text, no_sugar_regexp, sugar_regexp)) {
    output.push('sugar')
  }
  if (this.state.salt && this.findMatch(text, no_salt_regexp, salt_regexp)) {
    output.push('salt')
  }
  if (this.state.caffeine && this.findMatch(text, no_caffeine_regexp, caffeine_regexp)) {
    output.push('caffeine')
  }

  console.log('ingredients found: ', output)
  if (output.length > 0)
    this.speak('THIS product has ' + this.getText(output));
  else if (this.state.ingredients.length > 0)
    this.speak('This product does not have ' + this.state.ingredients)
  else {
    this.speak('There is no food ingredient to check.')
    this.speak('Please set it in the Settings menu.')
  }
    
}

detectLanguage(data) {
  this.setState({
    loading: true
  })

  console.log("Data: ", data)
  const response = JSON.parse(data._bodyText).responses[0]
  const text = response.fullTextAnnotation.text
  console.log("response: ", response)
  this.setState({
    detectedText: text
  })

  console.log("DetectedText: ", this.state.detectedText)
  fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${KEY}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text
    })
  })
  .then(data2 => data2.json())
  .then(res => this.cleanData(res))
  .catch(err => console.log(err))
}

usePhoto(imgPath) {
  this.setState({
    loading: true
  })

  //console.log("usePhoto")
  fetch(`https://vision.googleapis.com/v1/images:annotate?key=${KEY}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify({
            "requests": [
              {
            "image": {
              "content": imgPath
            },
            "features": [
            {
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ]
        }
      ]
    })
  })
  .then(data => this.cleanData(data))    //detectLanguage
  .catch(err => console.log('error ', err))

}

readFile() {
  const { imgPath } = this.state;
  //console.log("convertImg imgPath: ", imgPath)
  RNFS.readFile(imgPath, 'base64')
    .then(imgString => this.usePhoto(imgString))
    .catch(err => console.log(err))
}

convertImg() {
 this.state.translate = false
 this.state.read = false
 this.readFile()
}

convertImg2() {
 this.state.translate = true
 this.state.read = false
 this.readFile()
}

convertImgForReading() {
  this.state.translate = false
  this.state.read = true
  this.readFile()
 }
 
// convertImg3() {
//   this.setState.translate = false
//   const { imgPath } = this.state;
//   ImagePicker.openCropper({
//     path: imgPath,
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height
//   }).then(image => {
//     console.log(image);
//     this.setState({imgPath: image.path})
//   });
// }

render() {
  const { goBack } = this.props.navigation;

  const mappedLanguages = languages.map(lang => <Picker.Item key={ lang.code }
   label={ lang.language }
   value={ lang.code }
   style={ styles.pickerItem } />)

  return (
    <View>
      <ImageBackground 
        style={ styles.img }
        source={{
          uri: this.state.imgPath
        }}>

        <View style={ styles.topBar } />

       { this.state.picker ?
       <View style={ styles.pickerContainer }>
         <Picker selectedValue={ this.state.selectedLanguage }
                 onValueChange={ itemValue => this.setState({ selectedLanguage: itemValue })}
                 prompt='Choose a Language'
                 style={ styles.picker }
                 itemStyle={ styles.langStyle }>
          { mappedLanguages }
         </Picker>
         <TouchableOpacity style={styles.translateBtn} onPress={ this.convertImg2.bind(this) }>
           <Text style={ styles.translateTxt }>Select</Text>
         </TouchableOpacity>
       </View>
           : null
       }

        <Spinner isVisible={ this.state.loading }
                 size={ 100 }
                 type={ 'Wave' }
                 color={ '#3DD8CE' } />

        <View style={ styles.bottomBar }>

          <TouchableOpacity style={ [styles.goBackBtn, styles.Btn] } onPress={ () => goBack() }>
            <Image source={require("../../assets/images/left-arrow.png")}
                style={ styles.icon } />
            <Text style={ styles.btnTxt }>Back</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={ [styles.submitBtn, styles.Btn] }
            onPress={ this.convertImg3.bind(this) }>
            <Image source={require("../../../assets/send.png")}
                  style={ styles.icon } />
            <Text style={ styles.btnTxt }>Crop Image</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={ [styles.submitBtn, styles.Btn] }
            onPress={ this.convertImg.bind(this) }>
            <Image source={require("../../assets/images/send.png")}
                  style={ styles.icon } />
            <Text style={ styles.btnTxt }>Check</Text>
          </TouchableOpacity>
        
          <TouchableOpacity style={ [styles.submitBtn, styles.Btn] }
            onPress={ this.convertImgForReading.bind(this) }>
            <Image source={require("../../assets/images/message.png")}
                  style={ styles.icon } />
            <Text style={ styles.btnTxt }>Read</Text>
          </TouchableOpacity>

         <TouchableOpacity style={ [styles.submitBtn, styles.Btn] } onPress={ this.togglePicker.bind(this) }>
           <Image source={require("../../assets/images/refresh.png")}
                       style={ styles.icon } />
           <Text style={ styles.btnTxt }>Translate</Text>
         </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
  );
}
}

const styles = StyleSheet.create({
container: {
  backgroundColor: '#1E1E1E',
  alignItems: 'center',
  justifyContent: 'center',
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width
},

img: {
  flexDirection: "column",
  alignItems: 'center',
  justifyContent: "space-between",
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width
},

topBar: {
  backgroundColor: "rgba(0,0,0,1)",
  height: 20,
  width: "100%"
},

bottomBar: {
  //backgroundColor: "rgba(0,0,0,0.7)",
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
  marginTop: 10
},

goBackBtn: {
  marginLeft: 15
},

btnTxt: {
  color: 'white',
  fontSize: 24,
},

submitBtn: {
  marginRight: 15
},

icon: {
  height: 25,
  width: 25
},

pickerContainer: {
 position: 'absolute'
},

 picker: {
   backgroundColor: '#e9e9ef',
   shadowColor: '#000',
   marginTop: Dimensions.get('window').height / 3,
   width: Dimensions.get("window").width
 },
 translateTxt: {
   borderWidth: 2,
   borderColor: '#6dcff6',
   shadowColor: '#000',
   shadowOffset: { width: 0, height: -0.5 },
   shadowOpacity: 0.8,
   shadowRadius: 5,
   fontSize: 30,
   padding: 25
 },
 translateBtn: {
   alignItems: 'center',
   marginTop: 30
 },
});

AppRegistry.registerComponent("TakePhoto", () => LabelDetection);