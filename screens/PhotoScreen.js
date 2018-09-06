import React, {Component} from 'react';
import Dashboard from './DashboardScreen.js';
import { Card } from 'react-native-elements';
import {
	PixelRatio,
	AppRegistry,
	Text,
	View,
	TextInput,
	ScrollView,
	Button,
	TouchableOpacity,
	StyleSheet,
	Image,
	TouchableHighlight,
	Alert,
	FlatList,
	Dimensions,
	AsyncStorage,
	RefreshControl
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Toast from 'react-native-custom-toast';
import {Video} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

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

export default class PhotoScreen extends Component {
	
	static navigationOptions = {
		header: null
	}

	constructor(props){
		super(props)
		this.state ={
			image: [],
			url: '',
			// pennyer_id: 4,
			amtEarned: '',
			taskName: '',
			btasks_id: '',
			pennyer_id: this.props.navigation.state.params.pennyer_id,
			// pennyer_id: 1,
			data: [],
			isCount: 5,
			checked: '',
			taskPrice: '',	
			earnings: '',
			hasData: '',
			clicked: false,
	        refreshing: false,
	        clickBtn: false
		}
	}

	_onRefresh = () => {
	    this.setState({refreshing: true});
	    this.setState({
	    	image: [],
			url: '',
			// pennyer_id: 4,
			amtEarned: '',
			taskName: '',
			btasks_id: '',
			pennyer_id: this.props.navigation.state.params.pennyer_id,
			// pennyer_id: 1,
			data: [],
			isCount: 5,
			checked: '',
			taskPrice: '',	
			earnings: '',
			hasData: '',
			clicked: false,
	        refreshing: false,
	        clickBtn: false
	    })
	    this.fetchData();
	}

	componentDidMount(){	
		this._isMounted = true;
		if(this._isMounted){
			this.fetchData();
		}

	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	fetchData = async() => {
		const {pennyer_id} = this.state;
		this.setState({
			checked: false
		})

		// const urlImage = "http://192.168.254.116/piggypenny/public/storage/pictures/";
		const urlImage = "http://192.168.83.2/piggypenny/public/storage/pictures/";


		// let resolve = await fetch('http://192.168.254.116:8000/postImage/' + pennyer_id,{
		let resolve = await fetch('http://192.168.83.2:8000/postImage/' + pennyer_id,{
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseData) => {
			if(responseData.length != 0){
				this.setState({
					image: responseData,
					amtEarned: 0.00000000.toFixed(8),
					url: urlImage,
					hasData: true,
					refreshing: false
				});	
			}else{
				this.setState({
					hasData: false,
					refreshing: false
				})
			}
			
		});

		// if(this.state.hasData){
		// 	setTimeout(()=>{
		// 		this.fetchData();
		// 	},4000)	
		// }
	}

	press = (pennyer_id,btasks_id,priceEarned) =>{

		var total = parseFloat(this.state.amtEarned) + parseFloat(priceEarned);

		this.setState({
			checked: true,
			amtEarned: total.toFixed(8),
			clicked: true,
			clickBtn: true
		})

		// fetch("http://192.168.254.116:8000/performImage/", {  
		fetch("http://192.168.83.2:8000/performImage/", {  
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': '2FlY6xB8pIYOJMXdliOL3w5qcLdSN3DVne1xb1sI'
          },
           body: JSON.stringify({
            pennyer_id,
            btasks_id,
            priceEarned
           })
        })
		.then((response) => response.json())
		.then((responseData) => {
			
        }).catch(function(error) {
          Alert.alert("Error");
        });  

		this.refs.defaultToast.showToast('You earned 20 Satoshi');

  		var count = 0;
  		var interval = setInterval(()=>{
  			this.setState({isCount: this.state.isCount - 1});
  			count++;
  			if(count == 5){
		  		clearInterval(interval);
		  		this.setState({
		  			checked: false,
		  			isCount: 5
		  		})
				this.fetchData();
				AsyncStorage.setItem('countImage', '1');
			}
  		},1000);
	}

	done = async() => {
		AsyncStorage.getItem("countImage").then((value) => {
    		if(value != null){
    			Alert.alert('Your earning(s) has been added to your account!')
    			this.props.navigation.navigate('Dashboard');
    			AsyncStorage.removeItem('countImage');
    		}else{
    			Alert.alert('Thank you for spending your time!')
    			this.props.navigation.navigate('Dashboard');
    		}
	    }).done();
	}

	render(){
		if(this.state.hasData){
			return (
				<ScrollView
		   	        refreshControl={
	                  <RefreshControl
	                      onRefresh={() => this._onRefresh()}
	                      refreshing={this.state.refreshing}
	                  />
		           	}
				>
					<View style={styles.cardInfo}>
						<Card title="Eyes Here">
							<Text style={styles.info}>
								Swipe left or right to watch photos and click LIKE to earn 20 Satoshi. 
								You can only earn 15 photos per day.
							</Text>
						</Card>
					</View>
					<View>
						<Toast ref = "defaultToast" backgroundColor = "#28a745"/>
						{ this.state.checked == true ? <Text style={styles.timer}> {this.state.isCount} </Text> : <Text style={styles.timer}>  </Text> }
					</View>
				    <FlatList
				    	horizontal
				    	showsHorizontalScrollIndicator={false}
			    	    data={this.state.image}
				        style={ widthPercentageToDP(100) <= 550 ? styles.imageList : styles.imageListBig}
				        renderItem={({ item: rowData }) => {
				        	if(widthPercentageToDP(100) <= 550){
				        		return (
						            <Card
						              title={rowData.taskName}
						              image={{ uri: this.state.url + rowData.taskMedia }}
						              imageStyle={ styles.card }
					              	>
									<TouchableOpacity onPress={()=> this.press(rowData.pennyer_id,rowData.id,rowData.task_price) }>
			                     		 <FontAwesome style={styles.likeSmall}> {Icons.thumbsOUp} Like </FontAwesome>
			                    	</TouchableOpacity> 	
						            </Card>
		  		  	        	);		
		  		  	        }else{
		  		  	        	return (
						            <Card
						              title={rowData.taskName}
						              image={{ uri: this.state.url + rowData.taskMedia }}
						              imageStyle={ styles.cardBig }
					              	>
									<TouchableOpacity onPress={()=> this.press(rowData.pennyer_id,rowData.id,rowData.task_price) }>
			                     		 <FontAwesome style={styles.like}> {Icons.thumbsOUp} Like
			                     		 </FontAwesome>
			                    	</TouchableOpacity> 	
						            </Card>
		  		  	        	);
		  		  	        }
				        }}
				        keyExtractor={(item, index) => index.toString()}
				    />
				    <TouchableOpacity onPress={ this.done }>
					    <FontAwesome style={styles.done}> {Icons.check} DONE </FontAwesome>
			        </TouchableOpacity>
				</ScrollView>
			)
		}else{
			return (
				<ScrollView
					refreshControl={
	                  <RefreshControl
	                      onRefresh={() => this._onRefresh()}
	                      refreshing={this.state.refreshing}
	                  />
		           	}
				>
					<View style={styles.cardNoData}>
						<Card title="Eyes Here">
							<Text style={styles.noDataInfo}>
								No tasks for today!Come back tomorrow...
							</Text>
						</Card>
					</View>
					<TouchableOpacity onPress={ this.done }>
						<FontAwesome style={styles.back}> {Icons.backward} GO BACK </FontAwesome>
					</TouchableOpacity>
				</ScrollView>
			)
		}
		
	}
}

AppRegistry.registerComponent('PhotoScreen',()=>PhotoScreen)


const styles = StyleSheet.create({

	cardInfo: {
		padding: 0,
		width: 300,
		marginTop: '6%',
		alignSelf: 'center',
	},

	cardNoData: {
		padding: 0,
		width: 300,
		marginTop: '50%',
		alignSelf: 'center',
	},

	info: {
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 20,
		width: '80%',

	},

	noDataInfo:{
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 20,
		width: '80%',
		color: 'red'
	},

	timer: {
		fontSize: 50,
		color: 'red',
		marginTop: '5%',
		textAlign: 'center',
	},

	done: {
	    color: '#FFF',
	    textAlign: 'center',
	    paddingVertical: 13,
	    backgroundColor: 'blue',
	    borderRadius: 3,
	    width: "30%",
	    alignSelf: 'center',
	    marginTop: 45,
	    bottom: 20
	},

	back: {
		color: '#FFF',
	    textAlign: 'center',
	    paddingVertical: 13,
	    backgroundColor: 'blue',
	    borderRadius: 3,
	    width: "30%",
	    marginTop: "30%",
	    alignSelf: 'center'
	},

	header: {
		marginTop: '20%',
		textAlign: 'center',
		bottom: 20
	},

	taskName: {
		marginBottom: 10,
		textAlign: 'center'
	},

	card: {
		padding: 0,
		width: responsiveWidth(95),
		height: responsiveHeight(60),
	},

	cardBig: {
		padding: 0,
		width: responsiveWidth(95),
		height: heightPercentageToDP(60),
		// marginLeft: widthPercentageToDP(5)
	},

	image: {
		width: null,
	    height: null,
	    resizeMode: 'contain'
	},

	like: {
		backgroundColor: 'blue',
		backgroundColor:'transparent',
		textAlign: 'center',
		fontSize: 25,
		marginTop: 10,
		color: 'blue',
		alignSelf: 'center',
	},

	likeSmall: {
		backgroundColor: 'blue',
		backgroundColor:'transparent',
		textAlign: 'center',
		fontSize: 25,
		marginTop: 7,
		color: 'blue',
		alignSelf: 'center',
	},

	imageList: {
		flexDirection: 'row',
		// flex: 1,
		// height: responsiveHeight(100),
	},

	imageListBig: {
		flexDirection: 'row',
		flex: 1,
		// height: responsiveHeight(0),
	}
});

