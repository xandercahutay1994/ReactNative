import React, {Component} from 'react';
import {createBottomTabNavigator } from 'react-navigation';
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
	FlatList,
	Dimensions,
	PixelRatio
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { YellowBox } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';
import Table from 'react-native-simple-table';

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

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class WithdrawalHistoryScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			pennyer_id: '',
			withHistory: ''
		}	
		this.fetchAsync()
	}

	fetchAsync = async() => {
		AsyncStorage.getItem("pen_id").then((value) => {
	      this.setState({
	        pennyer_id: value
	      });
	    }).done();		
	}

	componentDidUpdate(){
		this.fetchData();
	}

	componentWillUnmount(){
		this.isCancelled = true;
	}

	fetchData = async() => {
		const {pennyer_id} = this.state;
		
		// let resolve = await fetch('http://192.168.254.116:8000/approvedWithdRequest/' + pennyer_id,{
		let resolve = await fetch('http://192.168.83.2:8000/approvedWithdRequest/' + pennyer_id,{
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseData) => {
			!this.isCancelled && this.setState({
				withHistory: responseData.withhistory
			});	
		}).catch(function(error) {
			Alert.alert('Something is wrong with the(history) server!');
		});
	}

	render() {	
		return (
			<ScrollView>
				<Container>
					<TouchableOpacity onPress={()=>this.props.navigation.openDrawer() } >
						<Icon name="menu" style={styles.drawer}/>
			        </TouchableOpacity>
			        <Content>
						<Text style={ widthPercentageToDP(100) <= 550 ? styles.history : styles.historyBig}> Withdrawal History </Text>
						<View style={styles.header}>	
								<Text style={ widthPercentageToDP(100) <= 550 ? styles.nameAmt : styles.nameAmtBig}> Amount (Satoshi)</Text>
								<Text style={ widthPercentageToDP(100) <= 550 ? styles.nameDate : styles.nameDateBig }> Date </Text>
						</View>
						<View style={styles.container}>

							<FlatList
					          data={this.state.withHistory}
					          style={styles.flatlist}
					          renderItem={({ item: rowData }) => {
				        		return (
			        				<Text style={styles.withdrawal_amt}>{rowData.withdrawal_amt}</Text>
		  		  	        	)		
					        }}
 				           keyExtractor={(item, index) => index.toString()}
							/>
							<FlatList
					          data={this.state.withHistory}
					          renderItem={({ item: rowData }) => {
				        		return (
			        				<Text style={styles.requested_at} >{rowData.req_at}</Text>
		  		  	        	)		
					        }}
 				           keyExtractor={(item, index) => index.toString()}
							/>
						</View>
						
					</Content>
				</Container>				
			</ScrollView>
		)
	}
}

AppRegistry.registerComponent('WithdrawalHistoryScreen',()=>WithdrawalHistoryScreen);

const styles = StyleSheet.create({

	container: { 
		flex: 1, 
		padding: 16, 
		backgroundColor: '#fff', 
		flexDirection: 'row',	
	},

	withdrawal_amt: {
		textAlign: 'center',
		fontSize: 20,
		lineHeight: 40,
		fontFamily: 'serif'
	},

	requested_at: {
		textAlign: 'center',
		fontSize: 20,
		lineHeight: 40,
		fontFamily: 'serif',
	},

	header:{
		flexDirection: 'row',
		backgroundColor: 'black',
		height: 40,
		padding: 5,
		flex: 1,
	},

	nameAmt: {
		color: 'white',
		fontSize: 22,
		// marginLeft: '18%',
		marginLeft: widthPercentageToDP(12)
	},

	nameAmtBig: {
		color: 'white',
		fontSize: 22,
		// marginLeft: '18%',
		marginLeft: widthPercentageToDP(11)
	},

	nameDate: {
		color: 'white',
		fontSize: 22,
		// marginLeft: '33%'
		marginLeft: widthPercentageToDP(25)
	},

	nameDateBig: {
		color: 'white',
		fontSize: 22,
		// marginLeft: '33%'
		marginLeft: widthPercentageToDP(24)
	},

	drawer: {
		padding: '3%'
	},

	history : {
		fontSize: 30,
		textAlign: 'center',
		marginBottom: '8%',
		color: '#110200',
		fontWeight: 'bold',
		marginTop: '2%',
		fontFamily: 'serif'
	},

	historyBig : {
		fontSize: 40,
		textAlign: 'center',
		marginBottom: '8%',
		color: '#110200',
		fontWeight: 'bold',
		marginTop: '2%',
		fontFamily: 'serif'
	}

})