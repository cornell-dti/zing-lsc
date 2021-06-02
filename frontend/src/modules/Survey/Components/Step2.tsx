import React, { useState } from 'react'
import { StyledContainer, StyledText } from 'Survey/Styles/Step2.style'

import { StudyHoursSlider } from 'Survey/Components/UIElements/StudyHoursSlider'

export const Step2 = () => {
  const [hours, setHours] = useState<number | number[]>(0)
  return (
    <StyledContainer>
      <StyledText>
        How much time do you spend on this course outside of class time, in
        hours per week?
      </StyledText>
      <StudyHoursSlider
        value={hours}
        onChange={(e, newVal) => setHours(newVal)}
      />
    </StyledContainer>
  )
}
