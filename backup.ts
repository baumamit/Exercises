let tableHead: HTMLElement|null = document.getElementById('allUsersTableHead');
let tableBody: HTMLElement|null = document.getElementById('allUsersTableBody');
let tableHeadHtml: string = '';
let tableBodyHtml: string = '';

interface UserType {
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
}

// Function to create a single user entry to the table HTML code
const userTableHTML = (user: UserType): string => {
    const html = `<h2>Ciao</h2>`;
    return html;
};

const createTableHeadHTML = (user: UserType): string => {
    const html = `<h2>Ciao</h2>`;
    return html;
};


fetch('https://dummyjson.com/users')
.then(res => res.json())
.then( data => {
    // console.log(users);
    const users: UserType[] = [...(data.users)];
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
    const minorUsers: UserType[] = users.filter((user) => {
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

