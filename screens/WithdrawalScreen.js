 import React, {Component} from 'react';
import Toast from 'react-native-custom-toast';
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
	AsyncStorage,
	PixelRatio,
	RefreshControl
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';
import Modal from 'react-native-modal'; // 2.4.0

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


export default class WithdrawalScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			earnings: '',
			pennyer_id: '',
			amount: '',
			email: '',
			walletAddress: '',
			clickBtn: '',
			refreshing: false,
			isRequest: false,
			ipAddress: ''
		}
		this.fetchAsync();
	}

	_onRefresh = () => {
	    this.setState({refreshing: true});
		this.setState({
			amount: '',
			clickBtn: false,
			walletAddress: '',
			refreshing: false,
			pennyer_id: '',
			isRequest: false,
			ipAddress: '',
			earnings: '',
		});
		this.fetchData();
		// this.componentDidUpdate();
	 }


	fetchAsync = async() => {
		AsyncStorage.getItem("email").then((value) => {
	      !this.isCancelled && this.setState({
	        email: value
	      });
	    }).done();	

		AsyncStorage.getItem("ipAddress").then((value) => {
	        !this.isCancelled && this.setState({
	          ipAddress: value
	        })
    		this.fetchData();
			this.checkIfRequested();
	    }).done();	
	}

	componentDidUpdate(){
	}

	componentWillUnmount(){
		this.isCancelled = true;
	}

	fetchData = async() => {
		email = this.state.email;
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
			!this.isCancelled && this.setState({
				pennyer_id: responseData.detail[0].id,
				earnings: responseData.detail[0].totalEarned.toFixed(8),
				walletAddress: responseData.detail[0].walletAddress
			});
			this.fetchAsync();
		}).catch(function(error) {
			alert('Withdrawal Screen has an error in the server')
		});

		// setTimeout(()=>{
		// 	this.fetchData();
		// },5000);
    }

    checkIfRequested = async() => {

    	pennyer_id = this.state.pennyer_id;
    	const{ipAddress} = this.state;

    	fetch("http://" + ipAddress + "/checkIfAlreadyRequest",{  	
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
			if(responseData.length > 0){
				!this.isCancelled && this.setState({
					isRequest: true
				})
			}else{
				!this.isCancelled && this.setState({
					isRequest: false
				})
			}
		}).catch(function(error) {
			alert("Can't check data because something is wrong with the server");
		});
    }

    sendRequest = async(amount) => {
      	email = this.state.email;
      	const{ipAddress} = this.state;
      	if(amount.length != ""){
      		let newAmount = "";

      		// if(amount >= 50 && amount < 100000){
      		if(amount >= 50 && amount < 100000){
      			newAmount = "0.000" + amount;
      		}else if(amount >= 100000 && amount <= 150000){
      			newAmount = "0.00" + amount; 
      		}

  			try{
	      		if(newAmount <= this.state.earnings && amount >= 50){
	      				this.setState({ clickBtn: true })
			      		this.refs.defaultToast.showToast('Sending Request...');

				        fetch("http://" + ipAddress + "/withdrawEarnings",{  	
					        method: 'POST',
					        headers: {
					          'Content-Type': 'application/json',
					          'Accept': 'application/json',
					          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
					        },
					        body: JSON.stringify({
					        	email,
					        	newAmount
					        })  
						})
						.then((response) => response.json())
						.then((responseData) => {
							Alert.alert(responseData);
							!this.isCancelled && this.setState({
								amount: '',
								clickBtn: false,
								refreshing: false	
							});
						}).catch(function(error) {
							this.setState({clickBtn:false,refreshing:false})
							Alert.alert('Something is wrong with the(withdrawal request screen) server!');
						});
				}else{
					alert("Amount to be requested must be greater than or equal to 50000 satoshi and not more than 150000" +
						"satoshi. Amount must be lesser than or equal to your total earnings also!");
				}	
	  		}catch(e){
				this.setState({clickBtn:false,refreshing:false});
      			Alert.alert(e)
      		}
	
		}else{
			this.setState({clickBtn:false,refreshing:false});
			Alert.alert('Please fill in desired amount!');
		}
	}

	onChange(text) {
	    let newText = '';
	    let numbers = '0123456789.';

	    for (var i = 0; i < text.length; i++) {
	        if ( numbers.indexOf(text[i]) > -1 ) {
	            newText = newText + text[i];
	        }
	    }   
	    this.setState({amount: newText})
	}

	render(){
		if(this.state.earnings < 0.00050000){
			return(
				<ScrollView
					refreshControl={
	                  <RefreshControl
	                      onRefresh={() => this._onRefresh()}
	                      refreshing={this.state.refreshing}
	                  />
		            }
				>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
					<Content>
						<Text style={styles.withdraw}> Withdrawal Earnings </Text>
						<View style={styles.container}>
							<View style={styles.screen}>
								<Text style={styles.textEarnings}> Total Earnings : </Text>
								<Text style={styles.earnings}> { this.state.earnings } </Text>
							</View>
							<View style={styles.cardInfo}>
								<Card title="Eyes Here">
									<Text style={styles.info}>
										Make sure your earnings reach up to 50000 satoshi for you to withdraw. You can avail our Premium Account if you want, just use your current earnings. Thank you!
									</Text>
								</Card>
							</View>
						</View>
					</Content>
			    </ScrollView>
			)
		}else{
			if(this.state.isRequest == false){
				return(
					<ScrollView
						refreshControl={
		                  <RefreshControl
		                      onRefresh={() => this._onRefresh()}
		                      refreshing={this.state.refreshing}
		                  />
			            }
					>
						<Toast ref = "defaultToast" backgroundColor = "#f40202"/>
						<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
							<Icon name="menu" style={styles.drawer}/>
				        </TouchableOpacity>
				        <Toast ref = "defaultToast" backgroundColor = "green" position="top"/>
						<Content>
							<Text style={styles.withdraw}> Withdrawal Earnings </Text>
							<View style={styles.container}>
								<View style={styles.screen}>
									<Text style={styles.textEarnings}> Total Earnings : </Text>
									<Text style={styles.earnings}> { this.state.earnings } </Text>
								</View>
								<View style={styles.screenAmount}>
									<Text style={styles.label}> Bitcoin Address </Text>
							        <Text style={styles.walletAddress}> { this.state.walletAddress } </Text>
									<View style={{flexDirection: 'row',display:'flex',alignSelf:'center',marginTop: 5}}>
										<Text style={styles.label3}> Amount</Text>
										<Text style={styles.label4}>(*exclude 0.00) </Text>
									</View>
									<TextInput
							            placeholder="Ex.(50000 or 150000)"
							            placeholderTextColor = "#a0b5d3"
							            onChangeText={text => this.onChange(text)}
							            value={this.state.amount}
							            keyboardType='numeric'
				                        style = {styles.textinput}
							            underlineColorAndroid='transparent'
							            autoCapitalize = "none"
							            autoCorrect = {false}
							        />
									<Toast ref = "defaultToast" backgroundColor = "green"/>
								</View>
								<View>
									<TouchableOpacity onPress={()=>this.sendRequest(this.state.amount)}>
										<FontAwesome style={ widthPercentageToDP(100) <= 550 ? styles.sendSmall : styles.send}> 
											{ this.state.clickBtn == false ?  Icons.send :  Icons.spinner }   
	                						{ this.state.clickBtn == false ?  " SEND REQUEST" :  " SENDING..." }
	                					</FontAwesome>
									</TouchableOpacity>
								</View>
								<View style={ widthPercentageToDP(100) <= 550 ? styles.withdrawInfoSmall : styles.withdrawInfo}>
									<Card title="Eyes Here"> 
										<Text style={ widthPercentageToDP(100) <= 550 ?  styles.wInfoSmall : styles.wInfo }>
											Hello! Please review your bitcoin address above if it is correct, if you want to edit your bitcoin address just go to 
											Account Details page.  Your bitcoin address above will be our reference in sending the amount you request to withdraw through Coins.ph.
											You can request a withdrawal one at a time only, you can request another if the previous request is already approved!
										</Text>
									</Card>
								</View>
							</View>
						</Content>
					</ScrollView>
				)	
			}else{
				return(
					<ScrollView
						refreshControl={
		                  <RefreshControl
		                      onRefresh={() => this._onRefresh()}
		                      refreshing={this.state.refreshing}
		                  />
			            }
					>
						<Toast ref = "defaultToast" backgroundColor = "#f40202"/>
						<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
							<Icon name="menu" style={styles.drawer}/>
				        </TouchableOpacity>
				        <Toast ref = "defaultToast" backgroundColor = "green" position="top"/>
						<Content>
							<Text style={styles.withdraw}> Withdrawal Earnings </Text>
							<View style={styles.container}>
								<View style={styles.screen}>
									<Text style={styles.textEarnings}> Total Earnings : </Text>
									<Text style={styles.earnings}> { this.state.earnings } </Text>
								</View>

								<View style={ widthPercentageToDP(100) <= 550 ? styles.withdrawInfoSmall : styles.withdrawInfo}>
									<Card title="Eyes Here"> 
										<Text style={ widthPercentageToDP(100) <= 550 ?  styles.wInfoSmall : styles.wInfo }>
											Hello! Your previous request is still on process. Please comeback when it is already approved thank you!
										</Text>
									</Card>
								</View>
							</View>
						</Content>
					</ScrollView>
				)				
			}
		}
	}

}

