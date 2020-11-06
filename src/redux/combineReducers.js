import {combineReducers} from 'redux'  

import user_reducer from './reducers/userReducer'
import channel_reducer from './reducers/channelReducer'
import color_reducer from './reducers/colorReducer'


const rootReducer=combineReducers({

	user:user_reducer,
	channel:channel_reducer,
	color:color_reducer
})

export default rootReducer
