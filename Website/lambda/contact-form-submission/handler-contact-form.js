'use strict'

var AWS = require('aws-sdk')
var ses = new AWS.SES()

var RECEIVER = 'example@example.com'
var SENDER = 'example@example.com'

module.exports.main = async (event, context) => {
  sendEmail(event, function (err, data) {
      context.done(err, null)
  })
}

function sendEmail (event, done) {
    var params = {
        Destination: {
            ToAddresses: [
                RECEIVER
            ]
        },
        Message: {
            Body: {
                Text: {
                    Data: 'name: ' + event.name + '\nphone: ' + event.phone + '\nemail: ' + event.email + '\ndesc: ' + event.desc,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: 'Website Referral Form: ' + event.name,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    }
    ses.sendEmail(params, done)
}