AppRegistry.registerComponent('WithdrawalScreen',()=>WithdrawalScreen)

const styles = StyleSheet.create({

	withdrawInfo: {
		padding: 0,
		marginTop: '6%',
		alignSelf: 'center',
		width: widthPercentageToDP(90),
		marginBottom: 20
	},

	withdrawInfoSmall: {
		padding: 0,
		marginTop: '6%',
		alignSelf: 'center',
		width: widthPercentageToDP(90),
		marginBottom: 20	
	},

	wInfoSmall: {
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 25,
		color: 'black',
		fontSize: 15
	},

	wInfo: {
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 25,
		color: 'black',
		fontSize: 15
	},

	label: {
	    color: "black",
	    padding: 0,
	    margin: 0,
	    fontSize: 22,
	    marginBottom: 4,
	},

	label4: {
		color: 'red',
		margin: 7,
		marginTop: 10
	},

	label3: {
		color: "black",
	    padding: 0,
	    margin: 0,
	    fontSize: 22,
	    marginBottom: 4,
		marginTop: 5
	},

	screenAmount: {
		marginTop: '9%'
	},

	sendSmall: {
	    color: '#FFF',
	    backgroundColor: 'blue',
	    marginTop: 15,
	    textAlign: 'center',
	    alignSelf: 'center',
	    paddingVertical: 11,
	    fontSize: 17,
	    borderRadius: 3,
	    width: widthPercentageToDP(45)		
	},

	send: {
	    color: '#FFF',
	    backgroundColor: 'blue',
	    marginTop: 15,
	    textAlign: 'center',
	    alignSelf: 'center',
	    paddingVertical: 13,
	    fontSize: 17,
	    borderRadius: 3,
	    width: widthPercentageToDP(30)
  	},

	textinput: {
	    color: '#454f5e',
	    height: 45,
	    fontSize: 20,
	    marginTop: 10,
	    marginBottom: 20,
	    paddingHorizontal: 14,
	    borderRadius: 10,
	    backgroundColor: '#f4f6f9',
	    borderWidth: 1,
	    borderColor: "#81a6db",
	    width: widthPercentageToDP(40),
	    alignSelf: 'center',
	    display: 'flex'
	},

	cardInfo: {
		padding: 0,
		marginTop: '6%',
		alignSelf: 'center',
		width: '90%'
	},

	info: {
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 25,
		width: '80%',
		color: 'red',
		fontSize: 15
	},

	walletAddress: {
		// textAlign: 'center',
		fontSize: 20,
		backgroundColor: '#ceb25f',
		padding: 7,
		opacity: 0.8,
		color: 'black',
		fontWeight: '100',
		borderRadius: 3,
		display: 'flex',
		marginBottom: 15,
		marginTop: 10,
		width: widthPercentageToDP(70)
	},

	earnings: {
		textAlign: 'center',
		fontSize: 20,
		backgroundColor: 'black',
		padding: 7,
		opacity: 0.8,
		color: 'white',
		fontWeight: '100',
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
		marginTop: '8%',
		display: 'flex',
	    alignSelf: 'center',
  	    width: '70%',
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

	withdraw : {
		fontSize: 40,
		textAlign: 'center',
		color: '#110200',
		fontWeight: 'bold',
		marginTop: '12%',
		fontFamily: 'Helvetica'
	}
})