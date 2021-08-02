import React from 'react'
import { StudentGrid } from 'EditZing/Components/StudentGrid'
import Grid from '@material-ui/core/Grid'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { useDrop } from 'react-dnd'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import {
  StyledGroupText,
  StyledGroupTextWrapper,
  StyledGroupContainer,
} from 'EditZing/Styles/StudentAndGroup.style'
import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tooltipPlacementBottom: {
      margin: 0,
    },
  })
)

/** the equivalent of Column */
export const GroupGrid = ({
  studentList,
  groupNumber,
  moveStudent,
}: GroupGridProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: STUDENT_TYPE,
    drop: (item: DnDStudentTransferType) => {
      moveStudent(item.studentToMove, item.groupNumber, groupNumber)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const classes = useStyles()

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <StyledGroupContainer
        ref={drop}
        style={{ opacity: isOver ? '0.6' : '1' }}
      >
        <StyledGroupTextWrapper>
          <Tooltip
            title={`Group ${groupNumber}: Matched on`}
            placement="bottom-start"
            classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}
          >
            <StyledGroupText>{'Group ' + String(groupNumber)}</StyledGroupText>
          </Tooltip>
        </StyledGroupTextWrapper>
        <Grid container spacing={2}>
          {studentList.map((student, index) => (
            <StudentGrid
              key={index}
              groupNumber={groupNumber}
              student={student}
            />
          ))}
        </Grid>
      </StyledGroupContainer>
    </Grid>
  )
}
