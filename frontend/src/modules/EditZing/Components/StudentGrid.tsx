import React from 'react'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { STUDENT_TYPE } from 'EditZing/Types/Student'
import { StudentGridProps } from 'EditZing/Types/ComponentProps'
// import { genderSVG } from 'EditZing/Styles/InlineSVGs'
import { colors } from '@core'
import { useDrag } from 'react-dnd'
import {
  StyledStudentDetail,
  StyledStudentText,
} from 'EditZing/Styles/StudentAndGroup.style'
import Tooltip from '@mui/material/Tooltip'

const PREFIX = 'StudentGrid'

const classes = {
  paper1: `${PREFIX}-paper1`,
  paper2: `${PREFIX}-paper2`,
}

// should we make it so that when it overflows, then the user can scroll?
const StyledGrid = styled(Grid)(
  ({ theme }) => `
  & .${classes.paper1} {
    padding: ${theme.spacing(2)};
    text-align: left;
    color: ${colors.black};
    font-family: 'Montserrat';
    font-weight: 700;
    font-size: 14;
    border: 0px solid rgba(205, 156, 242, 0.15);
    box-shadow: 0px 2px 5px rgba(205, 156, 242, 0.2);
    border-radius: 10px;
    //overflow-x: scroll;
  }

  & .${classes.paper2} {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
  }
`
)

/** the equivalent of MoveableItem */
export const StudentGrid = ({
  student,
  groupNumber,
  xsSize = 6,
  submissionTime,
}: StudentGridProps) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: STUDENT_TYPE,
      groupNumber: groupNumber,
      studentToMove: student,
    },
    type: STUDENT_TYPE,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? '0' : '1.0'

  return (
    <StyledGrid item xs={xsSize}>
      <div ref={drag}>
        <Paper style={{ opacity: opacity }} className={classes.paper1}>
          <Tooltip
            disableFocusListener
            disableTouchListener
            title={
              'Requested study partner ' +
              (submissionTime.getMonth() + 1) +
              '/' +
              submissionTime.getDate()
            }
          >
            <StyledStudentText>{student.name}</StyledStudentText>
          </Tooltip>
          <div className={classes.paper2}>
            {/* {genderSVG} {student.pronoun === 'a' ? 'Male' : 'Female'} */}
            <StyledStudentDetail>{student.email}</StyledStudentDetail>
            <StyledStudentDetail>{student.year}</StyledStudentDetail>
          </div>
        </Paper>
      </div>
    </StyledGrid>
  )
}
