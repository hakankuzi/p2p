const models = {};


models.getNewDate = function () {
    return new Date();
}

models.createSignupObj = function () {
    models.signup = new Object();
    models.signup.uid = 'none';
    models.signup.photoURL = globe.config.default_profile_image_path;
    models.signup.username = '';
    models.signup.biography = '';
    models.signup.phoneNumber = '';
    models.signup.email = '';
    models.signup.password = '';
    models.signup.roles = [globe.config.package_p2p, globe.config.package_group];
    models.signup.status = globe.config.student;
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
