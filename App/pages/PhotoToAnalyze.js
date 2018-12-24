import React, { Component } from "react";
import {
  AppRegistry,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import Camera from "react-native-camera";

class PhotoToAnalyze extends Component {
   constructor(props) {
    super(props)
    this.state = {
      nuts: false,
      peanut: false,
      wheat: false,
      milk: false,
      egg: false,
      soy: false,
      caffeine: false,
      photo: null,
    }  
    if (props.navigation && props.navigation.state && props.navigation.state.params) {
      this.state.nuts = props.navigation.state.params.nuts;
      this.state.peanut = props.navigation.state.params.peanut;
      this.state.wheat = props.navigation.state.params.wheat;
      this.state.milk = props.navigation.state.params.milk;
      this.state.egg = props.navigation.state.params.egg;
      this.state.caffeine = props.navigation.state.params.caffeine;
      this.state.soy = props.navigation.state.params.soy;
    }    
    // console.log("** Photo: nuts: " + this.state.nuts, 
    // ", sugar: " + this.state.sugar + ", salt:" + this.state.salt +
    // ", caffeine:" + this.state.caffeine);  

    //Tts.speak('Please check items you like to find labels.');
  }     
  static navigationOptions = {
    title: "Camera",
    header: null
  };

  takePicture() {
    this.camera
      .capture()
      .then(data => { 
        this.props.navigation.navigate('LabelDetection', Object.assign({},
           { homeKey: this.props.navigation.state.key,
            nuts: this.state.nuts, egg: this.state.egg, 
            wheat: this.state.wheat, soy: this.state.soy,
            fish: this.state.fish, peanut: this.state.peanut,
            milk: this.state.milk, caffeine: this.state.caffeine
           }, data))
      })
      .catch(err => console.error(err));
    }

  render() {
    const { Aspect, CaptureTarget, Orientation } = Camera.constants;

    return (
      <View>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={ styles.cam }
          aspect={ Aspect.fill }
          captureTarget={ CaptureTarget.disk }
          Orientation={ Orientation.auto }
          onFocusChanged={ (e) => {} }
          onZoomChanged={ (e) => {} }>
          <View style={ styles.bottomBar }> 

            <TouchableOpacity style={ [styles.goBackBtn, styles.Btn] } onPress={() => this.props.navigation.goBack()}>
              <Image source={require("../../assets/images/left-arrow.png")}
                  style={ styles.icon } />
              <Text style={ styles.btnTxt }>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={ this.takePicture.bind(this) }>
              <View style={ styles.camBtn } />
            </TouchableOpacity>

            <TouchableOpacity style={ [styles.submitBtn, styles.Btn] } />
            
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cam: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },

  bottomBar: {
    alignSelf: 'flex-end',
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    width: '100%'    
  },

  camBtn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1.3,
    borderColor: "#d6d7da",
    marginLeft:12,
    marginTop: 15
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
    color: 'white'
  },

  submitBtn: {
    marginRight: 15,
    width: 55
  },

  icon: {
    height: 30,
    width: 30
  }
});

PhotoToAnalyze.navigationOptions = {
    gesturesEnabled: false,
}

export default PhotoToAnalyze;