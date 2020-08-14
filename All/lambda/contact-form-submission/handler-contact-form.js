'use strict'

var AWS = require('aws-sdk')
var ses = new AWS.SES()

var RECEIVER = 'example@example.com'
var SENDER = 'example@example.com'

function composeSubject(formData) {
  var subject = 'New Contact Form Submission'
  return subject
}

function composeMessage(formData) {
  var msg = `You have a new web inquiry from ${formData.name}.

  Phone Number: ${formData.phone || "not provided"}
  EMail Address: ${formData.email || "not provided"}
  `
  return msg
}


module.exports.sendContactForm = (event, context, callback) => {
  const formData = JSON.parse(event.body)
  sendEmail(formData, function (err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
        status: err ? 500 : 200,
      }),
    }
    callback(null, response)
  })
}


function sendEmail(formData, callback) {
  var params = {
    Source: SENDER,
    Destination: { ToAddresses: [RECEIVER], },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: composeMessage(formData),
        },
      },
      Subject: {
        Data: composeSubject(formData),
        Charset: 'UTF-8',
      },
    },
  }
  ses.sendEmail(params, callback)
}
