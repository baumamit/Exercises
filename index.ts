// Get elements from the HTML document
let tableHead: HTMLElement | null = document.getElementById("allUsersTableHead");
let tableBody: HTMLElement | null = document.getElementById("allUsersTableBody");

let minorUsersTable: HTMLElement | null = document.getElementById("minorUsersTable");
let minorsTableHead: HTMLElement | null = document.getElementById("minorUsersTableHead");
let minorsTableBody: HTMLElement | null = document.getElementById("minorUsersTableBody");

let searchUsersButton: HTMLElement | null = document.getElementById("searchUsersButton");
let searchUsersInput = document.getElementById("searchUsersInput") as HTMLInputElement;
let searchResponseBox: HTMLElement | null = document.getElementById("searchResponseBox");

// Define a user type
interface UserType {
    [key: string]: any; // Needed for refering to the content of an object by an attribute key, user[key]
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    age: number;
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
            // ● Indicare la presenza di eventuali studenti minorenni
            displayMinorUsers(users);
        }
    });
}

// Function to add a sort button to each column of the users table
const addSortButtons = (users: UserType[], tableName: string) => {
    for (const key in users[0]) {
        // Generate a unique ID by the key attribute
        const buttonElementID = tableName + key + "SortButton";
        // Get a specific button element with the unique id
        const sortButton: HTMLElement = document.getElementById(buttonElementID);
        
        // Set a toggle attribute to reverse the sorting direction on each click
        let ascendingOrder = true;
        
        sortButton.addEventListener("click", () => {
            sortUsersByKey(users, key, tableName, ascendingOrder)
            // Toggle ascending/descending order
            ascendingOrder = !ascendingOrder;
        });
    }
}

// Function to sort a users array by a givven key with the choise for ascending or descending order
const sortUsersByKey = (users: UserType[], key: string, tableName: string, ascendingOrder: boolean) => {
    // console.log(`\n${key} sort button is clicked!\n`);
    const usersSortedByKey = [...users].sort((a: UserType, b: UserType) => {
        switch (typeof a[key]) {
            // Sort numbers by ascending or descending order
            case "number": return ascendingOrder ? a[key]-b[key] : b[key]-a[key];
            // Sort strings by ascending or descending order alphabetic order: A --> Z
            case "string": return ascendingOrder ? a[key].toUpperCase().localeCompare(b[key].toUpperCase()) : b[key].toUpperCase().localeCompare(a[key].toUpperCase());
            // Sort boolean values where `true` values first or last
            case "boolean": {
                const trueFirst = ascendingOrder ? a[key] : !a[key];
                return trueFirst ? -1 : 1;
            }
            default: return 0;
        }
    });
    
    // Choose the correct table body elelment by table name
    const tableBodyElement = ( tableName === "users" ? tableBody : minorsTableBody );
    // Clear the body of the users table
    tableBodyElement.innerHTML = '';
    usersSortedByKey.forEach((user) => {
        addUserTableHTML(user, tableName);
    });
}

// ● Nome, cognome e data di nascita di tutti gli utenti
const displayUsers = (users: UserType[]) => {
    const tableName = "users"
    // Choose the correct table head elelment by table name
    const tableHeadElement = ( tableName === "users" ? tableHead : minorsTableHead );
    // Clear the head of the users table
    tableHeadElement.innerHTML = '';
    
    addTableHeadHTML(users[0], tableName);
    
    // Choose the correct table body elelment by table name
    const tableBodyElement = ( tableName === "users" ? tableBody : minorsTableBody );
    // Clear the body of the users table
    tableBodyElement.innerHTML = '';
    users.forEach((user) => {
        addUserTableHTML(user, tableName);
    });
    
    // Add sort buttons to a users table headers
    addSortButtons(users, tableName)
}

