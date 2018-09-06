import React, {Component} from 'react';
import {createBottomTabNavigator } from 'react-navigation';
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
	AsyncStorage,
	Alert,
	ImageBackground,
	Dimensions,
	PixelRatio,
	Clipboard,
	RefreshControl
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { YellowBox } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {createStackNavigator} from 'react-navigation';
import DetailScreen from './SettingScreen';
import PasswordScreen from './PasswordScreen';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';
import Modal from 'react-native-modal'; // 2.4.0


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


export default class PremiumScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			earnings: '',
			email: '',
			// email: "angelicaaliguen@gmail.com",
			clickBtn: '',
			refreshing: false,
			subscription_type: ''

		}
		this.fetchAsync()
	}


	fetchAsync = async() => {
		AsyncStorage.getItem("email").then((value) => {
	      this.setState({
	        email: value
	      });
	    }).done();		
	}

	// _onRefresh = () => {
	//     this.setState({refreshing: true});
	// 	this.setState({
	// 		clickBtn: false,
	// 		refreshing: false,
	// 		earnings: '',
	// 		email: ''	
	// 	});
	//  }

	componentDidUpdate(){
		this.fetchData();
	}

	componentWillUnmount(){
		this.isCancelled = true;
	}

	fetchData = async() => {
		email = this.state.email;

		// fetch("http://192.168.254.116:8000/penDetail",{  	
	    fetch("http://192.168.83.2:8000/penDetail",{  	
	        method: 'POST',
	        headers: {
	          'Content-Type': 'application/json',
	          'Accept': 'application/json',
	          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
	        },
	        body: JSON.stringify({
	        	email
	        })  
		})
		.then((response) => response.json())
		.then((responseData) => {
			!this.isCancelled && this.setState({
				earnings: responseData.detail[0].totalEarned.toFixed(8),
				walletAddress: responseData.detail[0].walletAddress,
				subscription_type: responseData.detail[0].subscription_type,
				clickBtn: false,
			});
			console.log(responseData)
		}).catch(function(error) {
			alert('Something is wrong with the API in server')
		});

		// setTimeout(()=>{
		// 	this.fetchData();
		// },5000);
    }

	activatePress = async() => {
		this.setState({ clickBtn: true })

	   fetch("http://192.168.83.2:8000/premiumAccount",{  	
	        method: 'POST',
	        headers: {
	          'Content-Type': 'application/json',
	          'Accept': 'application/json',
	          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
	        },
	        body: JSON.stringify({
	        	email
	        })  
		})
		.then((response) => response.json())
		.then((responseData) => {
			Alert.alert(responseData);
			!this.isCancelled && this.setState({
				earnings: '',
				walletAddress: '',
				clickBtn: false,
				refreshing: false,
				subscription_type: ''
			});
		}).catch(function(error) {
			alert('Something is wrong with the API in server')
		});
	}


	render(){

		if(this.state.subscription_type != 1){
			if(this.state.earnings >= 0.00150000){
				return(
					<ScrollView>
						<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
							<Icon name="menu" style={styles.drawer}/>
				        </TouchableOpacity>
						<Content>
							<Text style={styles.premium}> Premium Account </Text>
							<View style={styles.container}>
								<View style={styles.screen}>
									<Text style={styles.textEarnings}> Total Earnings : </Text>
									<Text style={styles.earnings}> {this.state.earnings}  </Text>
								</View>

								<View style={styles.cardInfo}>	
									<Card title="Eyes Here"> 
										<Text style={styles.info}>
											Hello! You have sufficient funds/earnings to avail Premium Account. If you upgrade your account to Premium,
											you will get an unlimited viewings & earnings. Just click the ACTIVATE button to upgrade account. 
										</Text>
									</Card>
								</View>
								<TouchableOpacity onPress={this.activatePress}>
					        	    <FontAwesome style={styles.activate}> 
						        	    { this.state.clickBtn == false ?  Icons.toggleOn :  Icons.spinner }   
	                					{ this.state.clickBtn == false ?  " ACTIVATE" :  " ACTIVATING..." }
						            </FontAwesome>
						        </TouchableOpacity>
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
							<Text style={styles.premium}> Premium Account </Text>
							<View style={styles.container}>
								<View style={styles.screen}>
									<Text style={styles.textEarnings}> Total Earnings : </Text>
									<Text style={styles.earnings}> {this.state.earnings}  </Text>
								</View>

								<View style={styles.cardInfo}>	
									<Card title="Eyes Here"> 
										<Text style={styles.infoRed}>
											Hello! You have insufficient funds/earnings to avail Premium Account. Please come back if your earnings is greater than
											or equal to 0.00150000 Satoshi. 
										</Text>
									</Card>
								</View>
							</View>
						</Content>
					</ScrollView>
				)
			}
		}else{
			return (
				<ScrollView>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
			        <View style={styles.gif}>
						<Image source={require('./img/congratulations.gif')}/>
					</View>
				</ScrollView>
			)
		}
	}
}

AppRegistry.registerComponent('PremiumScreen',()=>PremiumScreen);

const styles = StyleSheet.create({

	gif: {
		alignSelf: 'center',
		marginTop: 30
	},

	activate: {
	    color: '#FFF',
	    backgroundColor: 'green',
	    marginTop: '20%',
		width: widthPercentageToDP(40),
		display: 'flex',
	    textAlign: 'center',
	    justifyContent: 'center',
	    paddingVertical: 13,
	    borderRadius: 15,
	    alignSelf: 'center',
  	    
	},

	cardInfo: {
		marginTop: 20
	},

	info:{
		fontSize: 15,
		textAlign: 'center',
		lineHeight: 25
	},

	infoRed:{
		fontSize: 15,
		textAlign: 'center',
		color: 'red',
		lineHeight: 25
	},

	earnings: {
		textAlign: 'center',
		fontSize: 20,
		backgroundColor: 'black',
		padding: 7,
		opacity: 0.8,
		color: 'white',
		// fontWeight: '100',
		borderRadius: 3,
		display: 'flex'
	},

	textEarnings: {
		textAlign: 'center',
		fontSize: 20,
		padding: 7,
		color: '#110200'
	},
	container: {
		marginTop: '15%',
		display: 'flex',
	    alignSelf: 'center',
  	    width: '60%',
	},

	screen: {
		// marginTop: '2%',
		flexDirection: 'row',
		// flex: 1,
		position: 'relative',
		justifyContent: 'center',
	},
	drawer: {
		padding: '3%'
	},

	premium : {
		fontSize: 40,
		textAlign: 'center',
		color: '#110200',
		fontWeight: 'bold',
		marginTop: '12%',
		fontFamily: 'serif'
	}
})