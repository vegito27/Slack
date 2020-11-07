import React from 'react';
import {Segment,Button,Input} from 'semantic-ui-react' 
import firebase from '../../firebase'
import FileModal from './FileModal'
import { v4 as uuidv4 } from 'uuid';
import ProgressBar from './ProgressBar'
import {Picker,emojiIndex} from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'   

 class MessageForm extends React.Component {

	state={
		storageRef:firebase.storage().ref(),
		typingRef:firebase.database().ref('typing'),
		uploadState:'',
		uploadTask:null,
		message:'',
		channel:this.props.currentChannel,
		user:this.props.currentUser, 
		loading:false,
		errors:[],
		modal:false,
		percentUploaded:0,
		emojiPicker:false
 	}


 	openModal=()=>this.setState({modal:true})

 	closeModal=()=>this.setState({modal:false})

	handleChange=event=> {
		this.setState({[event.target.name]:event.target.value})
	}

	componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }


	

	

	createMessage=(fileUrl=null)=>{

		const message={
			timestamp:firebase.database.ServerValue.TIMESTAMP,
			user:{
				id:this.state.user.uid,
				name:this.state.user.displayName,
				avatar:this.state.user.photoURL   

			},
		};

		if(fileUrl!==null){
			message['image']=fileUrl
		}else{
			message['content']=this.state.message
		}

		return message;

	}

	sendFileMessage=(fileUrl,ref,pathToUpload)=>{

		ref.child(pathToUpload)
			 .push()
			 .set(this.createMessage(fileUrl))
			 .then(()=>{
			 	this.setState({uploadState:'done'})
			 })
			 .catch(err=>{
			 	 console.error(err)
			 	 this.setState({
			 	 	errors:this.state.errors.concat(err)
			 	})

			})
		}


	sendMessage=()=>{
		const {getMessagesRef }=this.props

		const {message,channel,user}=this.state

		if(message){
			this.setState({loading:true})

			getMessagesRef() 
			.child(channel.id)
			.push()
			.set(this.createMessage())
			.then(
				()=>{
				this.setState({loading:false,message:'',errors:[] })

				this.state.
					typingRef
		 			.child(channel.id)
		 			.child(user.uid)
		 			.remove()
			})
			.catch(err=>{
				console.errror(err)
				this.setState({
					loading:false,
					errors:this.state.errors.concat(err) 
				})
			})

		}else{
			this.setState({
				errors:this.state.errors.concat({message:'Add a message'})
			})
		}    
	}


	getPath=()=>{
		if(this.props.isPrivateChannel){
			 return `chat/private/${this.state.channel.id }`
		}else{
			return `chat/public`
		}
	}

	uploadFile=(file,metadata)=>{


 		const pathToUpload=this.state.channel.id
 		const ref=this.props.getMessagesRef() 
 		const filePath=`${this.getPath()}/${uuidv4()}.jpeg`

 		this.setState(
	 		
	 		{
	 			uploadState:'uploading',
	 			uploadTask:this.state.storageRef.child(filePath).put(file,metadata) 
	 		},
	 		()=>{

	 			this.state.uploadTask.on('state_changed', snap=>{

				const percentUploaded=Math.round((snap.bytesTransferred/snap.totalBytes)*100)

				this.props.isProgressBarVisible(percentUploaded)

				this.setState({percentUploaded})

 			},
 			err=>{
 				console.error(err)

 				this.setState({
 					errors:this.state.errors.concat(err),
 					uploadState:'error',
 					uploadTask:null 
	 			})
 			},
 			()=>{
 				this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl=>{
 					this.sendFileMessage(downloadUrl,ref,pathToUpload)
 				})
 				.catch(err=>{

 					console.errror(err)

 						this.setState({
		 					errors:this.state.errors.concat(err),
		 					uploadState:'error',
		 					uploadTask:null
		 				})
	 				}) 
	 			}

		 	)
 		}
 	)}


 	handleKeyDown=(event)=>{

 		if(event.keyCode ===13 ){

 			this.sendMessage();
 		}

 		const {message,typingRef,channel,user}=this.state;

 		if(message){

 			typingRef
 			.child(channel.id)
 			.child(user.uid)
 			.set(user.displayName)

 		}else{

 			typingRef
 			.child(channel.id)
 			.child(user.uid)
 			.remove()
 		}
 	}

 	handleEmojiPicker=()=>{
 		this.setState({emojiPicker:!this.state.emojiPicker})
 	}

 	handleAddEmoji=emoji=>{
 		const oldMessage=this.state.message;
 		const newMessage=this.colonToUnicode(`${oldMessage}${emoji.colons}`)

 		this.setState({message:newMessage,emojiPicker:false})

 		setTimeout(()=>this.messageInputRef.focus(),0)
 	}

 	colonToUnicode = message => {
	    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
	      x = x.replace(/:/g, "");
	      let emoji = emojiIndex.emojis[x];
	      if (typeof emoji !== "undefined") {
	        let unicode = emoji.native;
	        if (typeof unicode !== "undefined") {
	          return unicode;
	        }
	      }
	      x = ":" + x + ":";
	      return x;
	    });
	  };



	render() {

		const {getMessagesRef}=this.props

		const {errors,message,loading,modal,uploadState,percentUploaded,typingRef,emojiPicker}=this.state


		return (
			<Segment className="message__form">
			{emojiPicker && (<Picker set="apple" onSelect={this.handleAddEmoji} className="emojiPicker" title="pick your emoji" emoji="point_up" />)}

				 <Input 
					 fluid 
					 name="message"
					 onKeyDown={this.handleKeyDown} 
					 value={message}
					 ref={node=>(this.messageInputRef=node)}
					 onChange={this.handleChange} 
					 className={ errors.some(error=>error.message.includes('message'))?'error':''}  
					 style={{marginBottom:'0.7em'}} 
					 label={<Button onClick={this.handleEmojiPicker} content={emojiPicker?'Close':null} icon={emojiPicker?'close':'add'} />} 
					 labelPosition="left" 
					 placeholder="Write your message...."
				 />

				 <Button.Group icon widths="2">
					 <Button 
						 onClick={this.sendMessage} 
						 disabled={loading} 
						 color="orange" 
						 content="Add Reply" 
						 labelPosition="left" 
						 icon="edit" />

					 <Button 
						 color="teal" 
						 disabled={uploadState==='uploading'} 
						 onClick={this.openModal} 
						 content="Upload Media" 
						 labelPosition="right" 
						 icon="cloud upload" />

				 </Button.Group> 
			 	
			 	 <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile}/>
			
				<ProgressBar uploadState={uploadState} percentUploaded={percentUploaded}/>
			
			</Segment>
		);
	}
}

export default MessageForm