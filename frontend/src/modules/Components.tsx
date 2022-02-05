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
  MenuItem,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import SearchBar from '@core/Components/SearchBar'
import PageNumbers from '@core/Components/PageNumbers'
import ZingModal from '@core/Components/ZingModal'
import ProgressBar from '@core/Components/ProgressBar'
import DropdownSelect from '@core/Components/DropdownSelect'

const Components = () => {
  const [age, setAge] = useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value)
  }

  const [modalOpen, setModalOpen] = useState(false)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

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
        <DropdownSelect value={age} onChange={handleChange}>
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </DropdownSelect>
      </Box>
      <Box my={3}>
        <SearchBar />
      </Box>
      <Box my={3}>
        <PageNumbers count={5} />
      </Box>
      <Box my={3}>
        <Button onClick={handleModalOpen}>Modal</Button>
        <ZingModal
          open={modalOpen}
          onClose={handleModalClose}
          primaryButtonText="Button Text"
          secondaryButtonText="Button Text"
        >
          Modal text goes here!
        </ZingModal>
      </Box>
      <Box my={3}>
        <ProgressBar total={8} step={4} />
      </Box>
      <Box my={3}>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
        <Typography variant="subtitle1">Subtitle 1</Typography>
        <Typography variant="subtitle2">Subtitle 2</Typography>
        <Typography variant="body1">Body text 1</Typography>
        <Typography variant="body2">Body text 2</Typography>
      </Box>
    </Box>
  )
}

export default Components
