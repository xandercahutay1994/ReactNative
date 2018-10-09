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
	Clipboard 
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

export default class SettingScreen extends Component {

	static navigationOptions = {
		tabBarIcon: ({ tintColor }) => {Icons.send}
	   // tabBarIcon: () => (
	   //    <Image
	   //      source={require('@assets/icons/home.png')}
	   //    />
	   //  )
	 }

	constructor(props){
		super(props)
		 this.state = {
	       initial: 'state',
	       email: '',
	       token: '',
	       firstname: '',
	       lastname: '',
	       earning: '',
	       subscription_type: '',
	       referCode: '',
	       walletAddress: '',
	       visibleModal: null,
	       wAddress: '',
	       clickBtn: false,
	       env: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	       // env: 'here',
           ipAddress: '',
	    }
		this.fetchAsync()
	}

	fetchAsync = async() => {
		AsyncStorage.getItem("email").then((value) => {
	      !this.isCancelled && this.setState({
	        email: value
	      });
	    }).done();		
    	AsyncStorage.getItem("ipAddressWithNoPort").then((value) => {
	        !this.isCancelled && this.setState({
	          ipAddress: value
	        })
			this.fetchData();
	    }).done();
    	AsyncStorage.getItem("subscription_type").then((value) => {
	        this.setState({
	          subscription_type: value
	        })
			this.fetchData();
	    }).done();
	}

	componentDidUpdate(){
		// this.fetchAsync();
	}

	componentWillUnmount(){
		this.isCancelled = true;
	}

	// https://coins.ph/m/join/pwzluz

