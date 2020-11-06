import {Grid} from 'semantic-ui-react'
import ColorPanel from './components/ColorPanel/ColorPanel'
import SidePanel from './components/SidePanel/SidePanel'
import Messages from './components/Messages/Messages'
import MetaPanel from './components/MetaPanel/MetaPanel'
import {connect} from 'react-redux'
import "./App.css"

const App=({currentUser,currentChannel,isPrivateChannel,userPosts,primaryColor,secondaryColor })=>{

  return (
    <Grid columns="equal" className="app2" style={{background:secondaryColor}}>


      <ColorPanel key={currentUser && currentUser.name} currentUser={currentUser}/>
      
      <SidePanel 
        key={currentUser  && currentUser.id } 
        currentUser={currentUser}
        primaryColor={primaryColor}
        /> 
      
      <Grid.Column style={{marginLeft:320}}>
         <Messages  key={currentChannel  && currentChannel.id } currentChannel={currentChannel} currentUser={currentUser} isPrivateChannel={isPrivateChannel}/>
      </Grid.Column>

      <Grid.Column width="4">
        <MetaPanel userPosts={userPosts} key={currentChannel && currentChannel.name} currentChannel={currentChannel} isPrivateChannel={isPrivateChannel}/>
      </Grid.Column>
    </Grid>
  );
}

  const mapStateToProps=state=>({

    currentUser:state.user.currentUser,
    currentChannel:state.channel.currentChannel,
    isPrivateChannel:state.channel.isPrivateChannel,
    userPosts:state.channel.userPosts,
    primaryColor:state.color.primaryColor,
    secondaryColor:state.color.secondaryColor  

  })

export default connect(mapStateToProps)(App);


