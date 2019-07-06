importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '440868485826'
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = payload.data.title;
    var notificationOptions = {
        body: payload.data.description,
        icon: payload.data.image,
        click_buttom: payload.data.url
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});