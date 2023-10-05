import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, provider, storage } from "../firebase";
import { signInWithPopup } from "firebase/auth"; // Import the signInWithPopup function
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType";
import db from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});
export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider) // Use signInWithPopup from firebase/auth
      .then((payload) => {
        dispatch(setUser(payload.user));
      })
      .catch((error) => {
        alert(error.message);
      });
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => dispatch(setUser(null)))
      .catch((err) => alert(err.message));
  };
}

export function postArticleAPI(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      if (payload.image) {
        const storageRef = ref(storage, `images/${payload.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, payload.image);

        // Monitor the upload progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress}%`);
          },
          (error) => console.log("Error uploading:", error),
          async () => {
            const downloadURL = await getDownloadURL(storageRef);

            // Rest of your code for adding the article to Firestore
            const articlesCollectionRef = collection(db, "articles");

            // Rest of your code for adding the article to Firestore
            await addDoc(articlesCollectionRef, {
              actor: {
                description: payload.user.email,
                title: payload.user.displayName,
                date: payload.timestamp,
                image: payload.user.photoURL,
              },
              video: payload.video,
              sharedImg: downloadURL, // Update this based on your logic to obtain downloadURL
              comments: 0,
              description: payload.description,
            });
            dispatch(setLoading(false));
          }
        );
      } else if (payload.video) {
        const articlesCollectionRef = collection(db, "articles");

        // Rest of your code for adding the article to Firestore
        await addDoc(articlesCollectionRef, {
          actor: {
            description: payload.user.email,
            title: payload.user.displayName,
            date: payload.timestamp,
            image: payload.user.photoURL,
          },
          video: payload.video,
          sharedImg: "", // Update this based on your logic to obtain downloadURL
          comments: 0,
          description: payload.description,
        });
        dispatch(setLoading(false));
      } else {
        console.error("No image provided in the payload.");
      }
    } catch (error) {
      console.error("Error during upload:", error);
    }
  };
}

export function getArticlesAPI() {
  return (dispatch) => {
    dispatch(setLoading(true));
    let payload;
    const articlesCollectionRef = collection(db, "articles");
    const q = query(articlesCollectionRef, orderBy("actor.date", "desc"));

    getDocs(q)
      .then((querySnapshot) => {
        const payload = querySnapshot.docs.map((doc) => doc.data());
        dispatch(getArticles(payload));
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  };
}
