import { db, collection, getDocs } from './firebase.js';

let guestsDocs = [];
async function loadGuests() {
    try {
        const guestsRef = collection(db, "guests");
        const snapshot = await getDocs(guestsRef);
        guestsDocs = snapshot.docs; 
    } catch (error) {
        console.error("שגיאה בטעינת האורחים:", error);
    }
}
await loadGuests(); 

const ul = document.getElementById('blessList');
ul.className = 'scroll-container';
ul.style.marginTop = '57%';


function drawList(guests) {

    ul.innerHTML = '';
    guests.forEach(guestDoc => {

        const guest = guestDoc.data();

        if(!guest.blessing || guest.blessing.trim().length === 0)
             return;

        const div = document.createElement('div');
        div.className = 'background-container';  
        div.style.height = '20vh'; 
        div.style.width = '50vh';      
        div.style.backgroundImage = "url('resources/icons/note-icon.png')";
        div.style.backgroundSize = '100%';

        //profile picture
        const image = document.createElement('img');
        image.src = guest.pictureSrc;
        image.className = 'profilePicture';
        div.appendChild(image);

        //is coming
        const hIsComing = document.createElement('h3');
        hIsComing.textContent = guest.isComing ? 'אהיה ביומולדת' : '';
        hIsComing.style.marginTop = '-1%';
        hIsComing.style.marginLeft = '65%';
        div.appendChild(hIsComing);
        
        //blessing
        const blessing = document.createElement('p');
        blessing.className = 'bless-container scroll-container';
        blessing.innerHTML = guest.blessing;
        div.appendChild(blessing);

        //signature
        const signature = document.createElement('h1');
        signature.className = "note-signature";
        signature.textContent = guest.name;
        div.appendChild(signature);

        const li = document.createElement('li');
        li.appendChild(div);
        ul.appendChild(li);
    });
}

drawList(guestsDocs);