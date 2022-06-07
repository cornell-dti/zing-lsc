import React from 'react'

import {
  StyledContainer,
  StyledCoursesWrapper,
  StyledQuestionText,
  StyledWarningText,
} from 'Survey/Styles/StepCourse.style'
import { InputField } from '@core/Components'
import { colors } from '@core/Constants'
import { StepCourseProps } from 'Survey/Types'

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
      <StyledQuestionText>
        What course(s) would you like to find study partners for?
      </StyledQuestionText>
      <StyledWarningText>
        * You do not need to submit the cross-listed version of the same course
        more than once
      </StyledWarningText>

      <StyledCoursesWrapper>
        {courses.map((course, index) => (
          <InputField
            inputStyle={textInputStyle}
            key={String(index)}
            value={course}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateCourse(index, e.target.value)
            }
            error={
              !validCourseRe.test(course) ? 'Must be of the form ABC 1100' : ''
            }
          />
        ))}
        <InputField
          inputStyle={textInputStyle}
          key={Math.random().toString()}
          placeholder={placeholder}
          value={''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            addCourse(e.target.value)
          }
        />
      </StyledCoursesWrapper>
    </StyledContainer>
  )
}
