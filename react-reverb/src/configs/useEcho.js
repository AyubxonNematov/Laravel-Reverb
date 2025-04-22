import { useEffect } from 'react';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

const getWebSocketConfig = (token) => ({
    broadcaster: 'reverb',
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST,
    wsPort: process.env.REACT_APP_REVERB_PORT || 8080,
    wssPort: process.env.REACT_APP_REVERB_PORT || 443,
    forceTLS: (process.env.REACT_APP_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: process.env.REACT_APP_REVERB_AUTH_ENDPOINT,
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
});

const useEcho = () => {
    useEffect(() => {
        const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);

        if (!token) return;

        try {
            //pusher 
            window.Pusher = Pusher;
            Pusher.logToConsole = false;
            //echo 
            window.echo = new Echo(getWebSocketConfig(token));
            const pusher = window.echo.connector.pusher;

            pusher.connection.bind('error', (err) => {
                console.error('WebSocket error:', err);
            });

            pusher.connection.bind('ping', () => {
                console.log('Ping sent');
            });

            pusher.connection.bind('pong', () => {
                console.log('Pong received');
            });

            pusher.connection.bind('connection_established', (data) => {
                console.log('Connection established:', data);
            });
        } catch (err) {
            console.error('Failed to initialize Echo:', err);
        }
    }, []);
};

export default useEcho; 