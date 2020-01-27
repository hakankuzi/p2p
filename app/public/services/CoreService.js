'use strict'
var CoreService = angular.module('CoreService', []);
CoreService.service('Core', function ($http, CrudData, $q) {
    let coreService = {};

    coreService.createNewVersion = function (collection, model, methodName, callback) {
        var version = (model.version + 1);
        let control = false;
        // check situation -------------------------------------
        angular.forEach(collection, (item) => {
            if (item.version === version) {
                control = true;
            }
        });
        // -------------------------------------------------------------
        if (control) {
            console.log('exist version');
        } else {
            model.rootLevel = false;
            model.version = version;
            model.registeredDate = new Date();
            CrudData.service(model, methodName, (response) => {
                callback(response);
            });
        }
    }
    // ---------------------------------------------------------------------------------------------
    coreService.saveOrUpdateWithPhoto = function (storage, item, methodName, image, isSave, callback) {
        let isEmpty = angular.equals({}, image);
        if (isSave) {
            if (isEmpty !== true
                && isEmpty !== globe.config.status_409
                && isEmpty !== globe.config.statust_401) {
                coreService.uploadPhoto(storage, image.item, (response) => {
                    if (response.status === globe.config.status_ok) {
                        item.photoURL = response.photoURL;
                        CrudData.service(item, methodName, (response) => {
                            if (response.data.status === globe.config.status_ok) {
                                callback({ status: globe.config.status_ok })
                            }
                        });
                    }
                });
            }
        } else {
            if (isEmpty !== true
                && image.item.size === true
                && image.item.changed === true) {
                coreService.uploadPhoto(storage, image.item, (response) => {
                    if (response.status === globe.config.status_ok) {
                        item.photoURL = response.photoURL;
                        CrudData.service(item, methodName, (response) => {
                            if (response.data.status === globe.config.status_ok) {
                                callback({ status: globe.config.status_ok })
                            }
                        });
                    }
                });
            } else {
                CrudData.service(item, methodName, (response) => {
                    if (response.data.status === globe.config.status_ok) {
                        callback({ status: globe.config.status_ok })
                    }
                });
            }
        }
    }
    // -----------------------------------------------------
    coreService.uploadPhoto = function (storage, image, callback) {
        let formattedName = coreService.doFormat(image.name);
        let ref = storage.ref(globe.config.default_storage_path + formattedName);
        ref.put(image.file).then((snapshot) => {
            snapshot.ref.getDownloadURL().then(function (url) {
                callback({ status: globe.config.status_ok, photoURL: url });
            });
        }).catch(err => {
            callback({ status: globe.config.status_409, err: err })
        });
    }
    // -----------------------------------------------------
    coreService.previewPhoto = function (element, path, callback) {
        let size = null;
        let width = null;
        let height = null;
        let changed = null;
        let name = element.files[0].name;
        let type = element.files[0].type;
        let file = element.files[0];
        if (!coreService.getExtension(type)) {
            callback({ status: globe.config.status_409, message: globe.messages.invalid_image_format, item: globe.config.default_profile_image_path })
        } else {
            var reader = new FileReader();
            reader.onload = function (e) {
                width = this.width;
                height = this.height;
                if (width > globe.config.width || height > globe.config.height) {
                    size = false;
                    callback({ status: globe.config.status_409, message: globe.messages.warning_upload_image_resolution, item: globe.config.default_profile_image_path });
                } else {
                    size = true;
                    changed = true;
                    path = e.target.result // Base64 
                    callback({ status: globe.config.status_ok, message: 'preview success', item: { file: file, name: name, path: path, changed: changed, size: size } });
                }
            }
            reader.readAsDataURL(file);
        }
    }
    // ---------------------------------------------------------------------------------------------
    coreService.findRecordById = function (list, documentId) {
        let item = null;
        angular.forEach(list, (record) => {
            if (record.documentId == documentId) {
                item = record;
            }
        });
        return item;
    }
    // ---------------------------------------------------------------------------------------------
    coreService.findHierarchy = function (collection) {
        let levels = []
        for (let i = 0; i < collection.length; i++) {
            if (collection[i].rootLevel === true) {
                let level = { rootLevel: true, root: collection[i], levels: [] };
                for (let k = 0; k < collection.length; k++) {
                    if (collection[k].rootLevel === false && collection[k].levelId === level.root.documentId) {
                        level.levels.push(collection[k]);
                    }
                }
                levels.push(level);
            }
        }
        return levels;
    }
    // ---------------------------------------------------------------------------------------------
    coreService.getExtension = function (type) {
        var extension = type
        var extensions = ["image/jpeg", "image/png",]
        var result = false;
        for (var i = 0; i < extensions.length; i++) {
            if (extension == extensions[i]) {
                result = true
                break;
            }
        }
        return result;
    }
    // ---------------------------------------------------------------------------------------------
    coreService.doFormat = function (item) {
        item = item.split('İ').join('i');
        item = item.split('I').join('i');
        item = item.split('Ç').join('c');
        item = item.split('Ö').join('ö');
        item = item.split('Ü').join('ü');
        item = item.split(' ').join('-');
        item = item.split('Ş').join('s');
        item = item.split(',').join('');
        item = item.split("'").join('');
        item = item.split(':').join('');
        item = item.split(';').join('');
        item = item.split('?').join('-');
        item = item.split('ç').join('c');
        item = item.split('ğ').join('g');
        item = item.split('ı').join('i');
        item = item.split('ö').join('o');
        item = item.split('ü').join('u');
        item = item.split('ş').join('s');
        item = item.split('#').join('-');
        item = item.split('!').join('');
        item = item.split('.').join('');
        item = item.toLowerCase();
        return item;
    }
    // ---------------------------------------------------------------------------------------------
    return coreService;
});