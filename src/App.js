import {Grid} from 'semantic-ui-react'
import ColorPanel from './components/ColorPanel/ColorPanel'
import SidePanel from './components/SidePanel/SidePanel'
import Messages from './components/Messages/Messages'
import MetaPanel from './components/MetaPanel/MetaPanel'
import {connect} from 'react-redux'
import "./App.css"

const App=({currentUser,currentChannel })=>{

  return (
    <Grid columns="equal" className="app2" style={{background:"#eee"}}>
      <ColorPanel />
      
      <SidePanel key={currentUser  && currentUser.id } currentUser={currentUser}/> 
      
      <Grid.Column style={{marginLeft:320}}>
         <Messages  key={currentChannel  && currentChannel.id } currentChannel={currentChannel} currentUser={currentUser} />
      </Grid.Column>

      <Grid.Column width="4">
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

  const mapStateToProps=state=>({

    currentUser:state.user.currentUser,
    currentChannel:state.channel.currentChannel 

  })

export default connect(mapStateToProps)(App);


