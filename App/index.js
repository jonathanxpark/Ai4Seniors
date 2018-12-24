import { Platform } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { color, fonts } from './setting';
import MainPage from './pages/Main';
//import SignUpPage from './pages/SignUp';
//import LogInPage from './pages/LogIn';
//import HomePage from './pages/Home';
import SettingsPage from './pages/Settings';
import PhotoToAnalyzePage from './pages/PhotoToAnalyze';
import PhotoToReadPage from './pages/PhotoToRead';
import LabelDetectionPage from './pages/LabelDetection';
import ReadingPage from './pages/Reading';
//import CheckPage from './pages/Check';
//import ShowResultPage from './pages/ShowResult';
//import TextInputComp from './pages/TextInputComp';

//import CallPage from './pages/Call';
//import TopicsPage from './pages/Topics';
//import TranscriptPage from './pages/Transcript';
//import ForgotPwd from './pages/ForgotPwd';
//import SettingUserInfoPage from './pages/SettingUserInfo';
//import SettingPasswordPage from './pages/SettingPassword';
//import SettingProfilePage from './pages/SettingProfile';
//import SettingMorningCallPage from './pages/SettingMorningCall';
////import AddMeetingPage from './pages/AddMeeting';
//import AvailabilityPage from './pages/Availability';
//import AddAvailabilityPage from './pages/AddAvailability';
//import LoadingPage from './pages/Loading';
//import SignUpEmailPage from './pages/SignUpEmail';
//import SignUpPasswordPage from './pages/SignUpPassword';
//import SignUpNamePage from './pages/SignUpName';
//import SignUpAgePage from './pages/SignUpAge';
//import SignUpSkypePage from './pages/SignUpSkype';

// const App = StackNavigator({
//   Main: { screen: MainPage }, 
//   SignUp: { screen: SignUpPage },
//   LogIn: {screen: LogInPage},
//   Home: { 
//     screen: TabNavigator({
//       Call: {screen: CallPage},
//       Topics: {screen: TopicsPage},
//       Home: {screen: HomePage},
//       History: {screen: HistoryPage},
//       Settings: {screen: SettingsPage},
//     }, {
//       initialRouteName: "Home"
//     }),
//     navigationOptions: {
//       header: null,
//       gesturesEnabled: false,
//     }
//   },
//   Transcript: { screen: TranscriptPage },
// })

const HomeTabScreen = TabNavigator({
  Home: {screen: MainPage},
  //Availability: {screen: AvailabilityPage},
  Settings: {screen: SettingsPage}
}, {
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor : '#ffffff',
    activeBackgroundColor : color.secondry,
    labelStyle: {
      fontFamily: fonts.regular,
    },
    style: {
      backgroundColor: color.primary,
    },
    backBehavior: 'none',
    initialRouteName : 'Home',
    ...Platform.select({
      android : {
        showIcon : true,
        showLabel : false,
        scrollEnabled : false,
        indicatorStyle : {
          backgroundColor : 'transparent'
        }
      }
    })
  },
  tabBarPosition: 'bottom',
})

const App = StackNavigator({
  //Loading : {
  //  screen: LoadingPage
  //},    
  Main : {
    screen: MainPage
  },
  Settings : {
    screen: SettingsPage
  },  
  PhotoToAnalyze : {
    screen: PhotoToAnalyzePage
  }, 
  PhotoToRead : {
    screen: PhotoToReadPage
  },   
  LabelDetection : {
    screen: LabelDetectionPage
  },  
  Reading : {
    screen: ReadingPage
  }, 
  // Check : {
  //   screen: CheckPage
  // },  

  // LogIn: {
  //   screen: StackNavigator({
  //     LogInScreen : { screen : LogInPage },
  //     ForgotPwdScreen : { screen : ForgotPwd }
  //   },{
  //     mode: 'modal',
  //     headerMode: 'none'
  //   })
  // },
  // SignUp: {
  //   screen: SignUpPage
  // },
  // SignUpEmail: {
  //   screen: SignUpEmailPage
  // },
  // SignUpPassword: {
  //   screen: SignUpPasswordPage
  // },
  // SignUpName: {
  //   screen: SignUpNamePage
  // },
  // SignUpAge: {
  //   screen: SignUpAgePage
  // },
  // SignUpSkype: {
  //   screen: SignUpSkypePage
  // },
  // Home : {
  //   screen : HomeTabScreen,
  //   navigationOptions: {
  //     gesturesEnabled: false,
  //   }
  // },
  // AddMeeting : {
  //   screen: AddMeetingPage
  // },
  // AddAvailability : {
  //   screen: AddAvailabilityPage
  // }, 
  // SettingUserInfo : {
  //   screen: SettingUserInfoPage
  // },
  // SettingPassword : {
  //   screen: SettingPasswordPage
  // },  
  // SettingProfile : {
  //   screen: SettingProfilePage
  // },     
  // SettingMorningCall : {
  //   screen: SettingMorningCallPage
  // },      
},{
    mode: 'modal',
    headerMode: 'none'
});

export default App