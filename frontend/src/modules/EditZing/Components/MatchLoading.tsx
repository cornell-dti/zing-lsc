import React from 'react'
import {
  Backdrop,
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { MatchLoadingProps } from 'EditZing/Types/ComponentProps'
import {
  StyledLoadingContainer,
  StyledLoadingText,
  StyledCenterWrapper,
  StyledWellDoneImg,
  StyledWellDoneText,
} from 'EditZing/Styles/MatchLoading.style'
import { colors } from '@core/Constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 1,
    },
    progress: {
      color: colors.mediumviolet,
    },
    circle: {
      strokeLinecap: 'round',
    },
  })
)

export const MatchLoading = ({
  showMatchLoading,
  isCurrentlyGrouping,
  numberGrouping,
  courseNames,
  setShowMatchLoading,
}: MatchLoadingProps) => {
  const classes = useStyles()

  const close = () => {
    if (!isCurrentlyGrouping) {
      setShowMatchLoading(false)
    }
  }

  return (
    <Backdrop
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
    </Backdrop>
  )
}
