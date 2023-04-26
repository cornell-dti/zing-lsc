import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadString } from 'firebase/storage'
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { templatesBucket } from '@fire/firebase'
import { API_ROOT, EMAIL_PATH } from '@core/Constants'
import { EmailTemplate } from '@core/Types'
import { useTemplateValue } from '@context/TemplateContext'

export const TemplateEditor = () => {
  const { templates, keepForm, appendForm } = useTemplateValue()
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isAddingTemplate = selectedTemplateId === ''

  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState<'group' | 'student'>('group')
  const [templateSubject, setTemplateSubject] = useState('')
  const [templateHtml, setTemplateHtml] = useState('')

  // Special value substitution in template HTML
  const replaceMap = {
    '{{COURSE_NAME}}': 'ABC 1100',
    '{{NEW_STUDENT_NAME}}': 'Jane Doe',
    '{{OTHER_STUDENTS_NAMES}}': 'Student 1, Student 2, Student 3',
  }
  const replacedHtml = Object.entries(replaceMap).reduce(
    (prev, [key, value]) => prev.replaceAll(key, value),
    templateHtml
  )

  /** Reset form fields based on template */
  const resetForm = (template: EmailTemplate) => {
    setTemplateName(template.name)
    setTemplateType(template.type)
    setTemplateSubject(template.subject)
    setTemplateHtml(template.html)
  }

  /** Change selected template and reset form if necessary */
  const changeSelectedTemplate = (template: EmailTemplate) => {
    // Don't reset form if currently selected list item is clicked
    if (template.id !== selectedTemplateId) {
      setSelectedTemplateId(template.id)
      resetForm(template)
    }
  }

  /** Change the form to add new template mode and prefill with defaults */
  const changeToAddNewTemplate = () => {
    setSelectedTemplateId('')
    setTemplateName('')
    setTemplateType('group')
    setTemplateSubject('')
    setTemplateHtml('')
  }

  /** Save selected template to storage */
  const saveSelectedTemplate = () => {
    setIsSaving(true)
    axios
      .post(`${API_ROOT}${EMAIL_PATH}/templates/update`, {
        id: selectedTemplateId,
        name: templateName,
        type: templateType,
        subject: templateSubject,
      })
      .then(() =>
        uploadString(
          ref(
            templatesBucket,
            templates.find((t) => t.id === selectedTemplateId)!.body
          ),
          templateHtml,
          'raw',
          { contentType: 'text/html' }
        )
      )
      .then(() => {
        keepForm(
          selectedTemplateId,
          templateName,
          templateType,
          templateSubject,
          templateHtml
        )
        setIsSaving(false)
      })
      .catch((error) => console.error('Failed to save', error))
  }

  /** Add new template to storage */
  const addNewTemplate = () => {
    setIsSaving(true)
    axios
      .post(`${API_ROOT}${EMAIL_PATH}/templates/add`, {
        name: templateName,
        type: templateType,
        subject: templateSubject,
      })
      .then(async (response) => {
        const id = response.data.data as string
        await uploadString(
          ref(
            templatesBucket,
            `${id}.html` // body is id.html the new template was created with
          ),
          templateHtml,
          'raw',
          { contentType: 'text/html' }
        )
        return id
      })
      .then((id) => {
        appendForm(
          id,
          templateName,
          templateType,
          templateSubject,
          templateHtml
        )
        setSelectedTemplateId(id)
        setIsSaving(false)
      })
      .catch((error) => console.error('Failed to save', error))
  }

  useEffect(() => {
    const mostRecentModifiedTemplate = templates.reduce((p, c) =>
      p.modifyTime.valueOf() > c.modifyTime.valueOf() ? p : c
    )
    setSelectedTemplateId(mostRecentModifiedTemplate.id)
    resetForm(mostRecentModifiedTemplate)
  }, [templates])

  return (
    <Box p={4}>
      <Typography variant="h4" component="h1" mb={4}>
        Template Editor
      </Typography>
      <Box component="main" display="flex" alignItems="flex-start" gap={4}>
        <List sx={{ minWidth: 400 }}>
          <ListItemButton
            selected={isAddingTemplate}
            onClick={changeToAddNewTemplate}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>Add Template</ListItemText>
          </ListItemButton>
          {[...templates]
            .sort((a, b) => b.modifyTime.valueOf() - a.modifyTime.valueOf())
            .map((template) => (
              <ListItemButton
                key={template.id}
                selected={template.id === selectedTemplateId}
                onClick={() => changeSelectedTemplate(template)}
              >
                <ListItemText>{template.name}</ListItemText>
              </ListItemButton>
            ))}
        </List>
        <Box
          component="form"
          display="grid"
          gridTemplateColumns="1fr 1fr"
          rowGap={2}
          columnGap={4}
          flexGrow={1}
        >
          <TextField
            label="Template Name"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            sx={{ gridColumn: 1 }}
          />
          <Box
            sx={{
              gridColumn: 2,
              gridRow: '1 / 3',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              Available Substitutions:
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="50%">Key</TableCell>
                  <TableCell width="50%">Example Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(replaceMap).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <TextField
            label="Type"
            select
            value={templateType}
            onChange={(event) =>
              setTemplateType(event.target.value as 'group' | 'student')
            }
            sx={{ gridColumn: 1 }}
          >
            <MenuItem value="group">
              Group (shared email to all group members)
            </MenuItem>
            <MenuItem value="student">Student (one email per student)</MenuItem>
          </TextField>
          <TextField
            label="Email Subject"
            value={templateSubject}
            onChange={(event) => setTemplateSubject(event.target.value)}
            sx={{ gridColumn: 1 }}
          />
          <Box sx={{ gridColumn: 2, alignSelf: 'center', display: 'flex' }}>
            <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Subject:</Typography>
            <Typography>{templateSubject}</Typography>
          </Box>
          <Box sx={{ gridColumn: 1 }}>
            <TextField
              label="Email Body (HTML)"
              multiline
              fullWidth
              minRows={10}
              value={templateHtml}
              onChange={(event) => setTemplateHtml(event.target.value)}
              InputProps={{ sx: { fontFamily: 'monospace' } }}
            />
            <Box display="flex" justifyContent="right" gap={2} mt={2}>
              {isAddingTemplate ? (
                <Button
                  key="primary" // Otherwise React will smooth-transition to the other button
                  variant="contained"
                  color="primary"
                  onClick={addNewTemplate}
                  disabled={isSaving}
                >
                  Create template
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      resetForm(
                        templates.find((t) => t.id === selectedTemplateId)!
                      )
                    }
                  >
                    Cancel changes
                  </Button>
                  <Button
                    key="primary"
                    variant="contained"
                    color="primary"
                    onClick={saveSelectedTemplate}
                    disabled={isSaving}
                  >
                    Save changes
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ gridColumn: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Body:</Typography>
            <Typography
              dangerouslySetInnerHTML={{ __html: replacedHtml }}
              sx={{ gridColumn: 2 }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
