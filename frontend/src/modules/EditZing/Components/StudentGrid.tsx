import { useState } from 'react'
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
import { Checkbox, Box, Typography } from '@mui/material'
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
    width: 112px;
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
  handleAddStudent,
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

  const [isHovering, setIsHovering] = useState(false)
  const [selected, setSelected] = useState(false)
  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAddStudent(student.email, e.target.checked)
    setSelected(!selected)
  }

  const opacity = isDragging ? '0' : '1.0'

  return (
    <Grid item xs={xsSize} sx={{ minWidth: '112px' }}>
      <div ref={drag}>
        <Paper
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}
          style={{ opacity: opacity }}
          sx={{
            padding: '10px',
            background: selected ? 'rgba(129, 94, 212, 0.15)' : '#FBF9FF',
            border: '0.25px solid #C0AEEA',
            fontFamily: 'Montserrat',
            fontWeight: '700',
            fontSize: '14',
            boxShadow: '0px 2px 5px rgba(205, 156, 242, 0.2)',
            borderRadius: '10px',
            width: '100%',
          }}
        >
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
            <Box
              sx={{
                display: 'flex',
                flexFlow: 'row nowrap',
                gap: '13px',
                position: 'relative',
              }}
            >
              <Box sx={{ width: '90%' }}>
                <Typography sx={{ fontWeight: '800', fontSize: '0.875rem' }}>
                  {student.name}
                </Typography>
                <Typography sx={{ fontWeight: '400', fontSize: '0.875rem' }}>
                  {student.email.replace('@cornell.edu', '')}
                </Typography>
                <Typography sx={{ fontWeight: '400', fontSize: '0.875rem' }}>
                  {student.year}
                </Typography>
              </Box>

              <Checkbox
                color="secondary"
                checked={selected}
                onChange={handleChecked}
                sx={{
                  display: selected || isHovering ? '' : 'none',
                  width: '20px',
                  height: '20px',
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                }}
              />
            </Box>
          </Tooltip>
        </Paper>
      </div>
    </Grid>
  )
}
