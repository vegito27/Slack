import React from 'react';

import {Grid,Form,Message,Header,Button,Segment ,Icon } from 'semantic-ui-react' 
import {Link} from 'react-router-dom' 
import firebase from '../../firebase'
import md5 from 'md5'


 class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			username:'',
			email:'',
			password:'',
			passwordConfirmation:'',
			errors:[],
			loading:false,
			usersRef:firebase.database().ref('users') 

		}
	}


	handleChange=(event)=>{
		this.setState({[event.target.name]:event.target.value})
	}

	isFormValid=()=>{

		let errors=[]

		let error;

		if(this.isEmpty(this.state)){

			error={message:'Fill in all fields'}

			this.setState({errors:errors.concat(error) })

			return false

		}else if(!this.isPasswordValid(this.state)){

			error={message:'Password is invalid'}

			this.setState({errors:errors.concat(error) })

			return false

		}else{

			return true 

		}

	}

	isEmpty=({username,email,password,passwordConfirmation})=>{

		return !username.length || !email.length || !password.length || !passwordConfirmation.length;

	}

	isPasswordValid=({password,passwordConfirmation})=>{

		if(password.lenght<6 || passwordConfirmation.length<6)return false

		else if(password!==passwordConfirmation) return false	

		else return true	

	}

	displayErrors=errors=>errors.map((error,i)=> <p key={i}>{error.message}</p>)


	handleSubmit=(event)=>{

		if(this.isFormValid()){

			this.setState({errors:[],loading:true})

			event.preventDefault();

			firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.email,this.state.password)
			.then(createUser=>{

				console.log(createUser)


				createUser.user.updateProfile({
					displayName:this.state.username,
					photoURL:`http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
				})
				.then(()=>{

					this.saveUser(createUser).then(()=>{
						console.log('user saved')
					})
				})
				.catch(err=>{

					console.log(err)

					this.setState({errors:this.state.errors.concat(err),loading:false})

				}) 			

			})
			.catch(error=>{

				console.log(error)

				this.setState({errors:this.state.errors.concat(error),loading:false})

			})
		}
	}

	saveUser=createUser=>{

		return this.state.usersRef.child(createUser.user.uid).set({
			name:createUser.user.displayName,
			avatar:createUser.user.photoURL  
		})
	}


	handleInputError=(errors,inputName)=>{

		return errors.some(error=>error.message.toLowerCase().includes(inputName)) ? 'error':''
	}

	render() {

		const {username,email,password,passwordConfirmation,errors,loading}=this.state

		return (
			<Grid textAlign="center" verticalAlign="middle" className="app">
			<Grid.Column style={{maxWidth:450}}>

					<Header as="h2" icon color="orange" textAlign="center">
						<Icon name="puzzle piece" color="orange" />Register for Dev Chat
					</Header>

					<Form onSubmit={this.handleSubmit} size="large">

						<Segment slacked>

							<Form.Input fluid name="username" icon="user" value={username} iconPosition="left" placeholder="Username" className={this.handleInputError(errors,'username')} onChange={this.handleChange} type="text" />
							<Form.Input fluid name="email" icon="mail" value={email} iconPosition="left" placeholder="Email  Address" className={this.handleInputError(errors,'email')} onChange={this.handleChange} type="email" />	
							<Form.Input fluid name="password" icon="lock" value={password} iconPosition="left" placeholder="Password" className={this.handleInputError(errors,'password')} onChange={this.handleChange} type="password" />
							<Form.Input fluid name="passwordConfirmation" value={passwordConfirmation} icon="repeat" iconPosition="left" className={this.handleInputError(errors,'password')} placeholder="Password Confirmation" onChange={this.handleChange} type="password" />

							<Button disabled={loading} className={loading?'loading':''} color="orange" fluid size="large">Submit</Button>
							
						</Segment>

					</Form>

					{errors.length>0 && (<Message errors style={{color:"red"}} ><h3>Error</h3>{this.displayErrors(errors)}</Message>)}

					<Message>Already a User?<Link to="/login">Login</Link></Message>

				</Grid.Column>
			</Grid>
	
		);
	}
}


export default Register
