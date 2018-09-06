import React, { Component } from 'react';
import { Icon,  Container, Header, Content, Left } from 'native-base';
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
  FlatList,
  ImageBackground,
  AsyncStorage
} from 'react-native';
import LoginScreen from './LoginScreen';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class WelcomeScreen extends Component{

	static navigationOptions = {
		header: null
	}

	constructor(props){
		super(props)
		this.state = {
			isLogin: ''
		}
	}

	componentDidMount(){
		AsyncStorage.getItem("isLogin").then((value) => {
	      this.setState({
	        isLogin: value
	      });
	      if(value != null){
	      	this.props.navigation.navigate('Login');
	      }
	    }).done();
	}

	login = () => {
		AsyncStorage.setItem('isLogin', '1');
		this.props.navigation.navigate('Login');
	}

	render(){
		if(this.state.isLogin == null){
			return (
				<ImageBackground source={require('./img/started.jpg')} style={styles.startedImg}>
					<Container>
						<Content>
				            <TouchableOpacity onPress={this.login}>
						        <Text style={styles.getStarted}>GET STARTED</Text>
					         </TouchableOpacity>  
					    </Content>
					</Container>
				</ImageBackground>
			);	
		}else{
			return <LoginScreen />
		}
	}
}

AppRegistry.registerComponent('WelcomeScreen', ()=>WelcomeScreen)
	
const styles = StyleSheet.create({
	getStarted: {
		color: '#FFF',
		width: "70%",
		textAlign: 'center',
		paddingVertical: 10,
		backgroundColor: 'blue',
		fontWeight: '900',
		borderRadius: 10,
		alignSelf: 'center',
		marginTop: responsiveHeight(86)
	},

	startedImg: {
		flex: 1,
        width: '100%',
        height: '100%',
	}
});