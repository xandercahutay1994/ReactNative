import React, {Component} from 'react';
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
	AsyncStorage
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';
import Toast from 'react-native-custom-toast';

export default class ReferScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			receiverEmail: '',
			senderEmail: '',
			referCode: '',
			clickBtn: false

		}
		this.fetchAsync()
	}

	fetchAsync = async() => {
		AsyncStorage.getItem("email").then((value) => {
	      this.setState({
	        senderEmail: value
	      });
	    }).done();

	    AsyncStorage.getItem("referCode").then((value) => {
	      this.setState({
	        referCode: value
	      });
	    }).done();		

	}

	componentWillUnmount(){
		this.isCancelled = true;
	}

	send = async(receiverEmail) => {
      	senderEmail = this.state.senderEmail;

      	if(receiverEmail != ""){
      	
      		this.setState({ clickBtn: true })
      		this.refs.defaultToast.showToast('Sending...');

		 	// fetch("http://192.168.254.116:8000/referFriend",{  	
	        fetch("http://192.168.83.2:8000/referFriend",{  	
		        method: 'POST',
		        headers: {
		          'Content-Type': 'application/json',
		          'Accept': 'application/json',
		          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
		        },
		        body: JSON.stringify({
		        	senderEmail,
		        	receiverEmail
		        })  
			})
			.then((response) => response.json())
			.then((responseData) => {
				alert(responseData)
				!this.isCancelled && this.setState({
					receiverEmail: '',
					clickBtn: false
				});
			}).catch(function(error) {
				this.setState({clickBtn:false})
				Alert.alert('Something is wrong with the(refer) server!');
			});
		}else{
			this.setState({clickBtn:false})
      		this.refs.matchToast.showToast('Please fill in email!');
		}

	}
	
	render(){
		return(
			<ScrollView>
				<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
					<Icon name="menu" style={styles.drawer}/>
		        </TouchableOpacity>
				<View style={styles.wrapper}>
					<Text style={styles.referLabel}> Referral Code </Text>
					<Text style={styles.referCode}> {this.state.referCode} </Text>
				</View>
				<View style={styles.detail}>
					<Text style={styles.label}>Email</Text>
					<TextInput
			            placeholder="Email..."
			            placeholderTextColor = "#a0b5d3"
			            onChangeText={receiverEmail => this.setState({receiverEmail})}
                		value={this.state.receiverEmail}
                        style = {styles.textinput}
			            underlineColorAndroid='transparent'
			            autoCapitalize = "none"
			            autoCorrect = {false}
			        />
					<Toast ref = "matchToast" backgroundColor = "red" position="top"/>
					<Toast ref = "defaultToast" backgroundColor = "blue"/>
				</View>
				<View style={styles.btnWrapper}>
					<TouchableOpacity activeOpacity = { .5 } onPress={()=>this.send(this.state.receiverEmail)}>
						<FontAwesome style={styles.send}> 
							{ this.state.clickBtn == false ?  Icons.send :  Icons.spinner }   
							{ this.state.clickBtn == false ?  " SEND" :  " SENDING..." }                    
						</FontAwesome>
					</TouchableOpacity>
				</View>
				<View style={styles.card}>
					<Card title="Eyes Here">
						<Text style={styles.info}>
							If you want to refer someone like your close friends please fill in the email textbox with their email so that we can send them
							via gmail and they can use your referral code also for you to earn 5 satoshis if they register.  
						</Text>
					</Card>
				</View>
			</ScrollView>
		)
	}
}

AppRegistry.registerComponent('ReferScreen',()=>ReferScreen)

const styles = StyleSheet.create({

	drawer: {
		padding: '3%'
	},

	wrapper: {
		flexDirection: 'row',
		// flexWrap: 'wrap',
		alignSelf: 'center',
		marginTop: '20%',
		position: 'absolute'
	},

	referCode: {
		textAlign: 'center',
		color: 'white',
		backgroundColor: "#121917",
		fontSize: 20,
		opacity: 0.8,
		borderRadius: 4,
		padding: 6,
		display: 'flex',
		fontWeight: '100',
		height: 50
	},

	referLabel: {
		color: '#110200',
		textAlign: 'center',
		fontSize: 20,
		padding: 7,
		fontWeight: 'bold',
		fontFamily: 'serif'
	},

	info: {
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 20,
		width: '80%',
  	    
	},

	card: {
		padding: 0,
		width: 300,
		marginTop: '6%',
		alignSelf: 'center'
	},

	send: {
	    color: '#FFF',
	    backgroundColor: 'green',
	    textAlign: 'center',
	    fontSize: 20,
	    borderRadius: 8,
	    paddingVertical: 10,
	    padding: 10	
	},

	back: {
		color: '#FFF',
	    backgroundColor: '#2c44cc',
	    textAlign: 'center',
	    fontSize: 20,
	    borderRadius: 8,
	    paddingVertical: 10,
	    padding: 10,
		marginRight: 20,
		marginLeft: 25
	},


	btnWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignSelf: 'center',
		flex: 1
		// position: 'relative'
	},

	detail: {
	    alignSelf: 'center',
  	    width: '80%',
  	    marginTop: '27%',
	    // position: 'relative'
	},

	label: {
	    color: "black",
	    padding: 0,
	    margin: 0,
	    fontSize: 22,
	    marginBottom: 4
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
	    borderColor: "#81a6db"
	},
})