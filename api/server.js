const app = require('express')()
const fs = require('fs')
const bodyParser = require('body-parser')
const axios = require('axios')
const fileUpload = require('express-fileupload');
app.use(fileUpload());

const aws = require('aws-sdk');
const { json } = require('body-parser');

aws.config.update({
  endpoint: process.env.ENDPOINT,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
})

const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: 'sgn',
})

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.post('/upload', async (req, res) => {
  try {
    const key = Date.now() + '-' + req.files.file.name
    const tmp = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AddPerm",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
            "s3:PutObject",
            "s3:PutObjectAcl",
            "s3:GetObject"
          ],
          "Resource": "arn:aws:s3:::delxpro.com/*"
        }
      ]
    }
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: req.files.file.data,
      ACL: 'public-read',
      ContentType: req.files.file.mimetype,
      Policy: JSON.stringify(tmp)
    }

    await s3.upload(params, (err, data) => {
      if (data) {
        return res.json({ status: 1, data: data.Location })
      }
      if (err) {
        return err
      }
    })
  } catch (error) {
    return res.json(error)
  }
})

module.exports = app
