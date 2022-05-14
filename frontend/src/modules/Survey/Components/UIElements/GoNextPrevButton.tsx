import React from 'react'
import { IconButton, Box } from '@mui/material'

// import { Image } from '@core/Components/Button'
import { GoToButtonProps } from '@core/Types/FormFieldProps'

export const GoNextPrevButton = ({
  onClick,
  children,
  caption,
}: GoToButtonProps) => {
  const containerStyle = { textAlign: 'center' }

  return (
    <Box sx={containerStyle}>
      <IconButton onClick={onClick} color="secondary">
        {children}
      </IconButton>
      <br />
      {caption}
    </Box>
  )
}
