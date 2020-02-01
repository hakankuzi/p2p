var ScheduleCtrl = angular.module('ScheduleCtrl', []);

ScheduleCtrl.controller('ScheduleController', function ($rootScope, Core, $scope, CrudData, $location) {

    var vm = this;
    vm.scheduleData = models.createScheduleObj();
    vm.properties = models.createSchedulePropertiesObj();
    // -------------------------------------------------------------------------------------------
    getCourseByUserId(response => {
        if (response.data.status === globe.config.status_ok) {
            vm.properties.courses = response.data.list;
        }
    });
    // -------------------------------------------------------------------------------------------
    getScheduleByUserId(response => {
        if (response.data.status === globe.config.status_ok) {
            console.log('get schedule list');
        }
    });
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
    // ----------------------------------------------------------------------------------------------------
    calendar.on('eventDrop', (event, dayDelta, minuteDelta, allDay) => {
        if ($rootScope.user.status === globe.config.tutor) {
            let result = confirm('Are you sure update schedule?');
            if (result) {
                let scheduleId = event.oldEvent.extendedProps.extraParams.scheduleId;
                let oldRecord = Core.findRecordById(vm.properties.schedules, scheduleId);
                let today = new Date();
                let dropDate = new Date(event.event.start);
                if (dropDate < today) {
                    alert('You cant dropped to before than today !!!');
                    event.revert();
                } else {
                    CrudData.service({ documentId: scheduleId }, $rootScope.apis.deleteSchedule, (response) => {
                        if (response.data.status === globe.config.status_ok) {
                            oldRecord.startDate = event.event.start;
                            oldRecord.endDate = event.event.end;
                            CrudData.service(oldRecord, $rootScope.apis.addSchedule, (response) => {
                                if (response.data.status === globe.config.status_ok) {
                                    getScheduleByUserId(response => {
                                        vm.hideModal('minemodal');
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    });
    // ----------------------------------------------------------------------------------------------------
    calendar.on('dateClick', function (info) {
        // chech selected Date ----------------------------------------------------------------------------
        if ($rootScope.user.status === globe.config.tutor) {
            vm.properties.selectedInfoStr = info.dateStr;
            let situation = globe.findSelectedDateSituation(info.dateStr);
            if (situation === globe.config.previous) {
                alert('You cant select previous date')
            } else if (situation === globe.config.today || situation === globe.config.next) {
                vm.properties.showCourse = true;
                vm.properties.showTime = true;
                vm.properties.isCourse = false;
                vm.properties.actionType = 'add';
                vm.properties.doAction = 'ADD SCHEDULE';
                vm.popModal('minemodal');
                $rootScope.$apply();
            }
        }
        // -----------------------------------------------------------------------------------------------  
    });
    // -----------------------------------------------------------------------------------------------  
    calendar.on('eventClick', (element) => {
        if ($rootScope.user.status === globe.config.tutor) {
            let scheduleId = element.event.extendedProps.extraParams.scheduleId;
            let record = Core.findRecordById(vm.properties.schedules, scheduleId);
            vm.scheduleData.price = record.price;
            vm.scheduleData.duration = record.duration;
            vm.properties.courseId = element.event.extendedProps.extraParams.courseId;
            vm.properties.doAction = 'DELETE SCHEDULE';
            vm.properties.isCourse = true;
            vm.properties.actionType = 'delete';
            vm.properties.selectedScheduleId = element.event.extendedProps.extraParams.scheduleId;
            vm.properties.showCourse = false;
            vm.properties.showTime = false;
            vm.popModal('minemodal');
            $rootScope.$apply();
        }
    });
    // -----------------------------------------------------------------------------------------------  
    calendar.render();
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    vm.changeCourse = function () {
        let isNone = globe.isNone(vm.scheduleData.courseId);
        if (!isNone) {
            let item = Core.findRecordById(vm.properties.courses, vm.scheduleData.courseId);
            vm.scheduleData.price = item.price;
            vm.scheduleData.duration = item.duration;
        }
    }
    // --------------------------------------------------------------------------------
    vm.doCRUD = function () {
        if (vm.properties.actionType === 'delete') {
            let isNone = globe.isNone(vm.properties.selectedScheduleId);
            if (!isNone) {
                let record = Core.findRecordById(vm.properties.schedules, vm.properties.selectedScheduleId);
                CrudData.service({ documentId: record.documentId }, $rootScope.apis.deleteSchedule, (response) => {
                    if (response.data.status === globe.config.status_ok) {
                        getScheduleByUserId(response => {
                            vm.hideModal('minemodal');
                        });
                    }
                });
            } else {
                alert('selected event problem');
            }
        } else {
            let time = document.getElementById('time').value;
            let list = [];
            list.push(vm.scheduleData.courseId);
            list.push(time);
            let isValidate = globe.isValidate(list);
            if (isValidate) {
                let record = Core.findRecordById(vm.properties.courses, vm.scheduleData.courseId);
                vm.properties.selectedTime = time;
                vm.scheduleData.photoURL = record.photoURL;
                vm.scheduleData.departmentId = record.departmentId;
                vm.scheduleData.duration = record.duration;
                vm.scheduleData.price = record.price;
                vm.scheduleData.packageType = record.packageType;
                vm.scheduleData.userId = $rootScope.user.documentId;
                vm.scheduleData.course = record.course;
                let tempDate = new Date(vm.properties.selectedInfoStr);
                let index = time.indexOf(':');
                if (index != -1) {
                    let hour = time.substring(0, index);
                    let minutes = time.substring(index + 1);
                    tempDate.setHours(hour);
                    tempDate.setMinutes(minutes);
                }
                let startDate = new Date(tempDate).getTime();
                let endDate = new Date(tempDate).setTime(startDate + (vm.scheduleData.duration * 60 * 1000));
                let selectedLocalDate = tempDate.toLocaleDateString();
                let today = new Date().toLocaleDateString();
                let check = false;
                if (selectedLocalDate === today) {
                    let selectedTimeString = new Date(tempDate).toTimeString();
                    let todayTimeString = new Date().toTimeString();
                    if (selectedTimeString < todayTimeString) {
                        check = true;
                    }
                }
                if (check) {
                    alert('Please select a time after current hours !!!');
                } else {
                    // Check Hours Between Exist Schedule -------
                    let conflicts = [];
                    angular.forEach(vm.properties.schedules, (item) => {
                        let selectedLocalDate = tempDate.toLocaleDateString();
                        let existStartDate = new Date(item.startDate).toLocaleDateString();
                        let existEndDate = new Date(item.endDate).toLocaleDateString();
                        if (selectedLocalDate === existStartDate) {
                            if ((new Date(startDate).getTime() >= new Date(existEndDate).getTime())
                                || (new Date(endDate).getTime() <= new Date(existStartDate).getTime())) {
                                conflicts.push(false);
                            } else {
                                conflicts.push(true);
                            }
                        }
                    });
                    if (conflicts.includes(true)) {
                        alert('You have conflict with exist schedules !!!');
                    } else {
                        vm.scheduleData.startDate = new Date(startDate);
                        vm.scheduleData.endDate = new Date(endDate);
                        CrudData.service(vm.scheduleData, $rootScope.apis.addSchedule, (response) => {
                            if (response.data.status === globe.config.status_ok) {
                                getScheduleByUserId(response => {
                                    if (response.data.status === globe.config.status_ok) {
                                        vm.hideModal('minemodal');
                                    }
                                });
                            }
                        });
                    }
                }
            } else {
                alert('You have fill all inputs !!!')
            }
        }
    }
    // --------------------------------------------------------------------------------
    vm.popModal = function () {
        globe.popModal('minemodal');
    }
    // --------------------------------------------------------------------------------
    vm.hideModal = function () {
        vm.scheduleData.courseId = 'none';
        vm.scheduleData.price = 0;
        vm.scheduleData.duration = 0;
        vm.properties.selectedDate = 'none';
        document.getElementById('time').value = '';
        globe.hideModal('minemodal');
    }
    // --------------------------------------------------------------------------------
    function getCourseByUserId(callback) {
        CrudData.service({ parameter: 'userId', documentId: $rootScope.user.documentId }, $rootScope.apis.getCoursesByUserId, (response) => {
            if (response.data.status = globe.config.status_ok) {
                callback(response);
            } else {
                console.log(response.data);
            }
        });
    }
    // --------------------------------------------------------------------------------
    function getScheduleByUserId(callback) {
        if ($rootScope.user.status === globe.config.tutor) {
            let item = { parameter: 'userId', documentId: $rootScope.user.documentId };
            CrudData.service(item, $rootScope.apis.getSchedulesByUserId, (response) => {
                angular.forEach(calendar.getEvents(), (event) => {
                    event.remove();
                });
                if (response.data.status === globe.config.status_ok) {
                    vm.properties.schedules = response.data.list;
                    angular.forEach(vm.properties.schedules, (schedule) => {
                        let obj = {
                            title: schedule.course + " (" + schedule.duration + " minutes)",
                            start: schedule.startDate,
                            end: schedule.endDate,
                            extraParams: {
                                scheduleId: schedule.documentId,
                                isScheduled: schedule.isScheduled,
                                courseId: schedule.courseId
                            }
                        }
                        calendar.addEvent(obj);
                    });
                } else {
                    vm.properties.schedules = [];
                }
                callback(response);
            });
        }
    }
    // --------------------------------------------------------------------------------
});