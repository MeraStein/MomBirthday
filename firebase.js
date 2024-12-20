import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, getDocs, updateDoc, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD9c8t82LiZUqlDwB4Hz_07yclBTOH2H1w",
    authDomain: "mombirthday-f01e3.firebaseapp.com",
    projectId: "mombirthday-f01e3",
    storageBucket: "mombirthday-f01e3.firebasestorage.app",
    messagingSenderId: "218394384560",
    appId: "1:218394384560:web:e245a6d7c5aaa8ece00375",
    measurementId: "G-CYYG661865"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addDataWithCustomId(guest) {
    try {
        const docRef = doc(db, "guests", guest.name);
        await setDoc(docRef, {
            name: guest.name,
            question: guest.question,
            answer: guest.answer,
            options: guest.options,
            pictureSrc: guest.pictureSrc,
            isComing: guest.isComing,
            blessing: guest.blessing
        });
    } catch (e) {
        console.error("Error adding document: ", e); 
    }
}


async function updateFieldInDocument(collectionName, documentId, field, newValue) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, {
            [field]: newValue
        });
        console.log(`הערך של ${field} במסמך ${documentId} עודכן בהצלחה`);
    } catch (error) {
        console.error("שגיאה בעדכון המסמך: ", error);
    }
}


async function findDocById(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId); 
        const document = await getDoc(docRef);

        if (document.exists()) {
            console.log("מסמך נמצא:", document.data());
            return document.data(); 
        } else {
            console.log("המסמך לא נמצא.");
            return null;
        }
    } catch (error) {
        console.error("שגיאה בחיפוש המסמך: ", error);
        throw error; 
    }
}

export { db, addDataWithCustomId, updateFieldInDocument, findDocById, getDocs, collection };