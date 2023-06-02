import React, { useEffect, useState } from 'react'
import '../../styles.css'
import './account.css'
import Navbar from '../../components/Navbar/Navbar'
import { Button, IconButton, InputAdornment, OutlinedInput, TextField } from '@material-ui/core'
import { SupabaseClient } from '@supabase/supabase-js'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom'

function Account() {

  const [editing, setEditing] = useState(false)
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await SupabaseClient.auth.getUser()
      console.log(user);
    }
    fetchData()
  }, [])
  

  // const Tickets = () => {
  //     return(
  //     <div className='ticket center'>
  //     <div>Location 1 &#8594; Location 2</div>
  //     <div>Price : 20 EGP</div>
  //     <div>Date: 10/05/2023</div>
  //     </div>
  //   )
  // }

  return (
    <div className='account-background'>
        <Navbar />
          <div className='account-details'>

          <div className='account-buttons'>

          <div className='mui-button'>
            <Button

            variant="contained" 
            onClick={() => {setEditing(!editing)}}>

            Change Account Details

            </Button>

          </div>

          <div className='mui-button'>

            <Button variant="contained">
            <Link className='account-link' to='/ticket'>
            all tickets
            </Link>
            </Button>
          
          </div>

          <div className='mui-button'>

            <Button variant="contained">
            <Link className='account-link' to='/senior'>
            Apply For a Senior Membership
            </Link>
            </Button>
          
          </div>

          </div>

            {
              editing && 
            <>
            <div className='detail'>
              <div>Name:</div>
              <div>Raffy Mekhtik</div>
            </div>

            <div className='detail'>
              <div>Email: </div>
              <div>raffynorair@gmail.com</div>
            </div>

            <div className='detail'>
              <div>Password: </div>
              <div>***********</div>
            </div>
            </>
            }

            {
              !editing &&
              <>
              <div className='detail'>
              <div>Name:</div>
              <TextField size="small" placeholder="Hello World" id="outlined-basic" variant="outlined" />
            </div>

            <div className='detail'>
              <div>Email: </div>
              <TextField size="small" placeholder="Hello World" id="outlined-basic" variant="outlined" />
            </div>

            <div className='detail'>
              <div>Password: </div>

              <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
            </div>
              </>
            }

            

          </div>

          {/* <div className='account-tickets'>
            <div className='bold center'>Tickets</div>

              <Tickets/>

          </div> */}

    </div>
  )
}

export default Account