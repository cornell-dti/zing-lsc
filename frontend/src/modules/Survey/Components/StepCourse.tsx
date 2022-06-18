import React, { useState } from 'react'

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
import { InputLabel, TextField } from '@mui/material'

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
    input: { color: 'purple.120', fontSize: '24px', fontWeight: '500' },
    '& .MuiInput-underline:before': { borderBottomColor: 'purple.75' },
  }

  const [nextCourse, setNextCourse] = useState('')

  const validCourseName = (name: string) => !name || validCourseRe.test(name)

  const helperText = (name: string) =>
    !validCourseName(name) ? 'Must be of the form ABC 1100' : ''

  const cleanInput = (courseName: string) => {
    return courseName.toUpperCase().trim()
  }
  // Update an existing course and auto-capitalize
  const updateCourse = (index: number, newValue: string) => {
    setCourses(
      courses.map((course, i) =>
        index === i ? newValue.toUpperCase() : course
      )
    )
  }

  // Called on blur, update existing course and trim or removes course if empty
  const finishUpdateCourse = (index: number, newValue: string) => {
    if (newValue) {
      setCourses(
        courses.map((course, i) =>
          index === i ? newValue.toUpperCase().trim() : course
        )
      )
    } else {
      setCourses(courses.filter((_, i) => index !== i))
    }
  }

  // Update the next course field and auto-capitalize as typing
  const updateNextCourse = (newValue: string) => {
    setNextCourse(newValue.toUpperCase())
  }

  // Called on blur, add next course if it's not empty and trims
  const finishNextCourse = (newValue: string) => {
    if (newValue) {
      setCourses([...courses, newValue.toUpperCase().trim()])
      setNextCourse('')
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
      <StyledQuestionText>
        What course(s) would you like to find study partners for?
      </StyledQuestionText>

      <StyledWarningText>
        * You do not need to submit the cross-listed version of the same course
        more than once
      </StyledWarningText>

      <StyledCoursesWrapper>
        {courses.map((course, index) => (
          <TextField
            inputProps={{ title: `course ${index} name field` }}
            key={String(index)}
            value={course}
            onChange={(e) => updateCourse(index, e.target.value)}
            onBlur={(e) => finishUpdateCourse(index, e.target.value)}
            error={!validCourseName(course)}
            helperText={helperText(course)}
            variant="standard"
            sx={textFieldStyle}
          />
        ))}
        <TextField
          inputProps={{ title: `course ${courses.length} name field` }}
          placeholder={placeholder}
          value={nextCourse}
          onChange={(e) => updateNextCourse(e.target.value)}
          onBlur={(e) => finishNextCourse(e.target.value)}
          error={!validCourseName(nextCourse)}
          helperText={helperText(nextCourse)}
          variant="standard"
          sx={textFieldStyle}
        />
      </StyledCoursesWrapper>
    </StyledContainer>
  )
}
