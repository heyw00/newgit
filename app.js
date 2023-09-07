const http = require('http')
const express = require('express')
const dotenv = require('dotenv')
const { database } = require('typeorm')
const { error } = require('console')

dotenv.config()

const myDatabase = new database({
 type: 'mysql', 
 host: 'localhost', 
 port: '3306',
 username: 'root',
 password: '',
 database: 'minitest'
})

const app = express()

app.use(express.json())





// ------------------------서버 ----------------------
const server = http.createServer(app)

const start = async () => {
    try {
        server.listen(8002, () => console.log(`Server is istening on 8002`))
    } catch (err) {
        console.log(err)
    }
}

start()



