import {combineReducers} from 'redux'  

import user_reducer from './reducers/userReducer'
import channel_reducer from './reducers/channelReducer'


const rootReducer=combineReducers({

	user:user_reducer,
	channel:channel_reducer
})

export default rootReducer
