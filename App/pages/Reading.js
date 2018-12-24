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
Dimensions
} from "react-native";
import { NavigationActions } from "react-navigation";
import Camera from "react-native-camera";
//import Key from '../../../assets/key/key';
import languages from '../../assets/languages/languages';
import RNFS from 'react-native-fs';
import Spinner from 'react-native-spinkit';
import Tts from 'react-native-tts';
// import ImagePicker from 'react-native-image-crop-picker';

export default class Read extends Component {
constructor(props) {
  super(props)
  this.state = {
    loading: false,
    translate: false,
    selectedLanguage: 'en',
    picker: false,
    detectedText: '',
    detectedLang: '',
    imgPath: props.navigation.state.params.path, 
    paused: false,
  }

  Tts.setDefaultLanguage('en-US')
  Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact')
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

 let key2 = 'AIzaSyBHUisq1h709pEYI0rFWQ1iUTJIM2KaaZU'
 fetch(`https://translation.googleapis.com/language/translate/v2?key=${key2}`, {
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
   Tts.setDefaultLanguage(this.state.selectedLanguage);
   //Tts.setDefaultLanguage('zh*');
 } else {
   console.log("Went here")
   Tts.setDefaultLanguage('en-US')
   Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact')
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
 this.speak(text)
}

cleanData(res) {
  //console.log("Lang detection: ", res.data.detections[0])
  var lang = ''
  //const text = JSON.parse(data._bodyText).responses[0].fullTextAnnotation.text
  for (const result of res.data.detections[0]){
    //console.log("Result : ", result)
   lang = result['language']
   break
  }
  //console.log("Lang: ", lang)

  this.setState({
    detectedLang: lang
  })
  console.log("DetectedLang : ", this.state.detectedLang)
  // If translation is needed, replace cleanedData with translated one.
  if (this.state.translate) {
   console.log("translate to ", this.state.selectedLanguage)
    this.translateText(this.state.detectedText)
    return
  }
  this.speak(this.state.detectedText)
}

detectLanguage(data) {
  this.setState({
    loading: true
  })

  console.log("Data: ", data)
  const text = JSON.parse(data._bodyText).responses[0].fullTextAnnotation.text

  //console.log("Response: ", text)
  this.setState({
    detectedText: text
  })

  console.log("DetectedText: ", this.state.detectedText)
  let key2 = 'AIzaSyBHUisq1h709pEYI0rFWQ1iUTJIM2KaaZU'
  fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${key2}`, {
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
 let key2 = 'AIzaSyBHUisq1h709pEYI0rFWQ1iUTJIM2KaaZU'
  fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key2}`, {
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
  .then(data => this.detectLanguage(data))
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
 this.readFile()
}

convertImg2() {
 this.state.translate = true
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
   //console.log('key in verify', this.props.navigation.state.params.homeKey)

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

AppRegistry.registerComponent("Read", () => Read);