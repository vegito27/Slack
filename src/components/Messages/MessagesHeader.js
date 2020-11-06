import React from 'react';
import {Header,Segment,Input,Icon} from 'semantic-ui-react'


export default class MessagesHeader extends React.Component {


	render() {

		const {channelName,numUniqueUser,handleSearchChange,searchLoading,isPrivateChannel,handleStar,isChannelStarred }=this.props

		// console.log("Message header",this.props)

		return (
			<Segment clearing>

				<Header fluid="true" as="h2" floated="left" style={{ marginBottom:0}}>
					<span>
						  {channelName } { !isPrivateChannel && 

						  	<Icon 
							  	onClick={handleStar} 
							  	name={isChannelStarred?'star':'star outline'} 
							  	color={isChannelStarred?'yellow':'black'}
						  	 />}
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




				
