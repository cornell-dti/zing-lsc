// export { }
import React from 'react'

import {
  StyledContainer,
  StyledTitle,
  StyledGroupArea,
  StyledGroupCardArea,
  StyledText,
} from 'Dashboard/Styles/Groups.style'

import { GroupCard } from 'Dashboard/Components/GroupCard'
import { CourseInfo } from 'Dashboard/Types'

export const Groups = ({
  toggleModalOpen,
  groups,
}: ModalProps & GroupsProps) => {
  return (
    <StyledContainer>
      {groups.length === 0 && <StyledTitle>No classes to show</StyledTitle>}
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
        {groups.length === 0 && (
          <StyledText>Click "+" to create a new group.</StyledText>
        )}
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
