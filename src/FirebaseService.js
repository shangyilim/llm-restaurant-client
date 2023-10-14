import { initializeApp } from 'firebase/app';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCm4cGv411boeMbEzaATpXcsWUZQSNY0g",
  authDomain: "restaurant-llm.firebaseapp.com",
  databaseURL: "https://restaurant-llm-default-rtdb.firebaseio.com",
  projectId: "restaurant-llm",
  storageBucket: "restaurant-llm.appspot.com",
  messagingSenderId: "455081615796",
  appId: "1:455081615796:web:ac16277e83930a47f812e1"
};

// Initialize Firebase
const firApp = initializeApp(firebaseConfig);

export default firApp;