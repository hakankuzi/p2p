// Dependencies --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = "tokbox";
const router = express.Router();


// Encryption and Decryption -------------
var crypto = require('crypto');
const password = 'crypto@123';
// ----------------------------------------

// Firebase Connection --------------------
const fbadmin = require('firebase-admin');
const account = require('../backend/accountKey.json');

// Initialize Firebase
fbadmin.initializeApp({
    credential: fbadmin.credential.cert(account),
    databaseURL: "https://online-school-dev.firebaseio.com",
    storageBucket: "online-school-dev.appspot.com",
    serviceAccountId: "firebase-adminsdk-sazk4@online-school-dev.iam.gserviceaccount.com"
});

const dbstore = fbadmin.firestore();
const auth = fbadmin.auth();


// ----------------------------------------------------
function createUserToken(user) {
    let token = jwt.sign(user, secretKey, {
        expiresIn: '24h'
    });
    return token;
};
// ----------------------------------------------------
function verifyUserToken(token) {
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.json({
                status: '412',
                message: 'token invalid'
            });
        } else {
            return decoded;
        }
    });
}
// ----------------------------------------------------
function toList(snapshot) {
    let list = [];
    snapshot.docs.forEach(function (doc) {
        var document = doc.data();
        document.documentId = doc.id;
        list.push(document);
    });
    return list
}
// ----------------------------------------------------
function encrypt(text) {
    const cipher = crypto.createCipher('aes128', secretKey);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encrypted) {

    const decipher = crypto.createDecipher('aes128',secretKey);
    var decrypted = decipher.update(encrypted,'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log(decrypted);
}
// ----------------------------------------------------


// AUTH PROCESS ----------------------------------------
router.post('/getUser', (req, res) => {
    let item = req.body.item;
    auth.getUser(item.uid).then(userRecord => {
        let token = createUserToken(userRecord.toJSON());
        res.json({
            status: '200',
            message: 'get new user',
            user: userRecord,
            token: token
        });
    }).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            user: null,
            token: null
        });
    });
});
// ----------------------------------------------------
router.post('/getUserWithEmailAndPassword', (req, res) => {
    let item = req.body.item;
    auth.getUserByEmail(item.email).then(userRecord => {


        decrypt(userRecord.email);


        dbstore.collection('users')
            .where('email', '==', decrypt(userRecord.email))
            .where('passwordHash', '==', userRecord.passwordHash).get().then(snapshot => {
                if (snapshot.docs.length !== 0) {
                    let token = createUserToken(userRecord.toJSON());
                    res.json({
                        status: '200',
                        message: 'user success',
                        user: userRecord,
                        token: token
                    });
                } else {
                    res.json({
                        status: '409',
                        message: 'no user',
                        token: null
                    });
                }
            }).catch(err => {
                res.json({
                    status: '409',
                    message: err.message,
                    user: null
                });
            });
    }).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            user: null
        });
    });
});
// ----------------------------------------------------
router.post('/createUser', (req, res) => {
    let item = req.body.item;
    auth.createUser({
        email: item.email,
        password: item.password,
    }).then(userRecord => {
        dbstore.collection('users').add({
            email: encrypt(userRecord.email),
            passwordHash: userRecord.passwordHash,
        }).then(() => {
            let token = createUserToken(userRecord.toJSON());
            res.json({
                status: '200',
                message: 'created new user',
                user: userRecord,
                token: token
            });
        }).catch(err => {
            res.json({
                status: '409',
                message: err.message,
                user: null,
                token: null
            });
        });
    }).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            user: null,
            token: null
        });
    });
});
// ----------------------------------------------------
router.post('/updateUser', (req, res) => {
    let item = req.body.item;
    auth.updateUser(item.uid, {
        email: item.email,
        phoneNumber: item.phoneNumber,
        emailVerified: item.emailVerified,
        password: item.password,
        displayName: item.displayName,
        photoURL: item.photoURL,
    }).then((userRecord) => {
        res.json({
            status: '200',
            message: 'updated user',
            user: userRecord
        })
    }).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            user: null
        });
    });
});
// ----------------------------------------------------
router.post('/deleteUser', (req, res) => {
    let item = req.body.item;
    auth.deleteUser(item.uid)
        .then(function () {
            res.json({
                status: '200',
                message: 'deleted user',
            });
        })
        .catch(function (err) {
            res.json({
                status: '409',
                message: err.message,
            });
        });
});
// ----------------------------------------------------
router.post('/listAllUsers', (req, res) => {
    let item = req.body.item;
    let list = [];
    auth.listUsers(item.amount).then((listUsersResult => {
        listUsersResult.users.forEach(userRecord => {
            list.push(userRecord.toJSON());
        });
        res.json({
            status: '200',
            message: 'list user records',
            list: list
        });
    })).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            list: null
        });
    });
});
// ----------------------------------------------------
router.post('/me', (req, res) => {
    let decoded = verifyUserToken(token);
    if (decoded) {
        res.json({
            status: '412',
            message: 'token invalid',
            user: null
        });
    } else {

        res.json({
            status: '200',
            message: 'me',
            user: decoded
        });
    }
});
// ------------------------------------------------------


