import React from 'react'
import { useSelector } from 'react-redux'
import { saveEntities } from '../../state/actionCreators'
import { Route, Switch } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import isoLanguages from 'iso-639-1'
import ProjectSettingsModal from '../../components/projectSettingsModal'
import NewKeysModal from '../../components/newKeysModal'
import './styles.scss'

const ViewProject = (props) => {

  const projects = useSelector(state => state?.entities?.projects)
  if(!projects) return null

  const project = projects[props?.match?.params?.projectId]
  if(!project) {
    props.history.push(`/${Object.values(projects)[0].id}`)
    return null
  }

  const handleProjectChange = (event, option) => {
    const getRoute = (id) => {
      switch(id){
        case 'projectSettings':
          return `/${props.match.params.projectId}/settings`
        case 'newProject':
          return '/new-project'
        case 'newKeys':
          return `/${props.match.params.projectId}/new-keys`
        default:
          return `/${id}`
      }
    }
    props.history.push(getRoute(option.id))
  }

  const viewTranslations = data => props.history.push(`/${project.id}/${data.id}`)

  const viewRoot = () => props.history.push(`/${project.id}`)

  const keys = Array.from(new Set(Object
    .values(project.body.translations)
    .map(obj => Object.keys(obj))
    .reduce((list,items) => list.concat(items), [])))

  const getTranslatedPercent = (key) => {
    const translations = project.body.translations
    const expectedTranslations = project.body.selectedLanguageCodes.length
    const translatedCount = project.body.selectedLanguageCodes.map(langCode => !!translations?.[langCode]?.[key] ? 1 : 0 ).filter(v => v === 1).length
    return `${((translatedCount / expectedTranslations)*100).toFixed(0)}%`
  }

  const handleSettingsChange = (project) => saveEntities({projects: [project]})

  const handleKeyDelete = (key) => async () => {
    if(window.confirm('Please confirm deletion- This cannot be undone.')){
      const translations = project.body.translations
      Object.keys(translations).forEach(langCode => {
        if(translations[langCode] && translations[langCode][key] !== undefined)
          delete translations[langCode][key]
      })
      saveEntities({ projects: [project] })
      viewRoot()
    }
  }

  const handleKeyCreation = (keys) => {
    const translations = project.body.translations
    const langCodes = [ ...(project.body.selectedLanguageCodes||[]), ...Object.keys(translations) ]
    keys.forEach(key => {
      langCodes.forEach(langCode => {
        if(!translations[langCode]) translations[langCode] = {}
        if(!translations[langCode][key]) translations[langCode][key] = ''
      })
    })
    saveEntities({ projects: [project] })
    viewRoot()
  }

  const handleTranslationChange = (langCode, key) => e => {
    const translations = project.body.translations
    if(!translations[langCode]) translations[langCode] = {}
    translations[langCode][key] = e.target.value
    saveEntities({ projects: [project] })
  }

  return (
    <div className="viewProjects">
      <div className="toolbar">
        <Autocomplete
          className="toolbar__program"
          size="small"
          filterSelectedOptions
          clearIcon={null}
          options={Object.values({
            ...projects,
            newKeys: { id: 'newKeys', body: { title: '+ Add new keys' } },
            projectSettings: { id: 'projectSettings', body: { title: '+ Project settings' } },
            newProject: { id: 'newProject', body: { title: '+ Create new project' } },
          })}
          getOptionLabel={(option) => option.body.title}
          value={project}
          renderInput={(params) => (
            <TextField
              {...params}
              label={(<>Program <AccountTreeIcon fontSize="3px" /></>)}
              placeholder="Program"
            />
          )}
          onChange={handleProjectChange}
        />
      </div>
      <div className="list">
          <div className="list--wrapper">
            <DataGrid
              rows={keys.map((key) => ({
                key,
                id: key,
                translated: getTranslatedPercent(key),
                [project.body.defaultLanguageCode]: project.body.translations[project.body.defaultLanguageCode][key]
              }))}
              columns={[
                { field: 'key', headerName: 'key', flex: 1, sortable: true },
                { field: 'translated', headerName: 'translated', flex: 1, sortable: true, renderCell: (param) => {
                  if(param.value === '100%') return <b style={{color: 'green'}}>{param.value}</b>
                  return param.value
                }},
                { field: project.body.defaultLanguageCode, headerName: project.body.defaultLanguageCode, flex: 8, sortable: true },
              ]}
              disableColumnMenu={true}
              rowHeight={35}
              onRowClick={viewTranslations}
            />
          </div>
        </div>
        <Switch>
          <Route path="/:projectId/settings" render={(props) => (
            <ProjectSettingsModal
              project={project}
              onChange={handleSettingsChange}
              onClose={viewRoot}
            />
          )} />
          <Route path="/:projectId/new-keys" render={(props) => (
            <NewKeysModal onClose={handleKeyCreation} />
          )} />
          <Route path="/:projectId/:key" render={(props) => (
            <Drawer
              anchor="right"
              open={true}
              onClose={viewRoot}
            >
              <Grid className="viewProjectsModal" container spacing={3}>
                <Grid className="viewProjectsModal__title" item xs={9}>{props.match.params.key}</Grid>
                <Grid className="viewProjectsModal__delete" item xs={3}>
                  <div onClick={handleKeyDelete(props.match.params.key)}>Delete</div>
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
                        onChange={handleTranslationChange(code, props.match.params.key)}
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

export default ViewProject
