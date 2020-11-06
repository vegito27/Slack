import {SET_USER,CLEAR_USER,SET_USERS_POSTS} from '../types'


export const setUser=user=>{

	return {
		type:SET_USER,
		payload:{ 
			currentUser:user 
		}
	}
}


export const clearUser=()=>{
	 return {
	 	 type:CLEAR_USER
	 }
}

export const setUserPosts=userPosts=>{
	return {
		type:SET_USERS_POSTS,
		payload:{userPosts}
	}
}