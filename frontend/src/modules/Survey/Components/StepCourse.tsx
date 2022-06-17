import React from 'react'

import {
  StyledContainer,
  StyledCoursesWrapper,
  StyledQuestionText,
  StyledWarningText,
} from 'Survey/Styles/StepCourse.style'
import { StyledLabelText } from 'Survey/Styles/Survey.style'

import { InputField } from '@core/Components'
import { colors } from '@core/Constants'
import { StepCourseProps } from 'Survey/Types'
import { InputLabel, TextField, FormControl } from '@mui/material'

export const StepCourse = ({
  validCourseRe,
  courses,
  setCourses,
}: StepCourseProps) => {
  const textInputStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: colors.darkpurple,
  }

  const textFieldStyle = {
    marginBottom: '1rem',
    input: { color: 'purple.120', fontSize: '24px', fontWeight: '500' },
    '& .MuiInput-underline:before': { borderBottomColor: 'purple.75' },
  }

  const cleanInput = (courseName: string) => {
    return courseName.toUpperCase().trim()
  }

  const updateCourse = (index: number, newValue: string) => {
    if (newValue) {
      setCourses(
        courses.map((course, i) =>
          index === i ? cleanInput(newValue) : course
        )
      )
    } else {
      setCourses(courses.filter((_, i) => index !== i))
    }
  }

  const addCourse = (newValue: string) => {
    if (newValue) {
      setCourses([...courses, cleanInput(newValue)])
    }
  }

  const placeholder =
    courses.length === 0 ? 'ABC 1100' : '+ Add another course...'

  return (
    <StyledContainer>
      <main>
        <StyledQuestionText>
          What course(s) would you like to find study partners for?
        </StyledQuestionText>

        <StyledWarningText>
          * You do not need to submit the cross-listed version of the same
          course more than once
        </StyledWarningText>
        <StyledCoursesWrapper>
          {courses.map((course, index) => (
            <TextField
              id={`course ${index} name field`}
              key={String(index)}
              placeholder={placeholder}
              value={course}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateCourse(index, e.target.value)
              }
              helperText={
                !validCourseRe.test(course)
                  ? 'Must be of the form ABC 1100'
                  : ''
              }
              variant="standard"
              sx={textFieldStyle}
              FormHelperTextProps={{
                style: {
                  color: '#f52c54',
                },
              }}
            />
            // <InputField
            //   inputStyle={textInputStyle}
            //   key={String(index)}
            //   value={course}
            //   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //     updateCourse(index, e.target.value)
            //   }
            //   error={
            //     !validCourseRe.test(course)
            //       ? 'Must be of the form ABC 1100'
            //       : ''
            //   }
            // />
          ))}
          <InputLabel htmlFor="course name field">
            <StyledLabelText> Course Name: </StyledLabelText>
          </InputLabel>
          {/* <InputField
            id="course name field"
            inputStyle={textInputStyle}
            key={Math.random().toString()}
            placeholder={placeholder}
            value={''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              addCourse(e.target.value)
            }
          /> */}
          <TextField
            id="course name field"
            key={Math.random().toString()}
            placeholder={placeholder}
            value={''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              addCourse(e.target.value)
            }
            variant="standard"
            sx={textFieldStyle}
            FormHelperTextProps={{
              style: {
                color: 'red',
              },
            }}
          />
        </StyledCoursesWrapper>
      </main>
    </StyledContainer>
  )
}
