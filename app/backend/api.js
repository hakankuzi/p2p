// Dependencies --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('../backend/keys.json');
const collections = require('../backend/collections.json');
const secretKey = keys.secretKey;
const encryptionSecretKey = keys.encryptionSecretKey;
const aes256 = require('aes256');
const menus = require('../backend/menus.json');
const firebaseConfig = require('../backend/firebase-config.json')

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


// Encryption and Decryption ------------------------
function encrypt(plainText) {
    let encrypted = aes256.encrypt(encryptionSecretKey, plainText);
    return encrypted;
}
function decrypt(encrypted) {
    let plainText = aes256.decrypt(encryptionSecretKey, encrypted);
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
                user.documentId = snapshot.docs[0].id;
                let password = decrypt(user.passwordHash);
                user.password = password
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
            biography: item.biography,
            photoURL: item.photoURL,
            roles: item.roles,
            status: item.status,
            phoneNumber: item.phoneNumber,
            userSituation: item.userSituation,
            displayName: item.displayName,
            registeredDate: item.registeredDate,
            passwordHash: passwordHash,
        }).then((doc) => {
            item.documentId = doc.id;
            user.uid = userRecord.uid;
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


// ------------------------------------------------------------
router.post('/getFirebaseConfig', (req, res) => {
    let item = req.body.item;
    res.json({
        status: '200',
        message: 'firebase config',
        config: firebaseConfig
    });
});
// ------------------------------------------------------------

// ------------------------------------------------------------
router.post('/me', (req, res) => {
    let token = req.body.token || req.body.query || req.headers['x-access-token'];
    jwt.verify(token, secretKey, (err, decoded) => {
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
        password: item.password,
    }).then((userRecord) => {
        passwordHash = encrypt(item.password);
        dbstore.collection('users').doc(item.documentId).update({
            email: item.email,
            phoneNumber: item.phoneNumber,
            passwordHash: passwordHash,
            displayName: item.displayName,
            photoURL: item.photoURL,
            biography: item.biography
        }).then(function () {
            res.json({
                status: '200',
                message: 'profile updated'
            });
        }).catch(function (err) {
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
let tokboxApiKey = keys.tokboxApiKey;
let tokboxSecretKey = keys.tokboxSecretKey;
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
router.post('/getLevelsByDepartmentId', (req, res) => {
    let item = req.body.item;
    getCollectionByParameterId(collections.levels, item, res);
});

router.post('/getPackageByDocumentId', (req, res) => {
    let item = req.body.item;
    getCollectionByDocumentId(collections.packages, item, res);

});
// ----------------------------------------------------------------------------
router.post('/getLessonsByLevelIdAndVersion', (req, res) => {
    let item = req.body.item;
    console.log(item);
    getCollectionByMultipleParameterIds(collections.lessons, item, res);
});
// ----------------------------------------------------------------------------
router.post('/getDepartments', (req, res) => {
    getCollections(collections.departments, res);
});
// ----------------------------------------------------------------------------
router.post('/getCourses', (req, res) => {
    getCollections(collections.courses, res);
});
// ----------------------------------------------------------------------------
router.post('/addPackage', (req, res) => {
    let item = req.body.item;
    addRecord(collections.packages, item, res);
});
// ----------------------------------------------------------------------------
router.post('/addDepartment', (req, res) => {
    let item = req.body.item;
    let payload = {
        department: item.department,
        description: item.description,
        photoURL: item.photoURL,
        situation: item.situation,
        version: item.version,
        registeredDate: item.registeredDate
    }
    addRecord(collections.departments, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/addLevel', (req, res) => {
    let item = req.body.item;
    let payload = item;
    addRecord(collections.levels, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/addLesson', (req, res) => {
    let item = req.body.item;
    let payload = item;
    addRecord(collections.lessons, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/updatePackage', (req, res) => {
    let item = req.body.item;
    let documentId = item.documentId;
    let payload = {
        special: item.special,
        package: item.package,
        description: item.description,
        agrement: item.agrement
    };
    updateRecord(collections.packages, documentId, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/updateLesson', (req, res) => {
    let item = req.body.item;
    let documentId = item.documentId;
    let payload = {
        topic: item.topic,
        description: item.description,
        duration: item.duration,
    }
    updateRecord(collections.lessons, documentId, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/updatePackage', (req, res) => {
    let item = req.body.item;
    let documentId = item.documentId;
    let payload = {
        special: item.special,
        package: item.package,
        description: item.description,
        agrement: item.agrement
    }
    updateRecord(collections.packages, documentId, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/updateLevel', (req, res) => {
    let item = req.body.item;
    let documentId = item.documentId;
    let payload = {
        departmentId: item.departmentId,
        description: item.description,
        level: item.level,
        amount: item.amount,
        rootLevel: true,
        situation: item.situation,
        version: item.version,
        registeredDate: item.registeredDate
    }
    updateRecord(collections.levels, documentId, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/updateDepartment', (req, res) => {
    let item = req.body.item;
    let documentId = item.documentId;
    let payload = {
        department: item.department,
        description: item.description,
        photoURL: item.photoURL,
        situation: item.situation,
        version: item.version,
        registeredDate: item.registeredDate
    }
    updateRecord(collections.departments, documentId, payload, res);
});
// ----------------------------------------------------------------------------
router.post('/getPaymentsByUid', (req, res) => {
    let item = req.body.item;
    getCollectionByParameterId(collections.payments, item, res)
});
// ----------------------------------------------------------------------------
router.post('/getPackagesByDepartmentId', (req, res) => {
    let item = req.body.item;
    getCollectionByParameterId(collections.packages, item, res)
});
// ----------------------------------------------------------------------------
function updateRecord(collectionName, documentId, payload, res) {
    dbstore.collection(collectionName).doc(documentId).update(payload).then(function () {
        res.json({
            status: '200',
            message: 'updated'
        });
    }).catch(function (err) {
        res.json({
            status: '409',
            message: err.message,
            user: null
        });
    });
}
// ----------------------------------------------------------------------------
function getCollectionByMultipleParameterIds(collectionName, item, res) {
    dbstore.collection(collectionName)
        .where(item.parameterOneId, '==', item.parameterOneValue)
        .where(item.parameterTwoId, '==', item.parameterTwoValue).get().then(snapshot => {
            if (snapshot.docs.length !== 0) {
                let list = toList(snapshot);
                res.json({
                    status: '200',
                    message: 'success list',
                    list: list
                });
            } else {
                res.json({
                    status: '409',
                    message: 'no record',
                    list: null
                });
            }
        }).catch(err => {
            res.json({
                status: '409',
                message: err,
                list: null
            });
        });
}
// ----------------------------------------------------------------------------
function getCollectionByDocumentId(collectionName, item, res) {
    dbstore.collection(collectionName).doc(item.documentId).get().then(snapshot => {
        if (snapshot.exists) {
            let document = snapshot.data();
            document.documentId = snapshot.id;
            let list = [];
            list.push(document);
            res.json({
                status: '200',
                message: 'success list',
                list: list
            });
        } else {
            res.json({
                status: '409',
                message: 'no record',
                list: null
            });
        }
    }).catch(err => {
        res.json({
            status: '409',
            message: err,
            list: null
        });
    });
}
// ----------------------------------------------------------------------------
function getCollectionByParameterId(collectionName, item, res) {
    dbstore.collection(collectionName).where(item.parameter, '==', item.documentId).get().then(snapshot => {
        if (snapshot.docs.length !== 0) {
            let list = toList(snapshot);
            res.json({
                status: '200',
                message: 'success list',
                list: list
            });
        } else {
            res.json({
                status: '409',
                message: 'no record',
                list: null
            });
        }
    }).catch(err => {
        res.json({
            status: '409',
            message: err,
            list: null
        });
    });
}
// ----------------------------------------------------------------------------
function getCollections(collectionName, res) {
    dbstore.collection(collectionName).get().then((snapshot) => {
        if (snapshot.docs.length === 0) {
            res.json({
                status: '409',
                message: 'no list',
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
}
// ----------------------------------------------------------------------------
function addRecord(collectionName, payload, res) {
    dbstore.collection(collectionName).add(payload).then((doc) => {
        res.json({
            status: '200',
            message: 'added successfully',
            document: doc,
        });
    }).catch(err => {
        res.json({
            status: '409',
            message: err.message,
            code: err.code,
            document: null
        });
    });
}
// ----------------------------------------------------------------------------


// Return Router
module.exports = router;