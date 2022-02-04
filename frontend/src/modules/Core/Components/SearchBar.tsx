import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { SearchBarProps } from '@core'

// insert the correct props here
const SearchBar = ({
  size = 'small',
  margin = 'none',
  minWidth,
  ...props
}: SearchBarProps) => {
  return (
    <TextField
      variant="outlined"
      sx={{
        minWidth: minWidth ? minWidth : 'initial',
      }}
      InputProps={{
        placeholder: 'Search...',
        sx: {
          py: 0.5,
          borderRadius: '40px',
          borderColor: 'essentials.25',
          color: 'essentials.50',
          fontFamily: 'Montserrat',
          '& .MuiOutlinedInput-input::placeholder': {
            fontWeight: 600,
          },
        },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      size={size}
      margin={margin}
      {...props}
    />
  )
}

export default SearchBar
