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

    function rootSumOfSquares(a, b, c) {
        return Math.sqrt((a ** 2) + (b ** 2) + (c ** 2))
    }

    function getGeometricNormal(cur, next) {
        const a = { x: Math.sin(cur) * R, y: Math.cos(cur) * R, z: -H }
        const b = { x: Math.sin(next) * R, y: Math.cos(next) * R, z: -H }

        const magnitude = - rootSumOfSquares(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)

        const res = {
            x: (a.y * b.z - a.z * b.y) / magnitude,
            y: (a.z * b.x - a.x * b.z) / magnitude,
            z: (a.x * b.y - a.y * b.x) / magnitude
        }

        return res
    }

    function getConeSurfaceNormal(X, Y) {
        const magnitude = rootSumOfSquares(X, Y, (R ** 2) / H)

        const res = {
            x: (X / magnitude),
            y: (Y / magnitude),
            z: R ** 2 / (H * magnitude)
        }

        return res
    }

    for (let i = 0; i <= 2 * Math.PI; i += (Math.PI / (N / 2))) {
        const currentPointRad = i
        const nextPointRad = i + Math.PI / (N / 2)

        const currentX = Math.sin(currentPointRad) * R
        const currentY = Math.cos(currentPointRad) * R

        const nextX = Math.sin(nextPointRad) * R
        const nextY = Math.cos(nextPointRad) * R

        // треугольники боковых поверхностей

        pointsArray.push(0)
        pointsArray.push(0)
        pointsArray.push(H)

        pointsArray.push(nextX)
        pointsArray.push(nextY)
        pointsArray.push(0)

        pointsArray.push(currentX)
        pointsArray.push(currentY)
        pointsArray.push(0)

        if (S) { // нормали боковых поверхностей для получения эффекта сглаживания

            const geometricNormal = getGeometricNormal(currentPointRad, nextPointRad)

            normalsArray.push(geometricNormal.x)
            normalsArray.push(geometricNormal.y)
            normalsArray.push(geometricNormal.z)

            const smoothingNormalNext = getConeSurfaceNormal(nextX, nextY)

            normalsArray.push(smoothingNormalNext.x)
            normalsArray.push(smoothingNormalNext.y)
            normalsArray.push(smoothingNormalNext.z)

            const smoothingNormalCur = getConeSurfaceNormal(currentX, currentY)

            normalsArray.push(smoothingNormalCur.x)
            normalsArray.push(smoothingNormalCur.y)
            normalsArray.push(smoothingNormalCur.z)

        } else { // простые геометрические нормали боковых поверхностей
            const geometricNormal = getGeometricNormal(currentPointRad, nextPointRad)

            normalsArray.push(geometricNormal.x)
            normalsArray.push(geometricNormal.y)
            normalsArray.push(geometricNormal.z)
            normalsArray.push(geometricNormal.x)
            normalsArray.push(geometricNormal.y)
            normalsArray.push(geometricNormal.z)
            normalsArray.push(geometricNormal.x)
            normalsArray.push(geometricNormal.y)
            normalsArray.push(geometricNormal.z)
        }

        // треугольники составляющие дно конуса

        pointsArray.push(0)
        pointsArray.push(0)
        pointsArray.push(0)

        pointsArray.push(currentX)
        pointsArray.push(currentY)
        pointsArray.push(0)

        pointsArray.push(nextX)
        pointsArray.push(nextY)
        pointsArray.push(0)

        // нормали дна конуса

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