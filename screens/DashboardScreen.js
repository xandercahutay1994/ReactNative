import React, { Component } from 'react';
import Toast from 'react-native-simple-toast';
import {createDrawerNavigator, DrawerView} from 'react-navigation';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';
import {
	Dimensions,
	PixelRatio,
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
	AsyncStorage,
	RefreshControl
} from 'react-native';
import SettingScreen from './SettingScreen';
import DrawerScreen from './DrawerScreen';
import MainDashScreen from './MainDashScreen';
import { YellowBox } from 'react-native';
import { DrawerActions } from 'react-navigation';
import Modal from "react-native-modal";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { MediaQuery, MediaQueryStyleSheet } from "react-native-responsive";
import FontAwesome, { Icons } from 'react-native-fontawesome';
import NotificationPopup from 'react-native-push-notification-popup';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const routes = ["Dashboard", "Account Details", "Withdrawal", "Terms and Conditions", "Logout"];

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

const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;
								// <Image source={require('./img/m15.png')} style={styles.mediaImg} />

export default class DashboardScreen extends Component {

	constructor(props){
		super(props);
		this.state = {
			data: [],
			// mail: this.props.navigation.state.params.email,
			mail: 'angelicaaliguen@gmail.com',
			earning: '',
			referCode: '',
			pennyer_id: '',
			isLoading: false,
			refreshing: false,
			notifyCount: ''
		}, () => {
	  		AsyncStorage.setItem("email", this.state.mail);
		}
	}

	_onRefresh = () => {
	    this.setState({refreshing: true});
	    this.setState({
			data: [],
			// mail: this.props.navigation.state.params.email,
			// mail: 'xandercahutay1994@gmail.com',
			mail: 'angelicaaliguen@gmail.com',
			earning: '',
			referCode: '',
			pennyer_id: '',
			isLoading: false,
			refreshing: false,
			notifyCount: ''
	    })
	    // this.fetchData();
	    this.componentDidMount();
	    this.setState({refreshing: false});
	}

	componentDidMount() {
     	this._isMounted = true;
		this.fetchData();
		this.fetchNotify();
    }

    componentWillUnmount(){
    	this._isMounted = false;	
    	this.isCancelled = true;
    }

    pop = () => {
    	// console.log(this.state.token);
    	const token = this.state.token;
    	if(this.state.token && this.state.token.length > 0){
		 	!this._isMounted && this.popup.show({
			    onPress: function() {console.log('Pressed')},
			    appTitle: 'Reminder',
			    timeText: 'Now',
			    title: 'Hello, ',
			    body: 'We send you a verification code to your gmail account, please click it to activate your PiggyPennyer account for you to withdraw your earnings. Thank you 😀',
			});
		}
    }

