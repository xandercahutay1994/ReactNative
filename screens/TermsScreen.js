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
	Dimensions
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';

export default class TermsScreen extends Component {

	render(){
		return(
			<ScrollView>
				<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
					<Icon name="menu" style={styles.drawer}/>
		        </TouchableOpacity>
		        <Content>
					<Text style={styles.terms}> Terms & Conditions </Text>
				</Content>
		    </ScrollView>
		)
	}

}

AppRegistry.registerComponent('TermsScreen',()=>TermsScreen)


const styles = StyleSheet.create({

	drawer: {
		padding: '3%'
	},

	terms : {
		fontSize: 40,
		textAlign: 'center',
		color: '#110200',
		fontWeight: 'bold',
		marginTop: '10%',
		fontFamily: 'serif'
	}

})