import React from 'react';
import {Segment,Comment} from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase'
import Message from './Message'


export default class Messages extends React.Component {
	
	constructor(props) {
		super(props);

	this.state={

		messagesRef:firebase.database().ref('messages'),
		channel:this.props.currentChannel,
		user:this.props.currentUser,
		messages:[],
		messagesLoading:true,
		progressBar:false ,
		numUniqueUser:'',
		searchTerm:'',
		searchLoading:false,
		searchResults:[] 
		
		}
	}

	componentDidMount(){
		const {channel,user}=this.state;

		if(channel && user){
			 this.addListeners(channel.id)
		}
	}

	addListeners=channelId=>{
		this.addMessagelisteners(channelId)
	}

	isProgressBarVisible=percent=>{
		 if(percent>0){
		 	this.setState({progressBar:true})
		 }
	}

	displayChannelName=channel=>channel?`#${channel.name}`:''


	addMessagelisteners=channelId=>{

		let loadedMessages=[]

		//inserting messages into firebase

		this.state.messagesRef.child(channelId).on('child_added',snap=>{

			loadedMessages.push(snap.val() )

			//updating(filling) the messages array

			this.setState({
				messages:loadedMessages,
				messagesLoading:false 
			})

			this.countuniqueUsers(loadedMessages)
		})
	}

	countuniqueUsers=messages=>{
		const uniqueUsers=messages.reduce((acc,message)=> {

			if(!acc.includes(message.user.name)){
					acc.push(message.user.name)		
				}

				return acc; 	

			},[])

		console.log(uniqueUsers)

		const plural=uniqueUsers.length>1 || uniqueUsers.length===0

		const numUniqueUser=`${uniqueUsers.length} User${plural?'s':''}`

		this.setState({numUniqueUser})

	}

	handleSearchChange=event=>{

		this.setState({

			searchTerm:event.target.value,

			searchLoading:true

		},()=>this.handleSearchMessage())
	}

	handleSearchMessage=()=>{

		const channelMessages=[...this.state.messages]

		const regex=new RegExp(this.state.searchTerm,'gi')


		const searchResults=channelMessages.reduce((acc,message)=>{


			if(message.content && message.content.match(regex) || message.user.name.match(regex)){
				acc.push(message) 
			}

			return acc;

		},[])

		this.setState({searchResults})

		setTimeout(()=>this.setState({searchLoading:false}),1000)

	}

	
	

	displayMessages=messages=>(

		messages.length >0 && messages.map(message=>( <Message key={message.timestamp} message={message} user={this.state.user} /> ))
				
	)

	render() {

		const {messagesRef,messages, channel,user,progressBar,numUniqueUser,searchTerm,searchResults,searchLoading  }=this.state

		console.log('message states',this.state)

		return (
			<React.Fragment>
				<MessagesHeader 
					channelName={this.displayChannelName(channel)} 
					numUniqueUser={numUniqueUser} 
					handleSearchChange={this.handleSearchChange}
					searchLoading={searchLoading} 
				/>

				<Segment>
					<Comment.Group className="messages">

					{ searchTerm ?  this.displayMessages(searchResults):this.displayMessages(messages) }
			
					</Comment.Group>

				</Segment>

				<MessageForm messagesRef={messagesRef} currentChannel={channel} currentUser={user}  isProgressBarVisible={this.isProgressBarVisible}/>
 
			</React.Fragment>
		);
	}
}


