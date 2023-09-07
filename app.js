const http = require('http')
const express = require('express')
const dotenv = require('dotenv')
const { DataSource } = require('typeorm')
const { error } = require('console')

dotenv.config()

const myDatabase = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDatabase.initialize()
    .then(() => {
        console.log("데이터 연결 됐음")
    })

const app = express()

app.use(express.json())


// 🎉 회원가입

app.post('/user/signup', async (req, res) => {
    try {

        const me = req.body
        //구조분해
        const { name, password, email } = me

        //필수사항 입력 확인
        if (name === undefined || password === undefined || email === undefined) {
            const error = new Error("KEY_ERROR")
            error.statusCode = 400
            throw error
        }

        //유효성검사 - 비밀번호 길이
        if (password.length < 8) {
            const error = new Error("INVALID_PASSWORD")
            error.statusCode = 400
            throw error
        }

        //이메일 중복 가입 체크
        const emailCheck = await myDatabase.query(`
            SELECT id, name, email FROM users WHERE email ='${email}';
        `)

        console.log('emailCheck : ', emailCheck)

        if (emailCheck.length > 0) {
            const error = new Error("DUPLICATED_EMAIL_ADDRESS")
            error.statusCode = 400
            throw error
        }

        const signup = await myDatabase.query(`
            INSERT INTO users (
                name,
                password,
                email
            )
            VALUES(
                '${name}',
                '${password}',
                '${email}'
            )
        `)

        console.log("signup success 🎉")

        return res.status(201).json({
            "message": "signup success 🎉"
        })

    } catch (err) {
        console.log(err)
        return res.status(error.statusCode).json({
            "message": error.message
        })
    }
})

// ✨ 로그인
app.post('/user/signin', async (req, res) => {
    try {

        const me = req.body
        //구조분해
        const { email, password } = me

        //필수입력 사항 확인
        if (email === undefined || password === undefined) {
            const error = new Error("KEY_ERROR")
            error.statusCode = 400
            throw error
        }

        // 가입된 유저 확인
        const userCheck = await myDatabase.query(`
             SELECT id, email FROM users WHERE email='${email}';
          `)

        console.log('userCheck: ', userCheck)


        if (userCheck.length === 0) {  //  = 는 대입 연산자
            const error = new Error("NON_EXIST_EMAIL_ADDRESS")
            error.statusCode = 400
            throw error
        }

        // 비밀번호 확인
        const passwordCheck = await myDatabase.query(`
             SELECT password FROM users WHERE email='${email}';
          `)

        console.log('passwordCheck : ', passwordCheck)

        if (password !== passwordCheck[0].password) {
            const error = new Error("INCORRECT_PASSPWORD")
            error.statusCode = 400
            throw error
        }

        console.log("signin success 🎉")
        return res.status(201).json({
            "message": "signin success 🎉"
        })
    } catch (err) {
        console.log(err)
        return res.status(error.statusCode).json({
            "message": error.message
        })
    }
})

// ------------------------서버 ----------------------
const server = http.createServer(app)

const start = async () => {
    try {
        server.listen(8002, () => console.log(`8002 Server 🎊`))
    } catch (err) {
        console.error(err)
    }
}

start()



