import React, { useState } from 'react'
import ProjectSettingsModal from '../../components/projectSettingsModal'
import { projects } from '../../state/projects'
import Api from '../../utils/api'
import './styles.scss'

const ViewNewProject = (props) => {
  const [project, setProject] = useState({
    body:{
      title: '',
      defaultLanguageCode: 'en',
      selectedLanguageCodes: ['en'],
      translations: {}
    }
  })

  const handleClose = async () => {
    if(project.body.title) {
      setProject( await Api.createProject(project) )
      projects[project.id] = project
      props.history.push(`/${project.id}`)
    }
  }

  return (
    <div className="viewProjects">
      <ProjectSettingsModal
        title="Create new project"
        accordionIndex={0}
        project={project}
        onChange={setProject}
      onClose={handleClose}
      />
    </div>
  )

}

export default ViewNewProject
