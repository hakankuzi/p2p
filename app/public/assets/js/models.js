const models = {};

models.department = {
    department: '',
    photoURL: '',
    situation: true,
    description: '',
    version: 0,
    registeredDate: new Date()
}

models.profile = {
    uid: '',
    photoURL: globe.config.default_profile_image_path,
    displayName: '',
    phoneNumber: '',
    username: '',
    password: '',
    email: '',
    biography: ''
}

models.level = {
    departmentId: '',
    description: '',
    level: '',
    situation: true,
    rootLevel: true,
    amount: 0,
    version: 0,
    registeredDate: new Date(),
}

models.lesson = {
    documentId: '',
    levelId: 'none',
    departmentId: 'none',
    no: 'none',
    topic: '',
    duration: '',
    description: '',
    situation: true,
    version: 0,
    registeredDate: new Date()
}

models.package = {
    departmentId: '',
    levelId: '',
    documentId: '',
    situation: true,
    packageType: globe.config.package_academy,
    subPackages: '',
    registeredDate: new Date(),
    special: '',
    duration: 0,
    version: 0,
    price: 0,
    agrement: '',
    description: '',
    isFree: false
}

models.group = {
    departmentId: 'none',
    situation: true,
    packageType: globe.config.package_academy,
    subPackages: globe.config.sub_package_group,
    registeredDate: new Date(),
    duration: 0,
    version: 0,
    price: 0,
    topic: ''
}

models.video = {
    departmentId: 'none',
    levelId: 'none',
    situation: true,
    packageType: globe.config.package_academy,
    subPackages: globe.config.sub_package_video,
    registeredDate: new Date(),
    duration: 0,
    version: 0,
    price: 0,
    topic: ''
}

models.package.properties = {
    price : 0,
    visible : false,
    selectedPackage: false,
    disabled: false,
    isAdded: false,
    isDuration: true,
    isPrice: false,
    isLevel: true,
    isLesson: false,
    isTopic: false,
    isTable: false,
    packages: [],
    tempList: [],
    lessons: [],
    versions: [],
    departments: [],
    levels: [],
    action: 'Save',
    modalAction: 'Add Level',
}