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
  Alert,
  RefreshControl
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';  

export default class RegisterScreen extends Component {
  constructor(props){
    super(props)
      this.state = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        walletAddress: "",
        refCodeOptional: "",
        clickButton: false,
        refreshing: false 
      }

  }

  static navigationOptions = {
    header: null
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    // this.setState({refreshing: false});
    this.setState({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      walletAddress: "",
      refCodeOptional: "",
      clickButton: false,
      refreshing: false
    }) 
  }

  // Register Function
  registerPress = async() => {

    this.setState({ clickButton: true })

    var check = false;
    const {firstname,lastname,email,password,walletAddress,refCodeOptional} = this.state;
      if(firstname != "" && lastname != "" && email != "" && password != ""){

        fetch("http://192.168.83.2:8000/registerPiggy",{  
        // fetch("http://192.168.83.2:8000/registerPiggy",{  
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
            refCodeOptional
           })
        })
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData.message != 500){
            // this.setState({
            //   firstname: firstname,
            //   lastname: lastname,
            //   email: email,
            //   password: password,
            //   walletAddress: walletAddress,
            //   refCodeOptional: refCodeOptional
            // });
            check = true;
            this.setState({
              firstname: "",
              lastname: "",
              email: "",
              password: "",
              walletAddress: "",
              refCodeOptional: "",
              clickButton: false,
              refreshing: false
            });
            Alert.alert('Successfully registered!We sent you an email for verification of your account!');
          }else{
            this.setState({ clickButton: false,refreshing: false });
            Alert.alert("Referral Code is invalid!");            
          }
        }).catch(function(error) {
          this.setState({ clickButton: false, refreshing:false });
          Alert.alert("Error in the server!");
        });  
    }else{
      this.setState({ clickButton: false, refreshing: false });
      Alert.alert('Please fill all fields');
    }
  };

  // Render View
  render() {

    return (
      <ScrollView style={{ backgroundColor: '#020c11' }}
          refreshControl={
              <RefreshControl
                  onRefresh={() => this._onRefresh()}
                  refreshing={this.state.refreshing}
              />
          }
      >
        <Text style={styles.register}> Register </Text>
        <View style={styles.formcontainer}>
          <Text style={styles.label}>Firstname</Text>
          <TextInput
            placeholder="Firstname..."
            placeholderTextColor = "#a0b5d3"
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
            placeholderTextColor = "#a0b5d3"
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
            placeholderTextColor = "#a0b5d3"
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
            placeholderTextColor = "#a0b5d3"
            onChangeText={password => this.setState({password})}
            value={this.state.password}
            underlineColorAndroid='transparent'
            style = {styles.textinput}
            secureTextEntry
          />
          <Text style={styles.label}>BTC Address(Optional)</Text>
          <TextInput
            placeholder="Wallet..."
            placeholderTextColor = "#a0b5d3"
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
            placeholderTextColor = "#a0b5d3"
            style = {styles.textinput}
            onChangeText={refCodeOptional => this.setState({refCodeOptional})}
            value={this.state.refCodeOptional}
            underlineColorAndroid='transparent'
            autoCapitalize = "none"
            autoCorrect = {false}
          />
          <TouchableOpacity onPress={ this.registerPress }>
              <FontAwesome style={styles.registerText}> 
                { this.state.clickButton == false ?  Icons.save :  Icons.spinner }   
                { this.state.clickButton == false ?  " SIGN UP" :  " REGISTERING..." }
              </FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => this.props.navigation.navigate('Login') }>
            <FontAwesome style={styles.loginText}> {Icons.signIn} LOGIN </FontAwesome>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}


                  // <Image  style={styles.mediaImg} source={require('./img/m15.png')} />

AppRegistry.registerComponent('RegisterScreen', ()=> RegisterScreen)

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  formcontainer: {
    flex: 1,
    width: "80%",
    marginTop: 50,  
    margin: "10%",   
  },

  register: {
    fontSize: 30,
    textAlign: "center",
    marginTop: "10%",
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
    height: 45,
    fontSize: 20,
    marginBottom: 20,
    paddingHorizontal: 14,
    borderRadius: 3,
    backgroundColor: '#3a4556',
    borderWidth: 1,
    borderColor: "#81a6db"
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

