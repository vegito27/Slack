import React from 'react';
import {Sidebar,Menu,Divider,Button} from 'semantic-ui-react' 

export default class ColorPanel extends React.Component {


	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Sidebar as={Menu} icon="label" inverted vertical visible width="very thin">
			<Divider />
			<Button size="sm" color="blue"/>



			</Sidebar>
		);
	}
}