	fetchData = async() => {
		// AsyncStorage.getItem("email").then((value) => {
	 //      console.log(value);
	 //    }).done();
	 	

		email = this.state.mail;
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
			if(this._isMounted){
				this.setState({
					earning: responseData.detail[0].totalEarned.toFixed(8),
					referCode: responseData.detail[0].referCode,
					pennyer_id: responseData.detail[0].id,
					token: responseData.detail[0].token
				});
				this.pop();
				AsyncStorage.setItem("earnings", this.state.earning);
				AsyncStorage.setItem('referCode', responseData.detail[0].referCode);
				AsyncStorage.setItem('pen_id', this.state.pennyer_id.toString());
			}
		}).catch(function(error) {
			alert('Dashboard Screen has an error in the server')
		});

		// setTimeout(()=>{
		// 	this.fetchData();
		// },2500);
    }

    fetchNotify = async() => {
		email = "angelicaaliguen@gmail.com";

		// alert(this.state.pennyer_id)
	 	// fetch("http://192.168.254.116:8000/penDetail",{  
        fetch("http://192.168.83.2:8000/sendNotificationToPennyer",{  	
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
			if(this._isMounted){
				this.setState({ notifyCount: responseData.length});
				console.log(responseData.length);
			}
		}).catch(function(error) {
			alert('Dashboard Notification has an error in the server')
		});    	
    }
	photoFunc = async(pennyer_id) => {
		this.props.navigation.navigate('Photo', {pennyer_id: pennyer_id});
	}

	// this.props.navigation.state.params.mail
	videoFunc = async(pennyer_id) => {
		this.props.navigation.navigate('Video', {pennyer_id: pennyer_id});
	}

	surFunc = (pennyer_id) => {
		this.props.navigation.navigate('Survey', {pennyer_id: pennyer_id});
		// this.props.navigate('DrawerOpen');
	}

	refFunc = (referCode) => {
		// Alert.alert("Your referral code is " + this.state.referCode);
		this.props.navigation.navigate('Refer', {referCode: referCode});
	}

	sideBar = async () => {
		this.props.navigation.openDrawer();	
	}

	showNotification = () => {
		Alert.alert('hello');
		console.log('hello')
	}

	render() {
		if(widthPercentageToDP(100) <= 550){
			return (
				<ScrollView
					refreshControl={
	                  <RefreshControl
	                      onRefresh={() => this._onRefresh()}
	                      refreshing={this.state.refreshing}
	                  />
		           	}
				>	
					<View style={styles.container}>
				        <NotificationPopup ref={ref => this.popup = ref} style={styles.popup}/>
			        </View>
					<View style={styles.header}>
						<TouchableOpacity onPress={this.sideBar } >
							<Icon name="menu" style={styles.menu}/>
				        </TouchableOpacity>
				        <Text style={styles.dashboard}> Dashboard </Text>
				        <FontAwesome style={styles.globe}> {Icons.bell} </FontAwesome>
						<Text style={styles.sat}> {this.state.earning} </Text>
					</View>
					<View style={styles.appContainer}>
						<Text style={styles.install}> * 20 Satoshi </Text>
						<View style={styles.installText}>
							<Image source={require('./img/app.png')} style={styles.installImg}/>
						</View>
						<Text style={styles.app}> Install Apps </Text>
					</View>
					<View style={styles.mediaContainer}>
						<View style={styles.mediaBody}>
							<TouchableOpacity onPress={()=>this.videoFunc(this.state.pennyer_id)} activeOpacity = { .5 }>
								<Image source={require('./img/videoclip.png')} style={styles.mediaVid}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>this.photoFunc(this.state.pennyer_id)} activeOpacity = { .5 }>
								  	<Image source={require('./img/m15.png')} style={styles.mediaImg} />
							</TouchableOpacity>
						</View>
						<View style={styles.mediaBody}>
							<Text style={styles.video}> Watch Videos </Text>
							<Text style={styles.photo}> Watch Photos </Text>
						</View>
					</View>
					<View style={styles.mediaContainerLast}>
						<View style={styles.media}>
							<Text style={styles.surveySat}> * 10 Satoshi </Text>
							<Text style={styles.referSat}> * 5 Satoshi </Text>
						</View>
						<View style={styles.mediaBodyImg}>
							<TouchableOpacity onPress={()=>this.surFunc(this.state.pennyer_id)} activeOpacity = { .5 }>
								<Image source={require('./img/survey2.png')} style={styles.mediaSurvey}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>this.refFunc(this.state.referCode)} activeOpacity = { .5 }>
								<Image source={require('./img/refer.png')} style={styles.mediaRefer}/>
							</TouchableOpacity>
						</View>
						<View style={styles.mediaBodyLast}>
							<Text style={styles.takeSurvey}> Take Surveys </Text>
							<Text style={styles.referFriend}> Invite Friends </Text>
						</View>
					</View>
				</ScrollView>
			);
		}else{
			return (
				<ScrollView
					refreshControl={
	                  <RefreshControl
	                      onRefresh={() => this._onRefresh()}
	                      refreshing={this.state.refreshing}
	                  />
		           	}
				>
					<View style={styles.header}>
						<TouchableOpacity onPress={this.sideBar } >
							<Icon name="menu" style={styles.menu}/>
				        </TouchableOpacity>
				        <Text style={styles.dashboard}> Dashboard </Text>
				        <TouchableOpacity onPress={this.showNotification}  style={styles.showNotification}>
			        		<FontAwesome style={styles.bell}> {Icons.bell} </FontAwesome>
							<Text style={styles.notifyCount}> {this.state.notifyCount} </Text>
						</TouchableOpacity>
						<Text style={styles.sat}> {this.state.earning}</Text>
					</View>
					<View style={styles.container}>
				        <NotificationPopup ref={ref => this.popup = ref} style={styles.popup}/>
			        </View>
					<View style={styles.appContainer}>
						<Text style={styles.install}> * 20 Satoshi </Text>
						<View style={styles.installText}>
							<Image source={require('./img/app.png')} style={styles.installImg}/>
						</View>
						<Text style={styles.app}> Install Apps </Text>
					</View>
					<View style={styles.mediaContainer}>
						<View style={styles.mediaBody}>
							<TouchableOpacity onPress={()=>this.videoFunc(this.state.pennyer_id)} activeOpacity = { .5 }>
								<Image source={require('./img/videoclip.png')} style={styles.mediaVid}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>this.photoFunc(this.state.pennyer_id)} activeOpacity = { .5 }>
								  	<Image source={require('./img/m15.png')} style={styles.mediaImgBig} />
							</TouchableOpacity>
						</View>
						<View style={styles.mediaBody}>
							<Text style={styles.video}> Watch Videos </Text>
							<Text style={styles.photoBig}> Watch Photos </Text>
						</View>
					</View>
					<View style={styles.mediaContainerLast}>
						<View style={styles.media}>
							<Text style={styles.surveySatBig}> * 10 Satoshi </Text>
							<Text style={styles.referSatBig}> * 5 Satoshi </Text>
						</View>
						<View style={styles.mediaBodyImg}>
							<TouchableOpacity onPress={()=>this.surFunc(this.state.pennyer_id)} activeOpacity = { .5 }>
								<Image source={require('./img/survey2.png')} style={styles.mediaSurvey}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>this.refFunc(this.state.referCode)} activeOpacity = { .5 }>
								<Image source={require('./img/refer.png')} style={styles.mediaReferBig}/>
							</TouchableOpacity>
						</View>
						<View style={styles.mediaBodyLast}>
							<Text style={styles.takeSurveyBig}> Take Surveys </Text>
							<Text style={styles.referFriendBig}> Invite Friends </Text>
						</View>
					</View>
				</ScrollView>
			)
		}
	}
}

