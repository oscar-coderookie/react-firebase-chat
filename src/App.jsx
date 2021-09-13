import "./App.css";
import { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCtFML0MkrwjIjW5OwxDhuer7H_affztP0",
  authDomain: "react-chat-35046.firebaseapp.com",
  projectId: "react-chat-35046",
  storageBucket: "react-chat-35046.appspot.com",
  messagingSenderId: "201093121125",
  appId: "1:201093121125:web:398ad94011d1105792328c",
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn /> }
      </section>
    </div>
  );
}

function SignIn() {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return <button onClick={signInWithGoogle}>Sign In with google</button>
}

function SignOut() {
  return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
}

function ChatRoom() {
  const dummy = useRef()

  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {

    e.preventDefault();
    const { uid, photoUrl } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    });
    setFormValue("");
    dummy.current.scrollIntoView({behavior: 'smooth'})
  };

  return (
    <>
      <div>
      {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}>

      </span>
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className="" disabled={!formValue}>
          Send MSG
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoUrl } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoUrl || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt={photoUrl} />
      <p>{text}</p>
    </div>
  );
}

export default App;