	fetchData = async() => {
		email = this.state.email;
		const {ipAddress} = this.state;

        fetch("http://" + ipAddress + ":8000/penDetail",{  	
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
					earning: responseData.detail[0].totalEarned.toFixed(8),
					firstname: responseData.detail[0].firstname,
					lastname: responseData.detail[0].lastname,
					token: responseData.detail[0].token,
					subscription_type: responseData.detail[0].subscription_type,
					referCode: responseData.detail[0].referCode,
					walletAddress: responseData.detail[0].walletAddress
				});
			this.fetchAsync();
		}).catch(function(error) {
			Alert.alert('Something is wrong with the(pennyer) server!');
		});
	}

	_renderButton = (text, onPress) => (
	    <TouchableOpacity onPress={onPress}>
	        <Text style={styles.walletAPI}>{text}</Text>
	    </TouchableOpacity>
	);

	 _renderModalContent = () => (
	    <View style={styles.modalContent}>
	        <Text style={styles.addressContent}>Please enter your bitcoin address</Text>
	        <TextInput
	            placeholder="Wallet Address..."
	            placeholderTextColor = "#a0b5d3"
	            onChangeText={wAddress => this.setState({wAddress})}
        		value={this.state.wAddress}
	            style = {styles.textinput}
	            underlineColorAndroid='transparent'
	            autoCapitalize = "none"
	            autoCorrect = {false}
	        />
	        <View style={styles.wrap}>
			    <TouchableOpacity onPress={() => this.setState({ visibleModal: null,wAddress: '' }) } >
					<FontAwesome style={styles.close}> {Icons.close} CLOSE </FontAwesome>
			    </TouchableOpacity>
		        <TouchableOpacity onPress={()=> this.update(this.state.wAddress) } >
					<FontAwesome style={styles.update}> 
						{this.state.clickBtn == false ? Icons.edit : Icons.spinner }	
						{this.state.clickBtn == false ? ' UPDATE' : ' UPDATING...' }  
				    </FontAwesome>
			    </TouchableOpacity>
			</View>
	    </View>
	);

	update = (walletAddress) => {
		const {email,ipAddress} = this.state;

		if(walletAddress != ""){

			this.setState({ clickBtn: true })

			fetch("http://" + ipAddress + ":8000/updateWalletAdd/", {  
		          method: 'POST',
		          headers: {
		            'Content-Type': 'application/json',
		            'Accept': 'application/json',
		            'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
		          },
		           body: JSON.stringify({
		           	email,
		            walletAddress
		           })
		        })
				.then((response) => response.json())
				.then((responseData) => {
					Alert.alert(responseData);
					this.setState({
						visibleModal: null,
						wAddress: null,
						clickBtn: false
					})
		        }).catch(function(error) {
		        	this.setState({ clickBtn: false })
		            Alert.alert("Wallet Address section has error in the server!");
		        });

		}else{
			this.setState({ clickBtn: false })
			Alert.alert('Please fill in input fields!');
		}
	}

	writeToClipboard = async () => {
	  await Clipboard.setString(this.state.wAddress);
	  alert('Copied to Clipboard!');
	};

	readFromClipboard = async () => {   
	  const clipboardContent = await Clipboard.getString();   
	  this.setState({ wAddress }); 
	};
	render() {
		return (
			<ScrollView>
				<Container>
					<Content>
						<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
							<Icon name="menu" style={styles.drawer}/>
				        </TouchableOpacity>
						 <ImageBackground source={require('./img/profile.png')} style={{
				             height: 100,
				             width: 100,
				             alignSelf: "center",
				             justifyContent: "center",
				             alignItems: "center",
				             marginTop: 10
			             }}/>
			            <View style={styles.emailDetails}>
	 						<Text style={styles.email}> {this.state.email} </Text>
							{ this.state.token == null ?  <FontAwesome style={styles.statVer}> {Icons.check} verified </FontAwesome> : <FontAwesome style={styles.statNotVer}> {Icons.windowClose} Not yet verified </FontAwesome> }			             
						</View>	
			            <View style={styles.details}>
			            	<View style={styles.wrap}>
		             			<Text style={styles.earnings}> Total Earnings </Text>
		             			<Text style={styles.earningsAPI}> {this.state.earning} </Text>
			            	</View>
			             	<View style={styles.wrap}>
			             		<Text style={styles.accType}> Account Type </Text>
			             		{ this.state.subscription_type == '0' ?  <Text style={styles.basicAPI}> Basic </Text> : <Text style={styles.basicAPI}> Premium </Text> }
			             	</View>
			             	<View style={styles.wrap}>
			             		<Text style={styles.referCode}> Referral Code </Text>
		             			<Text style={styles.referAPI}> {this.state.referCode} </Text>
			             	</View>
			             	<View style={styles.wrap}>
			             		<Text style={styles.walletAdd}> Wallet Address </Text>
		             			{this._renderButton(this.state.walletAddress == "" ? this.state.env : this.state.walletAddress, () => this.setState({ visibleModal: 2 }))  } 
			             	</View>
			             	<Modal
					          isVisible={this.state.visibleModal === 2}
					          animationIn={'slideInLeft'}
					          animationOut={'slideOutRight'}
					        >
					          {this._renderModalContent()}
					        </Modal>
			             </View>
			             <View style={styles.cardNoData}>
							<Card title="Eyes Here">
								<Text style={styles.noDataInfo}>
									If you dont have a Coins.ph account yet. Just copy this url 
								</Text>
								<Text style={styles.link}>
									https://coins.ph/m/join/pwzluz
								</Text>
								<Text style={styles.noDataInfo}>
									Click your bitcoin address if you want to edit/update it. and register there easily.
								</Text>
							</Card>
						</View>
					</Content>
				</Container>
			</ScrollView>
		)		
	}
}

AppRegistry.registerComponent('SettingScreen',()=>SettingScreen);

