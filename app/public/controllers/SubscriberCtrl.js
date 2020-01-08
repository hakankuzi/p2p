var SubscriberCtrl = angular.module('SubscriberCtrl', []);

SubscriberCtrl.controller('SubscriberController', function ($rootScope, $scope, $location, TokBoxData) {
    var vm = this;
    var session = null;
    $scope.message = '';
    $scope.connectionId = '';

    let item =  {
         scheduleId : '123'
    }

    TokBoxData.generateToken(item ,(response)=>{    
        if(response.data.status === '200'){    
            let document = response.data.document;
            let apiKey = '46488052';
            session = OT.initSession(apiKey, document.sessionId);
            // connect to session and publish ----------
            session.connect(document.token, (error)=>{
                if(error){
                    console.log(error);
                }else{
                    // stream listener -----------------------------------
                    session.on('streamCreated', (event)=>{
                        session.subscribe(event.stream, 'subscriber', {
                            insertMode : 'append',
                            width : '100%', 
                            height : '100%'
                        }, (error)=>{
                            console.log(error);
                        });
                    });
                    // ---------------------------------------------------

                    // signal listener -----------------------------------
                    session.on('signal:msg',(event)=>{
                        $scope.message = event.data;
                        console.log($scope.message);
                       // $scope.connectionId = event.from.connectionId === session.connectionId.connectionId ? 'mine' : 'theirs';
                    });
                    // ---------------------------------------------------

                }
            });
            // -----------------------------------------
        }
    });




    


});