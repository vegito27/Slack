import React from 'react';
import {Header,Segment,Input,Icon} from 'semantic-ui-react'


export default class MessagesHeader extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		const {channelName,numUniqueUser,handleSearchChange,searchLoading,isPrivateChannel }=this.props

		// console.log("Message header",this.props)


		return (
			<Segment clearing>

				<Header fluid="true" as="h2" floated="left" style={{ marginBottom:0}}>
					<span>
						  {channelName } { !isPrivateChannel && <Icon name={"star outline"} color="black" />}
					</span>

					<Header.Subheader>{ numUniqueUser } </Header.Subheader>
				</Header>


				<Header floated="right">
					 <Input loading={searchLoading} size="mini" onChange={handleSearchChange} icon="search" name="searchTerm" placeholder="Search Messages" />
				</Header>


				
			</Segment>
		);
	}
}




				
