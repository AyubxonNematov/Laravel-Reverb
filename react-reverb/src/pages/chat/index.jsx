import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import axios from '../../configs/axios';

const Chat = () => {
    const { logout, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [activeUser, setActiveUser] = useState(null);

    const getUsers = async (search) => {
        try {
            if (search && search.length > 2) {
                const response = await axios.get('/users', { params: { search } });
                setUsers(response.data);
            } else {
                const response = await axios.get('/users');
                setUsers(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const sendMessage = async (message, receiverId) => {
        try {
            const response = await axios.post('/messages', {
                message: message,
                receiver_id: receiverId
            });
            setMessages([...messages, response.data]);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getMessages = async (receiverId) => {
        try {
            setActiveUser(receiverId);
            const response = await axios.get(`/messages/${receiverId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        getUsers();

        const channel = window.echo.private(`chat.${user.id}`);

        channel.listen('MessageSend', (e) => {
            setMessages(prevMessages => [...prevMessages, e.message]);
        });

        // Cleanup function
        return () => {
            channel.stopListening('MessageSend');
        };
    }, [user.id]); // Only depend on user.id which is stable

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold">
                                    {user.name}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={logout}
                                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="px-4 py-8 sm:px-0">
                        <div className="bg-white rounded-lg shadow-lg h-[600px] flex">
                            {/* Left sidebar - contacts list */}
                            <div className="w-1/3 border-r border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <input
                                        type="text"
                                        placeholder="Search contacts..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onChange={(e) => getUsers(e.target.value)}
                                    />
                                </div>
                                <div className="overflow-y-auto h-[calc(600px-73px)]">
                                    {loading ? (
                                        <div className="p-4 text-center">Loading...</div>
                                    ) : (
                                        users.map((user) => (
                                            <div
                                                key={user.id}
                                                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center ${activeUser === user.id ? 'bg-gray-100' : ''}`}
                                                onClick={() => getMessages(user.id)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{user.name}</h3>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* Right side - chat area */}
                            <div className="w-2/3 flex flex-col">
                                {/* Chat header */}
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold">Chat</h2>
                                </div>

                                {/* Messages area */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="mb-4">
                                            {msg.sender_id === user.id ? (
                                                <div className="text-right">
                                                    <div className="inline-block bg-indigo-100 rounded-lg px-4 py-2">
                                                        <p className="text-gray-800">{msg.message}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-left">
                                                    <div className="inline-block bg-gray-100 rounded-lg px-4 py-2">
                                                        <p className="text-gray-800">{msg.message}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* Message input */}
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && message.trim() && activeUser) {
                                                    sendMessage(message, activeUser);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                if (message.trim() && activeUser) {
                                                    sendMessage(message, activeUser);
                                                }
                                            }}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chat;