import React, { Component } from 'react';

import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions, 
  PixelRatio,
  Alert
} from 'react-native';


export default class Register extends Component {
  constructor(props){
    super(props)
      this.state = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        walletAddress: "",
        code: ""
      }
  }

  // Register Function
  registerPress = async() => {
    const {firstname,lastname,email,password,walletAddress,code} = this.state;
      if(firstname != "" && lastname != "" && email != "" && password != ""){
        fetch("http://192.168.254.116:8000/registerPiggy",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
          },
           body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            walletAddress,
            code
           })
        })
        .then(function(response) {
          Alert.alert("Successfully Registered");
        }).catch(function(error) {
          Alert.alert("Error");
        });  

        this.setState({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          walletAddress: "",
          code: ""
        });
        // Alert.alert("Successfully Registered");
    }else{
      Alert.alert('Please fill all fields');
    }
  };



  // Render View
  render() {
    return (
      <React.Fragment>
        <Text style={styles.register}> Register </Text>
        <View style={styles.formcontainer}>
          <Text style={styles.label}>Firstname</Text>
          <TextInput
            placeholder="Firstname..."
            onChangeText={firstname => this.setState({firstname})}
            value={this.state.firstname}
            style = {styles.textinput}
            underlineColorAndroid='transparent'
            autoCapitalize = "none"
            autoCorrect = {false}
          />
          <Text style={styles.label}>Lastname</Text>
          <TextInput
            placeholder="Lastname..."
            onChangeText={lastname => this.setState({lastname})}
            value={this.state.lastname}
            style = {styles.textinput}
            underlineColorAndroid='transparent'
            autoCapitalize = "none"
            autoCorrect = {false}
          />
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            placeholder="Email Address..."
            onChangeText={email => this.setState({email})}
            value={this.state.email}
            style = {styles.textinput}
            underlineColorAndroid='transparent'
            keyboardType="email-address"
            autoCapitalize = "none"
            autoCorrect = {false}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password..."
            onChangeText={password => this.setState({password})}
            value={this.state.password}
            underlineColorAndroid='transparent'
            style = {styles.textinput}
            secureTextEntry
          />
          <Text style={styles.label}>Wallet Address</Text>
          <TextInput
            placeholder="Wallet..."
            style = {styles.textinput}
            onChangeText={walletAddress => this.setState({walletAddress})}
            value={this.state.walletAddress}
            underlineColorAndroid='transparent'
            autoCapitalize = "none"
            autoCorrect = {false}
          />
          <Text style={styles.label}>Referral Code(Optional)</Text>
          <TextInput
            placeholder="Referral Code..."
            style = {styles.textinput}
            onChangeText={code => this.setState({code})}
            value={this.state.code}
            underlineColorAndroid='transparent'
            autoCapitalize = "none"
            autoCorrect = {false}
          />
          <TouchableOpacity style={styles.buttonContainer}  onPress={this.registerPress}>
            <Text style={styles.registerText}>SIGN UP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.loginText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

AppRegistry.registerComponent('Register', ()=> Register)

const styles = StyleSheet.create({
  container:{
    justifyContent: "center",
    alignItems: "center"
  },

  formcontainer: {
    flex: 1,
    width: "80%",
    marginTop: 30,  
    margin: "10%",   
  },

  register: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 20,
    color: "black"
  },
 
  label: {
    color: "black",
    padding: 0,
    margin: 0,
    fontSize: 18
  },

  textinput: {
    color: 'white',
    height: 45,
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 14,
    borderRadius: 3,
    backgroundColor: '#3a4556'
  },

  registerText: {
    color: '#FFF',
    backgroundColor: 'green',
    marginTop: 5,
    textAlign: 'center',
    paddingVertical: 13,
    fontWeight: '700'
  },

  loginText: {
    color: '#FFF',
    marginTop: 5,
    textAlign: 'center',
    paddingVertical: 13,
    backgroundColor: 'blue',
    fontWeight: '900'
  },
});

