 import {SET_USER,CLEAR_USER,SET_USERS_POSTS} from '../types'

const initialUserState={
	currentUser:null,
	isLoading:true,
	userPosts:null
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
		case SET_USERS_POSTS:
			return {
				...state,
				userPosts:action.payload.userPosts
			}	
		default:
			return state

	}
} 

export default user_reducer