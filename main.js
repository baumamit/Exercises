const tableHead = document.getElementById('allUsersTableHead');
const tableBody = document.getElementById('allUsersTableBody');
let tableHeadHtml = '';
let tableBodyHtml = '';
// Function to create a single user entry to the table HTML code
const userTableHTML = (user) => {
    const html = `<h2>Ciao</h2>`;
    return html
};

const createTableHeadHTML = (user) => {
    const html = `<h2>Ciao</h2>`;
    return html
};


fetch('https://dummyjson.com/users')
.then(res => res.json())
.then( data => {
    // console.log(users);
    const users = [...(data.users)];
    // ● Numero di utenti caricati
    console.log('Numero di utenti caricati:',users.length);
    if (users.length) {
        tableHeadHtml += `
            <th>Nome</th>
            <th>Cognome</th>
            <th>Età</th>
        `;
        console.log(tableHeadHtml);
        // ● Nome, cognome e data di nascita di tutti gli utenti
        users.forEach(user => {
            console.log(`${user.id}. ${user.firstName} ${user.lastName}, ${user.birthDate}\n`);
            tableBodyHtml += userTableHTML(user);        
        });
        console.log(tableBodyHtml);
    }
    // ● Indicare la presenza di eventuali studenti minorenni
        // ○ Se sono presenti, scrivere (per ognuno di loro) il nome e cognome
        // ○ Numero di studenti minorenni
    const minorUsers = users.filter((user) => {
        return (user.age < 18)
    });
    console.log(minorUsers);
    
    if (minorUsers.length) {
        console.log(`Sono presenti ${minorUsers.length} studenti minorenni:\n`);
        minorUsers.forEach(minorUser => {
            console.log(`${minorUser.firstName} ${minorUser.lastName}, age: ${minorUser.age}\n`);
        });
    } else {
        console.log('Non sono presenti studenti minorenni.');
    }
});

