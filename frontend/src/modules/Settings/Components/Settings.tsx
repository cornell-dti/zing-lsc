import { DropdownSelect } from '@core/index'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  SelectChangeEvent,
  Switch,
  TextField,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DASHBOARD_PATH } from '@core/index'
import { ReactComponent as LogoImg } from '@assets/img/lscicon.svg'
import { AccountMenu } from 'Dashboard/Components/AccountMenu'
import { API_ROOT, COURSE_API } from '@core/Constants'
import { AdministratorsTable } from './AdministratorsTable'
import { Admin } from './types'
import axios from 'axios'

const semesterKeys: string[] = ['WI', 'SP', 'SU', 'FA']

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
    axios
      .get(`${API_ROOT}${COURSE_API}/semester/all`)
      .then((res) => setSemesters(res.data))
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
        setSemesters(semesters.concat(selectedSeason + year))
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
        pl: '5rem',
        pr: '5rem',
        display: 'flex',
        flexDirection: 'column',
      }}
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
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '70%', display: 'grid' }}>
            <Box sx={{ typography: 'h4', fontWeight: 'bold' }}>Semester</Box>
            <Box sx={{ typography: 'h5' }}>Current Semester:</Box>
            <DropdownSelect
              value={currRoster}
              onChange={changeCurrRoster}
              sx={{
                alignContent: 'right',
                right: '1px',
              }}
            >
              {semesters.map((sem) => (
                <MenuItem key={sem} value={sem}>
                  {sem}
                </MenuItem>
              ))}
            </DropdownSelect>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <DropdownSelect
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
              <Button onClick={addSemester}>Add semester</Button>
            </Box>
          </Box>
          <Box
            sx={{
              height: 'fit-content',
              padding: '2.5rem',
              display: 'grid',
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
              checked={surveyState}
              onChange={changeSurveyAvailability}
              sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
                size: 'lg',
                top: '1.9rem',
                scale: '1.8',
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1rem',
          pl: '5rem',
        }}
      >
        <Box
          sx={{
            typography: 'h4',
            fontWeight: 'bold',
            left: '90rem',
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
