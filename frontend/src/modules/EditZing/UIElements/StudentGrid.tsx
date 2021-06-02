import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { Student } from 'EditZing/Types/Student'
import { StudentGridProps } from 'EditZing/Types/ComponentProps'
import { colors, montserratFont } from '@core'

import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: colors.black,
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
  })
)

export const StudentGrid = ({ student }: StudentGridProps) => {
  const classes = useStyles()

  // const [{ isDragging }, drag] = useDrag({
  //   item: { name: { student }, type: 'Student' },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // })

  // const opacity = isDragging ? 0.4 : 1

  return (
    <React.Fragment>
      <Grid item xs={6}>
        <Paper className={classes.paper}>{student.fullName}</Paper>
      </Grid>
    </React.Fragment>
  )
}
