var globe = {}


globe.convertToTelFormat = function (Phone) {
    var first = Phone.substring(0, 3);
    var second = Phone.substring(3, 6);
    var third = Phone.substring(6, 8);
    var fourth = Phone.substring(8, 10);
    return first + " " + second + " " + third + " " + fourth;
}

globe.reConvertToTelFormat = function (Phone) {
    var first = Phone.substring(0, 3);
    var second = Phone.substring(4, 7);
    var third = Phone.substring(8, 10);
    var fourth = Phone.substring(11, 13);
    return first + "" + second + "" + third + "" + fourth;
}


globe.FindAttribute = function (contents, node, attr) {
    var regex = new RegExp('<' + node + ' .*?' + attr + '="(.*?)"', "gi"),
        result, res = [];
    while ((result = regex.exec(contents))) {
        res.push(result[1]);
    }
    return res;
}


globe.FindImages = function (contents, node, attr) {
    var $div = $('<div>').html(contents);
    $div.find('img').attr('src', function () {

        var item = this.outerHTML;
        var regex = new RegExp('<' + node + ' .*?' + attr + '="(.*?)"', "gi");
        var regexForName = new RegExp('<' + 'img' + ' .*?' + 'data-filename' + '="(.*?)"', "gi");
        var src64 = regex.exec(item)[1];
        var blob = new Blob([src64.split(/,(.+)/)], {
            type: 'image/png'
        });


        var PicName = regexForName.exec(item)[1];
        var PicFile = new File([blob], PicName);

        console.log(PicFile);

        var editedPicName = globe.convertSeoPath(PicName);
        var storageRef = firebase.storage().ref('/EssayImages/' + editedPicName);
        var uploadTask = storageRef.put(PicFile);
        uploadTask.on('state_changed', function (snapshot) {}, function (error) {}, function () {
            var storage = $firebaseStorage(storageRef);
            storage.$getDownloadURL().then(function (url) {
                console.log(url);
            });
        });
    });

    var processedHTML = $div.html();








}

globe.sortArray = function (data) {
    // sort by name
    return data.sort(function (a, b) {
        var nameA = a.name
        var nameB = b.name
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    });
}

globe.getDate = function () {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    curr_month++;
    if (curr_month < 10) {
        curr_month = "0" + curr_month;
    }
    if (curr_date < 10) {
        curr_date = "0" + curr_date;
    }
    var curr_year = d.getFullYear();
    curr_date = curr_date + "/" + curr_month + "/" + curr_year;
    return curr_date;
}

globe.getHoursAndMinutes = function () {

    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return hours + ":" + minutes;

}

globe.getExpertiseWithComma = function (items) {
    var text = "";
    angular.forEach(items, function (item) {
        text = text + item + ",";
    });
    var index = text.lastIndexOf(',');
    var text = text.substring(0, index);
    return text;
}


globe.shortText = function (text, index) {
    text = text.substring(0, index);
    text = text + "...";
    return text;
}

globe.getExtension = function (fileType) {
    var extension = fileType
    var extensions = ["image/jpeg", "image/png", ]
    var result = "fail"
    for (var i = 0; i < extensions.length; i++) {
        if (extension == extensions[i]) {
            result = "success"
            break;
        }
    }
    return result;
}

globe.getExtensionForCertificate = function (fileType) {

    var extension = fileType;
    var extensions = ["text/html", "image/jpeg", "image/png", "application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
    for (var i = 0; i < extensions.length; i++) {

        if (extension == extensions[i]) {
            if (extension == "image/jpeg" || extension == "image/png") {
                return "jpg"
            } else if (extension == "image/png") {
                return "jpg";
            } else if (extension == "application/pdf") {
                return "pdf";
            } else if (extension == "text/plain") {
                return "txt";
            } else if (extension == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                return "doc";
            } else if (extension == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                return "xls";
            } else if (extension == "text/html") {
                return "html";
            }

        }
    }
}

globe.convertSeoPath = function (item) {

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

globe.GetValueById = function (id) {
    var value = $('#' + id).val();
    return value;

}
globe.SetValueById = function (id, item) {
    $('#' + id).val(item);
}

globe.GetCityStateCountryAndCode = function (results) {

    var country = null,
        countryCode = null,
        city = null,
        cityAlt = null;
    var c, lc, component;


    for (var r = 0, rl = results.length; r < rl; r += 1) {
        var result = results[r];
        if (!city && result.types[0] === 'administrative_area_level_1') {
            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];
                if (component.types[0] === 'administrative_area_level_1') {
                    city = component.long_name;
                    break;
                }
            }
        } else if (!cityAlt && result.types[0] === 'administrative_area_level_2') {
            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];

                if (component.types[0] === 'administrative_area_level_2') {
                    cityAlt = component.long_name;
                    break;
                }
            }
        } else if (!country && result.types[0] === 'country') {
            country = result.address_components[0].long_name;
            countryCode = result.address_components[0].short_name;
        }
        if (city && country) {
            break;
        }
    }


    console.log(item);

    var item = {
        City: city,
        State: cityAlt,
        Country: country,
        CountryCode: countryCode,
        SearchCity: globe.convertSeoPath(city),
        SearchState: globe.convertSeoPath(cityAlt)
    }
    return item;
}