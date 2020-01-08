var TestCtrl = angular.module('TestCtrl', []);

TestCtrl.controller('TestController', function ($rootScope, TokBoxData, $location) {
    var vm = this;

    let item = {
        scheduleId : '123'
    }
    

    TokBoxData.createSession(item, (response)=>{
        if(response.data.status === '200' ){
            let sessionId = response.data.document.sessionId;
            item.sessionId = sessionId;

            TokBoxData.generateToken(item ,(response)=>{    
                if(response.data.status === '200'){    
                    let document = response.data.document;
                    let apiKey = '46488052';
                    let session = OT.initSession(apiKey, document.sessionId);
                    let publisher = OT.initPublisher('publisher', {
                        insertMode : 'append',
                        width : '100%',
                        height : '100%',
                    },(error)=>{
                        console.log(error);
                    });

                    session.connect(document.token, (error)=>{
                        if(error){
                            console.log(error);
                        }else{
                            session.publish(publisher,(error)=>{
                                console.log(error)
                            });
                        }
                    });
                }
            });
        }else{
            console.log(response.data);
        }
    });
});