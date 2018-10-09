import React, { Component } from 'react';
import {createStackNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid } from 'native-base';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions, 
  PixelRatio
} from 'react-native';
import SettingScreen from './screens/SettingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import PhotoScreen from './screens/PhotoScreen';
import VideoScreen from './screens/VideoScreen';
import MainDashScreen from './screens/MainDashScreen';
import PasswordScreen from './screens/PasswordScreen';
import PenTabNavigator from './screens/PenTabNavigator';
import ReferScreen from './screens/ReferScreen';
import SurveyScreen from './screens/SurveyScreen';
import TermsScreen from './screens/TermsScreen';
import WithdrawalScreen from './screens/WithdrawalScreen';
import LogoutScreen from './screens/LogoutScreen';
import HistoryScreen from './screens/HistoryScreen';
import PremiumScreen from './screens/PremiumScreen';
import ReferralScreen from './screens/ReferralScreen';

import modalScreen from './screens/modal';

import WithdrawalHistoryScreen from './screens/WithdrawalHistoryScreen';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const AppStackNavigator = createStackNavigator({
  Welcome:  WelcomeScreen,
  // Login: {
  //     screen: LoginScreen,
  //      navigationOptions: {
  //       header: 'none',
  //       drawerLockMode: 'locked-closed'
  //     }
  // },
  // Register: RegisterScreen,
  // MainDash: {
  //     screen: ({navigation}) => <MainDash screenProps={{mainNavigation:navigation}} />
  // },
  // Dashboard: {
  //     screen: ({navigation}) => <DashboardScreen screenProps={{dashNavigation:navigation}} />
  //   },
  // Photo: PhotoScreen,
  // Refer: ReferScreen
})

const Drawer = createDrawerNavigator({ 
    Welcome: {
        screen: WelcomeScreen,
         navigationOptions: {
          drawerLockMode: 'locked-closed'
        }
    },
    Login: {
        screen: LoginScreen,
         navigationOptions: {
          header: 'none',
          drawerLockMode: 'locked-closed'
        }
     },
     Register: {
        screen: RegisterScreen,
         navigationOptions: {
          drawerLockMode: 'locked-closed'
        }
     },
    Dashboard: DashboardScreen,
    MainDash: {
      screen: MainDashScreen,
      navigationOptions: ({ navigation }) => ({

      })
    },
    Photo: PhotoScreen,
    Video: VideoScreen,
    Refer:ReferScreen,
    Survey: SurveyScreen,
    'Account Details': PenTabNavigator,
    Password: PasswordScreen,
    'Terms and Conditions': TermsScreen,
    "Request Withdrawal": WithdrawalScreen,
    History: HistoryScreen,
    Referral: ReferralScreen,
    Withdrawal: WithdrawalHistoryScreen,
    "Premium Account": PremiumScreen,
    Logout: LogoutScreen
  },
  {
     headerMode: 'none',   
    contentComponent: props => <MainDashScreen {...props}/>
  });

export default Drawer;

// export default class App extends Component {
//   render(){
//     return (
//       <AppStackNavigator />
//     )
//   }
// }
AppRegistry.registerComponent('Drawer', ()=> Drawer)
  