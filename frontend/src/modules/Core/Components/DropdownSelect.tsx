import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  Select,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { DropdownSelectProps } from '@core'

export const DropdownSelect = ({
  minWidth = 300,
  margin = 'normal',
  size = 'medium',
  helperText,
  children,
  fullWidth,
  disabled,
  ...props
}: DropdownSelectProps) => {
  return (
    <FormControl
      sx={{ minWidth: minWidth, ...props.sx }}
      fullWidth={fullWidth}
      disabled={disabled}
      hiddenLabel
      margin={margin}
      size={size}
    >
      <Select
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        input={<OutlinedInput />}
        sx={{
          borderRadius: '6px',
          color: 'essentials.50',
          fontFamily: 'Montserrat',
          fontWeight: 600,
          px: 0.5,
          ...props.inputSx,
        }}
        MenuProps={{
          MenuListProps: {
            dense: true,
            sx: {
              borderRadius: '10px',
              '& .MuiMenuItem-root': {
                fontFamily: 'Montserrat',
                '&:hover': {
                  bgcolor: 'purple.16',
                },
              },
            },
          },
        }}
        {...props}
      >
        {children}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
