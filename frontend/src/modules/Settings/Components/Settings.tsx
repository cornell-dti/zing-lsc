import { DropdownSelect } from '@core/index'
import { Box, IconButton, SelectChangeEvent } from '@mui/material'
import Menu from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'

export const Settings = () => {
  const [currRoster, setCurrRoster] = useState<string>('SP23')

  const changeCurrRoster = (event: SelectChangeEvent) => {
    setCurrRoster(event.target.value)
  }
  return (
    <Box>
      <Box
        sx={{
          pl: '5rem',
          pr: '5rem',
          display: 'flex',
          flexDirection: 'row',
          background: 'green',
        }}
      >
        <Box sx={{ typography: 'h5' }}>Change Semester</Box>

        <DropdownSelect
          value={currRoster}
          onChange={changeCurrRoster}
          sx={{ alignSelf: 'right', background: 'blue' }}
        >
          <MenuItem value="SU22">Summer 2022</MenuItem>
          <MenuItem value="FA22">Fall 2022</MenuItem>
          <MenuItem value="WI23">Winter 2023</MenuItem>
          <MenuItem value="SP23">Spring 2023</MenuItem>
          <MenuItem value="SU23">Summer 2023</MenuItem>
        </DropdownSelect>
      </Box>
    </Box>
  )
}
