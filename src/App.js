import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';


import { useAuthState, useSignInWithGoogle } from 'firebase';
import { useCollectionData } from 'firebase';
import { useRef, useState } from 'react';


firebase.initializeApp({
  apiKey: "AIzaSyBaUAX4_frJg4g85RCqyYQ2pLBhtDGL7jc",
  authDomain: "chat-app-678b4.firebaseapp.com",
  projectId: "chat-app-678b4",
  storageBucket: "chat-app-678b4.appspot.com",
  messagingSenderId: "218191803814",
  appId: "1:218191803814:web:b8fda0a8710805dc67cb67",
  measurementId: "G-L12Q9WKTEM"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">

      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={useSignInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()


  const msgRef = firestore.collection('messages');
  const query = msgRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMassage = async(e) => {
    e.preventDefault();

    const {uid, photourl} = auth.currentUser;

    await msgRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photourl
    });
    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'})

  }


  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMassage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMassage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type = "submit"> Submit</button>
      </form>
    </>
  )
  function ChatMassage(props) {
    const { text, uid , photourl } = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

    return (
      <div className={ `message ${messageClass}`}>
        <img src = {photourl}/>        
        <p>{text}</p>
      </div>
    
    )
  }
}



export default App;
