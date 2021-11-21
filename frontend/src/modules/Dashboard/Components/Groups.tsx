// export { }
import React from 'react'

import {
  StyledContainer,
  StyledGroupArea,
  StyledGroupCardArea,
  StyledTextBox,
  StyledSmallText,
  StyledClassesContainer,
  StyledNoClasses,
} from 'Dashboard/Styles/Groups.style'

import { GroupCard } from 'Dashboard/Components/GroupCard'
import { CourseInfo } from 'Dashboard/Types'

export const Groups = ({ groups }: ModalProps & GroupsProps) => {
  return (
    <StyledContainer>
      {groups.length === 0 && (
        <React.Fragment>
          <StyledTextBox>
            <h2>No Classes to Show</h2>
          </StyledTextBox>
          <StyledSmallText>
            Once students request study partners, they'll automatically be
            placed into classes on this page!
          </StyledSmallText>
          <StyledClassesContainer>
            <StyledNoClasses />
            <StyledNoClasses />
            <StyledNoClasses />
            <StyledNoClasses />
            <StyledNoClasses />
            <StyledNoClasses />
            <StyledNoClasses />
            <StyledNoClasses />
          </StyledClassesContainer>
        </React.Fragment>
      )}
      <StyledGroupArea>
        <StyledGroupCardArea>
          {groups.map((g, i) => (
            <GroupCard
              key={i}
              id={g.courseId}
              name={g.name}
              submitted={300}
              total={300}
              deadline={new Date(g.dueDateStr)}
            />
          ))}
        </StyledGroupCardArea>
      </StyledGroupArea>
    </StyledContainer>
  )
}

interface ModalProps {
  toggleModalOpen: () => void
}

interface GroupsProps {
  groups: CourseInfo[]
}
