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
	Linking
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Toast from 'react-native-custom-toast';
import {Video} from 'react-native';
import { Icon,  Container, Header, Content, Button, Left, DrawerLayoutAndroid, Hamburger } from 'native-base';

export default class SurveyScreen extends Component {
	
	static navigationOptions = {
		header: null
	}

	constructor(props){
		super(props)
		this.state ={
			image: [],
			// url: "https://www.google.com/",
			surveyData: '',
			// pennyer_id: 4,
			amtEarned: '',
			taskName: '',
			btasks_id: '',
			// pennyer_id: this.props.navigation.state.params.pennyer_id,
			pennyer_id: 1,
			taskPrice: '',
			earnings: '',
			hasData: '',
			clicked: false,
			isClicked: '',
			clickUrl: '',
			canGoBack: ''
			
		}
	}

	componentDidMount(){	
		this._isMounted = true;

		if(this._isMounted){
			// this.fetchData();
		}
		this.fetchData();
		// https://www.surveymonkey.com/mp/website-feedback-survey-template/
		// https://www.snapsurveys.com/wh/siam/surveylanding/interviewer.asp
	}

	fetchData = async() => {
		const {pennyer_id} = this.state;
		this.setState({
			checked: false
		})

		// const urlSurvey = "http://192.168.83.2/piggypenny/public/storage/pictures/";

		let resolve = await fetch('http://192.168.83.2:8000/postSurvey/' + pennyer_id,{
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

	onBack() {
	  // this.refs[WEBVIEW_REF].goBack();
	  this.webview.goBack();
	}

	render(){
		if(this.state.isClicked == ""){
			return( 
				<Container>
					<Content>
						<View style={styles.cardInfo}>
							<Card title="Eyes Here">
								<Text style={styles.info}>
									Take and finish the survey provided below to earn 10 Satoshi.
								</Text>
							</Card>
						</View>
						<View>
							<Text> </Text>
						</View>
						<FlatList
				    	    data={this.state.surveyData}
					        renderItem={({ item: rowData }) => {
				        		return (
						            <Card
						              title={rowData.taskName}
					              	>
					              	<TouchableOpacity onPress={() => this.clickUrl(rowData.taskMedia) }>
									    <FontAwesome style={{textAlign:'center'}}> Go </FontAwesome>
							        </TouchableOpacity>
						            </Card>
		  		  	        	);	
					        }}
					        keyExtractor={(item, index) => index.toString()}
					    />
					</Content>
				</Container>
			)
		}else{
			return(

				<WebView
					ref={(ref) => { this.webview = ref; }}
			        source={{uri: this.state.clickUrl}}
			        style={styles.url}
			        onLoad={this.loading}
			        onNavigationStateChange={(event) => {
			        	this.setState({
					    	canGoBack: navState.canGoBack
					  	});
			        	this.checkUrl(event)
			        	// console.log(event)
			        }}
			       
			    />
			    
			)
		}
	}
}

AppRegistry.registerComponent('SurveyScreen',()=>SurveyScreen)

const styles = StyleSheet.create({
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