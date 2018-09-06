import React, { Component } from 'react';
import Toast from 'react-native-simple-toast';
import {createDrawerNavigator} from 'react-navigation';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, List, ListItem } from 'native-base';
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
	ImageBackground,
	AsyncStorage
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SettingScreen from './SettingScreen';
import DashboardScreen from './DashboardScreen';
import DrawerScreen from './DrawerScreen';
import { YellowBox } from 'react-native';
const routes = ["Dashboard", "Account Details", "Withdrawal", "Terms and Conditions", "Premium Account", "Logout"];
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


export default class MainDashScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			// email : 'xandercahutay1994@gmail.com'
			email: ''
		}

		this.fetchAsync();
	}

	fetchAsync = async() => {
		AsyncStorage.getItem("email").then((value) => {
			this.setState({ email: value })
	    }).done();
	}

	render(){
		return(
			<Container>
        		<Content>
			        <ImageBackground source={require('./img/profile.png')} style={{
			              height: 100,
			              width: 100,
			              alignSelf: "center",
			              justifyContent: "center",
			              alignItems: "center",
			              marginTop: 10
			            }}/>
			         <Text style={styles.email}> {this.state.email} </Text>
			         <List
			         	style={styles.list}
			            dataArray={routes}
			            renderRow={data => {
			              return (
			                <ListItem
			                  button
			                  onPress={() => this.props.navigation.navigate(data)}>
			                  <Text>{data}</Text>
			                </ListItem>
			              );
			            }}
			          />
        		</Content>
        	</Container>
		)
	}
}

AppRegistry.registerComponent('DashboardScreen',()=>DashboardScreen)

const styles = StyleSheet.create({
	list: {
		marginTop: 20
	},

	email: {
		marginTop: 10,
		textAlign: 'center'
	}
})

