import { EmailEditProps } from 'EditZing/Types/ComponentProps'
import { Button, Box, TextField } from '@mui/material'
import { SxProps } from '@mui/material'
import { EmailTemplate } from '@core/index'

export const EmailEdit = ({
  template,
  replacedHtml,
  setSelectedTemplate,
  replaceSelectedTemplate,
  setSingleGroupTemplate,
  setEmailSaved,
  groupNumber,
}: EmailEditProps) => {
  const TitleSx: SxProps = {
    color: 'essentials.6',
    backgroundColor: 'essentials.75',
    borderBottom: '0.5px solid #898992;',
    border: '0.5px solid',
    borderColor: 'essentials.50',
    padding: '16px',
    fontWeight: '900',
    borderRadius: '5px 5px 0px 0px;',
  }
  const BodyAndSubjectSx: SxProps = {
    color: 'essentials.75',
    backgroundColor: 'essentials.6',
    border: '0.5px solid',
    borderBottom: '0.5px solid #898992;',
    borderColor: 'essentials.50',
    padding: '16px',
  }

  const copyEmailTemplate = () => {
    let copied = Object.assign({}, template)
    copied.html = replacedHtml
    if (groupNumber) {
      setSingleGroupTemplate(copied, groupNumber)
    } else {
      setSelectedTemplate(copied)
      replaceSelectedTemplate(copied)
    }
  }

  const handleClick = () => {
    copyEmailTemplate()
    setEmailSaved(true)
  }
  const SaveButton = () => {
    return (
      <Button
        sx={{ alignSelf: 'end', marginTop: '10px' }}
        onClick={() => {
          handleClick()
        }}
        color="primary"
      >
        Save
      </Button>
    )
  }

  return (
    <Box>
      <Box>
        <Box sx={TitleSx}>Email Edit</Box>
        <TextField
          sx={{
            width: '100%',
            maxHeight: '350px',
            overflowY: 'scroll',
            borderRadius: '0px 0px 5px 5px;',
            ...BodyAndSubjectSx,
          }}
          multiline={true}
          defaultValue={replacedHtml}
          onChange={(event) => (replacedHtml = event.target.value)}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <SaveButton />
      </Box>
    </Box>
  )
}
