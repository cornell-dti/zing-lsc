import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { STUDENT_TYPE, DnDStudentTransferType } from 'EditZing/Types/Student'
import { StudentGridProps } from 'EditZing/Types/ComponentProps'
import { genderSVG } from 'EditZing/Styles/InlineSVGs'
import { colors } from '@core'
import { useDrop, useDrag } from 'react-dnd'

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
      fontWeight: 700,
      fontSize: 14,
      border: '0px solid rgba(205, 156, 242, 0.15)',
      boxShadow: '0px 2px 5px rgba(205, 156, 242, 0.2);',
      borderRadius: '10px',
    },
    paper2: {
      textAlign: 'left',
      color: colors.black,
      fontFamily: 'Montserrat',
      fontWeight: 400,
      fontSize: 14,
    },
  })
)

/** the equivalent of MoveableItem */
export const StudentGrid = ({
  student,
  groupIndex,
  studentIndex,
  moveStudentWithinGrid,
}: StudentGridProps) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: STUDENT_TYPE,
      groupIndex: groupIndex,
      studentIndex: studentIndex,
      studentToMove: student,
    },
    type: STUDENT_TYPE,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: STUDENT_TYPE,
    drop: (item: DnDStudentTransferType) => {
      moveStudentWithinGrid(item.studentToMove, groupIndex, studentIndex)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const classes = useStyles()

  function determineOpacity() {
    if (isDragging) {
      return '0'
    } else if (isOver) {
      return '0.9'
    } else {
      return '1.0'
    }
  }

  return (
    <Grid item xs={6} ref={drop}>
      <div ref={drag}>
        <Paper
          style={{
            opacity: determineOpacity(),
            background: isOver ? colors.lightviolet : colors.verylightviolet,
          }}
          className={classes.paper1}
        >
          {student.fullName}
          <div
            className={classes.paper2}
            style={{
              opacity: determineOpacity(),
              background: isOver ? colors.lightviolet : colors.verylightviolet,
            }}
          >
            {genderSVG} {student.pronoun === 'a' ? 'Male' : 'Female'}
          </div>
        </Paper>
      </div>
    </Grid>
  )
}
