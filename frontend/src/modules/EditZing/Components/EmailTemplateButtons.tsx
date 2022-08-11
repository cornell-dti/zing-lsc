import { Box, Typography } from '@mui/material'
import { RadioButtons } from '@core/Components'
import { TemplateRadioButtonsProps } from 'EditZing/Types/ComponentProps'

export const EmailTemplateButtons = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}: TemplateRadioButtonsProps) => {
  // labels and values fot the radio button
  const templateNames = templates.map((template) => template.name)
  const templateIds = templates.map((template) => template.id)

  // changing the selected email template
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelection = event.target.value
    templates.forEach((template) => {
      if (template.id === newSelection) {
        setSelectedTemplate(template)
      }
    })
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
        labels={templateNames}
        values={templateIds}
        onClick={handleChange}
        currentAnswer={selectedTemplate.id}
      />
    </Box>
  )
}
