import { DropdownSelect } from '@core/index'
import { Box, IconButton, SelectChangeEvent, Switch } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DASHBOARD_PATH } from '@core/index'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import { AccountMenu } from 'Dashboard/Components/AccountMenu'

export const Settings = () => {
  const [currRoster, setCurrRoster] = useState<string>('SP23')
  const semesters = ['SU22', 'FA22', 'WI23', 'SP23', 'SU23']
  const [surveyOpen, setSurveyOpen] = useState<boolean>(true)

  const changeCurrRoster = (event: SelectChangeEvent) => {
    // function to only open the survey of the semester
    setCurrRoster(event.target.value)
  }

  const changeSurveyAvailability = (event: SelectChangeEvent) => {
    setSurveyOpen(!surveyOpen)
    console.log(surveyOpen)
  }

  return (
    <Box
      sx={{ pl: '5rem', pr: '5rem', display: 'flex', flexDirection: 'column' }}
    >
      <Box
        sx={{
          width: '100%',
          height: 'fit-content',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          color="secondary"
          component={Link}
          to={{
            pathname: DASHBOARD_PATH,
          }}
          sx={{
            border: 'none',
            alignSelf: 'flex-start',
          }}
          disableRipple
          disableFocusRipple
        >
          <LogoImg />
        </IconButton>
        <AccountMenu
          selectedRoster={currRoster}
          setSelectedRoster={setCurrRoster}
          showMetricsLink={true}
          showDashboardLink={true}
          showSettingsLink={false}
        />
      </Box>
      <Box
        sx={{
          pl: '5rem',
          pr: '5rem',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        <Box sx={{ typography: 'h5' }}>Change Semester</Box>

        <DropdownSelect
          value={currRoster}
          onChange={changeCurrRoster}
          sx={{
            alignContent: 'right',
            right: '1px',
          }}
        >
          {semesters.map((sem) => (
            <MenuItem value={sem}>{sem}</MenuItem>
          ))}
        </DropdownSelect>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 'fit-content',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            pl: '2.5rem',
            pr: '2.5rem',
            display: 'grid',
            alignItems: 'center',
          }}
        >
          <Box sx={{ typography: 'h5', pr: '2rem' }}>Open Survey</Box>
        </Box>
        <Switch
          sx={{ right: '2rem' }}
          checked={!surveyOpen}
          onChange={changeSurveyAvailability}
        ></Switch>
      </Box>
    </Box>
  )
}
