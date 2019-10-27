'use strict';
const express = require('express');
const cors = require('cors');
const uuidv5 = require('uuid/v5');

// Firebase init
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Express and CORS middleware init
const app = express();
app.use(cors());

// POST / method
app.post("/", (req, res) => {
    const contact = {...req.body, key : uuidv5(req.body.birthday, '1b671a64-40d5-491e-99b0-da01ff1f3341')};

    return admin.database().ref('/contacts').push(contact)
        .then(() => {
            return res.status(200).send(contact)
        }).catch(error => {
            console.error(error);
            return res.status(500).send('Oh no! Error: ' + error);
        });
});

// GET / method
app.get("/", (req, res) => {
    return admin.database().ref('/contacts').on("value", snapshot => {
        return res.status(200).send(snapshot.val());
    }, error => {
        console.error(error);
        return res.status(500).send('Oh no! Error: ' + error);
    });
})

exports.contacts = functions.https.onRequest(app);