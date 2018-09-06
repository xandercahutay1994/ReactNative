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
import SettingScreen from './SettingScreen';

const DrawerScreen = createDrawerNavigator({
    Setting: {
      screen: SettingScreen
    },
})



export default DrawerScreen;

