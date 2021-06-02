import React from 'react'
import { StudentGrid } from 'EditZing/UIElements/StudentGrid'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { GroupGridProps } from 'EditZing/Types/ComponentProps'
import { colors } from '@core'

import {
  StyledGroupText,
  StyledGroupTextWrapper,
} from 'EditZing/Styles/GeneralStyle.style'

export const GroupGrid = ({ studentList, groupNumber }: GroupGridProps) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
      },
    })
  )
  const GridStyle = {
    flexGrow: 1,
    width: '20rem',
    height: '19rem',
    background: '#FFFFFF',
    border: '0.5px solid rgba(205, 156, 242, 0.15)',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.07)',
    borderRadius: '20px',
    padding: '2rem',
    overflow: 'scroll',
  }
  const classes = useStyles()
  return (
    <Grid item xs={3} style={GridStyle}>
      <StyledGroupTextWrapper>
        <StyledGroupText>{'Group ' + String(groupNumber + 1)}</StyledGroupText>
      </StyledGroupTextWrapper>
      <Grid container spacing={3}>
        {studentList.map((student) => (
          <StudentGrid student={student} />
        ))}
      </Grid>
    </Grid>
  )
}
