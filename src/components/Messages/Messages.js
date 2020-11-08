import React from 'react';
import {Segment,Comment} from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase'
import Message from './Message'
import {connect} from 'react-redux' 
import {setUserPosts} from '../../redux/actions/userActions'
import Typing from './Typing'
import Skeleton from './Skeleton'


 class Messages extends React.Component {
	
	constructor(props) {
		super(props);

	this.state={
		privateChannel:this.props.isPrivateChannel,
		messagesRef:firebase.database().ref('messages'),
		channel:this.props.currentChannel,
		user:this.props.currentUser,
		messages:[],
		messagesLoading:true,
		progressBar:false ,
		numUniqueUser:'',
		searchTerm:'',
		searchLoading:false,
		searchResults:[],
		privateMessagesRef:firebase.database().ref('privateMessages'),
		isChannelStarred:false,
		usersRef:firebase.database().ref('users'),
		typingRef:firebase.database().ref('typing'),
		typingUsers:[],
		connectedRef:firebase.database().ref('.info/connected'),
		listeners:[]  
		
		}
	}

	componentDidMount(){
		const {channel,user,listeners}=this.state;

		if(channel && user){
			this.removeListeners(listeners)
			this.addListeners(channel.id)

			this.addUserStarListener(channel.id,user.uid)
		}
	}

	addListeners=channelId=>{
		this.addMessagelisteners(channelId)
		this.addTypingListeners(channelId)
	}

	componentWillUnmount() {
	    this.removeListeners(this.state.listeners);
	    this.state.connectedRef.off();
	}

	 removeListeners = listeners => {
	    listeners.forEach(listener => {
	      listener.ref.child(listener.id).off(listener.event);
	    });
	  };

	addToListeners = (id, ref, event) => {
	    const index = this.state.listeners.findIndex(listener => {
	      return (
	        listener.id === id && listener.ref === ref && listener.event === event
	      );
	    });

	    if (index === -1) {
	      const newListener = { id, ref, event };
	      this.setState({ listeners: this.state.listeners.concat(newListener) });
	    }
	  }; 


	componentDidUpdate(prevProps,prevState){

		if(this.messagesEnd){
			this.scrollToBottom();
		}
	}

	scrollToBottom=()=>{

		this.messagesEnd.scrollIntoView({behaviour:'smooth'})
	}

	addMessagelisteners=channelId=>{

		let loadedMessages=[]

		const ref=this.getMessagesRef()

		//inserting messages into firebase

		ref.child(channelId).on('child_added',snap=>{

			loadedMessages.push(snap.val() )

			//updating(filling) the messages array

			this.setState({
				messages:loadedMessages,
				messagesLoading:false 
			})

			this.countuniqueUsers(loadedMessages)
			this.countUserposts(loadedMessages)
		})

		this.addToListeners(channelId,ref,'child_added')
	}


	addTypingListeners=channelId=>{

		let typingUsers=[]

		this.state.typingRef.child(channelId).on('child_added',snap=>{

			if(snap.key!==this.state.user.uid){
				typingUsers=typingUsers.concat({

					id:snap.key,
					name:snap.val()
				})

				this.setState({typingUsers})
			}
		})


		this.addToListeners(channelId,this.state.typingRef,'child_added')

		this.state.typingRef.child(channelId).on('child_removed',snap=>{

			const index=typingUsers.findIndex(user=>user.id===snap.key)

			if(index!==-1){
				typingUsers=typingUsers.filter(user=>user.id!==snap.key)
				this.setState({typingUsers})
			}
		})

		this.addToListeners(channelId,this.state.typingRef,'child_removed')

		this.state.connectedRef.on('value',snap=>{
			if(snap.value){

				this.state.typingRef
				.child(channelId)
				.child(this.state.user.uid)
				.onDisconnect()
				.remove(err=>{

					if(err!==null){
						console.error(err)
					}
				})
			}
		})
	}


	isProgressBarVisible=percent=>{
		 if(percent>0){
		 	this.setState({progressBar:true})
		 }
	}

	addUserStarListener=(channelId,userId)=>{

		this.state.usersRef
		.child(userId)
		.child('starred')
		.once('value')
		.then(data=>{

			if(data.val()!==null){

				const channelIds=Object.keys(data.val())

				const prevStarred=channelIds.includes(channelId)

				this.setState({isChannelStarred:prevStarred})
			}


		})
	}


	starChannel=()=>{

		if(this.state.isChannelStarred){

			this.state.usersRef.child(`${this.state.user.uid}/starred`)
			.update({

				[this.state.channel.id]:{

					name:this.state.channel.name,
					details:this.state.channel.details,
					createdBy:{
						name:this.state.channel.createdBy.name,
						avatar:this.state.channel.createdBy.avatar
					}
				}
			})

		}else{


			this.state.usersRef
			.child(`${this.state.user.uid}/starred`)
			.child(this.state.channel.id)
			.remove(err=>{

				if(err!==null){
					console.error(err )
				}
			})
		}
	}

	handleStar=()=>{
		this.setState(prevState=>({

			isChannelStarred:!prevState.isChannelStarred

		}),()=>this.starChannel());
	}


	displayChannelName=channel=>{
		
		return channel?`${this.state.privateChannel ? '@': '#'}${channel.name}`:' '	
	}

	getMessagesRef=()=>{

		const {messagesRef,privateMessagesRef,privateChannel}=this.state

		return privateChannel ? privateMessagesRef:messagesRef
 	}

	countuniqueUsers=messages=>{
	
		const uniqueUsers=messages.reduce((acc,message)=> {

			if(!acc.includes(message.user.name)){
					acc.push(message.user.name)		
				}

				return acc; 	

			},[])

		// console.log(uniqueUsers)

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

			if((message.content && message.content.match(regex)) || message.user.name.match(regex)){
				acc.push(message) 
			}

			return acc;

		},[])

		this.setState({searchResults})

		setTimeout(()=>this.setState({searchLoading:false}),1000)

	}


	countUserposts=messages=>{


		let userPosts=messages.reduce((acc,message)=>{

			if(message.user.name in acc){

				 acc[message.user.name].count+=1;

			}else{

				acc[message.user.name]={avatar:message.user.avatar,count:1}
				
				}

			 return acc;

			 console.log(acc)

			},{});

		this.props.setUserPosts(userPosts)
	}


	displayMessages=messages=>(

		messages.length >0 && messages.map(message=>( <Message key={message.timestamp} message={message} user={this.state.user} /> ))
				
	)

	displayTypingUser=users=>

		users.length >0 && users.map(user=>(

			<div style={{dislay:'flex',alignItems:'center',marginBottom:'0.2em'}} key={user.id}>
				<span className="user__typing">{user.name} is Typing</span><Typing />
			</div>

			));
		

	


	displayMessageSkeleton=loading=>(

		loading ? (<React.Fragment>{[...Array(10)].map((_,i)=>(<Skeleton key={i} />))}</React.Fragment>):null

	)	

	render(){

		const { messagesRef,messages,channel,user,progressBar,numUniqueUser,searchTerm,typingUsers,
			    searchResults,searchLoading,privateChannel,isPrivateChannel,isChannelStarred,messagesLoading }=this.state

		return (

			<React.Fragment>
				<MessagesHeader 
					channelName={this.displayChannelName(channel)} 
					numUniqueUser={numUniqueUser} 
					handleSearchChange={this.handleSearchChange}
					searchLoading={searchLoading} 
					isPrivateChannel={isPrivateChannel}
					handleStar={this.handleStar}
					isChannelStarred={isChannelStarred }
				/>

				<Segment>
					<Comment.Group className="messages">
					{this.displayMessageSkeleton(messagesLoading)}

					{ searchTerm ?  this.displayMessages(searchResults):this.displayMessages(messages) }

					{typingUsers && this.displayTypingUser(typingUsers)}

					<div ref={node=>(this.messagesEnd=node )} />
			
					</Comment.Group>

				</Segment>

				<MessageForm 
					messagesRef={messagesRef} 
					currentChannel={channel} 
					currentUser={user} 
					isPrivateChannel={privateChannel}  
					isProgressBarVisible={this.isProgressBarVisible}
					getMessagesRef={this.getMessagesRef}
				/>
 
			</React.Fragment>
		);
	}
}


export default connect(null,{setUserPosts})(Messages)



