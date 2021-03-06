const express = require('express');
const path = require('path');
const hbs = require('hbs')
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast')



const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectorypath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectorypath))

app.get("", (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Amit Bhandari'
    })
})

app.get('/about',(req,res) =>{
    res.render('about', {
       title: 'About Me',
       name: 'Amit Bhandari' 
    });
})

app.get('/help', (req,res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Amit Bhandari'
    });
})

app.get('/weather', (req, res) => {

    if(!req.query.address){
        return res.send({
            error: 'You must provide a address'
        })
    }

    geocode(req.query.address, (error,{latitude, longitude, location} = {}) => {
                 if(error) {
                     return res.send({error})
                    }
                forecast(latitude, longitude, (error, forecastData) => {
                    if(error) {
                        return res.end({error})
                    }

                    res.send({
                        forecast:forecastData,
                        location,
                        address: req.query.address

                    })
                })
                
    })

})



app.get('/help/*', (req, res) => {
     res.render('404',{
         title: '404',
         name: 'Amit Bhandari',
         errorMessage:'Help article not found.'
     })
})
app.get('*', (req, res) => {
       res.render('404', {
           title: '404',
           name: 'Amit Bhandari',
           errorMessage: 'Page not found'
       })
})
app.listen(port, () => {
    console.log('Server is up on port' + port)
})