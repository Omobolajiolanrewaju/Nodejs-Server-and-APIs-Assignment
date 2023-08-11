const http = require('http');
const fs = require('fs')
// const { buffer } = require('stream/consumers');

const PORT = 4002

const studentInfo = [] // empty student array

const server = http.createServer((req, res) => {

    if (req.url === '/students' && req.method === 'POST') { // checks the url and method of the request
        const data = [] // initialize empty array

        req.on('data', (chunk) => { // event listener checks if request has data
            data.push(chunk) // chunk is buffer and is added to the data array
        })

        req.on('end', () => { // event listener checks if request has ended
            try { 
                const bufferBody = Buffer.concat(data).toString() // converts buffer to string
                const newStudentInfo = JSON.parse(bufferBody); // converts string to JavaScript object
    
                if ( studentInfo[studentInfo.length - 1] === undefined ) {
                    studentInfo.push({...newStudentInfo, id: 1})
                    return res.end(`Added Successfully!!!`)
                }
                
                const lastStudentIndex = studentInfo.length - 1
                const lastStudentId = studentInfo[lastStudentIndex].id
                const newStudentId = lastStudentId + 1
                studentInfo.push({...newStudentInfo, id: newStudentId})
                return res.end(`Added Successfully!!!`)
            } catch (error) {
                res.writeHead(400)
                res.end(`Client error: ${error}`)
            }
        })
    } else if (req.url === '/students' && req.method === 'GET') { // checks the url and method of the request
        try {
            res.setHeader('content-type', 'application/json')
            res.writeHead(200)
            res.write(JSON.stringify(studentInfo)) // converts JavaScript object to String
            return res.end()
        } catch (error) {
            res.writeHead(404)
            res.end(`Student not found`)
        }
    } else if (req.url.startsWith('/students/') && req.method === 'GET') { // checks the url and method of the request
        res.setHeader('Content-Type', 'application/json');
        const id = Number(req.url.split('/')[2]);
        const studentIndex = studentInfo.findIndex(student => student.id === id); // find index of the student
    
        if (studentIndex !== -1) { // checks if student is in the students array
            const student = studentInfo[studentIndex];
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.write(JSON.stringify(student)) // converts JavaScript object to String
            return res.end();
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(404);
            return res.end(`Student not found`); 
        }
    } else if (req.url.startsWith('/students/') && req.method === 'PUT') { // checks the url and method of the request
        res.setHeader('Content-Type', 'application/json');
        const id = Number(req.url.split('/')[2]);
        const studentIndex = studentInfo.findIndex(student => student.id === id);

        const data = [] // initialize empty array

        req.on('data', (chunk) => { // event listener checks if request has data
            data.push(chunk) // chunk is buffer and is added to the data array
        })

        req.on('end', () => { // event listener checks if request has ended
            const bufferBody = Buffer.concat(data).toString() // converts buffer to string
            const newStudentInfo = JSON.parse(bufferBody); // converts string to JavaScript object

            if (studentIndex !== -1) {
                const updateStudentInfo = {...studentInfo[studentIndex], ...newStudentInfo}
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.write(JSON.stringify(updateStudentInfo)) // converts JavaScript object to String
                return res.end('\n\nEdited Successfully!!!');
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(404);
                return res.end('Student not found'); 
            }
        })
    } else if (req.url.startsWith('/students/') && req.method === 'DELETE') { // checks the url and method of the request
        res.setHeader('Content-Type', 'application/json');
        const id = Number(req.url.split('/')[2]);
        const studentIndex = studentInfo.findIndex(student => student.id === id);

        if (studentIndex !== -1) {
            const updateStudentInfo = studentInfo.splice(studentIndex, 1)
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            return res.end('Deleted Successfully!!!');
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(404);
            return res.end('Student not found');
        }
    }
})

server.listen(PORT, () => { // start server, listen for connections
    console.log(`Listening on port: $localhost:${PORT}`)
})