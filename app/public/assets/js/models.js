const models = {};


models.getNewDate = function () {
    return new Date();
}

models.createCourseObj = function () {
    models.course = new Object();
    models.course.documentId = 'none';
    models.course.departmentId = 'none';
    models.course.packageId = 'none';
    models.course.course = '';
    models.course.photoURL = '';
    models.course.situation = true;
    models.course.levels = [];
    models.course.groups = [];
    models.course.videos = [];
    models.course.subPackages = [];
    models.course.packageType = 'none';
    models.course.registeredDate = models.getNewDate();
    models.course.duration = 0;
    models.course.price = 0;
    models.course.userId = 'none';
    return models.course;
}

models.createCoursePropertiesObj = function () {
    let properties = new Object();
    properties.isDepartment = false;
    properties.departments = [];
    properties.isPackage = true;
    properties.packages = [];
    properties.isPrice = true;
    properties.isDuration = true;
    properties.isCourse = true;
    properties.coursePicName = '';
    properties.action = 'ADD COURSE';
    properties.selectedCourse = false;
    properties.visible = false;
    properties.courses = [];
    properties.package = {};
    properties.image = {};
    properties.isSave = true;
    return properties;
}

models.createSchedulePropertiesObj = function () {
    models.schedule.properties = new Object();
    models.schedule.properties.courseId = 'none';
    models.schedule.properties.selectedSchedule = false;
    models.schedule.properties.doAction = 'ADD SCHEDULE';
    models.schedule.properties.selectedType = 'none';
    models.schedule.properties.isType = false;
    models.schedule.properties.isDuration = true;
    models.schedule.properties.isPrice = true;
    models.schedule.properties.isTopic = false;
    models.schedule.properties.isAcademy = false;
    models.schedule.properties.showCourse = false;
    models.schedule.properties.showTime = false;
    models.schedule.properties.selectedScheduleId = 'none';
    models.schedule.properties.selectedDate = 'none';
    models.schedule.properties.selectedInfoStr = 'none';
    models.schedule.properties.clickInfo = 'none';
    models.schedule.properties.courses = [];
    models.schedule.properties.levels = [];
    models.schedule.properties.lessons = [];
    models.schedule.properties.packages = [];
    models.schedule.properties.schedules = [];
    return models.schedule.properties;
}

models.createCandidatePropertiesObj = function () {
    models.candidate.properties = new Object();
    models.candidate.properties.isDepartment = false;
    models.candidate.properties.departments = [];
    models.candidate.properties.isPackage = false;
    models.candidate.properties.packages = [];
    models.candidate.properties.action = 'No Action';
    models.candidate.properties.selectedCandidate = false;
    models.candidate.properties.visible = false;
    models.candidate.properties.candidates = [];
    return models.candidate.properties;
}

models.createCandidateObj = function () {
    models.candidate = new Object();
    models.candidate.documentId = 'none';
    models.candidate.departmentId = 'none';
    models.candidate.packageId = 'none';
    models.candidate.email = '';
    models.candidate.displayName = '';
    models.candidate.username = '';
    return models.candidate;
}

models.createScheduleObj = function () {
    models.schedule = new Object();
    models.schedule.courseId = 'none';
    models.schedule.photoURL = '';
    models.schedule.departmentId = 'none';
    models.schedule.duration = 0;
    models.schedule.price = 0;
    models.schedule.isScheduled = false;
    models.schedule.lessonId = 'none';
    models.schedule.levelId = 'none';
    models.schedule.liveSituation = 'soon';
    models.schedule.liveDuration = 0;
    models.schedule.situation = true;
    models.schedule.packageId = 'none';
    models.schedule.packageType = '';
    models.schedule.students = [];
    models.schedule.topic = '';
    models.schedule.version = 0;
    models.schedule.userId = 'none';
    models.schedule.startDate = '';
    models.schedule.endDate = '';
    
    return models.schedule;
}

models.createSignupObj = function () {
    models.signup = new Object();
    models.signup.uid = 'none';
    models.signup.photoURL = globe.config.default_profile_image_path;
    models.signup.username = ''
    models.signup.biography = '';
    models.signup.phoneNumber = '';
    models.signup.email = '';
    models.signup.password = '';
    models.signup.roles = [globe.config.package_p2p, globe.config.package_group];
    models.signup.status = globe.config.tutor;
    models.signup.situation = true;
    models.signup.displayName = '';
    models.signup.registeredDate = models.getNewDate();
    models.signup.courses = [];
    return models.signup;
}

