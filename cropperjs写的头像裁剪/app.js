const express = require('express')
const fs = require('fs')
const path = require('path')


const app = express()

// 设置body-parser处理post数据
app.use(express.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
}))
app.use(express.json({
    limit: '50mb'
}))


app.use('/node_modules/', express.static(path.join(__dirname, '/node_modules')))
app.use('/public/', express.static(path.join(__dirname, '/public')))



// 配置express-art-template
app.set('views')
app.engine('html', require('express-art-template'))

app.get('/index', (req, res) => {
    // let data = fs.readFile('./test4.html', (err, data) => {
    //     if (err) return false
    //     else res.send(data)
    // })
    res.render('index.html')
})

app.post('/upload', (req, res) => {
    let body = req.body
    console.log(body)
    res.send()
    // console.log(body.croppedImage)

})


app.listen(3000, (err) => {
    if (err) return false
    console.log(`success in 3000`)
})