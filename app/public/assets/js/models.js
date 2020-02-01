const models = {};


models.getNewDate = function () {
    return new Date();
}

models.createP2PObj = function () {
    models.video = new Object();
    return models.videos;
}

models.createP2PPropertiesObj = function () {
    let properties = new Object();
    properties.mute = 'MUTE';
    properties.message = '';
    properties.schedules = [];
    properties.session = 'none';
    properties.visible = false;
    properties.selectedSession = false;
    properties.rating = 75;
    properties.cameraSituation = '';
    return properties;
}

models.createVideoObj = function () {
    models.video = new Object();
    models.video.departmentId = 'none';
    models.video.levelId = 'none';
    models.video.lessonId = 'none';
    models.video.version = 'none';
    models.video.link = '';
    return models.videos;
}

models.createVideoPropertiesObj = function () {
    let properties = new Object();
    properties.isDepartment = false;
    properties.isVersion = true;
    properties.isLevel = true;
    properties.isLesson = true;
    properties.departments = [];
    properties.versions = [];
    properties.levels = [];
    properties.lessons = [];
    properties.videos = [];
    properties.action = 'ADD VIDEO';
    return properties;
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

models.createScheduleObj = function () {
    models.schedule = new Object();
    models.schedule.documentId = 'none';
    models.schedule.course = '';
    models.schedule.courseId = 'none';
    models.schedule.photoURL = '';
    models.schedule.departmentId = 'none';
    models.schedule.duration = 0;
    models.schedule.description = '';
    models.schedule.topic = '';
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
    models.schedule.version = 0;
    models.schedule.userId = 'none';
    models.schedule.startDate = '';
    models.schedule.endDate = '';
    return models.schedule;
}

models.createSchedulePropertiesObj = function () {
    let properties = new Object();
    properties.courseId = 'none';
    properties.selectedSchedule = false;
    properties.doAction = 'ADD SCHEDULE';
    properties.selectedType = 'none';
    properties.isType = false;
    properties.isDuration = true;
    properties.isPrice = true;
    properties.isTopic = false;
    properties.isAcademy = false;
    properties.showCourse = false;
    properties.showTime = false;
    properties.selectedTime = '';
    properties.actionType = 'add';
    properties.selectedScheduleId = 'none';
    properties.selectedDate = 'none';
    properties.selectedInfoStr = 'none';
    properties.clickInfo = 'none';
    properties.courses = [];
    properties.levels = [];
    properties.lessons = [];
    properties.packages = [];
    properties.schedules = [];
    return properties;
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
models.createCandidatePropertiesObj = function () {
    let properties = new Object();
    properties.isDepartment = false;
    properties.departments = [];
    properties.isPackage = false;
    properties.packages = [];
    properties.action = 'No Action';
    properties.selectedCandidate = false;
    properties.visible = false;
    properties.candidates = [];
    return properties;
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
    models.department.photoURL = 'none';
    models.department.situation = true;
    models.department.description = '';
    models.department.version = 0;
    models.department.registeredDate = models.getNewDate();
    return models.department;
}

models.createDepartmentPropertiesObj = function () {
    let properties = new Object();
    properties.selectedDepartment = false;
    properties.action = 'SAVE';
    properties.isSave = true;
    properties.picName = '';
    properties.image = {};
    properties.message = '';
    properties.departments = [];
    return properties;
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
    models.lesson.videoLink = '';
    models.lesson.situation = true;
    models.lesson.version = 0;
    models.lesson.registeredDate = models.getNewDate();
    return models.lesson;
}

models.createLessonPropertiesObj = function () {
    let properties = new Object();
    properties.action = 'Save';
    properties.isSave = true;
    properties.departments = [];
    properties.levels = [];
    properties.versions = [];
    properties.lessons = [];
    properties.numbers = [];
    properties.selectedLesson = false;
    return properties;
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

models.createPackageProperties = function () {
    let properties = new Object();
    properties.disabled = false;
    properties.price = 0;
    properties.duration = 0;
    properties.visible = false;
    properties.selectedPackage = false;
    properties.disabled = false;
    properties.isAdded = false;
    properties.isDuration = true;
    properties.isPrice = false;
    properties.isLevel = true;
    properties.isLesson = false;
    properties.isTopic = false;
    properties.isTable = false;
    properties.isSave = true;
    properties.packages = [];
    properties.tempList = [];
    properties.lessons = [];
    properties.versions = [];
    properties.departments = [];
    properties.levels = [];
    properties.videos = [];
    properties.subPackages = [];
    properties.action = 'Save';
    properties.modalAction = 'Add Level';
    return properties;
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


