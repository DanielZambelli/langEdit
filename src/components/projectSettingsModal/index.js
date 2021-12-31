import React from 'react'
import isoLanguages from 'iso-639-1'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

class ProjectSettingsModal extends React.Component{

  state = {
    accordionIndex: this.props.accordionIndex !== undefined ? this.props.accordionIndex : -1
  }

  languages = isoLanguages.getLanguages(isoLanguages.getAllCodes())

  handleClick = (accordionIndex) => (...args) => this.setState({ accordionIndex: this.state.accordionIndex === accordionIndex ? -1 : accordionIndex })

  handleChange = (key) => (e,options) => {
    if(!this.props.onChange) return
    const next = {...this.props.project}
    switch(key){
      case 'title':
        next.body.title = e.target.value
      break
      case 'languages':
        next.body.selectedLanguageCodes = options.map(o => o.code)
      break
      case 'defaultLanguage':
        next.body.defaultLanguageCode = e.target.value
      break
    }
    this.props.onChange(next)
  }

  render(){
    return (
        <Dialog
          fullWidth
          maxWidth="md"
          scroll="paper"
          open={true}
          onClose={this.props.onClose}
          PaperProps={{style: { background: '#E9EDF2' }}}
        >
          <DialogTitle>{this.props.title || 'Project Settings'}</DialogTitle>
          <DialogContent dividers>
            <Accordion expanded={this.state.accordionIndex === 0} onChange={this.handleClick(0)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ marginRight: '5px' }}>Project title:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{this.props.project.body.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={this.props.project.body.title}
                      onChange={this.handleChange('title')}
                    />
                    </Grid>
                  <Grid item xs={12}><small>Name for your project. Consider a pattern like client and name of application e.g. Facebook-Messenger</small></Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={this.state.accordionIndex === 1} onChange={this.handleClick(1)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ marginRight: '5px' }}>Languages</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{this.props.project.body.selectedLanguageCodes.join(', ').toUpperCase()}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      size="small"
                      filterSelectedOptions
                      clearIcon={null}
                      options={this.languages}
                      getOptionLabel={(option) => `${option.code.toUpperCase()} - ${option.name}`}
                      value={this.languages.filter(l => this.props.project.body.selectedLanguageCodes.includes(l.code))}
                      renderInput={(params) => <TextField {...params} placeholder="Languages" />}
                      onChange={this.handleChange('languages')}
                    />
                  </Grid>
                  <Grid item xs={12}><small>Select the languages to translate to. Selecting two languages then each texts/strings can be translated to these two languages.</small></Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={this.state.accordionIndex === 2} onChange={this.handleClick(2)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ marginRight: '5px' }}>Default language:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {this.props.project.body.defaultLanguageCode.toUpperCase()} - {isoLanguages.getName(this.props.project.body.defaultLanguageCode)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Select
                        size="small"
                        value={this.props.project.body.defaultLanguageCode}
                        onChange={this.handleChange('defaultLanguage')}
                      >
                        {this.props.project.body.selectedLanguageCodes.map(i => (
                          <MenuItem key={i} value={i}>{i.toUpperCase()} - {isoLanguages.getName(i)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}><small>Select default language for the project. The default language is used when performing on-click translation from the default language and to the diffrent languages.</small></Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>Continue</Button>
        </DialogActions>
        </Dialog>
    )
  }
}

export default ProjectSettingsModal