// *************************************************************
// MiddleWare --------------------------------------------------
router.use(function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
        req.decoded = verifyUserToken(token);
        next();
    } else {
        res.json({
            status: 412,
            message: 'token not exist'
        });
    }
});
// -------------------------------------------------------------
// *************************************************************


// CRUD PROGRESSING ------------------------------------
router.post('/getCourses', (req, res) => {
    let item = req.body.item;
    dbstore.collection('courses').get().then((snapshot) => {
        if (snapshot.docs.length === 0) {
            res.json({
                status: '409',
                message: 'no course',
                list: []
            });
        } else {
            let list = toList(snapshot);
            res.json({
                status: '200',
                message: 'success list',
                list: list
            });
        }
    }).catch(err => {
        res.json({
            status: '409',
            message: err,
            list: []
        });
    });
});




// Tokbox -----------------------------------------------
const OpenTok = require('opentok');
let tokboxApiKey = '46488052';
let tokboxSecretKey = '2c86770ac45f5ac8ae8860356535e97af293a116';
const opentok = new OpenTok(tokboxApiKey, tokboxSecretKey);

// get sessionId by scheduleId --------------------------------------------------------- 
router.post('/getSessionByScheduleId', (req, res) => {
    let item = req.body.item;
    dbstore.collection('sessions').where('scheduleId', '==', item.scheduleId).get().then((snapshot) => {
        if (snapshot.docs.length === 0) {
            res.json({
                status: '409',
                message: 'no session',
                sessionId: null
            });
        } else {
            let document = snapshot.docs[0].data();
            res.json({
                status: '200',
                message: 'got successfully',
                sessionId: document.sessionId
            });
        }
    }).catch((error) => {
        res.json({
            status: '409',
            message: error,
            sessionId: null
        });
    });
});
// -------------------------------------------------------------------------------

// generating Tokens -------------------------------------------------------------
router.post('/generateToken', (req, res) => {
    let item = req.body.item;
    dbstore.collection('sessions').where('scheduleId', '==', item.scheduleId).get().then((snapshot) => {

        if (snapshot.docs.length === 0) {
            res.json({
                status: '409',
                message: 'no session'
            });
        } else {
            let item = snapshot.docs[0].data();
            let token = opentok.generateToken(item.sessionId);
            item.token = token
            res.json({
                status: '200',
                message: 'got successfully',
                document: item
            });
        }
    }).catch((error) => {
        res.json({
            status: '409',
            message: error,
            document: null
        });
    });
});
// -------------------------------------------------------------------------------


// Create a session that will attempt to transmit streams directly between clients
// If clients cannot connect, the session uses the OpenTok TURN SERVER
// create tokbox session ----------------------------------------------------------
router.post('/createSession', (req, res) => {
    let item = req.body.item;
    opentok.createSession((err, session) => {
        if (err) {
            res.json({
                status: '409',
                message: err,
                document: null
            });
        } else {
            // save the sessionId
            item.sessionId = session.sessionId;
            item.mediaMode = session.mediaMode;
            item.archiveMode = session.archiveMode;
            dbstore.collection('sessions').add(item).then((snapshot => {
                res.json({
                    status: '200',
                    message: 'session is created successfully',
                    document: item
                });
            })).catch((error) => {
                res.json({
                    status: '409',
                    message: error,
                    document: null
                });
            });
        }
    });
});
// ----------------------------------------------------------------------------


// 





// -----------------------------------------------------

// MiddleWare -------------------------
router.use(function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
        // verify token
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.json({
                    status: 412,
                    message: 'Token invalid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        res.json({
            status: 412,
            message: 'No token provide'
        });
    }
});





// Return Router
module.exports = router;