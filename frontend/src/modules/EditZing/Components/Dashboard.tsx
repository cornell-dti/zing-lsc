import React from 'react'
import Grid from '@material-ui/core/Grid'
import { StyledContainer } from 'EditZing/Styles/DashboardStyle.style'
import { GroupGrid } from 'EditZing/UIElements/GroupGrid'
import { Student } from 'EditZing/Types/Student'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, useDrag } from 'react-dnd'

export const Dashboard = () => {
  const fakeStudentGroups: Student[][] = require('EditZing/fakeData.json')
  return (
    <StyledContainer>
      <Grid container spacing={1}>
        {fakeStudentGroups.map((fakeStudentGroup, index) => (
          <DndProvider backend={HTML5Backend}>
            <GroupGrid
              key={index}
              studentList={fakeStudentGroup}
              groupNumber={index}
            />
          </DndProvider>
        ))}
      </Grid>
    </StyledContainer>
  )
}