models.createDepartmentObj = function () {
    models.department = new Object();
    models.department.department = '';
    models.department.photoURL = '';
    models.department.situation = true;
    models.department.description = '';
    models.department.version = 0;
    models.department.registeredDate = models.getNewDate();
    return models.department;
}

models.createProfileObj = function () {
    models.profile = new Object();
    models.profile.documentId = 'none'
    models.profile.uid = 'none';
    models.profile.photoURL = globe.config.default_profile_image_path;
    models.profile.displayName = '';
    models.profile.phoneNumber = '';
    models.profile.username = '';
    models.profile.password = '';
    models.profile.email = '';
    models.profile.biography = '';
    return models.profile;
}

models.createLevelObj = function () {
    models.level = new Object();
    models.level.documentId = 'none';
    models.level.departmentId = 'none';
    models.level.description = '';
    models.level.level = '';
    models.level.situation = true;
    models.level.rootLevel = true;
    models.level.amount = 0;
    models.level.version = 0;
    models.level.registeredDate = models.getNewDate();
    return models.level;
}

models.createLessonObj = function () {
    models.lesson = new Object();
    models.lesson.documentId = 'none';
    models.lesson.levelId = 'none';
    models.lesson.departmentId = 'none';
    models.lesson.no = 'none';
    models.lesson.topic = '';
    models.lesson.duration = '';
    models.lesson.description = '';
    models.lesson.situation = true;
    models.lesson.version = 0;
    models.lesson.registeredDate = models.getNewDate();
    return models.lesson;
}

models.createPackageObj = function () {
    models.package = new Object();
    models.package.departmentId = 'none';
    models.package.levelId = 'none';
    models.package.amount = 0;
    models.package.documentId = 'none';
    models.package.situation = true;
    models.package.packageType = globe.config.package_academy;
    models.package.subPackage = 'none';
    models.package.registeredDate = models.getNewDate();
    models.package.special = '';
    models.package.duration = 0;
    models.package.version = 0;
    models.package.agrement = '';
    models.package.description = '';
    models.package.isFree = false;
    return models.package;
}

models.createGroupObj = function () {
    models.group = new Object();
    models.group.departmentId = 'none';
    models.group.situation = true;
    models.group.packageType = globe.config.package_academy;
    models.group.subPackage = globe.config.sub_package_group;
    models.group.registeredDate = models.getNewDate();
    models.group.duration = 0;
    models.group.version = 0;
    models.group.price = 0;
    models.group.topic = '';
    return models.group;
}

models.createVideoObj = function () {
    models.video = new Object();
    models.video.departmentId = 'none';
    models.video.levelId = 'none';
    models.video.amount = 0;
    models.video.situation = true;
    models.video.packageType = globe.config.package_academy;
    models.video.subPackage = globe.config.sub_package_video;
    models.video.registeredDate = models.getNewDate();
    models.video.duration = 0;
    models.video.version = 0;
    models.video.price = 0;
    models.video.topic = '';
    return models.video;;
}


models.createPackageProperties = function () {
    models.package.properties = new Object();
    models.package.properties.disabled = false;
    models.package.properties.price = 0;
    models.package.properties.duration = 0;
    models.package.properties.visible = false;
    models.package.properties.selectedPackage = false;
    models.package.properties.disabled = false;
    models.package.properties.isAdded = false;
    models.package.properties.isDuration = true;
    models.package.properties.isPrice = false;
    models.package.properties.isLevel = true;
    models.package.properties.isLesson = false;
    models.package.properties.isTopic = false;
    models.package.properties.isTable = false;
    models.package.properties.isSave = true;
    models.package.properties.packages = [];
    models.package.properties.tempList = [];
    models.package.properties.lessons = [];
    models.package.properties.versions = [];
    models.package.properties.departments = [];
    models.package.properties.levels = [];
    models.package.properties.videos = [];
    models.package.properties.subPackages = [];
    models.package.properties.action = 'Save';
    models.package.properties.modalAction = 'Add Level';
    return models.package.properties;
}
