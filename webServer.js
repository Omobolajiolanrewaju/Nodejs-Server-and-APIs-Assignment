const http = require('http')
const fs =  require('fs')

const HOSTNAME = 'localhost' // hostname
const PORT = 4000 // port

const handleRequest = (req, res) => { // handles request
    // console.log({ path: req.url, method: req.method })
    console.log(req.url)

    if (req.url === '/') { 
        const file = fs.readFileSync('./index.html') // reads the index html file
        res.setHeader('Content-type', 'text/html')
        res.writeHead(200)
        res.write(file)
        res.end('Hello from the server') // ends the request cycle
    }

    if (req.url.endsWith('.html') && req.method === 'GET') {
        try {
            const splitUrl = req.url.split('/')
            const fileName = splitUrl[1]
            const fileLocation = `./${fileName}` 
        
            const file = fs.readFileSync(fileLocation)
            res.setHeader('Content-type', 'text/html')
            res.writeHead(200)
            res.write(file)
            res.end() 
        } catch (error) {
            const file = fs.readFileSync('./404.html') // reads the 404 html file
            res.setHeader('content-type', 'text/html')
            res.writeHead(404)
            res.write(file)
            res.end() // ends the request cycle
        }
    }
}

const server = http.createServer(handleRequest)

server.listen(PORT, HOSTNAME, () => {
    console.log(`Listening on port: ${HOSTNAME}:${PORT}`)
})