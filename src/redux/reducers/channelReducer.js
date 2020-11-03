import {SET_CURRENT_CHANNEL} from '../types'

const initialChannelState={

	currentChannel:null
}

const channel_reducer=(state=initialChannelState,action)=>{

	switch(action.type){
		
		case SET_CURRENT_CHANNEL:
			return {
				...state,
				currentChannel:action.payload.currentChannel	
				}

		default:
			return state
	}
}

export default channel_reducer
