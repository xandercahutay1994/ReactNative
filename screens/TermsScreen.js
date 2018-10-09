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
	PixelRatio
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';

const widthPercentageToDP = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
const heightPercentageToDP = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  const elemHeight = parseFloat(heightPercent);
return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

export default class TermsScreen extends Component {

	render(){
		if(widthPercentageToDP(100) <= 550){
			return(
				<ScrollView>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
			        <Content>
						<Text style={styles.terms}> Terms & Conditions </Text>
						<View style={styles.termsTwo}>
							<Image source={require('./img/terms.jpg')} style={styles.img}/>
						</View>
					</Content>
			    </ScrollView>
			)
		}else{

			return(
				<ScrollView>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
			        <Content>
						<Text style={styles.terms}> Terms & Conditions </Text>
						<View style={styles.termsTwo}>
							<Image source={require('./img/terms.jpg')}/>
						</View>
					</Content>
			    </ScrollView>
			)
		}

	}

}

AppRegistry.registerComponent('TermsScreen',()=>TermsScreen)


const styles = StyleSheet.create({

	drawer: {
		padding: '3%'
	},

	img:{
		width: widthPercentageToDP(90)
	},

	termsTwo:{
		alignSelf: 'center',
		marginTop: 10
	},

	terms : {
		fontSize: 40,
		textAlign: 'center',
		color: '#110200',
		fontWeight: 'bold',
		marginTop: '10%',
		fontFamily: 'Helvetica'
	}

})