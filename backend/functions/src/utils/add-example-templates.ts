import { storage } from '../config'

// Storage emulator will automatically create bucket on first write
const templatesBucket = storage.bucket('zing-lsc-templates')

const templateNames = ['example-1.html', 'example-2.html']

templateNames.forEach((template) =>
  templatesBucket
    .upload(template)
    .then(() => console.log(`Successfully uploaded ${template}`))
    .catch((e) => console.error(`Failed to upload ${template}: ${e}`))
)
