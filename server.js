const express = require('express');
const mailer = require('express-mailer');
const bodyParser = require('body-parser');
const app = express();

app.set('views', './dist');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/client', express.static(__dirname + '/dist/client'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(__dirname);

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'natebowditchsite@gmail.com',
    pass: '@aW,ygU2i.'
  }
});

app.get('/', function (req, res) {
  res.render('index')
});

app.post('/send', function (req, res, next) {
  var senderName = req.body.name;
  var senderEmail = req.body.email;
  var senderMessage = req.body.message;

  app.mailer.send('email', {
    to: 'nhbowditch@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
    subject: 'Test Email', // REQUIRED. 
    senderName,
    senderEmail,
    senderMessage
  }, function (err) {
    if (err) {
      // handle error 
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.redirect('/');
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});