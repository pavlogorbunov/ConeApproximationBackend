const express = require('express')
const cors = require('cors')

const PORT = 3000

const corsOptions = {
    origin: [
        'http://localhost:8080'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type'],
    credentials: true,
}

function generateCone({ N, H, R, S }) {
    let pointsArray = []
    let normalsArray = []

    for (let i = 0; i <= 2 * Math.PI; i += (Math.PI / (N / 2))) {
        pointsArray.push(0)
        pointsArray.push(0)
        pointsArray.push(H)

        pointsArray.push(Math.sin(i) * R)
        pointsArray.push(Math.cos(i) * R)
        pointsArray.push(0)

        pointsArray.push(Math.sin(i + Math.PI / (N / 2)) * R)
        pointsArray.push(Math.cos(i + Math.PI / (N / 2)) * R)
        pointsArray.push(0)

        if (S) { // нормали для получения эффекта сглаживания
            let magnitude = - Math.sqrt((Math.cos(i + Math.PI / (N / 2)) - Math.cos(i)) ** 2 + (Math.sin(i) - Math.sin(i + Math.PI / (N / 2))) ** 2 + (Math.sin(i) * Math.cos(i + Math.PI / (N / 2)) - Math.cos(i) * Math.sin(i + Math.PI / (N / 2))) ** 2)

            normalsArray.push((Math.cos(i + Math.PI / (N / 2)) - Math.cos(i)) / magnitude)
            normalsArray.push((Math.sin(i) - Math.sin(i + Math.PI / (N / 2))) / magnitude)
            normalsArray.push((Math.sin(i) * Math.cos(i + Math.PI / (N / 2)) - Math.cos(i) * Math.sin(i + Math.PI / (N / 2))) / magnitude)

            magnitude = Math.sqrt((Math.sin(i) * R) ** 2 + (Math.cos(i) * R) ** 2 + (R ** 2 / H) ** 2)

            normalsArray.push((Math.sin(i) * R) / magnitude)
            normalsArray.push((Math.cos(i) * R) / magnitude)
            normalsArray.push((R ** 2 / H) / magnitude)
            normalsArray.push((Math.sin(i + Math.PI / (N / 2)) * R) / magnitude)
            normalsArray.push((Math.cos(i + Math.PI / (N / 2)) * R) / magnitude)
            normalsArray.push((R ** 2 / H) / magnitude)
        } else { // простые геометрические нормали
            const magnitude = - Math.sqrt((Math.cos(i + Math.PI / (N / 2)) - Math.cos(i)) ** 2 + (Math.sin(i) - Math.sin(i + Math.PI / (N / 2))) ** 2 + (Math.sin(i) * Math.cos(i + Math.PI / (N / 2)) - Math.cos(i) * Math.sin(i + Math.PI / (N / 2))) ** 2)

            normalsArray.push((Math.cos(i + Math.PI / (N / 2)) - Math.cos(i)) / magnitude)
            normalsArray.push((Math.sin(i) - Math.sin(i + Math.PI / (N / 2))) / magnitude)
            normalsArray.push((Math.sin(i) * Math.cos(i + Math.PI / (N / 2)) - Math.cos(i) * Math.sin(i + Math.PI / (N / 2))) / magnitude)
            normalsArray.push((Math.cos(i + Math.PI / (N / 2)) - Math.cos(i)) / magnitude)
            normalsArray.push((Math.sin(i) - Math.sin(i + Math.PI / (N / 2))) / magnitude)
            normalsArray.push((Math.sin(i) * Math.cos(i + Math.PI / (N / 2)) - Math.cos(i) * Math.sin(i + Math.PI / (N / 2))) / magnitude)
            normalsArray.push((Math.cos(i + Math.PI / (N / 2)) - Math.cos(i)) / magnitude)
            normalsArray.push((Math.sin(i) - Math.sin(i + Math.PI / (N / 2))) / magnitude)
            normalsArray.push((Math.sin(i) * Math.cos(i + Math.PI / (N / 2)) - Math.cos(i) * Math.sin(i + Math.PI / (N / 2))) / magnitude)
        }

        pointsArray.push(0)
        pointsArray.push(0)
        pointsArray.push(0)

        pointsArray.push(Math.sin(i + Math.PI / (N / 2)) * R)
        pointsArray.push(Math.cos(i + Math.PI / (N / 2)) * R)
        pointsArray.push(0)

        pointsArray.push(Math.sin(i) * R)
        pointsArray.push(Math.cos(i) * R)
        pointsArray.push(0)

        normalsArray.push(0)
        normalsArray.push(0)
        normalsArray.push(-1)
        normalsArray.push(0)
        normalsArray.push(0)
        normalsArray.push(-1)
        normalsArray.push(0)
        normalsArray.push(0)
        normalsArray.push(-1)
    }

    return { pointsArray, normalsArray }
}

const app = express()
app.use('*', cors(corsOptions))
app.use(express.json())

app.use('/', (req, res) => {
    res.send(JSON.stringify(generateCone(req.body)))
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})