import React from 'react';
import {Comment} from  'semantic-ui-react'

class Test extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
		    <Comment>

			    <Comment.Content >

			    <Comment.Author >Rishabh Tripathi</Comment.Author>

			    
			    <Comment.Text >Hello World</Comment.Text>
			    </Comment.Content>


		    </Comment>
	    )
	}
}

export default Test