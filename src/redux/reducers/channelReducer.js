import {SET_CURRENT_CHANNEL,SET_PRIVATE_CHANNEL} from '../types'

const initialChannelState={

	currentChannel:null,
	isPrivateChannel:false
}

const channel_reducer=(state=initialChannelState,action)=>{

	switch(action.type){
		
		case SET_CURRENT_CHANNEL:
			return {
				...state,
				currentChannel:action.payload.currentChannel	
				}

		case SET_PRIVATE_CHANNEL:
			return {
				...state,
				isPrivateChannel:action.payload.isPrivateChannel
			}		

		default:
			return state
	}
}

export default channel_reducer
