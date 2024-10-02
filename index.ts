// Get elements from the HTML document
let tableHead: HTMLElement | null = document.getElementById("allUsersTableHead");
let tableBody: HTMLElement | null = document.getElementById("allUsersTableBody");

let minorUsersTable: HTMLElement | null = document.getElementById("minorUsersTable");
let minorsTableHead: HTMLElement | null = document.getElementById("minorUsersTableHead");
let minorsTableBody: HTMLElement | null = document.getElementById("minorUsersTableBody");

let searchUsersButton: HTMLElement | null = document.getElementById("searchUsersButton");
let searchUsersInput = document.getElementById("searchUsersInput") as HTMLInputElement;
let searchUsersTableHead: HTMLElement | null = document.getElementById("searchUsersTableHead");
let searchUsersTableBody: HTMLElement | null = document.getElementById("searchUsersTableBody");

// Define a user type
interface UserType {
    [key: string]: any; // Needed to call the content by attribute key, user[key]
    id?: number;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    age?: number;
}


// Function to get users array by attributes specified in the input parameter userAttributesToFetch
// Return an empty array if no users are found to avoid the void error
const getAndDisplayUsers = (userAttributesToFetch: string) => {
    fetch(`https://dummyjson.com/users?select=${userAttributesToFetch}`)
        .then((res) => res.json())
        // Extract users list from the fetch() result
        .then((data) => [...data.users])
        .then((users) => {
            // If the users array is not empty..
            if (users.length) {
                // Display the fetched users
                displayUsers(users);

                // Listen to buttons
                for (const key in users[0]) {
                    const buttonElementID = key + "SortButton";
                    const sortButton: HTMLElement = document.getElementById(buttonElementID);

                    sortButton.addEventListener("click", () => {
                        // console.log(`\n${key} sort button is clicked!\n`);
                        const sorted = [...users].sort((a: UserType, b: UserType) => {
                            return (a[key]).toUpperCase() > (b[key]).toUpperCase() ? 1 : -1
                        });
                        tableBody.innerHTML = '';
                        sorted.forEach((user) => {
                            addUserTableHTML(user, tableBody);
                        });
                    });
                }
                // ● Indicare la presenza di eventuali studenti minorenni
                displayMinorUsers(users);
            }
        });
}

const displayUsers = (users: UserType[]) => {
    // ● Nome, cognome e data di nascita di tutti gli utenti
    tableHead.innerHTML = '';
    addTableHeadHTML(users[0], tableHead);

    tableBody.innerHTML = '';
    users.forEach((user) => {
        addUserTableHTML(user, tableBody);
    });
}

// Function to list the minor users
// ● Indicare la presenza di eventuali studenti minorenni
const displayMinorUsers = (users: UserType[]) => {
    const minorUsers: UserType[] = users.filter((user) => {
        return user.age < 30;
    });

    const minorUsersTableCaption: HTMLElement = document.createElement("caption");
    if (minorUsers.length) {
        minorUsersTableCaption.innerHTML = `Sono presenti ${minorUsers.length} studenti minorenni:`;
        addTableHeadHTML(users[0], minorsTableHead);
        minorUsers.forEach((minorUser) => {
            addUserTableHTML(minorUser, minorsTableBody);
        });
    } else {
        minorUsersTableCaption.innerHTML = "Non sono presenti studenti minorenni.";
    }
    minorUsersTable.append(minorUsersTableCaption);
};

// Function to translate a user attribute key (string) to a friendly header in Italian
const translateKeyToHeader = (key: string): string => {
    switch (key) {
        case "id":
            return "ID";
        case "firstName":
            return "Nome";
        case "lastName":
            return "Cognome";
        case "birthDate":
            return "Data di Nascita"
        case "age":
            return "Età";
        default:
            return "";
    }
}

