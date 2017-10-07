const express = require('express');
const mailer = require('express-mailer');
const bodyParser = require('body-parser');
const sanitizer = require('sanitizer');
const app = express();

app.set('port', (process.env.PORT || 5000))
app.set('views', './dist');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', express.static(__dirname + '/dist'));
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
  var senderName = sanitizer.sanitize(req.body.name);
  var senderEmail = sanitizer.sanitize(req.body.email);
  var senderMessage = sanitizer.sanitize(req.body.message);

  console.log('Received request to send email');
  console.log(`   name:    ${senderName}`);
  console.log(`   email:   ${senderEmail}`);
  console.log(`   message: ${senderMessage}`);

  if (senderName === '' || senderEmail === '' || senderMessage === '') {
    console.log('Some content was empty, redirecting!')
    res.redirect('/#contactMe');
    return;
  }

  console.log('Email away!');
  app.mailer.send('email', {
    to: 'nhbowditch@gmail.com',
    subject: 'Email from personal site',
    senderName,
    senderEmail,
    senderMessage
  }, function (err) {
    if (err) {
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.redirect('/#contactMe');
  });
});

app.listen(app.get('port'), function () {
  console.log(`Example app listening on port ${app.get('port')}!`)
});