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
} from '@mui/material'

const Components = () => {
  return (
    <Box m={5}>
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
    </Box>
  )
}

export default Components
