import { Button } from '@material-ui/core'
import { TextField } from '@mui/material'
import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './senior.css'
function Senior() {
  return (
    <div>
        <Navbar />

        <div className='senior-body'>
        <Button
        variant="contained"
        component="label"
        >
        Upload National ID
        <input
            type="file"
            hidden
        />
        </Button>

        <TextField
          id="outlined-multiline-flexible"
          label="Additional Comments (Optional)"
          multiline
          rows={4}
        />
        </div>

    </div>
  )
}

export default Senior