export {
	widthPercentageToDP,
	heightPercentageToDP
}

AppRegistry.registerComponent('DashboardScreen',()=>DashboardScreen)


const styles = MediaQueryStyleSheet.create({

	notifyCount: {
		// backgroundColor: 'red',
		color: 'red',
		// bottom: 18,
		// margin: -5,
		// bottom: 3,
		marginTop: 7,
		marginLeft: -18,
		fontSize: 20,
		fontWeight: 'bold',
		width: 17,
		height: 24,
		// borderRadius: 10
	},

	container: {
	},

	showNotification: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		right: 135,
	},

	popup: {
		fontSize: 20,
		color: 'red'
	},

	sat: {
		fontWeight: '100',
		color: 'white',
		position: 'absolute',
		right: 5,
		bottom: 8,
		backgroundColor: "#121917",
		padding: 3,
		fontSize: 19,
		opacity: 0.8,
		borderRadius: 4
	},

	bell: {
		fontWeight: '100',
		color: 'white',
		// right: 135,
		marginTop: 19,	
		fontSize: 20,
	
	},

	globe: {
		// fontWeight: '100',
		// color: 'white',
		position: 'absolute',
		right: 125,
		bottom: 9,
		padding: 3,
		// fontSize: 19,
		// opacity: 0.8,
		borderRadius: 4
	},

    mediaImg: {
		height: 80, 
		width: 90,
   	    resizeMode : 'stretch',
   	    marginLeft: widthPercentageToDP(28)
   	},

   	mediaImgBig: {
		height: 80, 
		width: 90,
   	    resizeMode : 'stretch',
   	    marginLeft: widthPercentageToDP(42)
   	},

	header: {
		flexDirection:'row', 
		flexWrap: 'wrap',
		backgroundColor: '#1e73fc',
		paddingVertical: 16
	},

	menu: {
		marginLeft: 15,
		fontSize: 20,
		color: 'white',
		marginTop: 3
	},

	sideMenu: {
		flex: 1,
		flexDirection:'row', 
		flexWrap: 'wrap',
		alignItems: 'flex-start'
	},

	dashboard: {
		fontSize: 25,
		left: 30,
		bottom: 8,
		position: 'absolute'
	},

	lastPart: {
		flexDirection:'row', 
		flexWrap: 'wrap',
		paddingVertical: 8
	},

	installText: {
		flexDirection:'row', 
		flexWrap: 'wrap',
        alignSelf: 'center',
        marginTop: 20
	},

	media: {
		// textAlign: 'center',
		// color: 'white',
		backgroundColor: '#121917',
		padding: 5,
		flexDirection:'row', 
		flexWrap: 'wrap',
		opacity: 0.8,
	},

	mediaSat: {
		textAlign: 'center',
		color: 'white',
		backgroundColor: '#121917',
		padding: 5,
		flexDirection:'row', 
		flexWrap: 'wrap',
		opacity: 0.8,
		fontSize: 12
	},

	referSat: {
		color: 'white',
		fontSize: 12,
	    marginLeft: widthPercentageToDP(36)
	},

	referSatBig: {
		color: 'white',
		fontSize: 12,
	    marginLeft: widthPercentageToDP(48)
	},

	surveySat: {
		color: 'white',
		fontSize: 12,
		position: 'relative',
		marginLeft: widthPercentageToDP(12)
	},

	surveySatBig: {
		color: 'white',
		fontSize: 12,
		position: 'relative',
		marginLeft: '10%',
	},

	link: {
		marginTop: 17
	},

	email: {
		fontWeight: '100',
		color: 'white',
		left: 3,
		fontSize: 13,
		padding: 3
	},

	mediaContainer: {
		marginTop: '5%',
		margin: '3%'
	},

	mediaContainerLast: {
		marginTop: '10%'
	},

	install: {
		color: 'white',
		backgroundColor: '#121917',
		// backgroundColor: 'blue',
		padding: 5,
		opacity: 0.8,
		fontSize: 12,
		textAlign: 'center'
	},

	installImg: {
		height: 70, 
		width: 90,
        resizeMode : 'stretch',
        marginTop: '3%'
	},


	mediaBody: {
		flex: 1,
		alignSelf: 'stretch',
		marginTop: 15,
		flexDirection:'row', 
        alignItems: 'flex-end',
	},

	mediaBodyLast: {
		// marginTop: '2%',
		// flex: 1,
		// alignSelf: 'stretch',

	},

	mediaVid: {
		height: 90, 
		width: 90,
		marginLeft: widthPercentageToDP(9)
	},

	video: {
		position: 'relative',
		marginLeft: "10%",
		marginTop: -10
	},

	photo: {
		position: 'absolute',
		marginLeft: widthPercentageToDP(62)
	},

	photoBig: {
		position: 'absolute',
		marginLeft: widthPercentageToDP(66)
	},

	takeSurvey: {
		position: 'relative',
		marginLeft: widthPercentageToDP(12)
	},

	takeSurveyBig: {
		position: 'relative',
		marginLeft: responsiveWidth(10)
	},

	referFriend: {
		position: 'absolute',
		marginLeft: widthPercentageToDP(64)
	},

	referFriendBig: {
		position: 'absolute',
		marginLeft: widthPercentageToDP(68)
	},

	app: {
		top: 10,
		textAlign: 'center'
	},


	mediaBodyImg: {
		flex: 1,
		flexDirection:'row',  
        marginTop: '6%'
	},

	mediaSurvey: {
		height: 90, 
		width: 90,
		marginLeft: "27%",
		resizeMode : 'stretch',
	},

	mediaRefer: {
		height: 90, 
		width: 90,
   	    resizeMode : 'stretch',
		marginTop: '5%',
		marginLeft: widthPercentageToDP(14)
	},

	mediaReferBig: {
		height: 90, 
		width: 90,
   	    resizeMode : 'stretch',
		marginTop: '5%',
		marginLeft: widthPercentageToDP(26)
	}
});	