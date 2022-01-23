class Api{

  constructor(opts){
    this.api = opts.api
    this.basicAuth = opts.basicAuth
  }

  getProjects(){
    return fetch(this.api+'client/api/projects', { headers: { Authorization: this.basicAuth }}).then(res => res.json()).then(list => list.reduce((map,item) => ({ ...map, [item.id]: item }), {}))
  }

  saveProject(project){
    return fetch(this.api+'client/api/project', {
      method: project.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.basicAuth
      },
      body: JSON.stringify({ project }),
    }).then(res => res.json())
  }

}

const client = new Api({
  api: process.env.REACT_APP_API_BASE,
  basicAuth: 'Basic '+window.btoa(`${process.env.REACT_APP_PUBLIC_CLIENT_USER}:${process.env.REACT_APP_PUBLIC_CLIENT_PASS}`)
})

export default client
