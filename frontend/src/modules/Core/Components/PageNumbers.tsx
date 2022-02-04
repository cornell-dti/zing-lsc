import { Box, Pagination, PaginationItem } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { PageNumberProps } from '@core'
import { Link as RouterLink } from 'react-router-dom'

const PageNumberButton = ({ direction }: { direction: string }) => {
  return (
    <Box
      sx={{
        fontFamily: 'Montserrat',
        fontWeight: 600,
        color: '#000',
        '& .arrow-icon': { color: 'essentials.50' },
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

const PageNumbers = ({
  count = 1,
  boundaryCount = 1,
  defaultPage = 1,
  siblingCount = 1,
  useRouter = false,
  ...props
}: PageNumberProps) => {
  return (
    <Pagination
      sx={{ fontFamily: 'Montserrat' }}
      count={count}
      boundaryCount={boundaryCount}
      defaultPage={defaultPage}
      siblingCount={siblingCount}
      renderItem={(item) => {
        let totalProps: { [k: string]: any } = item
        if (useRouter) {
          totalProps['component'] = RouterLink
          totalProps['to'] = `?page=${item.page}`
        }
        return (
          <PaginationItem
            sx={{
              fontFamily: 'Montserrat',
              color: '#898992',
              fontWeight: 600,
              '&.Mui-selected': {
                backgroundColor: 'essentials.12',
                color: 'black',
              },
            }}
            components={{
              previous: BackButton,
              next: NextButton,
            }}
            {...totalProps}
          />
        )
      }}
      {...props}
    />
  )
}

export default PageNumbers
