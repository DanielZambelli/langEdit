const { DataTypes, Model } = require('sequelize')
const db = require('./db')

class Projects extends Model {}

Projects.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  body: {
    type: DataTypes.JSONB,
    set(value) {
      const expectedFields = ['title','defaultLanguageCode','selectedLanguageCodes','translations']
      if(typeof value !== 'object' || value === null || !!Object.keys(value).find(key => !expectedFields.includes(key)))
        throw new Error('Unexpected value in project body: '+Object.keys(value).filter(key => !expectedFields.includes(key)).join(', '))
      if(!value.title) value.title = 'a new project'
      if(!value.defaultLanguageCode) value.defaultLanguageCode = 'en'
      if(!value.selectedLanguageCodes) value.selectedLanguageCodes = ['en']
      if(!value.translations) value.translations = {}
      this.setDataValue('body', value)
    }
  }
}, {
  sequelize: db,
  modelName: 'langedit_projects',
  freezeTableName: true,
})

Projects
  .sync()
  .then(async () => {
    const res = await Projects.findOne({ where: { body: { title: 'Hello World' } } })
    if(res) return
    await Projects.create({
      body: {
        title: 'Hello World',
        defaultLanguageCode: 'en',
        selectedLanguageCodes: ['da','en'],
        translations: {
          da: {
            title: 'Hej Verden',
            da: '',
            en: 'Engelsk',
            fox: 'Den hurtige brune ræv hopper over den dovne hund'
          },
          en: {
            title: 'Hello World',
            da: 'Danish',
            en: '',
            fox: 'The quick brown fox jumps over the lazy dog'
          }
        }
      }
    })
  })

module.exports = Projects
