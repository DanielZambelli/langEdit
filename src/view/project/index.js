import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import isoLanguages from 'iso-639-1'
import ProjectSettingsModal from '../../components/projectSettingsModal'
import NewKeysModal from '../../components/newKeysModal'
import { projects, setProjects } from '../../state/projects'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import Api from '../../utils/api'
import './styles.scss'

class ViewProject extends React.Component{

  state = {
    projects,
  }

  languages = isoLanguages.getLanguages(isoLanguages.getAllCodes())

  componentDidMount(){
    // if the project cant be found then go to create a new one
    if(!this.state.projects?.[this.props.match.params.projectId]){
      const projects = Object.values(this.state.projects)
      this.props.history.push(`/${projects.length > 0 ? projects[0].id : 'new-project'}`)
    }
  }

  componentWillUnmount(){
    setProjects(JSON.parse(JSON.stringify(this.state.projects)))
  }

  handleProjectChange = (event, option) => {
    const getRoute = (id) => {
      switch(id){
        case 'projectSettings':
          return `/${this.props.match.params.projectId}/settings`
        case 'newProject':
          return '/new-project'
        case 'newKeys':
          return `/${this.props.match.params.projectId}/new-keys`
        default:
          return `/${id}`
      }
    }
    this.props.history.push(getRoute(option.id))
  }

  handleProjectSettingsChange = (project) => {
    Api.saveProject(project)
    this.setState({ projects: { ...this.state.projects, [project.id]: project } })
  }

  handleTranslationChange = (langCode, key) => e => {
    const projects = JSON.parse(JSON.stringify(this.state.projects))
    const project = projects[this.props.match.params.projectId]
    const translations = project.body.translations
    if(!translations[langCode]) translations[langCode] = {}
    translations[langCode][key] = e.target.value
    Api.saveProject(project)
    this.setState({ projects })
  }

  handleKeyDelete = (key) => () => {

    if(window.confirm('Please confirm deletion- This cannot be undone.')){
      const projects = JSON.parse(JSON.stringify(this.state.projects))
      const project = projects[this.props.match.params.projectId]
      const translations = project.body.translations
      Object.keys(translations).forEach(langCode => {
        if(translations[langCode] && translations[langCode][key] !== undefined) delete translations[langCode][key]
      })
      Api.saveProject(project)
      this.setState({ projects }, this.openProject)
    }
  }

  handleKeyCreation = (keys) => {
    const projects = JSON.parse(JSON.stringify(this.state.projects))
    const project = projects[this.props.match.params.projectId]
    const translations = project.body.translations
    const langCodes = [ ...(project.body.selectedLanguageCodes||[]), ...Object.keys(translations) ]
    keys.forEach(key => {
      langCodes.forEach(langCode => {
        if(!translations[langCode]) translations[langCode] = {}
        if(!translations[langCode][key]) translations[langCode][key] = ''
      })
    })
    Api.saveProject(project)
    this.setState({ projects }, this.openProject)
  }

  openTranslationModal = data => this.props.history.push(`/${this.props.match.params.projectId}/${data.id}`)

  openProject = () => this.props.history.push(`/${this.props.match.params.projectId}`)

  getTranslatedPercent = (key) => {
    const project = this.state.projects?.[this.props.match.params.projectId]
    const translations = project.body.translations
    const expectedTranslations = project.body.selectedLanguageCodes.length
    const translatedCount = project.body.selectedLanguageCodes.map(langCode => !!translations?.[langCode]?.[key] ? 1 : 0 ).filter(v => v === 1).length
    return `${((translatedCount / expectedTranslations)*100).toFixed(0)}%`
  }

  renderTranslatedPercentCell = (param) => {
    if(param.value === '100%') return <b style={{color: 'green'}}>{param.value}</b>
    return param.value
  }

  render(){
    const project = this.state.projects?.[this.props.match.params.projectId]
    if(!project) return null
    const autocompleteOptions = Object.values({
      ...this.state.projects,
      newKeys: { id: 'newKeys', body: { title: '+ Add new keys' } },
      projectSettings: { id: 'projectSettings', body: { title: '+ Project settings' } },
      newProject: { id: 'newProject', body: { title: '+ Create new project' } },
    })
    const keys = Array.from(new Set(Object
      .values(project.body.translations)
      .map(obj => Object.keys(obj))
      .reduce((list,items) => list.concat(items), [])))
    return (
      <div className="viewProjects">
        <div className="toolbar">
          <Autocomplete
            className="toolbar__program"
            size="small"
            filterSelectedOptions
            clearIcon={null}
            options={autocompleteOptions}
            getOptionLabel={(option) => option.body.title}
            value={project}
            renderInput={(params) => (
              <TextField
                {...params}
                label={(<>Program <AccountTreeIcon fontSize="3px" /></>)}
                placeholder="Program"
              />
            )}
            onChange={this.handleProjectChange}
          />
        </div>
        <div className="list">
          <div className="list--wrapper">
            <DataGrid
              rows={keys.map((key) => ({
                key,
                id: key,
                translated: this.getTranslatedPercent(key),
                [project.body.defaultLanguageCode]: project.body.translations[project.body.defaultLanguageCode][key]
              }))}
              columns={[
                { field: 'key', headerName: 'key', flex: 1, sortable: true },
                { field: 'translated', headerName: 'translated', flex: 1, sortable: true, renderCell: this.renderTranslatedPercentCell },
                { field: project.body.defaultLanguageCode, headerName: project.body.defaultLanguageCode, flex: 8, sortable: true },
              ]}
              disableColumnMenu={true}
              rowHeight={35}
              onRowClick={this.openTranslationModal}
            />
          </div>
        </div>
        <Switch>
          <Route path="/:projectId/settings" render={(props) => (
            <ProjectSettingsModal
              project={project}
              onChange={this.handleProjectSettingsChange}
              onClose={this.openProject}
            />
          )} />
          <Route path="/:projectId/new-keys" render={(props) => (
            <NewKeysModal onClose={this.handleKeyCreation} />
          )} />
          <Route path="/:projectId/:key" render={(props) => (
            <Drawer
              anchor="right"
              open={true}
              onClose={this.openProject}
            >
              <Grid className="viewProjectsModal" container spacing={3}>
                <Grid className="viewProjectsModal__title" item xs={9}>{props.match.params.key}</Grid>
                <Grid className="viewProjectsModal__delete" item xs={3}>
                  <div onClick={this.handleKeyDelete(props.match.params.key)}>Delete</div>
                </Grid>
                {project.body.selectedLanguageCodes.map(code => (
                    <Grid key={code} item xs={12}>
                      <TextField
                        multiline
                        fullWidth
                        variant="outlined"
                        size="medium"
                        label={isoLanguages.getName(code)}
                        value={project.body.translations?.[code]?.[props.match.params.key]}
                        onChange={this.handleTranslationChange(code, props.match.params.key)}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Drawer>
          )} />
        </Switch>
      </div>
    )
  }
}

export default ViewProject
