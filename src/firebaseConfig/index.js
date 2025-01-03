import { GoogleAuthProvider, signInWithEmailAndPassword,signOut,signInWithPopup,createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, storage } from './firebaseConfig';

import { addDoc, collection, getDocs ,updateDoc,doc,setDoc, getDoc,arrayUnion,} from "firebase/firestore";


export {
    signInWithEmail, signUpWithEmail, logOut,
    signInWithPop, addData, getData, updateData,
    addMessages,getMessages,
};


const addData = async (data) => {
    try {
        // check if the user is already added to the document
        // if not then add the user to the document
        // let isExist = false;
        // const docsRef = await getDocs(doc(db, "onlineusers",data.uid));
        // docsRef.forEach((doc) => {
        //     // console.log(doc.id, " => ", doc.data());
        //     console.log(doc.data());
        //     if (doc.id === data.uid) {
        //         console.log("user already exist");
        //         // return;
        //         isExist = true;
        //         return;

        //     }
        // }
        // );
        // console.log(isExist);
        // if (isExist) {
        //     return;
        // }
        // const docRef = await setDoc(doc(db, "onlineusers",data.uid), data);
        

        const docRef = await getDoc(doc(db, "onlineusers", data.uid));
        if (docRef.exists()) {
            // console.log("Document data:", docRef.data());
            console.log("user already exist");
            if (docRef.data().isOnline === false)
            {
                
                updateData("onlineusers", {...data,isOnline:true});
                }
            return;
        }
         await setDoc(doc(db, "onlineusers",data.uid), data);
        // console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }

}

// const addMessages = async ({ uid, message }) => {
//     try {
//         const docRef = await setDoc(doc(db, "messages", uid), message);
//         // console.log("Document written with ID: ", docRef.id);
//     } catch (error) {
//         console.error("Error adding document: ", error);
//     }

// }

const addMessages = async ({ uid, message }) => {
    try {
        const docRef = doc(db, "messages", uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            // Document exists, update it
            await updateDoc(docRef, {
                messages: arrayUnion(message)
            });
        } else {
            // Document does not exist, create it with the message as an array
            await setDoc(docRef, {
                messages: [message]
            });
        }

        // console.log("Message added to document with ID: ", uid);
    } catch (error) {
        console.error("Error adding message: ", error);
    }
}

const getMessages = async (uid) => {
    try {
        const docRef = doc(db, "messages", uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            // Document exists, return the messages
            return docSnapshot.data().messages;
        } else {
            // Document does not exist, return an empty array
            return [];
        }
    } catch (error) {
        console.error("Error getting messages: ", error);
    }

}


const getData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "onlineusers"));
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
        });

        return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

const updateData = async (docName,data) => {

    try {
        // update the doc
        // console.log("updating doc", data);
        await updateDoc(doc(db, docName, data.uid), {
            isOnline: data.isOnline
        });
    } 
    catch (error) {
        console.error("Error updating document: ", error);
    }
    
}



const signInWithEmail= async (email, password) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch (error) {
        return error;
    }
}

const signUpWithEmail = async (email, password) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        return user;
    } catch (error) {
        return error;
    }
}

const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        return error;
    }
}


const signInWithPop = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        // console.log(user);
        return user;
    } catch (error) {
        return error;
    }
}

// const checkUser = async () => {
//     try {
//         const user = auth.
//         return user;
//     } catch (error) {
//         return error;
//     }
// }
