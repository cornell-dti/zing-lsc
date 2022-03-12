import React from 'react'
import Grid from '@mui/material/Grid'

import {
  StyledContainer,
  StyledGroupArea,
  StyledGroupCardArea,
  StyledTextBox,
  StyledSmallText,
  StyledClassesContainer,
  StyledNoClasses,
} from 'Dashboard/Styles/Groups.style'

import { GroupCard } from 'Dashboard/Components/GroupCard'
import { CourseInfo } from 'Dashboard/Types/CourseInfo'

export const Groups = ({ groups }: GroupsProps) => {
  return (
    <StyledContainer>
      {groups.length === 0 && (
        <React.Fragment>
          <StyledTextBox>
            <h2>No Classes to Show</h2>
          </StyledTextBox>
          <StyledSmallText>
            Once students request study partners, they'll automatically be
            placed into classes on this page!
          </StyledSmallText>
          <StyledClassesContainer>
            {[...Array(8)].map(() => (
              <StyledNoClasses />
            ))}
          </StyledClassesContainer>
        </React.Fragment>
      )}
      <StyledGroupArea>
        <StyledGroupCardArea>
          <Grid container xs={10.5}>
            {groups.map((g, i) => (
              <Grid item xs={3}>
                <GroupCard
                  key={i}
                  id={g.courseId}
                  name={g.names[0]}
                  newStudents={g.unmatched.length}
                  groupsFormed={g.lastGroupNumber}
                />
              </Grid>
            ))}
          </Grid>
        </StyledGroupCardArea>
      </StyledGroupArea>
    </StyledContainer>
  )
}

interface GroupsProps {
  groups: CourseInfo[]
}
