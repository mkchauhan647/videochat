import { GoogleAuthProvider, signInWithEmailAndPassword,signOut,signInWithPopup } from 'firebase/auth';
import { db, auth, storage } from './firebaseConfig';


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
        console.log(user);
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

export { signInWithEmail, signUpWithEmail, logOut, signInWithPop };