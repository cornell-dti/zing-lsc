import { Box, Typography } from '@mui/material'
import { RadioButtons } from '@core/Components'
import { TemplateName } from 'EditZing/utils/emailTemplates'
import { TemplateRadioButtonsProps } from 'EditZing/Types/ComponentProps'

export const EmailTemplateButtons = ({
  selectedTemplate,
  setSelectedTemplate,
}: TemplateRadioButtonsProps) => {
  // we could include all, but designers advise to limit it to just these few for now
  const activeTemplates = [
    TemplateName.MATCHED,
    TemplateName.CHECK_IN,
    TemplateName.ADD_STUDENT,
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTemplate(event.target.value as TemplateName)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: '40px',
      }}
    >
      <Typography variant="h5" component="h5" fontWeight="800" mb="12px">
        Use an existing template:
      </Typography>
      <RadioButtons
        values={activeTemplates}
        onClick={handleChange}
        key={'TemplateRadioButtons'}
        currentAnswer={selectedTemplate || ''}
      />
    </Box>
  )
}
