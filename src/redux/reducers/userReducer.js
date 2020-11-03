import {SET_USER,CLEAR_USER} from '../types'

const initialUserState={
	currentUser:null,
	isLoading:true
}

const user_reducer=(state=initialUserState,action)=>{
	switch(action.type){
		
		case SET_USER:
			return {
				currentUser:action.payload.currentUser,
				isLoading: false
			}

		case CLEAR_USER:
			return {
				 ...state,
				 isLoading:false,
			}
		default:
			return state

	}
} 

export default user_reducer