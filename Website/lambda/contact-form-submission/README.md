## contact-form-submission

This function is invoked from the website when the contact form is submitted. It
composes and sends an email with the contact form data.

### What to edit

  * Change the RECEIVER to your email address:
  ```
    var RECEIVER = 'example@example.com'
  ```
  * Change the SENDER to either yours (again) or something like "website@...":
  ```
    var SENDER = 'example@example.com'
  ```
  * The email Body, to match your contact form fields:
  ```
    Body: {
        Text: {
            Data: 'name: ' + event.name + '\nphone: ' + event.phone + '\nemail: ' + event.email + '\ndesc: ' + event.desc,
  ```
  * The email Subject, to match your contact form fields:
  ```
    Subject: {
        Data: 'Website Referral Form: ' + event.name,
  ```
