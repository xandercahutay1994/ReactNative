import React, {Component} from 'react';
import {createBottomTabNavigator } from 'react-navigation';
import TabNavigator from 'react-navigation';
import {
	Dimensions,
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
	ImageBackground,
	FlatList,
	PixelRatio
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { YellowBox } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';
import Table from 'react-native-simple-table';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

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

export default class ReferralScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			referCode: '',
			referHistory: '',
			tableHead: ['Taskname', 'TaskPrice', 'Date'],
			ipAddress: ''
		}
		this.fetchAsync()
	}

	fetchAsync = async() => {
		AsyncStorage.getItem("referCode").then((value) => {
	      this.setState({
	        referCode: value
	      });
	    }).done();		
	    AsyncStorage.getItem("ipAddress").then((value) => {
	        this.setState({
	          ipAddress: value
	        })
    		this.fetchData();
	    }).done();
	}

	componentDidUpdate(){
		// this.fetchData();
	}

	componentWillUnmount(){
		this.isCancelled = true;
	}


	fetchData = async() => {
		const {referCode,ipAddress} = this.state;
		
		// let resolve = await fetch('http://192.168.254.116:8000/pennyerHistory/' + email,{
		let resolve = await fetch("http://"+ ipAddress + "/referHistory/" + referCode,{
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseData) => {
			!this.isCancelled && this.setState({
				referHistory: responseData.referHistory
			});	
			// console.log(responseData)
		}).catch(function(error) {
			Alert.alert('Something is wrong with the(history) server!');
		});    	

	}
	render(){
		return(
			<ScrollView>
				<Container>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
					<Content>
						<Text style={styles.history}> Referral History </Text>
						<View style={styles.header}>	
							<Text style={ widthPercentageToDP(100) <= 500 ? styles.namePrice : styles.namePriceBig }> Details </Text>
							<Text style={ widthPercentageToDP(100) <= 500 ? styles.nameDate : styles.nameDateBig }> Date </Text>
						</View>
						<View style={styles.container}>
							<FlatList
					          data={this.state.referHistory}
					          style={styles.flatlist}
					          renderItem={({ item: rowData }) => {
					          	return(
				        			<View style={styles.details}>
				        				<Text style={styles.nameDetails}>Earned 5 Satoshi by referring {rowData.referEmail}</Text>
				        				<Text style={styles.petsa}>{rowData.registered_at} </Text>
		  		  	        		</View>
					          	)
					          }}
					         keyExtractor={(item, index) => index.toString()}
					        />
					    </View> 	
					</Content>
				</Container>
			</ScrollView>
		)
	}

}

AppRegistry.registerComponent('ReferralScreen',()=>ReferralScreen);

const styles = StyleSheet.create({
	details: {
		display:'flex'
	},

	drawer: {
		padding: '3%'
	},

	history : {
		fontSize: 40,
		textAlign: 'center',
		marginBottom: '8%',
		color: '#110200',
		fontWeight: 'bold',
		marginTop: '2%',
		fontFamily: 'Helvetica'
	},

	container: { 
		flex: 1, 
		padding: 16, 
		backgroundColor: '#fff', 
		flexDirection: 'row',	
		width: widthPercentageToDP(100),
		display: 'flex'
	},

	header:{
		flexDirection: 'row',
		backgroundColor: 'black',
		height: 40,
		padding: 5
	},

		nameHeaderBig: {
		marginLeft: widthPercentageToDP(2),
		fontSize: 20,
		color: 'white'
	},

	namePriceBig: {
		marginLeft: widthPercentageToDP(17),
		fontSize: 20,
		color: 'white'
	},

	nameDateBig: {
		marginLeft: widthPercentageToDP(45),
		fontSize: 20,
		color: 'white'
	},

	nameHeader: {
		marginLeft: widthPercentageToDP(2),
		fontSize: 20,
		color: 'white'
	},

	flatlist: {
		width: '30%'
	},

	namePrice: {
		marginLeft: widthPercentageToDP(16),
		fontSize: 20,
		color: 'white',
		flex: 1
	},

	nameDate: {
		marginLeft: widthPercentageToDP(1),
		fontSize: 20,
		color: 'white',
		flex: 1 
	},

		headerText: {
		textAlign: 'center',
		fontSize: 20
	},

	nameDetails: {
		// marginLeft: widthPercentageToDP(2),
		fontSize: 17,
		lineHeight: 40,
		fontFamily: 'Helvetica',
		width: widthPercentageToDP(58)
	},

	task_price: {
		fontSize: 20,
		lineHeight: 40,
		fontFamily: 'Helvetica',
		textAlign: 'center'	
	},

	petsa: {
		position: 'absolute',
		marginLeft: widthPercentageToDP(60),
		textAlign: 'center',
		fontSize: 20,
		lineHeight: 40,
		fontFamily: 'Helvetica'
	},
});