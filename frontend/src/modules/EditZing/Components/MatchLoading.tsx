import { styled } from '@mui/material/styles'
import { Backdrop, CircularProgress, Theme } from '@mui/material'
import { MatchLoadingProps } from 'EditZing/Types/ComponentProps'
import {
  StyledLoadingContainer,
  StyledLoadingText,
  StyledCenterWrapper,
  StyledWellDoneImg,
  StyledWellDoneText,
} from 'EditZing/Styles/MatchLoading.style'
import { colors } from '@core/Constants'

// randomly generated from codemod
const PREFIX = 'MatchLoading'

const classes = {
  backdrop: `${PREFIX}-backdrop`,
  progress: `${PREFIX}-progress`,
  circle: `${PREFIX}-circle`,
}

// using styled-components instead of emotion
const StyledBackdrop = styled(Backdrop)`
  &.${classes.backdrop} {
    z-index: 1;
  }

  ${classes.progress} {
    color: ${colors.mediumviolet};
  }

  &.${classes.circle} {
    stroke-linecap: round;
  }
`

export const MatchLoading = ({
  showMatchLoading,
  isCurrentlyGrouping,
  numberGrouping,
  courseNames,
  setShowMatchLoading,
}: MatchLoadingProps) => {
  const close = () => {
    if (!isCurrentlyGrouping) {
      setShowMatchLoading(false)
    }
  }

  return (
    <StyledBackdrop
      className={classes.backdrop}
      open={showMatchLoading}
      onClick={close}
    >
      <StyledLoadingContainer>
        {isCurrentlyGrouping ? (
          <StyledCenterWrapper>
            <StyledLoadingText>
              Grouping {numberGrouping} unmatched students in{' '}
              {courseNames.join(', ')}...
            </StyledLoadingText>
            <CircularProgress
              className={classes.progress}
              classes={{
                circle: classes.circle,
              }}
              size={120}
              thickness={3}
            />
          </StyledCenterWrapper>
        ) : (
          <StyledCenterWrapper>
            <StyledWellDoneImg />
            <StyledWellDoneText>
              Congrats! Your students have been successfully grouped.
            </StyledWellDoneText>
          </StyledCenterWrapper>
        )}
      </StyledLoadingContainer>
    </StyledBackdrop>
  )
}
