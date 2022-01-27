import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Box, Button, Stack, IconButton } from '@mui/material'

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
    </Box>
  )
}

export default Components
