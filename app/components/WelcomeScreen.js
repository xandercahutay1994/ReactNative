import React, { Component } from 'react';
import {StackNavigator} from 'react-navigation';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions, 
  PixelRatio,
  Alert,
  FlatList
} from 'react-native';


export default class WelcomeScreen extends Component{

	render(){
		return (
			<View>
				<Button title="GET STARTED"/>
			</View>
		);
	}
}

// export default StackNavigator({
//   Welcome : {
//     screen: WelcomeScreen
//   }
// });

AppRegistry.registerComponent('WelcomeScreen', ()=>WelcomeScreen)

const styles = StyleSheet.create({
	started : {
	    color: '#FFF',
	    backgroundColor: 'blue',
	    textAlign: 'center',
	    borderRadius: 3,
	    flex: 1,
	    padding: 10,
	    width: 150,
	    justifyContent: "center",
	    alignItems: "center",
	    margin: "30%"
	}
});