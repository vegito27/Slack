import React from 'react';
import {Grid,Header,Icon,Dropdown,Image} from 'semantic-ui-react'
import firebase from '../../firebase'
import {connect} from 'react-redux'

class UserPanel extends React.Component {
	
	constructor(props) {
		super(props);

		this.state={
			user:this.props.currentUser
		}
	}

	componentWillReceiveProps(nextProps){

		console.log(nextProps)

		this.setState({user:nextProps.currentUser})
	}

	dropdownOptions=()=>[
		{
			key:'user', 
			text:<span>Signed In as <strong>{this.state.user.displayName}</strong></span>,
			disabled:true
		},
		{
			key:'avatar',
			text:<span>Change avatar</span>
		},
		{
			key:'signout',
			text:<span onClick={this.handleSignOut}>Signed Out</span>
		}
	]
	handleSignOut=()=>{
		firebase
		.auth()
		.signOut()
		.then(()=>console.log('signed out!')) 
	}

	render() {
			const {user}=this.state
			const {primaryColor}=this.props

		return (
			<Grid style={{background:primaryColor}}>
				<Grid.Column>
					<Grid.Row style={{padding:'1.2em',margin:0}}>

						<Header inverted floated="left" as="h2">

							<Icon name="code"/>
							<Header.Content>DevChat</Header.Content>

						</Header>

					</Grid.Row>

					<Header style={{ padding:'0.25em' }} as="h4" inverted>
						<Dropdown trigger={<span><Image src={user.photoURL} color="pink" spaced="right" avatar />{user.displayName}</span>} options={this.dropdownOptions()}/>
					 </Header>

				</Grid.Column>

			</Grid>
		);
	}
}

const mapStateToProps=(state)=>({

	currentUser:state.user.currentUser
})

export default connect(mapStateToProps)(UserPanel)




