import { getBody } from '../utils/emailTemplates'
import { EmailPreviewProps } from 'EditZing/Types/ComponentProps'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'

export const EmailPreview = ({
  templateName,
  courseNames,
}: EmailPreviewProps) => {
  const body = getBody(templateName, courseNames.join(', '))
  return (
    <Box sx={{ border: '0.5px solid #898992;', borderColor: 'essentials.50' }}>
      <Box
        sx={{
          color: 'essentials.6',
          backgroundColor: 'essentials.75',
          borderBottom: '0.5px solid #898992;',
          borderColor: 'essentials.50',
          padding: '16px',
          fontWeight: '900',
        }}
      >
        Email Preview
      </Box>
      <Box
        sx={{
          color: 'essentials.75',
          backgroundColor: 'essentials.6',
          borderBottom: '0.5px solid #898992;',
          borderColor: 'essentials.50',
          padding: '16px',
          fontWeight: '900',
        }}
      >
        <Typography></Typography>
      </Box>
      <div dangerouslySetInnerHTML={{ __html: body }}></div>
    </Box>
  )
}
