import React from 'react'

import {
  StyledContainer,
  StyledCoursesWrapper,
  StyledQuestionSubtext,
  StyledQuestionText,
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

  const updateCourse = (index: number, newValue: string) => {
    if (newValue) {
      setCourses(courses.map((course, i) => (index === i ? newValue : course)))
    } else {
      setCourses(courses.filter((_, i) => index !== i))
    }
  }

  const addCourse = (newValue: string) => {
    if (newValue) {
      setCourses([...courses, newValue])
    }
  }

  const placeholder =
    courses.length === 0 ? 'ABC 1100' : '+ Add another course...'

  return (
    <StyledContainer>
      <StyledQuestionText>
        What course(s) would you like to find study partners for?
        <StyledQuestionSubtext>
          (Cross-listed courses will only be counted once)
        </StyledQuestionSubtext>
      </StyledQuestionText>
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
