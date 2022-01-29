import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// insert the correct props here
const SearchBar = () => {
  return (
    <TextField
      size="small"
      variant="outlined"
      InputProps={{
        placeholder: 'Search...',
        sx: {
          py: 0.5,
          borderRadius: '40px',
          borderColor: '#B8B7BC',
          color: '#898992',
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
    />
  )
}

export default SearchBar
