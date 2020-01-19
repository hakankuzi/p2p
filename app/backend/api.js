// Dependencies --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('../backend/keys.json');
const secretKey = keys.secretKey;
const encryption_secret_key = keys.encryption_secret_key;
const aes256 = require('aes256');
const menus = require('../backend/menus.json');

// Encryption and Decryption -------------
function encrypt(plainText) {
    let encrypted = aes256.encrypt(encryption_secret_key, plainText);
    return encrypted;
}
function decrypt(encrypted) {
    let plainText = aes256.decrypt(encryption_secret_key, encrypted);
    return plainText.toString();
}
// ---------------------------------------

const router = express.Router();

// Firebase Connection --------------------
const fbadmin = require('firebase-admin');
const account = require('../backend/accountkey.json');

// Initialize Firebase
fbadmin.initializeApp({
    credential: fbadmin.credential.cert(account),
    databaseURL: "https://online-school-dev.firebaseio.com",
    storageBucket: "online-school-dev.appspot.com",
    serviceAccountId: "firebase-adminsdk-sazk4@online-school-dev.iam.gserviceaccount.com"
});

const dbstore = fbadmin.firestore();
const auth = fbadmin.auth();
const storeage = fbadmin.storage();
const bucket = storeage.bucket();


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
            return { status: '409', result: err.message }
        } else {
            return { status: '200', result: decoded }
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

// AUTH PROCESS ----------------------------------------
router.post('/getMenusByRoles', (req, res) => {
    let item = req.body.item;
    var list = [];
    for (var i = 0; i < menus.length; i++) {
        var arr = menus[i];
        var items = arr.roles;
        for (var k = 0; k < items.length; k++) {
            var auth = items[k];
            if (item.roles.includes(auth)) {
                list.push(menus[i]);
                break;
            }
        }
    }
    if (list.length !== 0) {
        res.json({
            status: '200',
            message: 'menus by roles',
            list: list
        });
    } else {
        res.json({
            status: '409',
            message: 'no menus by roles',
            menus: null
        });
    }
});
// ----------------------------------------------------
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
        if (userRecord) {
            dbstore.collection('users').where('passwordHash', '==', userRecord.passwordHash).get().then(snapshot => {
                if (snapshot.docs.length !== 0) {
                    let user = snapshot.docs[0].data();
                    let email = decrypt(user.email);
                    console.log(email);
                    let passwordHash = user.passwordHash;
                    if (email === item.email && passwordHash === userRecord.passwordHash) {
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
                            user: null,
                            token: null
                        });
                    }
                } else {
                    res.json({
                        status: '409',
                        message: 'no user',
                        user: null,
                        token: null
                    });
                }
            }).catch(err => {
                res.json({
                    status: '409',
                    message: 'no user',
                    user: null,
                    token: null
                });
            });
        } else {
            res.json({
                status: '409',
                message: 'no user',
                user: null,
                token: null
            });
        }
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
    let valid = verifyUserToken(token);
    if (valid.status === '200') {
        if (valid.result) {
            res.json({
                status: '412',
                message: 'token invalid',
                user: null
            });
        } else {
            res.json({
                status: '200',
                message: 'me',
                user: valid.result
            });
        }
    } else {
        res.json({
            status: '412',
            message: 'token invalid',
            user: null
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