import React from 'react';

import {Grid,Form,Message,Header,Button,Segment ,Icon } from 'semantic-ui-react' 
import {Link} from 'react-router-dom' 
import firebase from '../../firebase'
 

 class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			email:'',
			password:'',
			errors:[],
			loading:false, 
		}
	}


	handleChange=(event)=>{
		this.setState({[event.target.name]:event.target.value})
	}



	displayErrors=errors=>errors.map((error,i)=> <p key={i}>{error.message}</p>)


	handleSubmit=(event)=>{

		event.preventDefault();

		if(this.isFormValid(this.state)){

			this.setState({errors:[],loading:true})

			firebase
			.auth()
			.signInWithEmailAndPassword(this.state.email,this.state.password)
			.then(signedInuser=> {
				console.log('signed in user')
			})
			.catch(err=>{

				console.error(err)

				this.setState({

					errors:this.state.errors.concat(err),
					loading:false
				})
			})
		}
	}


	isFormValid=({email,password})=>email && password



	handleInputError=(errors,inputName)=>{

		return errors.some(error=>error.message.toLowerCase().includes(inputName)) ? 'error':''
	}



	render() {

		const {email,password,errors,loading}=this.state

		return (
			<Grid textAlign="center" verticalAlign="middle" className="app">
			<Grid.Column style={{maxWidth:450}}>

					<Header as="h2" icon color="violet" textAlign="center">
						<Icon name="code branch" color="violet" />Login to DevChat
					</Header>

					<Form onSubmit={this.handleSubmit} size="large">

						<Segment slacked>

							 <Form.Input fluid name="email" icon="mail" value={email} iconPosition="left" placeholder="Email Address" className={this.handleInputError(errors,'email')} onChange={this.handleChange} type="email" />	
							<Form.Input fluid name="password" icon="lock" value={password} iconPosition="left" placeholder="Password" className={this.handleInputError(errors,'password')} onChange={this.handleChange} type="password" />
							
							<Button disabled={loading} className={loading?'loading':''} color="violet" fluid size="large">Submit</Button>
							
						</Segment>

					</Form>

					{errors.length>0 && (<Message errors style={{color:"red"}} ><h3>Error</h3>{this.displayErrors(errors)}</Message>)}

					<Message>Don't have an account ?<Link to="/register">Register</Link></Message>

				</Grid.Column>
			</Grid>
	
		);
	}
}


export default Login
