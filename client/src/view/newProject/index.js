import React, { useState } from 'react'
import ProjectSettingsModal from '../../components/projectSettingsModal'
import { saveEntities } from '../../state/actionCreators'
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
      const res = await saveEntities({ projects: [ project ] })
      props.history.push(`/${res.projects[0].id}`)
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
