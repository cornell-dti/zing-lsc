import { Box, CircularProgress, Fade } from '@mui/material'
import React from 'react'

// meant to show when the route is loading with the information it needs
// 800 ms delay, as no special feedback (loading) is needed before then.
export const RouteLoading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Fade
      in={isLoading}
      style={{
        transitionDelay: isLoading ? '800ms' : '0ms',
      }}
      unmountOnExit
    >
      <Box display="flex" justifyContent="center" padding={6}>
        <CircularProgress size={50} />
      </Box>
    </Fade>
  )
}
