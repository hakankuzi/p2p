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
    photoURL: 'assets/img/avatar.jpg',
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
    packageType: '',
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
    packageType: "academy",
    subPackages: "group",
    registeredDate: new Date(),
    duration: 0,
    version: 0,
    price: 0,
    topic: ''
}