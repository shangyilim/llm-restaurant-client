
import Header from './Header';
import './App.css';
import { useCallback, useState, useEffect, useRef } from 'react';
import firApp from './FirebaseService'
import Chat from './Chat'

import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp
} from "firebase/firestore";


const db = getFirestore(firApp);

const botUser = { name: 'Waiter', profilePicUrl: './assets/logo.jpg' };
const introChat = { user: botUser, message: 'Welcome to ask waiter! Ask for anything on the menu' }
function App() {

  const messagesEndRef = useRef(null);
  const [user, setUser] = useState();

  const [currentQuery, setCurrentQuery] = useState();
  const [currentQueryChats, setCurrentQueryChats] = useState();
  const [postMessage, setPostMessage] = useState();

  const lastMessageBot = !currentQueryChats?.length || (currentQueryChats?.length && currentQueryChats[currentQueryChats.length - 1].source === 'bot');
  const loading = !lastMessageBot;
  const sendTextMessage = useCallback(async () => {
    if (!user) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    let queryId = currentQuery;
    if (!queryId) {
      const queryRef = await addDoc(collection(db, "query"), {});
      queryId = queryRef.id;
      setCurrentQuery(queryId);
    }

    await addDoc(collection(db, `query/${queryId}/chats`), {
      source: 'user',
      user: {
        name: user.displayName,
        profilePicUrl: user.photoURL
      },
      message: postMessage,
      timestamp: serverTimestamp(),
    })

    setPostMessage("");

  }, [user, postMessage, currentQuery]);


  const onAuthChanged = useCallback((user) => {
    setUser(user);
  }, []);

  const startOver = useCallback(() => {
    setCurrentQuery(null);
    setCurrentQueryChats(null);

  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loading]);

  useEffect(() => {
    if (!user || !currentQuery) {
      return;
    }

    const q = query(collection(db, `query/${currentQuery}/chats`), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.source === 'bot') {
          chats.push({
            user: botUser,
            ...data,
          })
        }
        else {
          chats.push(data);
        }
      });
      setCurrentQueryChats(chats);
    });

    return () => {
      unsubscribe();
    }

  }, [user, currentQuery]);

  return (

    <div className="min-h-screen h-full w-full bg-navy-30">
      <Header onAuthChanged={onAuthChanged} />
      <div className="w-3/4 bg-navy-10 min-h-screen h-full mx-auto flex flex-col flex-grow pb-56">
        <Chat chat={introChat} />
        {currentQueryChats?.map(chat => <Chat chat={chat} />)}
        {loading && <Chat chat={{ user: botUser }} loading />}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-navy-10 w-full shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] min-h-32 h-auto bottom-0 fixed">
        <div className="flex-wrap flex w-5/6 mx-auto">

          <textarea
            className="w-4/5 mx-auto h-16 rounded-3xl my-auto overflow-scroll text-gray-900 dark:placeholder-gray-400 p-4"
            placeholder="Hello! I'm your walking menu. Ask me anything!"
            value={postMessage} // ...force the input's value to match the state variable...
            onChange={e => setPostMessage(e.target.value)} ></textarea>
          <button className="w-16 h-16 rounded-full bg-amber-800 my-3" onClick={sendTextMessage} disabled={!lastMessageBot}>
            Ask
          </button>
          <button className="w-16 h-16 rounded-full bg-amber-500 my-3" onClick={startOver}>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
