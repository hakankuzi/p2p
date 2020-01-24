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
    levels: [],
    lesson : {},
    departmentId: '',
    levelId: '',
    no: '',
    topic: '',
    duration: '',
    description: '',
    situation: true,
    version: 0,
    registeredDate: new Date()
}