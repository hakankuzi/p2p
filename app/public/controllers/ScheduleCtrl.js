var ScheduleCtrl = angular.module('ScheduleCtrl', []);

ScheduleCtrl.controller('ScheduleController', function ($rootScope, $scope, CrudData, $location) {
    // -------------------------------------------------------------------------------------------
    $("#time").datetimepicker({
        autoclose: true,
        format: "hh:ii",
        startView: 1
    });
    // Preperation Calendar -----------------------------------------------------------------------
    var calendarEl = document.getElementById('calendar');
    let editable = false;
    if ($rootScope.user.status === globe.config.tutor || $rootScope.user.status === globe.config.admin) editable = true;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        titleFormat: { // will produce something like "Tuesday, September 18, 2018"
            month: 'long',
            year: 'numeric',
            day: 'numeric',
            weekday: 'long',
            hours12: false
        },
        plugins: ['interaction', 'dayGrid'],
        defaultDate: new Date().getTime(),
        editable: editable,
        eventLimit: true, // allow "more" link when too many events
        events: []
    });
    angular.forEach(calendar.getEvents(), (event) => {
        event.remove();
    });
    // ----------------------------------------------------------------------------------------------------
    calendar.on('dateClick', function (info) {
        // chech selected Date ----------------------------------------------------------------------------
        if ($rootScope.user.status === globe.config.tutor || $rootScope.user.status === globe.config.admin) {
            vm.scheduleData = models.createScheduleObj();
            vm.properties = models.createSchedulePropertiesObj();
            vm.properties.selectedInfoStr = info.dateStr;
            let situation = globe.findSelectedDateSituation(info.dateStr);
            if (situation === globe.config.previous) {
                alert('You cant select previous date')
            } else if (situation === globe.config.today || situation === globe.config.next) {
                vm.popModal('minemodal');
            }
        }
        // -----------------------------------------------------------------------------------------------  
    });

    // -----------------------------------------------------------------------------------------------  
    calendar.on('eventClick', (element) => {
        if ($rootScope.user.status = globe.config.tutor) {
            vm.properties.courseId = element.event.extendedProps.extraParams.courseId;
            CrudData.service({ parameter: 'courseId', documentId: vm.properties.courseId }, $rootScope.apis.getSchedulesByCourseId, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    alert('You cant delete this schedule, its scheduled !!!');
                } else {
                    vm.properties.doAction = 'DELETE SCHEDULE';
                    vm.properties.isCourse = true;
                    vm.properties.selectedScheduleId = element.event.extendedProps.extraParams.scheduleId;
                    vm.properties.showCourse = false;
                    vm.properties.showTime = false;
                    vm.popModal('minemodal');
                }
            });
        }
    });
    // -----------------------------------------------------------------------------------------------  






    calendar.render();

    // --------------------------------------------------------------------------------
    var vm = this;
    vm.scheduleData = models.createScheduleObj();
    vm.properties = models.createSchedulePropertiesObj();




    // --------------------------------------------------------------------------------
    vm.changeCourse = function () {


    }
    // --------------------------------------------------------------------------------
    vm.changeType = function () {

    }
    // --------------------------------------------------------------------------------
    vm.changeLevel = function () {

    }
    // --------------------------------------------------------------------------------
    vm.changeLesson = function () {

    }
    // --------------------------------------------------------------------------------
    vm.saveOrUpdate = function () {

    }
    // --------------------------------------------------------------------------------
    vm.popModal = function () {
        globe.popModal('minemodal');
    }
    // --------------------------------------------------------------------------------
    vm.hideModal = function () {
        globe.hideModal('minemodal');
    }




});