import { ArrowBack, ArrowForward } from '@mui/icons-material'
import {
  Box,
  Button,
  Stack,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'
import SearchBar from '@core/Components/SearchBar'
import PageNumbers from '@core/Components/PageNumbers'

const Components = () => {
  const [age, setAge] = useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value)
  }

  return (
    <Box m={8} pb={6}>
      <Box my={3}>
        <Stack spacing={2} direction="row">
          <Button>Button text</Button>
          <Button disabled>Button text</Button>
          <Button variant="outlined" color="secondary">
            Button text
          </Button>
          <Button variant="outlined" color="secondary" disabled>
            Button text
          </Button>
        </Stack>
      </Box>
      <Box my={3}>
        <Stack spacing={2} direction="row">
          <Button startIcon={<ArrowBack />}>Button text</Button>
          <Button startIcon={<ArrowBack />} disabled>
            Button text
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBack />}
          >
            Button text
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBack />}
            disabled
          >
            Button text
          </Button>
        </Stack>
      </Box>
      <Box my={3}>
        <Stack spacing={2} direction="row">
          <Button endIcon={<ArrowForward />}>Button text</Button>
          <Button endIcon={<ArrowForward />} disabled>
            Button text
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<ArrowForward />}
          >
            Button text
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<ArrowForward />}
            disabled
          >
            Button text
          </Button>
        </Stack>
      </Box>
      <Box my={3}>
        <Stack spacing={2} direction="row">
          <Button size="small">Button text</Button>
          <Button size="small" disabled>
            Button text
          </Button>
          <Button variant="outlined" color="secondary" size="small">
            Button text
          </Button>
          <Button variant="outlined" color="secondary" size="small" disabled>
            Button text
          </Button>
        </Stack>
      </Box>
      <Box my={3}>
        <Stack spacing={2} direction="row">
          <IconButton>
            <ArrowBack />
          </IconButton>
          <IconButton disabled>
            <ArrowBack />
          </IconButton>
          <IconButton color="secondary">
            <ArrowBack />
          </IconButton>
          <IconButton color="secondary" disabled>
            <ArrowBack />
          </IconButton>
        </Stack>
      </Box>
      <Box my={3}>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Primary" />
          <FormControlLabel
            disabled
            control={<Checkbox />}
            label="Primary Disabled"
          />
          <FormControlLabel
            control={<Checkbox color="secondary" />}
            label="Secondary"
          />
          <FormControlLabel
            disabled
            control={<Checkbox />}
            label="Secondary Disabled"
          />
        </FormGroup>
      </Box>
      <Box my={3}>
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel
          value="male"
          control={<Radio disabled />}
          label="Male"
        />
      </Box>
      <Box my={3}>
        <FormControl
          sx={{ m: 1, minWidth: 300 }}
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
              fontWeight: 600,
              px: 0.5,
            }}
            value={age}
            MenuProps={{
              MenuListProps: {
                dense: true,
                sx: {
                  borderRadius: '10px',
                  '& .MuiMenuItem-root': {
                    fontFamily: 'Montserrat',
                    '&:hover': {
                      backgroundColor: '#EBE5F8',
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box my={3}>
        <SearchBar />
      </Box>
      <Box my={3}>
        <PageNumbers count={10} />
      </Box>
    </Box>
  )
}

export default Components
