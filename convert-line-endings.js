import glob from 'glob'
import { exec } from 'child_process'

glob('./lib/**/*.js', (err, files) => {
    if (err) {
        console.error('Error finding files:', err)
        return
    }

    files.forEach(file => {
        exec(`dos2unix ${file}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error converting file ${file}:`, err)
                return
            }

            if (stderr) {
                console.error(stderr)
            }

            console.log(`Converted ${file} to LF`)
        })
    })
})
