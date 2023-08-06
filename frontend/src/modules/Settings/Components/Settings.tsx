import { DropdownSelect } from '@core'
import {
  Box,
  Button,
  Grid,
  IconButton,
  SelectChangeEvent,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { DASHBOARD_PATH } from '@core'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import { AccountMenu } from 'Dashboard/Components/AccountMenu'
import { AdministratorsTable } from './AdministratorsTable'
import AddAdminModal from './AddAdminModal'
import { useSettingsValue } from '@context/SettingsContext'
import { useCourseValue } from '@context/CourseContext'

export const Settings = () => {
  const {
    currRoster,
    surveyState,
    administrators,
    semesterAdded,
    setCurrRoster,
    changeCurrRoster,
    changeSurveyAvailability,
    removeAdmin,
    addAdmin,
    addSemester,
    setSemesterAdded,
  } = useSettingsValue()

  const semesterKeys: string[] = ['WI', 'SP', 'SU', 'FA']

  const { semesters } = useCourseValue()

  const [selectedSeason, setSelectedSeason] = useState<string>('WI')
  const [year, setYear] = useState<string>(
    String(new Date().getFullYear()).substring(2, 4)
  )

  const [openAddAdmin, setOpenAddAdmin] = useState(false)
  const handleAddAdmin = () => {
    setOpenAddAdmin(true)
  }
  const handleCloseAdmin = () => setOpenAddAdmin(false)

  return (
    <Box
      sx={{
        p: '0 5%',
      }}
    >
      <AddAdminModal
        open={openAddAdmin}
        handleClose={handleCloseAdmin}
        addAdmin={addAdmin}
      />
      <Box
        sx={{
          width: '100%',
          height: 'fit-content',
          padding: '2.5rem 0',
          display: 'flex',
          flexFlow: 'row wrap',
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
      <Box sx={{ typography: 'h2', fontWeight: 'bold', p: '24px 0' }}>
        Settings
      </Box>
      <Grid container spacing={2}>
        <Grid
          item
          md={6}
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'left',
            gap: '12px',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ typography: 'h6', fontWeight: '700', width: '100%' }}>
              Current Semester
            </Box>
            <Typography sx={{ width: '100%', maxWidth: '625px' }}>
              Changing the current semester here will change the semester that
              the survey students submit to and the default viewing semester for
              all users.
            </Typography>
            <DropdownSelect
              value={currRoster}
              onChange={changeCurrRoster}
              sx={{
                width: '100%',
                maxWidth: '600px',
              }}
            >
              {semesters.map((sem) => (
                <MenuItem key={sem} value={sem}>
                  {sem}
                </MenuItem>
              ))}
            </DropdownSelect>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ typography: 'h6', fontWeight: '700', width: '100%' }}>
              New Semester
            </Box>
            <Typography sx={{ width: '100%', maxWidth: '625px' }}>
              This will add a new semester from the list of semesters you can
              change to.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexFlow: 'row wrap',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <DropdownSelect
                sx={{ mb: '8px' }}
                value={selectedSeason}
                onChange={(event: SelectChangeEvent) => {
                  setSelectedSeason(event.target.value)
                }}
              >
                {semesterKeys.map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </DropdownSelect>
              <TextField
                label="Year"
                variant="outlined"
                type={'number'}
                value={year}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setYear(event.target.value)
                }}
              />
              <IconButton onClick={() => addSemester(selectedSeason, year)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          md={6}
          sx={{
            height: 'fit-content',
            display: 'flex',
            flexFlow: 'column nowrap',
          }}
        >
          <Box
            sx={{
              typography: 'h6',
              fontWeight: '700',
              width: '100%',
            }}
          >
            Survey Status
          </Box>
          <Typography sx={{ width: '100%', maxWidth: '625px', mb: '8px' }}>
            This setting turns off and on the survey that students can fill out
            to request new study partners.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'row nowrap',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <Typography> Off </Typography>
            <Switch
              checked={surveyState}
              onChange={changeSurveyAvailability}
              sx={{
                size: 'lg',
                scale: '1.8',
              }}
            />
            <Typography> On </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          width: '100%',
          height: 'fit-content',
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            typography: 'h4',
            fontWeight: 'bold',
            pt: '3rem',
          }}
        >
          Administrators
        </Box>
        <AdministratorsTable data={administrators} removeAdmin={removeAdmin} />
        <Box my={5} px={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => handleAddAdmin()}>Add Admin</Button>
        </Box>
      </Box>
      <Snackbar
        open={semesterAdded}
        autoHideDuration={6000}
        onClose={() => setSemesterAdded(false)}
        message="Successfully added semester!"
      />
    </Box>
  )
}