const styles = StyleSheet.create({

	cardNoData: {
		padding: 0,
		width: widthPercentageToDP(80),
		alignSelf: 'center',
		marginTop: 15
	},

	link:{
		alignSelf: "center",
		fontSize: 15,
		color: "green",
		lineHeight: 25
	},

	noDataInfo:{
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 20,
		width: '80%',
		color: 'blue'
	},

	buttonRen: {
		alignSelf: 'flex-end',  
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
			// marginLeft: widthPercentageToDP(21),
		display: 'flex',
		marginLeft: 'auto'
	},

	walletAPI: {
		fontSize: 18,
		right: 0,
		marginLeft: widthPercentageToDP(12),
		// justifyContent: 'flex-end',
		// textAlign: 'right',
		// paddingVertical: 2,
		color: '#0ace55',
		marginBottom: '-2%'
		// alignSelf: 'flex-end',
		// display: 'flex',
		// alignItems: 'flex-end'
	},

	update: {
		color: '#FFF',
	    textAlign: 'center',
	    paddingVertical: 13,
	    backgroundColor: 'blue',
	    borderRadius: 3,
	    padding: 10
	},

	close: {
		color: '#FFF',
	    textAlign: 'center',
	    paddingVertical: 13,
	    backgroundColor: 'red',
	    borderRadius: 3,
	    padding: 10,
	    marginLeft: 10
	},

	textinput: {
	    color: '#454f5e',
	    height: 50,
	    fontSize: 20,
	    marginBottom: 32,
	    paddingHorizontal: 10,
	    borderRadius: 10,
	    backgroundColor: '#f4f6f9',
	    borderWidth: 1,
	    borderColor: "#81a6db",
	    marginTop: 20,
	    width: widthPercentageToDP(80)
	},

	addressContent: {
		fontSize: 22
	},

	container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	},
	
	button: {
	    justifyContent: 'flex-end',
	    alignItems: 'flex-end',
	},

	modalContent: {
	    backgroundColor: 'white',
	    padding: 22,
	    justifyContent: 'center',
	    alignItems: 'center',
	    borderRadius: 4,
	    borderColor: 'rgba(0, 0, 0, 0.1)',
	},

	bottomModal: {
	    justifyContent: 'flex-end',
	    margin: 0,
	},

	drawer: {
		padding: '3%'
	},
	
	wrap: {
		flexDirection:'row', 
		flexWrap: 'wrap'
	},

	earnings: {
		fontSize: 18,
		marginBottom: '3%',
		marginTop: '5%',
		color: '#0a88d1'
	},

	earningsAPI: {
		fontSize: 18,
		marginTop: '5%',
		textAlign: 'right',
		position: 'absolute',
		right: 0,
		paddingVertical: 3
	},

	basicAPI: {
		fontSize: 18,
		textAlign: 'right',
		position: 'absolute',
		right: 0,
		paddingVertical: 3
	},


	accType: {
		fontSize: 18,
		marginBottom: '3%',
		color: '#0a88d1'
	},

	walletAdd: {
		fontSize: 18,
		color: '#0a88d1',
		marginBottom: '3%'
	},

	referCode: {
		fontSize: 18,
		color: '#0a88d1',
		marginBottom: '3%'
	},

	referAPI: {
		fontSize: 15,
		textAlign: 'right',
		position: 'absolute',
		right: 0,
		paddingVertical: 5	
	},

	details:{
		marginTop: '8%',
		borderTopColor: 'black',
	    borderTopWidth: 1,
	    margin: '3%'
	},

	emailDetails: {
		marginTop: '2%'
	},

	email: {
		// color: '#0d1016',
		textAlign: 'center',
		fontSize: 20,
	},

	statVer: {
		color: 'green',
		textAlign: 'center',
		fontSize: 15,
		marginTop: '2%'	
	},

	statNotVer: {
		color: 'red',
		textAlign: 'center',
		fontSize: 15,
		marginTop: '2%'	
	},
})



		                	// <TouchableOpacity onPress={()=> this.press(rowData.btask_id,rowData.pennyer_id) }>
		                 //    	 <FontAwesome style={styles.like}> {Icons.thumbsOUp} Like </FontAwesome>
		                 //    </TouchableOpacity>

// <Text> {this.state.id} </Text>
// 				<Text style={styles.header}> Click LIKE button to earn satoshi </Text>
// 				<View style={styles.box}>
// 					<FlatList
// 						numColumns={15}
// 				        showsHorizontalScrollIndicator={false}
// 						style={styles.imageList}
//                         data={ this.state.image }
//                         ItemSeparatorComponent = {this.FlatListItemSeparator}
//                         keyExtractor={(item, index) => item.toString() }
//                         renderItem = {({ item }) =>
//                    		 <View>
// 	                         <Image source={[{ uri: this.state.url + item.taskMedia }]} style={styles.photoDis}/>
// 		                     <TouchableOpacity onPress={()=> this.press(item.btask_id) }>
// 		                        <Text style={styles.like}> Like </Text>
// 		                     </TouchableOpacity>
// 		                  </View>
// 		                }
// 		            />
// 				</View>
// <Card
			 //        title={null}
			 //        image={{ uri: "http://192.168.83.2/piggypenny/public/storage/pictures/7-2-5.jpg" }}
			 //        containerStyle={{ padding: 0, width: 160 }}
			 //      >																			
			 //        <Text style={{ marginBottom: 10 }}>
			 //          hello
			 //        </Text>
			 //      </Card>