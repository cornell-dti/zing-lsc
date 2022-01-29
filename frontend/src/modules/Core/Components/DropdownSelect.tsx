import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'

const DropdownSelect = () => {
  const [age, setAge] = useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value)
  }

  return (
    <FormControl
      sx={{ m: 1, minWidth: 120 }}
      hiddenLabel
      margin="normal"
      size="medium"
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Age"
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        input={<OutlinedInput />}
        onChange={handleChange}
        sx={{
          borderRadius: '6px',
          color: '#898992',
          fontFamily: 'Montserrat',
        }}
        value={age}
        MenuProps={{ MenuListProps: { sx: { fontFamily: 'Montserrat' } } }}
      >
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  )
}

export default DropdownSelect
