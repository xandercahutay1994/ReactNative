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
  FlatList
} from 'react-native';


export default class Login extends Component {
  // constructor(){
  //   super()
  //   this.state = { 
  //     res: []
  //   }
  // }
  render(){
    return (
      <Text> Login </Text>
    );
  } 
}
AppRegistry.registerComponent('Login', ()=> Login)


      // //fetch("http://192.168.254.116:8000/registerPiggy",{
      //   method: 'POST', 
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //     'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
      //   },
      //    body: JSON.stringify({
      //     firstname,
      //     lastname,
      //     email,
      //     password,
      //     walletAddress,
      //     code
      //    })
      // })
      // .then(function(response) {
      //   Alert.alert("Successfully Registered");
      // }).catch(function(error) {
      //   Alert.alert("Error");
      // });  

  // componentDidMount() {
    // let response = fetch("http://localhost:8000/list");
    // let responseJson = response.json();
    // console.log(responseJson);
    // return responseJson;

    // fetch('http://192.168.0.182:8000/list')
    //    .then((response) => {
    //    response.json() })   
    //       .then( (json) => {
    //           this.setState({res: json});
    //       });
          // res: responseJson[] 
          // res:responseJson[0].id
      // .catch((error)=>{
      //   Alert.alert(error);
      // });
  // }

//   fetchListData = ({item}) => {
//     return(
//         <View>
//           <Text> Al </Text>
//           <Text> {item.id} {item.name}</Text>
//         </View>
//     )
//   }

//   render(){
//     return ( 
//       <React.Fragment>
//         <View>
//           <FlatList
//             data={ this.state.res }
//             renderItem = { this.fetchListData }
//             keyExtractor={(item, index) => item.toString()}
//           />
//         </View>
//       </React.Fragment>
//     );
//   }
// }

