import { Box, CircularProgress, Fade, Typography } from '@mui/material'
import React from 'react'

// meant to show when the route is loading with the information it needs
// 800 ms delay, as no special feedback (loading) is needed before then.
export const RouteLoading = ({
  isLoading,
  hasLoadedCourses,
  hasLoadedStudents,
}: {
  isLoading: boolean
  hasLoadedCourses?: boolean
  hasLoadedStudents?: boolean
}) => {
  return (
    <Fade
      in={isLoading}
      style={{
        transitionDelay: isLoading ? '800ms' : '0ms',
      }}
      unmountOnExit
    >
      <Box
        display="flex"
        alignItems="center"
        padding={6}
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={50} />
        {hasLoadedCourses !== undefined && hasLoadedCourses ? (
          <Typography>Loaded courses ✅</Typography>
        ) : (
          <Typography>Loading courses ⏳</Typography>
        )}
        {hasLoadedStudents !== undefined && hasLoadedStudents ? (
          <Typography>Loaded students ✅</Typography>
        ) : (
          <Typography>Loading students ⏳</Typography>
        )}
      </Box>
    </Fade>
  )
}
