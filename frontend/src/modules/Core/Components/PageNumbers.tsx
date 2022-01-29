import { Box, Pagination, PaginationItem } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const PageNumberButton = ({ direction }: { direction: string }) => {
  return (
    <Box
      sx={{ fontFamily: 'Montserrat', fontWeight: 600 }}
      display="flex"
      alignItems="center"
      gap={1}
    >
      {direction === 'left' ? (
        <>
          <ArrowBackIosNewIcon /> Back
        </>
      ) : (
        <>
          Next <ArrowForwardIosIcon />
        </>
      )}
    </Box>
  )
}

const BackButton = () => {
  return <PageNumberButton direction="left" />
}

const NextButton = () => {
  return <PageNumberButton direction="right" />
}

const PageNumbers = ({ count }: { count: number }) => {
  return (
    <Pagination
      sx={{ fontFamily: 'Montserrat' }}
      count={count}
      renderItem={(item) => (
        <PaginationItem
          components={{
            previous: BackButton,
            next: NextButton,
          }}
          {...item}
        />
      )}
    />
  )
}

export default PageNumbers
