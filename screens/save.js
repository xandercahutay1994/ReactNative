	import React, { Component } from 'react';
	import Toast from 'react-native-simple-toast';
	import {createDrawerNavigator, DrawerView} from 'react-navigation';
	import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid } from 'native-base';
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
		FlatList
	} from 'react-native';
	// import Icon from 'react-native-vector-icons/FontAwesome';
	import FontAwesome from 'react-native-vector-icons/FontAwesome';
	import SettingScreen from './SettingScreen';
	import DrawerScreen from './DrawerScreen';
	import { YellowBox } from 'react-native';
	import { DrawerActions } from 'react-navigation';
	YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

	export default class DashboardScreen extends Component {


		// static navigationOptions = ({ navigation }) => {
		// 	// title: "xandercahutay1994@gmail.com",

		//     return {
	 //   	       title: navigation.state.params.mail,
	 //    		// headerTitleStyle: {
		// 	    //   color: 'white'
		// 	    // },
		//     }
		//   };

		constructor(props){
			super(props);
			this.state = {
				data: [],
				// mail: this.props.navigation.state.params.mail,
				mail: 'xandercahutay1994@gmail.com',
				earning: '',
				referCode: '',
				pennyer_id: '',
				isLoading: false
			}
		}

		componentDidMount() {
			// const email = this.props.navigation.state.params.mail;
			// this.setState({
			// 	// email: this.props.navigation.state.params.mail
			// });

	     	this._isMounted = true;
			this.fetchData();
	    }

	    componentWillUnmount(){
	    	this._isMounted = false;	
	    }

		fetchData = async() => {
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
					this.setState({
						earning: responseData.detail[0].totalEarned.toFixed(8),
						referCode: responseData.detail[0].referCode,
						pennyer_id: responseData.detail[0].pennyer_id
					});
			}).catch(function(error) {
					Alert.alert('Something is wrong with the server!');
			});
			this._isMounted = true;
	    }

		photoFunc = (id) => {
			this.props.navigation.navigate('Photo', {pennyer_id: id});
		}

		// this.props.navigation.state.params.mail
		videoFunc = () => {
			Alert.alert('video');	
		}

		surFunc = () => {
			this.props.navigate('DrawerOpen');
		}

		refFunc = () => {
			Alert.alert("Your referral code is " + this.state.referCode);
		}

		sideBar = () => {
			// this.props.navigation.openDrawer();
			// this.props.navigation.navigate("DrawerOpen", {mail: this.state.mail})
			// this.drawer.openDrawer();
			// this.props.navigation.navigate('DrawerClose');
			// this.props.navigation.navigate('DrawerOpen');
		}

		render() {
			return (
				<ScrollView>
					<View style={styles.header}>
						<TouchableOpacity onPress={ this.sideBar } >
							<Icon name="menu" style={styles.menu}/>
				        </TouchableOpacity>
				        <Text style={styles.dashboard}> Dashboard </Text>
						<Text style={styles.sat}> {this.state.earning} </Text>
					</View>
					<View style={styles.sideMenu}>

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
							<TouchableOpacity onPress={this.videoFunc} activeOpacity = { .5 }>
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
					<View style={styles.mediaContainer}>
						<View style={styles.media}>
							<Text style={styles.surveySat}> * 10 Satoshi </Text>
							<Text style={styles.referSat}> * 5 Satoshi </Text>
						</View>
						<View style={styles.mediaBody}>
							<TouchableOpacity onPress={this.surFunc} activeOpacity = { .5 }>
								<Image source={require('./img/survey2.png')} style={styles.mediaSurvey}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={this.refFunc} activeOpacity = { .5 }>
								<Image source={require('./img/refer.png')} style={styles.mediaRefer}/>
							</TouchableOpacity>
						</View>
						<View style={styles.mediaBody}>
							<Text style={styles.video}> Take Surveys </Text>
							<Text style={styles.photo}> Invite Friends </Text>
						</View>
					</View>
				</ScrollView>
			);
		}
	}

	AppRegistry.registerComponent('DashboardScreen',()=>DashboardScreen)


	const styles = StyleSheet.create({
		header: {
			flexDirection:'row', 
			flexWrap: 'wrap',
			backgroundColor: '#1e73fc',
			paddingVertical: 10
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
			top: 4,
			position: 'absolute'
		},

		lastPart: {
			flexDirection:'row', 
			flexWrap: 'wrap',
			paddingVertical: 8
		},

		mediaBody: {
			flexDirection:'row', 
			marginTop: 10
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
			position: 'absolute',
			// padding: 5,
			right: 50,
			top: 5
		},

		surveySat: {
			color: 'white',
			fontSize: 12,
			position: 'relative',
			// padding: 5,
			left: 35
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

		sat: {
			fontWeight: '100',
			color: 'white',
			position: 'absolute',
			right: 5,
			top: 5,
			backgroundColor: "#121917",
			padding: 3,
			fontSize: 19,
			opacity: 0.8,
			borderRadius: 4
		},

		mediaContainer: {
			marginTop: 15
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

		},

		mediaVid: {
			height: 90, 
			width: 90,
	        resizeMode : 'stretch',
	        // position: 'relative',
	        marginLeft: 35
		},

		mediaImg: {
			height: 70, 
			width: 90,
	        resizeMode : 'stretch',
	        marginTop: 15,
	        // position: 'absolute',
	        marginLeft: 105
		},

		app: {
			top: 10,
			textAlign: 'center'
		},

		video: {
			position: 'relative',
			left: 36
		},

		photo: {
			position: 'absolute',
			right: 36
		},

		mediaSurvey: {
			height: 90,
			width: 90,
			resizeMode: 'stretch',
			// position: 'relative',
	        marginLeft: 35
		},

		mediaRefer: {
			height: 90,
			width: 90,
			resizeMode: 'stretch',
			// position: 'absolute',
			marginLeft: 105,
			marginTop: 10
		}
	});