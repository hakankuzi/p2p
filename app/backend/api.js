// Dependencies --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('../backend/keys.json');
const secretKey = keys.secretKey;
const encryption_secret_key = keys.encryption_secret_key;
const aes256 = require('aes256');
const menus = require('../backend/menus.json');

// Router --------------------------------
const router = express.Router();
// ---------------------------------------

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

// Encryption and Decryption ------------------------
function encrypt(plainText) {
    let encrypted = aes256.encrypt(encryption_secret_key, plainText);
    return encrypted;
}
function decrypt(encrypted) {
    let plainText = aes256.decrypt(encryption_secret_key, encrypted);
    return plainText.toString();
}
// ----------------------------------------------------
function createUserToken(user) {
    let token = jwt.sign(user, secretKey, {
        expiresIn: '24h'
    });
    return token;
};
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

function getMenusByRoles(roles) {
    var list = [];
    for (var i = 0; i < menus.length; i++) {
        var arr = menus[i];
        var items = arr.roles;
        for (var k = 0; k < items.length; k++) {
            var auth = items[k];
            if (roles.includes(auth)) {
                list.push(menus[i]);
                break;
            }
        }
    }
    return list;
}

// AUTH PROCESS ----------------------------------------
// ----------------------------------------------------
router.post('/getUserWithEmailAndPassword', (req, res) => {
    let item = req.body.item;
    auth.getUserByEmail(item.email).then(userRecord => {
        dbstore.collection('users').where('email', '==', item.email).get().then(snapshot => {
            if (snapshot.docs.length !== 0) {
                let user = snapshot.docs[0].data();
                let password = decrypt(user.passwordHash);
                if (item.password === password && item.email === user.email) {
                    let token = createUserToken(user);
                    user.token = token;
                    res.json({
                        status: '200',
                        message: 'user success',
                        user: user
                    });
                } else {
                    res.json({
                        status: '409',
                        message: 'entered wrong password',
                        code: 'wrong-password',
                        user: null
                    });
                }
            } else {
                res.json({
                    status: '409',
                    message: 'user authenticated but no in db',
                    code: 'record in db',
                    user: null
                });
            }
        }).catch(err => {
            res.json({
                status: '409',
                message: 'no user',
                code: err.code,
                user: null
            });
        });
    }).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            code: err.code,
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
        passwordHash = encrypt(item.password);
        dbstore.collection('users').add({
            uid: userRecord.uid,
            email: item.email,
            username: item.username,
            courses: item.courses,
            profilePicPath: item.profilePicPath,
            roles: item.roles,
            status: item.status,
            userSituation: item.userSituation,
            nameSurname: item.nameSurname,
            registeredDate: item.registeredDate,
            passwordHash: passwordHash,
        }).then(() => {
            let token = createUserToken(item);
            let user = { item, token };
            res.json({
                status: '200',
                message: 'created new user',
                user: user,
            });
        }).catch(err => {
            res.json({
                status: '409',
                message: err.message,
                code: err.code,
                user: null,
                token: null
            });
        });
    }).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            code: err.code,
            user: null,
            token: null
        });
    });
});
// ----------------------------------------------------



// *************************************************************
// MiddleWare --------------------------------------------------
router.use(function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.json({
                    status: '409',
                    message: 'invalid token',
                    user: null
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
});
// -------------------------------------------------------------
// *************************************************************


// ----------------------------------------------------
router.post('/me', (req, res) => {
    let item = req.body.item;
    jwt.verify(item.token, secretKey, (err, decoded) => {
        if (err) {
            res.json({
                status: '409',
                message: 'invalid token',
                user: null
            });
        } else {
            let menus = getMenusByRoles(decoded.roles);
            user = decoded;
            user.menus = menus;
            res.json({
                status: '200',
                message: 'me',
                user: user
            });
        }

    });
});
// ------------------------------------------------------------


// ------------------------------------------------------------
router.post('/getMenusByRoles', (req, res) => {
    let item = req.body.item;
    let list = getMenusByRoles(item.roles);
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
// ------------------------------------------------------


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

// CRUD PROGRESSING -----------------------------------------------------------
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
// ----------------------------------------------------------------------------





// Return Router
module.exports = router;