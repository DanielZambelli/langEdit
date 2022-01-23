import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { getEntities } from '../../state/actionCreators'
import ViewProjects from '../../view/project'
import ViewNewProject from '../../view/newProject'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './styles.scss'

class App extends React.Component{

  async componentDidMount(){
    await getEntities({ projects: {} })
  }

  render(){
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route path="/new-project" component={ViewNewProject} />
            <Route path="/:projectId" component={ViewProjects} />
            <Route path="/" component={ViewProjects} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
