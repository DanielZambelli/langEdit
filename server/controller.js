const routeController = (callback) => {
  return async (req,res) => {
    let status = 200
    let msg = 'ok'
    let type = 'json'

    try{
      const data = {...req.body, ...req.params}
      msg = await callback(data)
    }
    catch(e){
      msg = e.message
      type = 'text'
      status = 500
    }
    finally{
      if(type === 'json') res.status(status).json(msg)
      else res.status(status).send(msg)
    }
  }
}

module.exports = routeController
