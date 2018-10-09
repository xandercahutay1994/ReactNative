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
import { Badge } from 'react-native-elements';

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
			mail: this.props.navigation.state.params.email,
			earning: '',
			referCode: '',
			pennyer_id: '',
			isLoading: false,
			refreshing: false,
			notifyCount: '',
			notify: [],
			notificationId: '',
			withPennyerId: '',
			withdrawalAmt: '',
			referHistory: [],
			refCount: '',
			penRewards: [],
			rewardCount: '',
			subscription_type: '',
			ipAddress: "",
			referEarnings: "",
			notificationCount: 0,
			admin: 'admin'

		}, () => {
	  		AsyncStorage.setItem("email", this.state.mail);
		}
  		this.fetchIpAdd();
	}

	_onRefresh = () => {
	    this.setState({refreshing: true});
	    this.setState({
			data: [],
			mail: this.props.navigation.state.params.email,
			earning: '',
			referCode: '',
			pennyer_id: '',
			isLoading: false,
			refreshing: false,
			notifyCount: '',
			notify: [],
			notificationId: '',
			withPennyerId: '',
			withdrawalAmt: '',
			referHistory: [],
			refCount: '',
			penRewards: [],
			rewardCount: '',
			subscription_type: '',
			ipAddress: "",
			referEarnings: "",
			notificationCount: 0,
			admin: 'admin'
	    })
	    this.fetchData();
	    this.fetchIpAdd();
	    this.componentDidMount();
	    this.setState({refreshing: false});
	}

	fetchIpAdd = async() =>{
		AsyncStorage.getItem("ipAddress").then((value) => {
	        this.setState({
	          ipAddress: value
	        })
			this.fetchData();
			this.fetchNotify();
	    }).done();
	}

	componentDidMount() {
		this.fetchIpAdd();
     	this._isMounted = true;
    }

    componentWillUnmount(){
    	this._isMounted = false;	
    	this.isCancelled = true;
    }

    pop = () => {
    	if(this.state.token && this.state.token.length > 0){
		 	this._isMounted && this.popup.show({
			    onPress: function() {console.log('Pressed')},
			    appTitle: 'Reminder',
			    timeText: 'Now',
			    title: 'Hello, ',
			    body: 'We send you a verification code to your gmail account, please click it to activate your PiggyPennyer account for you to withdraw your earnings. Thank you 😀',
			});
		}
    }

	fetchData = async() => {
		
		email = this.state.mail;
		const{ipAddress} = this.state;

        fetch("http://" + ipAddress + "/penDetail",{  	
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
					token: responseData.detail[0].token,
					subscription_type: responseData.detail[0].subscription_type
				});
				this.pop();
				AsyncStorage.setItem("earnings", this.state.earning);
				AsyncStorage.setItem('referCode', responseData.detail[0].referCode);
				AsyncStorage.setItem('pen_id', this.state.pennyer_id.toString());
				AsyncStorage.setItem('token', this.state.token);	
				AsyncStorage.setItem('subscription_type', this.state.subscription_type);	
				this.fetchHistory();
				this.fetchReward();
			}
		}).catch(function(error) {
			alert('Dashboard Screen has an error in the server')
		});

		// setTimeout(()=>{
		// 	this.fetchData();
		// },2500);
    }

    fetchHistory =  async() => {
    	const {pennyer_id,ipAddress,admin} = this.state;
    	// alert(pennyer_id);

    	let resolve = await fetch("http://" + ipAddress + "/paidReferral/" + pennyer_id + '/' + admin,{
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseData) => {
			// if(!this.isCancelled){
				if(responseData != ""){
					this.setState({
						refCount: 1,
						referEarnings: responseData.referEarnings
					});
				}
			// }
				
		}).catch(function(error) {
			Alert.alert('Something is wrong with the(referral history) server!');
		});
    }

    // withdrawal
    fetchNotify = async() => {
		email = this.state.mail;
		const{ipAddress} = this.state;

        fetch("http://" + ipAddress + "/sendNotificationToPennyer",{  	
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
				if(responseData.length > 0){
					this.setState({ 
						notifyCount: parseInt(responseData.length),
						notify: responseData,
						notificationCount: responseData.length 
					});

					this.state.notify.map((data,i)=>{
						this.setState({ 
							withdrawalAmt: data.withdrawal_amt,
							notificationId: data.id,
							withPennyerId: data.pennyer_id
						})
					});
				}
			// }
		}).catch(function(error	) {
			alert('Fetch Notification has an error in the server')
		});    	
    }

    // daily reward OKAY NAH
    fetchReward =  async() => {
    	const {pennyer_id,ipAddress} = this.state;

    	let resolve = await fetch("http://" + ipAddress + "/getReward/" + pennyer_id,{
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseData) => {
			// alert(responseData.length);
			// if(this.isMounted){
				this.setState({
				// 	penRewards: responseData,
					rewardCount: responseData.length,
				});
			// }
		}).catch(function(error) {
			Alert.alert('Something is wrong with the(reward history) server!');
		});
    
		this.setState({
			notificationCount: this.state.refCount + this.state.rewardCount
		});
    }

	photoFunc = async(pennyer_id) => {
		if(this.state.token != null)
			this.verifyAccount();
		else
			this.props.navigation.navigate('Photo', {pennyer_id: pennyer_id, subscription_type: this.state.subscription_type});
	}

	videoFunc = async(pennyer_id) => {
		if(this.state.token != null)
			this.verifyAccount();
		else
			this.props.navigation.navigate('Video', {pennyer_id: pennyer_id, subscription_type: this.state.subscription_type});
	}

	surFunc = (pennyer_id) => {
		if(this.state.token != null)
			this.verifyAccount();
		else
			this.props.navigation.navigate('Survey', {pennyer_id: pennyer_id, subscription_type: this.state.subscription_type});
	}

	refFunc = (referCode) => {
		if(this.state.token != null)
			this.verifyAccount();
		else
			this.props.navigation.navigate('Refer', {referCode: referCode });
	}

	sideBar = async () => {
		this.props.navigation.openDrawer();	
	}

	verifyAccount = async() => {
		alert("Verify first the code we sent to your Gmail Account before making any transaction!Thanks 😀");			
	}

	showNotification = () => {
		notificationId = this.state.notificationId; 
		referCode = this.state.referCode;
		pennyer_id = this.state.pennyer_id;
		const{ipAddress} = this.state;

		if(!this.isCancelled){
			fetch("http://" + ipAddress + "/updateWithdrawalStatus",{  	
		        method: 'POST',
		        headers: {
		          'Content-Type': 'application/json',
		          'Accept': 'application/json',
		          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
		        },
		        body: JSON.stringify({
		        	notificationId
		        })  
			})
			.then((response) => response.json())
			.then((responseData) => {
				if(this.state.notify != ""){
					alert("Hello!The amount of " + this.state.withdrawalAmt + " Satoshi that you requested to withdraw has been successfully sent to your Coins.ph account!Thank you 😀");
				}

			}).catch(function(error) {
				alert('Update Notification has an error in the server')
			});  

			fetch("http://" + ipAddress + "/updateRefHistory",{  	
		        method: 'POST',
		        headers: {
		          'Content-Type': 'application/json',
		          'Accept': 'application/json',
		          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
		        },
		        body: JSON.stringify({
		        	referCode
		        })  
			})
			.then((response) => response.json())
			.then((responseData) => {
				referEarnings = this.state.referEarnings;
				if(referEarnings != ""){
					alert("You earned a total of " +  referEarnings + " Satoshi for a successfull referral!Congratulations 😀");
				}
			}).catch(function(error) {
				alert('Update Notification has an error in the server')
			});    	

	     
			fetch("http://" + ipAddress + "/postReward",{  	
		        method: 'POST',
		        headers: {
		          'Content-Type': 'application/json',
		          'Accept': 'application/json',
		          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
		        },
		        body: JSON.stringify({
		        	pennyer_id
		        })  
			})
			.then((response) => response.json())
			.then((responseData) => {
				let reward = responseData * 5;

				if(reward >= 1){
					alert("You got a daily total reward of " + reward + " Satoshi!Congratulations 😀");
				}
			}).catch(function(error) {
				alert('Update referral has an error in the server')
			});    	
			this.fetchIpAdd();
		}
		this.fetchIpAdd();
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
				        <TouchableOpacity onPress={this.showNotification}  style={styles.showNotification}>
			        		<FontAwesome style={styles.bell}> {Icons.bell} </FontAwesome>
			        		<Badge
							  value={this.state.notificationCount}
							  textStyle={styles.notifyCount}
							/>
						</TouchableOpacity>
						<Text style={styles.sat}> {this.state.earning}</Text>
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
			if(this.state.token != null || this.state.subscription_type == 0){
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
				        		<Badge
	  							  value={this.state.notificationCount}
								  textStyle={styles.notifyCount}
								/>
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
				        		<Badge
	  							  value={this.state.notificationCount + this.state.refCount}
								  textStyle={styles.notifyCount}
								/>
							</TouchableOpacity>
							<Text style={styles.sat}> {this.state.earning}</Text>
						</View>
						<View style={styles.container}>
					        <NotificationPopup ref={ref => this.popup = ref} style={styles.popup}/>
				        </View>
				        <View>
				        <Text style={styles.premium}> {this.state.subscription_type == 1 ? '* PREMIUM ACCOUNT *' : ''} </Text>
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
}

export {
	widthPercentageToDP,
	heightPercentageToDP
}

AppRegistry.registerComponent('DashboardScreen',()=>DashboardScreen)


const styles = MediaQueryStyleSheet.create({

	premium :{
		fontSize: 30,
		fontWeight: 'bold',
		color: 'green',
		textAlign: 'center',
		margin: 3
	},

	notPremium: {  

	},

	notifyCount: {
		// backgroundColor: 'red',
		color: 'red',
		// bottom: 18,
		// margin: -5,
		// bottom: 3,
		// marginTop: 17,
		// marginLeft: -2,
		fontSize: 20,
		fontWeight: 'bold',
		// width: 8,
		// height: 15,
		borderRadius: 10
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
		marginTop: 20,	
		fontSize: 20,
		left: 19
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
        marginTop: 30
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