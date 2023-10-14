import React from 'react';


const Chat = ({ chat, loading }) => {
    return <div>
        <div className="flex flex-col flex-grow p-4 overflow-scroll space-x-3">
            <div>
                {!!chat.user && <div className="flex flex-wrap min-h-[50px] mt-4">
                    <img className="w-10 h-10 rounded-full" src={chat.user.profilePicUrl}
                        alt={chat.user.name} />
                    <span className="text-gray-500 mx-5 my-auto">{chat.user.name}: </span>
                </div>}
                <div className="mt-4 ml-12 p-5 rounded max-w-xl bg-amber-200 shadow-lg border-b-2">

                    {loading && <div class="animate-pulse flex space-x-4">
                        <div class="flex-1 space-y-6 py-1">
                            <div class="h-2 bg-amber-700 rounded"></div>
                            <div class="space-y-3">
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="h-2 bg-amber-700 rounded col-span-2"></div>
                                    <div class="h-2 bg-amber-700 rounded col-span-1"></div>
                                </div>
                                <div class="h-2 bg-amber-700 rounded"></div>
                            </div>
                        </div>
                    </div>}

                    {!!chat.message?.length && <div>
                        {chat.message}
                    </div>}

                </div>
            </div>
        </div>
    </div>
}

export default Chat;