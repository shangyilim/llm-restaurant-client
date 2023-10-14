import React, { useCallback, useEffect, useState } from 'react';
import firApp from './FirebaseService';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth(firApp);

const Header = ({ onAuthChanged, }) => {

    const [user, setUser] = useState();

    const login = useCallback(() => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            setUser(user);
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }, []);
    const logout = useCallback(() => { }, []);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            onAuthChanged(user);
            setUser(user);
            
        });
    }, []);
    return <header>
        <nav className="bg-navy-400 px-2 lg:px-4 py-2.5 h-18">
            <div className="flex flex-wrap justify-between items-center max-w-screen">
                <a href="/" className="flex items-center">
                    <img src="./assets/logo.jpg" alt="Ask Waiter" className="mr-3 h-16 sm:h-10 stop-image" />
                    <span className="mr-3 self-center text-2xl whitespace-nowrap font-light text-white">
                        Ask Waiter
                    </span>
                </a>
                {!!user && <div className="flex flex-wrap items-end auth">
                    <div className="flex flex-wrap items-center text-white">
                        <img className="w-5 h-5 rounded-full" src={user?.photoURL}
                            alt={user?.displayName} />
                        <span className="text-white text-xs whitespace-nowrap font-light px-4 lg:px-5 py-2 lg:py-2.5">
                            {user?.displayName}
                        </span>
                        <div className="dropdown inline-block relative shadow-lg">

                            <ul className="dropdown-menu absolute hidden text-gray-700 pt-3 w-48 right-2">
                                <li className="bg-white p-4 flex-row">
                                    <img className="w-10 h-10 rounded-full" src={user?.photoURL}
                                        alt={user?.displayName} />
                                    <span
                                        className="text-navy-200 text-md whitespace-nowrap px-4 lg:px-5 py-2 lg:py-2.5 mr-6">
                                        {user?.displayName}
                                    </span>
                                </li>
                                <li className="">
                                    <a className="bg-white hover:bg-navy-20 py-3 px-4 block whitespace-no-wrap text-navy-500 font-semibold"
                                        href="/" onClick={logout}>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>}
                {!user && <button className="w-[100px] bg-white shadow-md flex flex-wrap mt-12" onClick={login}>
                    <img src="./assets/Google.png" className="w-8 m-2" />
                    <span className="text-slate-700 text-sx m-auto">Sign in with Google</span>
                </button>}
            </div>
        </nav>
    </header>
}

export default Header;