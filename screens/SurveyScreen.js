const WEBVIEW_REF = "WEBVIEW_REF";
import React, {Component} from 'react';
import Dashboard from './DashboardScreen.js';
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
	WebView,
	Linking,
	BackHandler,
  	Platform,
  	RefreshControl
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Toast from 'react-native-custom-toast';
import {Video} from 'react-native';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';

export default class SurveyScreen extends Component {
	
	webView = {
		canGoBack: false,
		ref: null		
	}

	static navigationOptions = {
		header: null
	}

	constructor(props){
		super(props)
		this.state ={
			image: [],
			surveyData: '',
			amtEarned: '',
			taskName: '',
			btasks_id: '',
			pennyer_id: this.props.navigation.state.params.pennyer_id,
			taskPrice: '',
			earnings: '',
			hasData: '',
			clicked: false,
			isClicked: '',
			clickUrl: '',
			pennyer_btc: '',	
			isCount: 5,
			checked: '',
	        refreshing: false,
            ipAddress: '',
	        subscription_type: this.props.navigation.state.params.subscription_type 
		}		
		this.fetchIpAdd();
	}

	_onRefresh = () => {
	    this.setState({refreshing: true});
	    this.setState({
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
			earnings: '',
			hasData: '',
			pennyer_btc: '',	
			clicked: false,
	        refreshing: false,
            ipAddress: '',
	        subscription_type: this.props.navigation.state.params.subscription_type 
	    })
	    this.fetchIpAdd();
	}