// Function to add head titles to the table HTML code
const addTableHeadHTML = (user: UserType, tableHeadElement: HTMLElement) => {
    Object.keys(user).forEach((key) => {
        // Create HTML elements for the headers
        const thElement: HTMLElement = document.createElement("th");
        const keyElement: HTMLElement = document.createElement("b");
        // Translate the headers to Italian
        keyElement.innerHTML = translateKeyToHeader(key);
        thElement.appendChild(keyElement);

        // Create a search button indide each header
        const sortButton: HTMLElement = document.createElement("button");
        const buttonID = `${key}SortButton`;
        sortButton.setAttribute("id", buttonID);
        sortButton.setAttribute("class", "sort-button");
        thElement.appendChild(sortButton);

        // Add a graphic icon to the button
        const iElement: HTMLElement = document.createElement("i");
        iElement.setAttribute("class", "fa fa-sort");
        iElement.setAttribute("alt", "ordina per nome");
        sortButton.appendChild(iElement);

        // Add the final HTML code of each table header
        tableHeadElement.appendChild(thElement);
    });
};

// Function to add a single user entry to the table HTML code
const addUserTableHTML = (user: UserType, tableBodyElement: HTMLElement) => {
    // Create a row HTML code
    const trUser: HTMLElement = document.createElement("tr");
    tableBodyElement.appendChild(trUser);
    // Add each of the user attributes (key) of the user
    Object.keys(user).forEach((key) => {
        const tdUser: HTMLElement = document.createElement("td");
        tdUser.innerHTML = user[key];
        tableBodyElement.appendChild(tdUser);
    });
};

// Function to search users by a search key and print only specific attributes of matching users
const searchUsers = (searchKey: string, searchString: string, userAttributesToSearch: string) => {
    searchUsersTableHead.innerHTML = '';
    searchUsersTableBody.innerHTML = '';
    fetch(`https://dummyjson.com/users/filter?key=${searchKey}&value=${searchString}&select=${userAttributesToSearch}`)
        .then(res => res.json())
        .then((data) => {
            // console.log(users);
            const users: UserType[] = [...data.users];
            if (users.length) {
                const div = document.createElement("div");
                div.innerHTML = `Ho trovato ${users.length} utenti che hanno cognome ‘${searchString}’:`
                searchUsersTableBody.appendChild(div);
                users.forEach((user: UserType, index: number) => {
                    const div = document.createElement("div");
                    const birthDate = new Date(user.birthDate).toLocaleString().split(',')[0];
                    //console.log(birthDate);

                    // 1: Mario Rossi nato il 23/09/2000 a Palermo
                    // 2: Giulio Rossi nato il 11/09/2023 a Torino
                    div.innerHTML = `${index + 1}: ${user.firstName} ${user.lastName} ${user.gender == 'female' ? 'nata' : 'nato'} il ${birthDate} a ${user.address.city}`;
                    searchUsersTableBody.appendChild(div);
                });
            } else {
                searchUsersTableBody.innerHTML = `Non sono stati trovati utenti col cognome ‘${searchString}’.`;
            }

        });
}

// ******** MAIN LOOP ********
// Specify attributes to fetch from the database
const userAttributesToFetch = `id,firstName,lastName,birthDate,age`;
getAndDisplayUsers(userAttributesToFetch);

/* Esercizio 6 - Parte 1:
Ricerca per cognome
Realizzare una function che, dato il cognome, restituisce i dettagli di tutti gli utenti con quel
cognome, contattando le api di dummyjson.
https://dummyjson.com/docs/users#users-search */

searchUsersButton.addEventListener("click", () => {
    //console.log('Search button clicked!', searchUsersInput.value);
    const searchKey = `lastName`;
    // Remove spaces from the input string;
    let searchString: string = searchUsersInput.value.trim();
    if (searchString.length) {
        // Convert input string to the database format - Capitalised
        searchString = searchString.charAt(0).toUpperCase() + searchString.slice(1).toLowerCase();
        // Choose search parameters for the assignment
        const userAttributesToSearch = `id,firstName,lastName,birthDate,address,gender`;
        searchUsers(searchKey, searchString, userAttributesToSearch);
    } else {
        searchUsersTableBody.innerHTML = `Inserisci il cognome per cercare.`;
    }
});
