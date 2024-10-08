var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var tableHead = document.getElementById("allUsersTableHead");
var tableBody = document.getElementById("allUsersTableBody");
var minorUsersTable = document.getElementById("minorUsersTable");
var minorsTableHead = document.getElementById("minorUsersTableHead");
var minorsTableBody = document.getElementById("minorUsersTableBody");
var searchUsersButton = document.getElementById("searchUsersButton");
var searchUsersInput = document.getElementById("searchUsersInput");
var searchResponseBox = document.getElementById("searchResponseBox");
var getAndDisplayUsers = function (userAttributesToFetch) {
    fetch("https://dummyjson.com/users?select=".concat(userAttributesToFetch))
        .then(function (res) { return res.json(); })
        .then(function (data) { return __spreadArray([], data.users, true); })
        .then(function (users) {
        if (users.length) {
            displayUsers(users);
            displayMinorUsers(users);
        }
    });
};
var addSortButtons = function (users, tableName) {
    var _loop_1 = function (key) {
        var buttonElementID = tableName + key + "SortButton";
        var sortButton = document.getElementById(buttonElementID);
        var ascendingOrder = true;
        sortButton.addEventListener("click", function () {
            sortUsersByKey(users, key, tableName, ascendingOrder);
            ascendingOrder = !ascendingOrder;
        });
    };
    for (var key in users[0]) {
        _loop_1(key);
    }
};
var sortUsersByKey = function (users, key, tableName, ascendingOrder) {
    var usersSortedByKey = __spreadArray([], users, true).sort(function (a, b) {
        switch (typeof a[key]) {
            case "number": return ascendingOrder ? a[key] - b[key] : b[key] - a[key];
            case "string": return ascendingOrder ? a[key].toUpperCase().localeCompare(b[key].toUpperCase()) : b[key].toUpperCase().localeCompare(a[key].toUpperCase());
            case "boolean": {
                var trueFirst = ascendingOrder ? a[key] : !a[key];
                return trueFirst ? -1 : 1;
            }
            default: return 0;
        }
    });
    var tableBodyElement = (tableName === "users" ? tableBody : minorsTableBody);
    tableBodyElement.innerHTML = '';
    usersSortedByKey.forEach(function (user) {
        addUserTableHTML(user, tableName);
    });
};
var displayUsers = function (users) {
    var tableName = "users";
    var tableHeadElement = (tableName === "users" ? tableHead : minorsTableHead);
    tableHeadElement.innerHTML = '';
    addTableHeadHTML(users[0], tableName);
    var tableBodyElement = (tableName === "users" ? tableBody : minorsTableBody);
    tableBodyElement.innerHTML = '';
    users.forEach(function (user) {
        addUserTableHTML(user, tableName);
    });
    addSortButtons(users, tableName);
};
var displayMinorUsers = function (users) {
    var minorUsers = users.filter(function (user) {
        return user.age < 30;
    });
    var tableName = "minorUsers";
    var minorUsersTableCaption = document.createElement("caption");
    if (minorUsers.length) {
        minorUsersTableCaption.innerHTML = "Sono presenti ".concat(minorUsers.length, " studenti minorenni:");
        addTableHeadHTML(minorUsers[0], tableName);
        minorUsers.forEach(function (minorUser) {
            addUserTableHTML(minorUser, tableName);
        });
    }
    else {
        minorUsersTableCaption.innerHTML = "Non sono presenti studenti minorenni.";
    }
    minorUsersTable.append(minorUsersTableCaption);
    addSortButtons(minorUsers, tableName);
};
var translateKeyToHeader = function (key) {
    switch (key) {
        case "id":
            return "ID";
        case "firstName":
            return "Nome";
        case "lastName":
            return "Cognome";
        case "birthDate":
            return "Data di Nascita";
        case "age":
            return "Età";
        default:
            return "";
    }
};
var addTableHeadHTML = function (user, tableName) {
    Object.keys(user).forEach(function (key) {
        var thElement = document.createElement("th");
        var keyElement = document.createElement("b");
        keyElement.innerHTML = translateKeyToHeader(key);
        thElement.appendChild(keyElement);
        var sortButton = document.createElement("button");
        var buttonID = "".concat(tableName).concat(key, "SortButton");
        sortButton.setAttribute("id", buttonID);
        sortButton.setAttribute("class", "sort-button");
        thElement.appendChild(sortButton);
        var iElement = document.createElement("i");
        iElement.setAttribute("class", "fa fa-sort");
        iElement.setAttribute("alt", "ordina per nome");
        sortButton.appendChild(iElement);
        var tableHeadElementID = (tableName === "users" ? tableHead : minorsTableHead);
        tableHeadElementID.appendChild(thElement);
    });
};
var addUserTableHTML = function (user, tableName) {
    var tableBodyElement = (tableName === "users" ? tableBody : minorsTableBody);
    var trUser = document.createElement("tr");
    tableBodyElement.appendChild(trUser);
    Object.keys(user).forEach(function (key) {
        var tdUser = document.createElement("td");
        tdUser.innerHTML = user[key];
        tableBodyElement.appendChild(tdUser);
    });
};
var searchUsers = function (searchKey, searchString, userAttributesToSearch) {
    searchResponseBox.innerHTML = '';
    fetch("https://dummyjson.com/users/filter?key=".concat(searchKey, "&value=").concat(searchString, "&select=").concat(userAttributesToSearch))
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var users = __spreadArray([], data.users, true);
        if (users.length) {
            searchResponseBox.innerHTML = "Ho trovato ".concat(users.length, " utenti che hanno il cognome \u2018").concat(searchString, "\u2019:");
            users.forEach(function (user, index) {
                var div = document.createElement("div");
                var birthDate = new Date(user.birthDate).toLocaleString().split(',')[0];
                div.innerHTML = "".concat(index + 1, ": ").concat(user.firstName, " ").concat(user.lastName, " ").concat(user.gender == 'female' ? 'nata' : 'nato', " il ").concat(birthDate, " a ").concat(user.address.city);
                searchResponseBox.append(div);
            });
        }
        else {
            searchResponseBox.innerHTML = "Non sono stati trovati utenti col cognome \u2018".concat(searchString, "\u2019.");
        }
    });
    searchResponseBox.style.display = "none";
};
var listenToSearchUsersButton = function () {
    var searchKey = "lastName";
    var searchString = searchUsersInput.value.trim();
    if (searchString.length) {
        searchString = searchString.charAt(0).toUpperCase() + searchString.slice(1).toLowerCase();
        var userAttributesToSearch = "id,firstName,lastName,birthDate,address,gender";
        searchUsers(searchKey, searchString, userAttributesToSearch);
    }
    else {
        searchResponseBox.innerHTML = "Inserisci il cognome per cercare.";
    }
};
var main = function () {
    var userAttributesToFetch = "id,firstName,lastName,birthDate,age";
    getAndDisplayUsers(userAttributesToFetch);
    searchUsersButton.addEventListener("click", listenToSearchUsersButton);
};
main();
//# sourceMappingURL=index.js.map