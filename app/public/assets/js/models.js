const models = {};

models.department = {
    documentId: '',
    department: '',
    photoURL: '',
    situation: true,
    description: '',
    version: 0,
    registeredDate: new Date()
}


models.profile = {
    documentId: '',
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
    documentId: '',
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
    departmentId: '',
    levelId: '',
    no: '',
    topic: '',
    duration: '',
    description: '',
    situation: true,
    TopicSeoPath: null,
    version: 0,
    registeredDate: new Date()
}