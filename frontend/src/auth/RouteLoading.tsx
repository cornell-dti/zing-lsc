import { Box, CircularProgress, Fade, Typography } from '@mui/material'
import React from 'react'

// meant to show when the route is loading with the information it needs
// 800 ms delay, as no special feedback (loading) is needed before then.
export const RouteLoading = ({
  isLoading,
  hasLoadedCourses,
  hasLoadedStudents,
  hasLoadedTemplates,
  hasLoadedAdministrators,
  hasLoadedCurrRoster,
  hasLoadedSurveyState,
}: {
  isLoading: boolean
  hasLoadedCourses?: boolean
  hasLoadedStudents?: boolean
  hasLoadedTemplates?: boolean
  hasLoadedAdministrators?: boolean
  hasLoadedCurrRoster?: boolean
  hasLoadedSurveyState?: boolean
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
        {hasLoadedTemplates !== undefined && hasLoadedTemplates ? (
          <Typography>Loaded templates ✅</Typography>
        ) : (
          <Typography>Loading templates ⏳</Typography>
        )}
        {hasLoadedAdministrators !== undefined && hasLoadedAdministrators ? (
          <Typography>Loaded administrators ✅</Typography>
        ) : (
          <Typography>Loading administrators ⏳</Typography>
        )}
        {hasLoadedCurrRoster !== undefined && hasLoadedCurrRoster ? (
          <Typography>Loaded current semester ✅</Typography>
        ) : (
          <Typography>Loading current semester ⏳</Typography>
        )}
        {hasLoadedSurveyState !== undefined && hasLoadedSurveyState ? (
          <Typography>Loaded survey status ✅</Typography>
        ) : (
          <Typography>Loading survey status ⏳</Typography>
        )}
      </Box>
    </Fade>
  )
}
