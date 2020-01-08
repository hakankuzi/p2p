var SubscriberCtrl = angular.module('SubscriberCtrl', []);

SubscriberCtrl.controller('SubscriberController', function ($rootScope, $location, TokBoxData) {
    var vm = this;

    let item =  {
         scheduleId : '123'
    }
    TokBoxData.getSessionByScheduleId(item, (response)=>{
        if(response.data.status === '200' ){
            let apiKey = '46488052';
            let session = OT.initSession(apiKey, response.data.sessionId);

            
            session.on('streamCreated', (event)=>{
                session.subscribe(event.stream, 'subscriber', {
                    insertMode : 'append',
                    width : '100%', 
                    height : '100%'
                }, (error)=>{
                    console.log(error);
                });
            });
        }
    });
});