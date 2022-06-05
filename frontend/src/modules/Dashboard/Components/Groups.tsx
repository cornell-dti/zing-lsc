import React from 'react'

import {
  StyledTextBox,
  StyledSmallText,
  StyledClassesContainer,
  StyledNoClasses,
} from 'Dashboard/Styles/Groups.style'

import { GroupCard } from 'Dashboard/Components/GroupCard'
import { CourseInfo } from 'Dashboard/Types/CourseInfo'
import { Box } from '@mui/material'

export const Groups = ({ groups }: GroupsProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      {groups.length === 0 ? (
        <>
          <StyledTextBox>
            <h2>No Classes to Show</h2>
          </StyledTextBox>
          <StyledSmallText>
            Once students request study partners, they'll automatically be
            placed into classes on this page!
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
          {groups.map((g) => (
            <GroupCard
              key={g.courseId}
              id={g.courseId}
              name={g.names[0]}
              newStudents={g.unmatched.length}
              groupsFormed={g.lastGroupNumber}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

interface GroupsProps {
  groups: CourseInfo[]
}
