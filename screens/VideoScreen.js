import React, {Component} from 'react';
import Dashboard from './DashboardScreen.js';
import { Card } from 'react-native-elements';
import {
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
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';


export default class VideoScreen extends Component {
	
	static navigationOptions = {
		header: null
	}

	constructor(props){
		super(props)

		this.state = {
			image: [],
			url: '',
			amtEarned: '',
			taskName: '',
			btasks_id: '',
			pennyer_id: this.props.navigation.state.params.pennyer_id,
			data: [],
			isCount: 5,
			checked: '',
			taskPrice: '',
			pennyer_btc: '',
			earnings: '',
			hasData: '',
			play: false,
	        refreshing: false,
	        token: '',
            ipAddress: '',
	        subscription_type: this.props.navigation.state.params.subscription_type	
		}
		this.fetchIpAdd();
	}

	_onRefresh = () => {
	    this.setState({refreshing: true});
		this.state = {
			image: [],
			url: '',
			amtEarned: '',
			taskName: '',
			btasks_id: '',
			pennyer_id: this.props.navigation.state.params.pennyer_id,
			data: [],
			isCount: 5,
			checked: '',
			taskPrice: '',
			pennyer_btc: '',
			earnings: '',
			hasData: '',
			play: false,
	        refreshing: false,
	        token: '',
            ipAddress: '',
	        subscription_type: this.props.navigation.state.params.subscription_type
		} 
		this.fetchIpAdd();
	}

	fetchIpAdd = async() =>{
		AsyncStorage.getItem("ipAddressWithNoPort").then((value) => {
	        this.setState({
	          ipAddress: value
	        })
			this.fetchData();
			// AsyncStorage.getItem("token").then((value) => {
	 	// 		this.setState({token: value})
		 //    }).done();
	    }).done();
	}

	componentDidMount(){	
		this._isMounted = true;

		if(this._isMounted){
			// this.fetchData();
			AsyncStorage.getItem("token").then((value) => {
	 			this.setState({token: value})
		    }).done();
		}
	}


	fetchData = async() => {
		const {pennyer_id,ipAddress} = this.state;
		this.setState({
			checked: false
		})

		const urlVideo = "http://" + ipAddress + "/piggypenny/public/storage/videos/";

		this.setState({
				url: urlVideo,
			});	

		let resolve = await fetch("http:" + ipAddress + ":8000/postVideo/" + pennyer_id,{
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseData) => {
			if(responseData.length != 0){
				this.setState({
					image: responseData,
					amtEarned: 0.00000000.toFixed(8),
					url: urlVideo,
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
	}

	videoEnd = (pennyer_id,btasks_id,priceEarned) => {	
		var total = parseFloat(this.state.amtEarned) + parseFloat(priceEarned);
		const {ipAddress} = this.state;
		this.setState({
			checked: true,
			amtEarned: total.toFixed(8)
		})

		fetch("http://" + ipAddress + ":8000/performVideo/", {  
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
          Alert.alert("Error in earning/performing video");
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
				AsyncStorage.setItem('videoCount', '1');
			}
  		},1000);
	}

	done = async() => {
		AsyncStorage.getItem("videoCount").then((value) => {

    		if(value != null){
    			Alert.alert('Your earning(s) has been added to your account!')
    			this.props.navigation.navigate('Dashboard');
    			AsyncStorage.removeItem('videoCount');
    		}else{
    			Alert.alert('Thank you for spending your time!')
    			this.props.navigation.navigate('Dashboard');
    		}

	    }).done();
	}

	emptyToken(){
		const{subscription_type} = this.state;
		if(subscription_type == 1){
			return <Text style={styles.infoUnli}> Enjoy your unlimited watching of videos 😀.</Text>
		}else{
			return <Text style={styles.info}> Swipe left or right to watch videos and finish watching the whole video to earn 20 Satoshi. You can only view 15 photos per day.</Text>
		}
	}

	videoName(){
		return
			<FlatList
	          data={this.state.videoList}
	          style={styles.flatlist}
	          renderItem={({ item: rowData }) => {
				<Text>{rowData.taskName}</Text>
	        }}
	           keyExtractor={(item, index) => index.toString()}
			/>
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
								{this.emptyToken()}
							</Text>
						</Card>
					</View>
					<View>
						<Toast ref = "defaultToast" backgroundColor = "#28a745"/>
						{ this.state.checked == true ? <Text style={styles.timer}> {this.state.isCount} </Text> : <Text style={styles.timer}>  </Text> }
					</View>
					<View>
						<FlatList
					    	horizontal
					    	showsHorizontalScrollIndicator={false}
					        data={this.state.image}
					        style={styles.videoList}
					        renderItem={({ item: rowData }) => {
			        			this.videoName();
				        		return (
				        			<VideoPlayer
									    source={{ 
											uri: this.state.url + rowData.taskMedia,
		       								type: 'mp4'
									    }}
								        disableBack
								        disableFullscreen
								        paused={this.state.play ? false : true} 
								        rate={1.0}                              
		       							volume={1.0}
		       							onEnd={()=>this.videoEnd(rowData.pennyer_id,rowData.id,rowData.pennyer_btc)}
		       							muted={false}
		       							controls={true}
		       							playIcon
		       							playButton
									    style={ styles.video }
									/>
			  		          );		
					        }}
					        keyExtractor={(item, index) => index.toString()}
					    />
					</View>
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

AppRegistry.registerComponent('VideoScreen',()=>VideoScreen)

const styles = StyleSheet.create({

	cardNoData: {
		padding: 0,
		width: 300,
		marginTop: '50%',
		alignSelf: 'center',
	},

	noDataInfo:{
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 20,
		width: '80%',
		color: 'red'
	},

	done: {
	    color: '#FFF',
	    marginTop: 35,
	    textAlign: 'center',
	    paddingVertical: 13,
	    backgroundColor: 'blue',
	    borderRadius: 3,
	    width: "30%",
	    alignSelf: 'center'
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

	timer: {
		fontSize: 50,
		color: 'red',
		marginTop: '5%',
		textAlign: 'center',
	},

	cardInfo: {
		padding: 0,
		width: 300,
		marginTop: '6%',
		alignSelf: 'center',
	},

	info: {
		textAlign: 'center',
		alignSelf:  'center',
		justifyContent: 'center',
		lineHeight: 20,
		width: '80%',

	},

	video: {
		width: responsiveWidth(90),
		height:400,
		justifyContent: 'center',
		alignSelf: 'center',
		// alignItems: 'center',
		marginTop: '5%',
	},

	videoList: {
		marginLeft: '5%',
		backgroundColor: 'white'
	},

	videoName: {
		fontSize: 20,
		color: 'blue',
	}
})