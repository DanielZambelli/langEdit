// TODO: Github like documentation offering it as a service, covering what it is, why, how to use and deploy it, prices...

import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import ViewProjects from '../../view/project'
import ViewNewProject from '../../view/newProject'
import Api from '../../utils/api'
import {setProjects} from '../../state/projects'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './styles.scss'

class App extends React.Component{

  state = { init: false }

  async componentDidMount(){
    const projects = await Api.getProjects()
    setProjects(projects)
    this.setState({ init: true })
  }

  render(){
    if(!this.state.init) return null
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route path="/new-project" component={ViewNewProject} />
            <Route path="/:projectId" component={ViewProjects} />
            <Redirect to="/project" />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
