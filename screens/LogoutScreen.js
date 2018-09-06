import React, {Component} from 'react';
import Toast from 'react-native-simple-toast';
import { Card } from 'react-native-elements';
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
	Alert,
	FlatList,
	Dimensions,
	AsyncStorage
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';

export default class LogoutScreen extends Component {

	componentDidMount(){
		this._isMounted = true;
		this.fetchAsync();
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	fetchAsync = async() => {
		AsyncStorage.removeItem('email');
		AsyncStorage.clear();
     	this.props.navigation.navigate('Login');
	}

	render(){
		return (
			<View>

			</View>
		)

	}

}

AppRegistry.registerComponent('LogoutScreen',()=>LogoutScreen)


const styles = StyleSheet.create({

	drawer: {
		padding: '3%'
	},

})