// Function to list the minor users
// ● Indicare la presenza di eventuali studenti minorenni
const displayMinorUsers = (users: UserType[]) => {
    // Filter to keep only underage users
    const minorUsers: UserType[] = users.filter((user) => {
        return user.age < 30;
    });
    
    const tableName = "minorUsers"
    
    // Create an HTML element for displaying a notice as the caption of the minor users table
    const minorUsersTableCaption: HTMLElement = document.createElement("caption");
    // If there are minors in the users database..
    if (minorUsers.length) {
        // Report minors count in the caption of the minor users table
        minorUsersTableCaption.innerHTML = `Sono presenti ${minorUsers.length} studenti minorenni:`;
        addTableHeadHTML(minorUsers[0], tableName);
        minorUsers.forEach((minorUser) => {
            addUserTableHTML(minorUser, tableName);
        });
    } else {
        // Report that minors were found in the caption of the minor users table
        minorUsersTableCaption.innerHTML = "Non sono presenti studenti minorenni.";
    }
    minorUsersTable.append(minorUsersTableCaption);
    
    // Add sort buttons to a users table headers
    addSortButtons(minorUsers, tableName);
    
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
const addTableHeadHTML = (user: UserType, tableName: string) => {
    Object.keys(user).forEach((key) => {
        // Create HTML elements for the headers
        const thElement: HTMLElement = document.createElement("th");
        const keyElement: HTMLElement = document.createElement("b");
        // Translate the headers to Italian
        keyElement.innerHTML = translateKeyToHeader(key);
        thElement.appendChild(keyElement);
        
        // Create a search button indide each header
        const sortButton: HTMLElement = document.createElement("button");
        // Create a unique id for each newly created sort button
        const buttonID = `${tableName}${key}SortButton`;
        // Set the unique button id
        sortButton.setAttribute("id", buttonID);
        // Add a general CSS class for all the sort buttons
        sortButton.setAttribute("class", "sort-button");
        // Insert the sort button to the head element of the users table
        thElement.appendChild(sortButton);
        
        // Add a graphic icon to the button
        const iElement: HTMLElement = document.createElement("i");
        iElement.setAttribute("class", "fa fa-sort");
        // Set alternative text for disabled accessibility 
        iElement.setAttribute("alt", "ordina per nome");
        sortButton.appendChild(iElement);
        // Choose the correct table head element id
        const tableHeadElementID = ( tableName==="users" ? tableHead : minorsTableHead );
        // Add the final HTML code of each table header
        tableHeadElementID.appendChild(thElement);
    });
};

// Function to add a single user entry to the table HTML code
const addUserTableHTML = (user: UserType, tableName: string) => {
    // Choose the correct table body elelment by table name
    const tableBodyElement = ( tableName==="users" ? tableBody : minorsTableBody );
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
    // Clear previous search results
    searchResponseBox.innerHTML = '';
    fetch(`https://dummyjson.com/users/filter?key=${searchKey}&value=${searchString}&select=${userAttributesToSearch}`)
    .then(res => res.json())
    .then((data) => {
        // console.log(users);
        const users: UserType[] = [...data.users];
        if (users.length) {
            // Create a response box
            searchResponseBox.innerHTML = `Ho trovato ${users.length} utenti che hanno il cognome ‘${searchString}’:`
            
            // Fill in the response content
            users.forEach((user: UserType, index: number) => {
                const div = document.createElement("div");
                const birthDate = new Date(user.birthDate).toLocaleString().split(',')[0];
                // 1: Mario Rossi nato il 23/09/2000 a Palermo
                // 2: Giulio Rossi nato il 11/09/2023 a Torino
                div.innerHTML = `${index + 1}: ${user.firstName} ${user.lastName} ${user.gender == 'female' ? 'nata' : 'nato'} il ${birthDate} a ${user.address.city}`;
                searchResponseBox.append(div);
            });
        } else {
            searchResponseBox.innerHTML = `Non sono stati trovati utenti col cognome ‘${searchString}’.`;
        }
        
    });
    searchResponseBox.style.display = "none"
}

// Function to search on click users with the last name that match the input search box
const listenToSearchUsersButton = () => {
    /* Esercizio 6 - Parte 1: Ricerca per cognome
    Realizzare una function che, dato il cognome, restituisce i dettagli di tutti gli utenti con quel
    cognome, contattando le api di dummyjson.
    https://dummyjson.com/docs/users#users-search */
    //console.log(searchKey);
    const searchKey = "lastName";
    //console.log('Search button clicked!', searchUsersInput.value);
    // Remove spaces from the input string;
    let searchString: string = searchUsersInput.value.trim();
    if (searchString.length) {
        // Convert input string to the database format - Capitalised
        searchString = searchString.charAt(0).toUpperCase() + searchString.slice(1).toLowerCase();
        // Choose search parameters for the assignment
        const userAttributesToSearch = `id,firstName,lastName,birthDate,address,gender`;
        searchUsers(searchKey, searchString, userAttributesToSearch);
    } else {
        searchResponseBox.innerHTML = `Inserisci il cognome per cercare.`;
    }
}

// ******** MAIN LOOP ********
const main = () => {
    // Specify attributes to fetch from the database
    const userAttributesToFetch = `id,firstName,lastName,birthDate,age`;
    getAndDisplayUsers(userAttributesToFetch);
    
    // Esercizio 6 - Parte 1: Ricerca per cognome
    searchUsersButton.addEventListener("click", listenToSearchUsersButton);
}

main();