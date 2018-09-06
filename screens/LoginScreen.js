import React, { Component } from 'react';
import Toast from 'react-native-simple-toast';
import DashboardScreen from './DashboardScreen';
import MainDashScreen from './MainDashScreen';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions, 
  PixelRatio,
  Alert,
  FlatList,
  AsyncStorage,
  RefreshControl
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';  

export default class LoginScreen extends Component{

  constructor(props){
    super(props)
      this.state = {
        email: '',
        password: '',
        res: [],
        user: '',
        isLoading: true,
        hasEmail: '',
        clickButton: false,
        refreshing: false 
      }
      this.fetchAsync()
  }

  fetchAsync = async() => {
    AsyncStorage.getItem("email").then((value) => {
        this.setState({
          hasEmail: value
        })
    }).done();
  }   

  _onRefresh = () => {
    this.setState({refreshing: true});
    // this.setState({refreshing: false});
    !this.isCancelled && this.setState({
      email: "",
      password: "",
      clickButton: false,
      refreshing: false
    }) 
  }

  goTo = () => {
    this.props.navigation.navigate('Dashboard');
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUnmount(){
    // this._isMounted = false;  
    this.isCancelled = true;
  }

  login = async() => {
    this.setState({ clickButton: true })

    const { email, password } = this.state;
    
    if(email != "" && password != ""){
      // fetch("http://192.168.254.116:8000/loginPiggy",{  
      fetch("http://192.168.83.2:8000/loginPiggy",{  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })  
      })
      .then((response) => response.json())
      .then((responseData) => {
        if(responseData == email){
          !this.isCancelled && this.setState({
            user: responseData,
          });
          // this.props.navigation.setParams({ email: responseData })
          AsyncStorage.setItem('email', responseData);
          // this.props.navigation.navigate('Dashboard');
          this.props.navigation.navigate('Dashboard', {email: responseData});  
          !this.isCancelled &&  this.setState({
              email: "",
              password: "",
              clickButton: false
            })  
        }else{
          Alert.alert(responseData);
          this.setState({
            password: "",
            clickButton: false
          })
        }
      }).catch(function(error) {
        Alert.alert('Something is wrong with the server!Please try again...');
        this.setState({ clickButton: false })
      }); 
    }else{
        Alert.alert('Please fill in input fields!');
        this.setState({ clickButton: false })
    }
  }

	render(){
    		return (
    			<ScrollView style={{ backgroundColor: '#020c11'}}
            refreshControl={
                  <RefreshControl
                      onRefresh={() => this._onRefresh()}
                      refreshing={this.state.refreshing}
                  />
              }
          >
            <TextInput mail={this.state.user} />
            <Text style={styles.login}> Login </Text>
            <View style={styles.container}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                address={this.state.user}
                placeholder="Email..."
                placeholderTextColor = "#a0b5d3"
                onChangeText={email => this.setState({email})}
                value={this.state.email}
                style = {styles.textinput}
                underlineColorAndroid='transparent'
                autoCapitalize = "none"
                autoCorrect = {false}
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Password..."
                placeholderTextColor = "#a0b5d3"
                onChangeText={password => this.setState({password})}
                value={this.state.password}
                style = {styles.textinput}
                underlineColorAndroid='transparent'
                autoCapitalize = "none"
                autoCorrect = {false}
                secureTextEntry
              />
              <TouchableOpacity onPress={this.login }>
                <FontAwesome style={styles.loginText}> 
                    { this.state.clickButton == false ?  Icons.signIn :  Icons.spinner }   
                    { this.state.clickButton == false ?  " LOGIN" :  " LOADING..." }
                </FontAwesome>   
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                <FontAwesome style={styles.registerText}>SIGN UP</FontAwesome>
              </TouchableOpacity>  
            </View>
          </ScrollView>
  		);
  }
}

AppRegistry.registerComponent('LoginScreen', ()=>LoginScreen)

const styles = StyleSheet.create({
  container: {
    width: "80%",
    margin: "10%",
  },

  login: {
    fontSize: 30,
    textAlign: "center",
    marginTop: '40%',
    color: "white"
  },

  label: {
    color: "white",
    padding: 0,
    margin: 0,
    fontSize: 22,
    marginBottom: 4
  },

  textinput: {
    color: 'white',
    // color: '#454f5e',
    height: 45,
    fontSize: 20,
    marginBottom: 20,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#3a4556',
    // backgroundColor: '#81a1d1',
    borderWidth: 1,
    borderColor: "#81a6db",
      
  },

  registerText: {
    color: '#FFF',
    backgroundColor: 'green',
    marginTop: 5,
    textAlign: 'center',
    paddingVertical: 13,
    borderRadius: 1
  },

  loginText: {
    color: '#FFF',
    marginTop: 5,
    textAlign: 'center',
    paddingVertical: 13,
    backgroundColor: 'blue',
    borderRadius: 1
  }
});