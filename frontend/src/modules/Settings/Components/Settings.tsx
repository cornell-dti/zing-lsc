import { DropdownSelect } from '@core'
import {
  Box,
  Grid,
  IconButton,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DASHBOARD_PATH } from '@core'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import { AccountMenu } from 'Dashboard/Components/AccountMenu'
import { API_ROOT, COURSE_API } from '@core/Constants'
import { AdministratorsTable } from './AdministratorsTable'
import { Admin } from './types'
import axios from 'axios'

const semesterKeys: string[] = ['WI', 'SP', 'SU', 'FA']
const semValueMap = new Map([
  ['WI', 0],
  ['SP', 1],
  ['SU', 2],
  ['FA', 3],
])

const sortSemesters = (a: string, b: string) => {
  const aSemPrefix = a.substring(0, 2)
  const bSemPrefix = b.substring(0, 2)
  const aSemYear = Number(a.substring(2))
  const bSemYear = Number(b.substring(2))
  return (
    aSemYear - bSemYear ||
    semValueMap.get(aSemPrefix)! - semValueMap.get(bSemPrefix)!
  )
}

export const Settings = () => {
  const [currRoster, setCurrRoster] = useState<string>('')
  const changeCurrRoster = async (event: SelectChangeEvent) => {
    // function to only open the survey of the semester
    setCurrRoster(event.target.value)
    await axios.post(`${API_ROOT}${COURSE_API}/semester/current`, {
      semester: event.target.value,
    })
  }

  const [selectedSeason, setSelectedSeason] = useState<string>('WI')
  const [year, setYear] = useState<string>(
    String(new Date().getFullYear()).substring(2, 4)
  )

  const [semesters, setSemesters] = useState<string[]>([])
  const [surveyState, setSurveyState] = useState<boolean>(false)
  const getAllSemesters = async () => {
    axios.get(`${API_ROOT}${COURSE_API}/semester/all`).then((res) => {
      setSemesters(res.data.sort(sortSemesters))
    })
  }

  const getCurrSurveyState = async () => {
    await axios.get(`${API_ROOT}${COURSE_API}/semester/survey`).then((req) => {
      setSurveyState(req.data)
    })
  }

  const getCurrSemester = async () => {
    await axios.get(`${API_ROOT}${COURSE_API}/semester/current`).then((req) => {
      setCurrRoster(req.data)
    })
  }

  const addSemester = () => {
    axios
      .post(`${API_ROOT}/global/semester`, {
        semester: selectedSeason + year,
      })
      .then(() => {
        const sem = selectedSeason + year
        setSemesters(
          semesters.indexOf(sem) === -1
            ? semesters.concat(selectedSeason + year).sort(sortSemesters)
            : semesters
        )
      })
      .catch((err) => console.log(err))
  }

  const changeSurveyAvailability = async () => {
    axios.post(`${API_ROOT}${COURSE_API}/semester/survey`, {
      surveyOpen: !surveyState,
    })
    setSurveyState(!surveyState)
  }

  useEffect(() => {
    getAllSemesters()
    changeSurveyAvailability()
    getCurrSurveyState()
    getCurrSemester()
    getAdministrators()
  }, [])

  const [administrators, setAdministrators] = useState<Admin[]>([])

  const getAdministrators = async () => {
    await axios.get(`${API_ROOT}/admin`).then((req) => {
      setAdministrators(req.data)
    })
  }

  const removeAdmin = (admin: Admin) => {
    axios
      .delete(`${API_ROOT}/admin`, { data: admin })
      .then(() => {
        administrators.forEach((email, index) => {
          if ((email.email = admin.email)) {
            administrators.splice(index, 1)
            getAdministrators()
          }
        })
      })
      .catch((err) => console.log(err))
  }

  // TODO: allow to edit admin information
  const editAdmin = () => {}

  return (
    <Box
      sx={{
        p: '0 5%',
      }}
    >
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
              <IconButton onClick={addSemester}>
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
        <AdministratorsTable
          data={administrators}
          removeAdmin={removeAdmin}
          editAdmin={editAdmin}
        />
      </Box>
    </Box>
  )
}
