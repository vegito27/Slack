import { SET_COLORS } from '../types'

const initialColorsState={
	primaryColor:'#4c3c4c',
	secondaryColor:'#eee'
}

const color_reducer=(state=initialColorsState,action)=>{

	switch(action.type){

		case SET_COLORS:
			return {
				primaryColor: action.payload.primaryColor,

				secondaryColor: action.payload.secondaryColor
			}
		default:
			return state	
	}

}

export default color_reducer
