import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxsSmdjlpHUZ0qqvoCx47ny2txVNtIxgg",
  authDomain: "track-it-ai-b5f7e.firebaseapp.com",
  projectId: "track-it-ai-b5f7e",
  storageBucket: "track-it-ai-b5f7e.firebasestorage.app",
  messagingSenderId: "211800648975",
  appId: "1:211800648975:web:a3bbd94d6909f2a056a27a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
