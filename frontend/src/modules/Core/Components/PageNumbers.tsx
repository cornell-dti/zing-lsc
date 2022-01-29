import { Box, Pagination, PaginationItem } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const PageNumberButton = ({ direction }: { direction: string }) => {
  return (
    <Box
      sx={{
        fontFamily: 'Montserrat',
        fontWeight: 600,
        color: '#000',
        '& .arrow-icon': { color: '#898992' },
      }}
      display="flex"
      alignItems="center"
      gap={1}
    >
      {direction === 'left' ? (
        <>
          <ArrowBackIosNewIcon className="arrow-icon" /> Back
        </>
      ) : (
        <>
          Next <ArrowForwardIosIcon className="arrow-icon" />
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
          sx={{
            fontFamily: 'Montserrat',
            color: '#898992',
            fontWeight: 600,
            '&.Mui-selected': {
              backgroundColor: '#DBDBDD',
              color: 'black',
            },
          }}
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
