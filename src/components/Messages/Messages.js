import React from 'react';
import {Segment,Comment} from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'

export default class Messages extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<MessagesHeader />
				<Segment>
					<Comment.Group className="messages">

					</Comment.Group>


				</Segment>

				<MessageForm />



			</React.Fragment>
		);
	}
}
