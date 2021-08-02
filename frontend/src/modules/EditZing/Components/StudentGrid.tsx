import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { STUDENT_TYPE } from 'EditZing/Types/Student'
import { StudentGridProps } from 'EditZing/Types/ComponentProps'
import { genderSVG } from 'EditZing/Styles/InlineSVGs'
import { colors } from '@core'
import { useDrag } from 'react-dnd'
import {
  StyledStudentDetail,
  StyledStudentName,
} from 'EditZing/Styles/StudentAndGroup.style'
import { Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper1: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: colors.black,
      fontFamily: 'Montserrat',
      fontSize: 14,
      border: '0px solid rgba(205, 156, 242, 0.15)',
      boxShadow: '0px 2px 5px rgba(205, 156, 242, 0.2);',
      borderRadius: '10px',
    },
    paper2: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      marginTop: '2px',
    },
    tooltipPlacementBottom: {
      margin: 0,
    },
  })
)

/** the equivalent of MoveableItem */
export const StudentGrid = ({
  student,
  groupNumber,
  xsSize = 6,
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

  const classes = useStyles()

  const opacity = isDragging ? '0' : '1.0'

  return (
    <Grid item xs={xsSize}>
      <div ref={drag}>
        <Paper style={{ opacity: opacity }} className={classes.paper1}>
          <Tooltip
            title={`${student.name} requested study partner`}
            placement="bottom-start"
            classes={{
              tooltipPlacementBottom: classes.tooltipPlacementBottom,
            }}
          >
            <StyledStudentName>{student.name}</StyledStudentName>
          </Tooltip>
          <div className={classes.paper2}>
            {/* {genderSVG} {student.pronoun === 'a' ? 'Male' : 'Female'} */}
            <StyledStudentDetail>{student.email}</StyledStudentDetail>
            <StyledStudentDetail>{student.year}</StyledStudentDetail>
          </div>
        </Paper>
      </div>
    </Grid>
  )
}
