import { getBody } from '../utils/emailTemplates'
import { EmailPreviewProps } from 'EditZing/Types/ComponentProps'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import { SxProps } from '@mui/material'

export const EmailPreview = ({
  templateName,
  courseNames,
}: EmailPreviewProps) => {
  const ContainerSx: SxProps = {
    border: '0.5px solid #898992;',
    borderColor: 'essentials.50',
  }
  const TitleSx: SxProps = {
    color: 'essentials.6',
    backgroundColor: 'essentials.75',
    borderBottom: '0.5px solid #898992;',
    borderColor: 'essentials.50',
    padding: '16px',
    fontWeight: '900',
  }
  const BodyAndSubjectSx: SxProps = {
    color: 'essentials.75',
    backgroundColor: 'essentials.6',
    borderBottom: '0.5px solid #898992;',
    borderColor: 'essentials.50',
    padding: '16px',
  }

  const body = getBody(templateName, courseNames.join(', '))
  return (
    <Box sx={ContainerSx}>
      <Box sx={TitleSx}>Email Preview</Box>
      <Box
        sx={{
          fontWeight: '900',
          ...BodyAndSubjectSx,
        }}
      >
        <Box display={'flex'} flexDirection={'row'}>
          <Typography fontWeight={800}>Subject: </Typography>&nbsp;
          <Typography>Study Partners!</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          maxHeight: '250px',
          overflow: 'scroll',
          ...BodyAndSubjectSx,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: body }}></div>
      </Box>
    </Box>
  )
}
