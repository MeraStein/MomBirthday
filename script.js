import { db, collection, findDocById, updateFieldInDocument, getDocs } from './firebase.js';

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

const ul = document.getElementById("guestList");


//draw list
async function drawList(names) {
    ul.innerHTML = '';

    names.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.addEventListener('click', function() {
            createVerifyState(name);
        });

        ul.appendChild(li);
    });
}
drawList([]);

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
    const filteredGuests = filterGuestsByInclude(searchInput.value);  
    drawList(filteredGuests);
    if(searchInput.value.length === 0)
        drawList([]);
});


const mainDiv = document.getElementById('main-div');

function clear() {
    if (mainDiv) 
        mainDiv.innerHTML = ''; 
}

//create and manage verify situation
async function createVerifyState(name) {

    clear();

    const guest = await findDocById("guests", name);

    if(!guest)
    {
        alert("this name is not a guest's one");
        return;
    }

    mainDiv.style.backgroundImage = "url('resources/images/verify-pic.png')"; 

    //the question
    const hVerify = document.createElement('h2');
    hVerify.textContent = guest.question;
    hVerify.style.marginTop = "45%";
    mainDiv.appendChild(hVerify);

    const btnDiv = document.createElement('div');
    btnDiv.style.display = 'flex';
    btnDiv.style.flexDirection = 'column';
    btnDiv.style.gap = '2.5vh';
    btnDiv.style.marginTop = '4vh';
    mainDiv.appendChild(btnDiv);

    const r = Math.floor(Math.random() * 4);
    let j = 0;
    for (let i = 0; i < 4; i++) {
        const btn = document.createElement('button');
    
        if (i === r) {
            btn.textContent = guest.answer; 
        } else {
            btn.textContent = guest.options[j++]; 
        }
    
        btnDiv.appendChild(btn);
    
        btn.addEventListener('click', function () {
            if (i === r) {
                createAcountState(guest);
            } else {
                alert("תשובה שגויה, נסה שוב.");
            }
        });
    }    
}

/*
 * create acount situation.
 */
function createAcountState(guest) {

    clear(); 

    mainDiv.style.backgroundImage = "url('resources/images/acount-pic.png')"; 
    
    //profile picture
    const image = document.createElement('img');
    image.src = guest.pictureSrc;
    image.className = 'profilePicture';
    image.style.marginTop = '3.5%';
    mainDiv.appendChild(image);   

    //name of guest
    const hAcount = document.createElement('h2');
    hAcount.textContent = guest.name;
    hAcount.style.marginTop = "0%";
    mainDiv.appendChild(hAcount); 

    //is coming or not.
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    div.style.marginTop = '3.5%';
    div.style.marginRight = '40%';
    mainDiv.appendChild(div); 

    const iconLeft = document.createElement('img');
    iconLeft.className = "icon-finger";
    iconLeft.src = "resources/icons/left-pointer-icon.png";
    iconLeft.style.animation = 'bounceLeft 2s infinite';
    div.appendChild(iconLeft);

    
    const btn = document.createElement('button');
    btn.textContent = guest.isComing ? "מגיע.ה" : "לאישור";
    btn.style.width = '10vh';
    btn.style.height = '4vh';
    btn.style.fontSize = '2vh';
    btn.style.border = '0.2vh';
    btn.style.marginTop = '13%';
    btn.addEventListener('click', function() {
        guest.isComing = !guest.isComing;
        updateFieldInDocument("guests", guest.name, 'isComing', guest.isComing);
        btn.textContent = guest.isComing ? "מגיע.ה" : "לאישור";
    });
    div.appendChild(btn);

    //blessing
    const blessInput = document.createElement('textarea');
    blessInput.placeholder = 'נסח פה...';
    blessInput.innerText = guest.blessing;
    blessInput.addEventListener('blur', function() {
        const newBlessing = blessInput.value;
        updateFieldInDocument("guests", guest.name, 'blessing', newBlessing);
        guest.blessing = newBlessing; 
    });
    
    mainDiv.appendChild(blessInput);

    const btn1 = document.createElement('button');
    btn1.textContent = "press me";
    btn1.style.width = '10vh';
    btn1.style.height = '6vh';
    btn1.style.fontSize = '2vh';
    btn1.style.border = '0.2vh';
    btn1.style.marginTop = '45.1%';
    btn1.addEventListener('click', function() {
        window.location.href = 'blessIndex.html';
    });
    mainDiv.appendChild(btn1);
}

//help function
function filterGuestsByInclude(str) {
    const filteredGuests = [];

    guestsDocs.forEach(guestDoc => {
        const guestData = guestDoc.data(); 
        if (guestData.name.includes(str)) 
            filteredGuests.push(guestData.name);
    });

    return filteredGuests;
}


