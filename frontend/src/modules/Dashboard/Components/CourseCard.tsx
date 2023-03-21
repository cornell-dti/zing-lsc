import React, { useEffect, useState } from 'react'
import { API_ROOT, colors, COURSE_API, EDIT_ZING_PATH } from '@core'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import { ReactComponent as NewlyMatchableIcon } from '@assets/img/newlymatchable.svg'
import { ReactComponent as GroupsIcon } from '@assets/img/groupsicon.svg'
import { ReactComponent as PlusIcon } from '@assets/img/plusicon.svg'
import { ReactComponent as WarningIcon } from '@assets/img/warning.svg'
import { useHistory } from 'react-router'
import { defaultSortingOrder, defaultFilterOption } from './Dashboard'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import axios from 'axios'

export const CourseCard = ({
  id,
  name,
  newStudents,
  groupsFormed,
  flagged,
}: CourseCardProps) => {
  const history = useHistory()
  const handleClickView = () => {
    const state = history.location.state as any
    history.push({
      pathname: `${EDIT_ZING_PATH}/${id}`,
      state: {
        sortedOrder: state?.sortedOrder
          ? state.sortedOrder
          : defaultSortingOrder,
        filterOption: state?.filterOption
          ? state.filterOption
          : defaultFilterOption,
      },
    })
  }

  const [flag, setFlag] = useState(flagged)

  useEffect(() => {
    console.log(flag)
  }, [flag])

  const handleSetFlag = () => {
    axios.post(`${API_ROOT}${COURSE_API}/flagged`, {
      flagged: !flagged,
      courseId: id,
    })
    setFlag(!flag)
  }

  // returns color of background, button, and if newly matchable
  function getColor(students: number, groups: number) {
    //all students are matched
    if (students === 0 && groups > 0) {
      return { color: colors.white, new_match: 'no' }
    }
    //students are ready to be matched
    else if (students > 0 && groups > 0) {
      return { color: colors.lightgreen, new_match: 'no' }
    }
    //NEWLY MATCHABLE
    else if (students > 1 && groups === 0) {
      return { color: colors.lightgreen, new_match: 'yes' }
    }
    //only 1 student & 0 groups formed
    else return { color: colors.yellow, new_match: 'no' }
  }
  const styleMap = getColor(newStudents, groupsFormed)

  return (
    <Box
      sx={{
        width: 300,
        height: 300,
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        position: 'relative', // Needed to use absolute positioning for Newly Matchable
      }}
    >
      {styleMap.new_match === 'yes' && (
        <Box sx={{ position: 'absolute', top: 24 }}>
          <NewlyMatchableIcon />
        </Box>
      )}
      <Typography variant="h4" fontWeight={600}>
        {name}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: styleMap.color,
          }}
        >
          {newStudents === 1 ? <WarningIcon /> : <PlusIcon />}
          <Typography>
            {newStudents} {newStudents === 1 ? 'New Student' : 'New Students'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GroupsIcon />
          <Typography>
            {groupsFormed}{' '}
            {groupsFormed === 1 ? 'Group Formed' : 'Groups Formed'}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" gap={2}>
        <Button
          onClick={handleClickView}
          sx={{ boxShadow: 2 }}
          color="secondary"
          variant="outlined"
        >
          View
        </Button>
        {/* {newStudents > 1 && <Button>Match</Button>} hidden for summer launch */}
        <Checkbox
          checked={flag}
          icon={<BookmarkBorderIcon />}
          checkedIcon={<BookmarkIcon />}
          // onClick={() => updateFlaggedCourses(id)}
          onClick={() => handleSetFlag()}
        />
      </Box>
    </Box>
  )
}

interface CourseCardProps {
  id: string
  name: string
  newStudents: number
  groupsFormed: number
  flagged: boolean
}