	fetchIpAdd = async() =>{
		AsyncStorage.getItem("ipAddressWithNoPort").then((value) => {
	        this.setState({
	          ipAddress: value
	        })
			this.fetchData();
			AsyncStorage.getItem("token").then((value) => {
	 			this.setState({token: value})
		    }).done();
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
		// https://www.surveymonkey.com/mp/website-feedback-survey-template/
		// https://www.snapsurveys.com/wh/siam/surveylanding/interviewer.asp
	}

	componentWillMount() {
	    if (Platform.OS === 'android') {
	      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
	    }
	}

	onAndroidBackPress = () => {
	    if (this.webView.canGoBack && this.webView.ref) {
	      this.webView.ref.goBack();
	      return true;
	    }
	    return false;
	}


	fetchData = async() => {
		const {pennyer_id,ipAddress} = this.state;
		this.setState({
			checked: false
		})

		let resolve = await fetch("http://" + ipAddress + ":8000/postSurvey/" + pennyer_id,{
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseData) => {
			if(responseData.length != 0){
				this.setState({
					surveyData: responseData,
					amtEarned: 0.00000000.toFixed(8),
					// url: urlSurvey,
					hasData: true
				});	
			}else{
				this.setState({
					hasData: false
				})
			}
			
		});

		// if(this.state.hasData){
		// 	setTimeout(()=>{
		// 		this.fetchData();
		// 	},4000)	
		// }
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	loading = () => {
		console.log('Loading your URL');

					// 	<WebView
					// ref={(ref) => { this.webview = ref; }}
			  //       source={{uri: "https://www.facebook.com/"}}
			  //       style={styles.url}
			  //       onLoad={this.loading}
			  //       onNavigationStateChange={(event) => {
			  //       	this.checkUrl(event)
			  //       }}
			  //     />
					            // <Text onPress={ ()=> Linking.openURL(rowData.taskMedia) } > {decodeURIComponent(rowData.taskMedia)} </Text>

	}

	checkUrl = (event) => {
		console.log(event);
		AsyncStorage.getItem("surveyUrl").then((value) => {
			// const surUrl = value
			if(event.url == value){
				// this.webview.stopLoading()
				console.log('correct');
			}else{
				console.log('wrong');
			}
	    }).done();


	}

	clickUrl = (url) => {
		// decodeURIComponent
		var decodeUrl = decodeURIComponent(url);

		AsyncStorage.setItem('surveyUrl', decodeUrl);

		this.setState({
			clickUrl: decodeUrl,
			isClicked: true
		})
		// this.checkUrl(decodeUrl);
	}


	press = (pennyer_id,btasks_id,priceEarned,linkUrl) =>{
		// this.clickUrl(linkUrl);

		Linking.openURL(decodeURIComponent(linkUrl));

		var total = parseFloat(this.state.amtEarned) + parseFloat(priceEarned);
		const {ipAddress} = this.state;
		this.setState({
			checked: true,
			amtEarned: total.toFixed(8),
			clicked: true
		})

		fetch("http://" + ipAddress + ":8000/performSurvey/", {  
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

		// this.refs.defaultToast.showToast('You earned 10 Satoshi');

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

	onBack() {
	  // this.refs[WEBVIEW_REF].goBack();
	  			            // disabled={!this.state.canGoBack}
			            // <Text style={this.state.canGoBack ? styles.topbarText : styles.topbarTextDisabled}>Go Back</Text>
	  // this.webview.goBack();
	  this.refs[WEBVIEW_REF].goBack();

	}

	onNavigationStateChange(navState) {
	    this.setState({
	      canGoBack: navState.canGoBack
	    });
	  }
	
	done = async() => {
		// Alert.alert('Thank you for spending your time!')
		// this.props.navigation.navigate('Dashboard');

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

	linkUrl = (urlLink) => {
		Linking.openURL(decodeURIComponent(urlLink))

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
			return <Text style={styles.infoUnli}> Enjoy your unlimited visiting of videos 😀.</Text>
		}else{
			return <Text style={styles.info}> Take and finish the survey provided below to earn 10 Satoshi.
										You can only visit 15 survey per day.</Text>
		}
	}

	render(){
		if(this.state.hasData){
			if(this.state.isClicked == ""){
				return( 
					<ScrollView
						 refreshControl={
		                  <RefreshControl
		                      onRefresh={() => this._onRefresh()}
		                      refreshing={this.state.refreshing}
		                  />
			           	}
					>
						<View>
							<View style={styles.cardInfo}>
								<Card title="Eyes Here">
									<Text style={styles.info}>
										{this.emptyToken()}
									</Text>
								</Card>
							</View>
							{ this.state.checked == true ? <Text style={styles.timer}> {this.state.isCount} </Text> : <Text style={styles.timer}>  </Text> }

							<FlatList
					    	    data={this.state.surveyData}
						        renderItem={({ item: rowData }) => {
					        		return (
							            <Card
							              title={rowData.taskName}
						              	>
							              	<TouchableOpacity onPress={()=> this.press(rowData.pennyer_id,rowData.id,rowData.pennyer_btc,rowData.taskMedia) }>
												<FontAwesome style={styles.urlLink}> {decodeURIComponent(rowData.taskMedia)} </FontAwesome>
											</TouchableOpacity>
							            </Card>
			  		  	        	);	
						        }}
						        keyExtractor={(item, index) => index.toString()}
						    />
						    <TouchableOpacity onPress={ this.done }>
								<FontAwesome style={styles.back}> {Icons.backward} GO BACK </FontAwesome>
							</TouchableOpacity>
						</View>
					</ScrollView>
				)
			}else{
				return(
				    <WebView
			          ref={(webView) => { this.webView.ref = webView; }}
				      onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
			          style={{flex: 1}}
			          source={{uri: this.state.clickUrl}}
			          /> 
				)
			}
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

AppRegistry.registerComponent('SurveyScreen',()=>SurveyScreen)

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

  timer: {
	fontSize: 50,
	color: 'red',
	marginTop: '5%',
	textAlign: 'center',
  },

  urlLink: {
  	textAlign:'center', 
  	color: 'blue',
  	fontSize: 18
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

  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  topbar: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topbarTextDisabled: {
    color: 'gray'
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

	url: {
		padding: 20,
		flex: 1,
		marginTop: 20,
		margin: 20
	}

})