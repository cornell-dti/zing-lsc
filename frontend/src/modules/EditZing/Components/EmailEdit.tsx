import { EmailEditProps } from 'EditZing/Types/ComponentProps'
import { Button, Box, TextField } from '@mui/material'
import { SxProps } from '@mui/material'

export const EmailEdit = ({
  template,
  replacedHtml,
  setSelectedTemplate,
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

  const copyEmailTemplate = () => {
    let copied = Object.assign({}, template)
    copied.html = replacedHtml
    setSelectedTemplate(copied)
    console.log('copied', copied)
    console.log(template)
  }

  const handleClick = () => {
    console.log('clicked')
    copyEmailTemplate()
  }
  const SaveButton = () => {
    return (
      <Button
        onClick={() => {
          handleClick()
        }}
        color="secondary"
        variant="outlined"
      >
        Save
      </Button>
    )
  }

  return (
    <Box>
      <Box sx={TitleSx}>Email Edit</Box>
      <TextField
        multiline={true}
        defaultValue={replacedHtml}
        onChange={(event) => (replacedHtml = event.target.value)}
      />
      <SaveButton />
    </Box>
  )
}
