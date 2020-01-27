const globe = {}

globe.config = {
    image_width: 4096,
    image_height: 4096,
    default_profile_image_path: "assets/img/avatar.jpg",
    default_storage_path: "/Images/",
    status_ok: '200',
    status_409: '409',
    statust_401: '401',
    sub_package_level: "level",
    sub_package_video: "video",
    sub_package_group: 'group',
    package_academy: "academy",
    package_p2p: "p2p",
    package_group: "group",
    tutor: "tutor",
    student: "student",
    admin: "admin"
}

globe.messages = {
    empty_item: 'Yo cant send empty object :|',
    warning_upload_image_resolution: 'Profile image height and width cannot be greater than 4096px:|',
    invalid_image_format: 'The file you selected should be in .png or .jpg format :|',
}


globe.isNone = function (variable) {
    if (variable === 'none' || variable === undefined) {
        return true;
    } else {
        return false;
    }
}
globe.popModal = function (id) {
    $('#' + id).modal('show');
}

globe.hideModal = function (id) {
    $('#' + id).modal('hide');
}


