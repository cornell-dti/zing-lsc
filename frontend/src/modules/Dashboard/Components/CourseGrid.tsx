import React, { useState } from 'react'

import {
  StyledTextBox,
  StyledSmallText,
  StyledClassesContainer,
  StyledNoClasses,
} from 'Dashboard/Styles/Groups.style'

import { CourseCard } from 'Dashboard/Components/CourseCard'
import { Box } from '@mui/material'
import { Course } from '@core/Types'
import { useCourseValue } from '@context/CourseContext'

export const CourseGrid = ({ courses }: CourseGridProps) => {
  const { updateFlagged } = useCourseValue()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      {courses.length === 0 ? (
        <>
          <StyledTextBox>
            <h2>No Courses to Show</h2>
          </StyledTextBox>
          <StyledSmallText>
            Once students request study partners, they'll automatically be
            placed into courses on this page!
          </StyledSmallText>
          <StyledClassesContainer>
            {[...Array(8)].map((_, i) => (
              <StyledNoClasses key={i} />
            ))}
          </StyledClassesContainer>
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            justifyContent: 'center',
            gap: 4,
            gridTemplateColumns: 'repeat(auto-fill, 300px)',
            px: 10,
            py: 4,
          }}
        >
          {courses.map((c) => {
            return (
              <CourseCard
                key={c.courseId}
                id={c.courseId}
                name={c.names[0]}
                newStudents={c.unmatched.length}
                groupsFormed={c.lastGroupNumber}
                flagged={c.flagged == null ? false : c.flagged} // null to guard for current courses without a flag field
                updateFlagged={updateFlagged}
              />
            )
          })}
        </Box>
      )}
    </Box>
  )
}

interface CourseGridProps {
  courses: Course[]
}
