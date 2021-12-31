import React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

class NewKeysModal extends React.Component{

  static propTypes = {
    onClose: PropTypes.func,
  }

  state = {
    keys: [''],
  }

  handleChange = (index) => (e) => {
    const keys = [ ...this.state.keys ]
    keys[index] = e.target.value.replace(/[^a-z0-9+]+/gi, '')
    if(keys.length -1 === index) keys.push('')
    this.setState({ keys })
  }

  handleRemove = (index) => () => {
    const keys = [ ...this.state.keys ]
    keys.splice(index, 1)
    if(keys.length === 0) keys.push('')
    this.setState({ keys })
  }

  handleClose = () => {
    if(!this.props.onClose) return
    this.props.onClose(this.state.keys.filter(key => key.length > 0))
  }

  render(){
    return (
        <Dialog
          fullWidth
          scroll="paper"
          open={true}
          onClose={this.handleClose}
          PaperProps={{style: { background: '#E9EDF2' }}}
        >
          <DialogTitle>New Keys</DialogTitle>
          <DialogContent dividers>
            <Grid container alignItems="center" spacing={1}>
              <Grid key={-1} item xs={12}><small>Define the keys that should be translated e.g. "homeTitle". Only alphanumeric characters are allowed with no spaces and no special characters.</small></Grid>
              {this.state.keys.map((key, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      size="small"
                      value={key}
                      onChange={this.handleChange(index)}
                    />
                  </Grid>
                  <Grid item xs={1}><CancelOutlinedIcon onClick={this.handleRemove(index)} /></Grid>
                </React.Fragment>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Continue</Button>
        </DialogActions>
        </Dialog>
    )
  }
}

export default NewKeysModal
