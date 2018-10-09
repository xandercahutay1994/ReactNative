import React, {Component} from 'react';
import { Container, Header, Content, Left } from 'native-base';
import {createBottomTabNavigator } from 'react-navigation';
import {
	AppRegistry,
	Text,
	View,
	TextInput,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Image,
	TouchableHighlight,
	AsyncStorage,
	Alert,
	ImageBackground
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { YellowBox } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

import SettingScreen from './SettingScreen';
import PasswordScreen from './PasswordScreen';
import HistoryScreen from './HistoryScreen';
import WithdrawalHistoryScreen from './WithdrawalHistoryScreen';
import ReferralScreen from './ReferralScreen';

export default createBottomTabNavigator ({
  Details: SettingScreen,
  Password: PasswordScreen,
  Earnings: HistoryScreen,
  'Withdrawal': WithdrawalHistoryScreen,
  Referral: ReferralScreen
},
{
	navigationOptions: ({ navigation }) => ({
	  tabBarIcon: ({ focused, tintColor }) => {
	    const { routeName } = navigation.state;
	    let iconName;
	    if (routeName === 'Change Password') {
	    	iconName = `${Icons.save}`
	    }

	    return <FontAwesome> {iconName} </FontAwesome>
	  },
	}),
	tabBarOptions: {
      activeTintColor: '#24a53e',
	  showIcon: true,
	  swipeEnabled: false,
	  labelStyle: {
	    fontSize: 17,
	    paddingVertical: 10
	  },
	  style: {
	    backgroundColor: '#2b3338',
	  },
	  tabStyle: {
	    width: 100,
	  },
    },
})

AppRegistry.registerComponent('PenTabNavigator ',()=>PenTabNavigator );