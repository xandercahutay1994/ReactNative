import React, {Component} from 'react';
import TabNavigator from 'react-navigation';
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
	ImageBackground
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { YellowBox } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';
import Toast from 'react-native-custom-toast';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class Password extends Component {

	constructor(props){
		super(props)
		this.state = {
			currPass: '',
			newPass: '',
			rePass: '',
			isRight: false,
			email: '',
	        clickButton: false,
	        clickPass: false,
            ipAddress: "",
		}
		this.fetchIpAdd();
	}

	fetchIpAdd = async() =>{
		AsyncStorage.getItem("ipAddressWithNoPort").then((value) => {
	        this.setState({
	        	ipAddress: value
	        })
	    }).done();
	}	

	componentDidMount(){
     	this._isMounted = true;
 		AsyncStorage.getItem("email").then((value) => {
 			this.setState({email: value})
	    }).done();
	}

	componentWillUnmount(){
		this._isMounted = false;	
	}

	checkPassword = async(password) => {

		if(password != ""){
			this.setState({ clickButton: true });

			const {email,ipAddress} = this.state;

			// fetch("http://192.168.254.116:8000/checkPassword/", {  
			fetch("http://" + ipAddress + ":8000/checkPassword/", {  
	          method: 'POST',
	          headers: {
	            'Content-Type': 'application/json',
	            'Accept': 'application/json',
	            'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
	          },
	           body: JSON.stringify({
	            email,
	            password
	           })
	        })
			.then((response) => response.json())
			.then((responseData) => {
				if(responseData == password){
					this.setState({
						isRight: true,
						clickButton: false
					})				
				}else{
					// Alert.alert(responseData)
					this.refs.defaultToast.showToast(responseData);
					this.setState({
						currPass: "",
						clickButton: false
					})
				}
	        }).catch(function(error) {
	        	this.setState({ clickButton: false});
		        Alert.alert("Error");
	        });
	 	}else{
	 		this.setState({ clickButton: false});
	 		this.refs.matchToast.showToast("Please fill in input field!");
	 	}
	}

	changePassword = async(newPassword,rePassword) => {
		const {email,ipAddress} = this.state;

		if(newPassword != "" && rePassword != ""){

			if(newPassword == rePassword){
				this.setState({ clickPass: true });

				fetch("http://" + ipAddress + ":8000/changePassword/", {  
		          method: 'POST',
		          headers: {
		            'Content-Type': 'application/json',
		            'Accept': 'application/json',
		            'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
		          },
		           body: JSON.stringify({
		           	email,
		            newPassword
		           })
		        })
				.then((response) => response.json())
				.then((responseData) => {
					Alert.alert(responseData);
					this.setState({
						isRight: '',
						currPass: '',
						newPass: '',
						rePass: '',
						clickPass: false		
					})
		        }).catch(function(error) {
		        	this.setState({clickPass: false});
		            Alert.alert("Error in the server");
		        });
			}else{
				this.refs.matchToast.showToast("Two input fields must match!");
				this.setState({clickPass: false});
			}
		}else{
			this.refs.matchToast.showToast("All fields must be fill in!");
			this.setState({clickPass: false});
		}
	}

	render(){
		if(!this.state.isRight){
			return(
				<ScrollView>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
					<Text style={styles.changePassword}> Change Password </Text>
					<View style={styles.container}>
						<Text style={styles.label}>Current Password</Text>
						<Toast ref = "defaultToast" backgroundColor = "red" position="top"/>
						<Toast ref = "matchToast" backgroundColor = "red" position="top"/>
						<TextInput
				            placeholder="Current..."
				            onChangeText={currPass => this.setState({currPass})}
				            value={this.state.currPass}
	                        style = {styles.textinput}
				            underlineColorAndroid='transparent'
				            autoCapitalize = "none"
				            autoCorrect = {false}
				            secureTextEntry
				        />
	    				<TouchableOpacity onPress={()=>this.checkPassword(this.state.currPass)}>
							<FontAwesome style={styles.save}> 
								{ this.state.clickButton == false ?  Icons.send :  Icons.spinner }   
								{ this.state.clickButton == false ?  " SEND" :  " CHECKING..." }                    
							</FontAwesome>
						</TouchableOpacity>
					</View>
				</ScrollView>
			)
		}else{
			return (
				<ScrollView>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
					<Text style={styles.changePassword}> Change Password </Text>
					<View style={styles.container}>
				        <Text style={styles.label}>New Password</Text>
						<TextInput
				            placeholder="New..."
				            onChangeText={newPass => this.setState({newPass})}
				            value={this.state.newPass}
	                        style = {styles.textinput}
				            underlineColorAndroid='transparent'
				            autoCapitalize = "none"
				            autoCorrect = {false}
				            secureTextEntry
				        />
				        <Text style={styles.label}>Re-type Password</Text>
						<TextInput
				            placeholder="Re-type..."
				            onChangeText={rePass => this.setState({rePass})}
				            value={this.state.rePass}
	                        style = {styles.textinput}
				            underlineColorAndroid='transparent'
				            autoCapitalize = "none"
				            autoCorrect = {false}
				            secureTextEntry
				        />
						<Toast ref = "matchToast" backgroundColor = "red" position="top"/>
						<View>
							<TouchableOpacity onPress={()=>this.changePassword(this.state.newPass,this.state.rePass)}>
								<FontAwesome style={styles.save}> 
									{ this.state.clickPass == false ?  Icons.save :  Icons.spinner }   
									{ this.state.clickPass == false ?  " SAVE" :  " SAVING..." } 
								</FontAwesome>
							</TouchableOpacity>
						</View>
					</View>
			    </ScrollView>

			)
		}
	}
}

AppRegistry.registerComponent('Password',()=>Password);

const styles = StyleSheet.create({

	newPassword: {
		display: 'none'
	},

	drawer: {
		padding: '3%'
	},

	container: {
  	    alignSelf: 'center',
  	    width: '80%',
  	    marginTop: '15%'

	},

	changePassword: {
		fontSize: 40,
		color: '#110200',
		fontWeight: 'bold',
	    textAlign: "center",
	    marginTop: '3%',
	    fontFamily: 'Helvetica'
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
	    height: 45,
	    fontSize: 20,
	    marginBottom: 20,
	    paddingHorizontal: 14,
	    borderRadius: 10,
	    backgroundColor: '#f4f6f9',
	    borderWidth: 1,
	    borderColor: "#81a6db",
	},

  	save: {
	    color: '#FFF',
	    backgroundColor: 'green',
	    marginTop: 5,
	    textAlign: 'center',
	    paddingVertical: 13,
	    // fontWeight: '700',
	    fontSize: 17,
	    borderRadius: 1
	  },
})