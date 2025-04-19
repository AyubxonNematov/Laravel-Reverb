// Singleton instance
let echoInstance = null;

export const EchoInstance = async () => {
    // Returns nothing on the server side (SSR)
    if (typeof window === 'undefined') {
        return null;
    }

    const authToken = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];

    // If the instance already exists, return it
    if (echoInstance) {
        return echoInstance;
    }

    try {
        // Lazy import laravel-echo and pusher-js
        const { default: Echo } = await import('laravel-echo');
        const { default: Pusher } = await import('pusher-js');

        // Add Pusher to the global window object
        window.Pusher = Pusher;
        // Create the Echo instance
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 80,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 443,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            auth: authToken
                ? {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
                : {},
        });

        // Log all events
        echoInstance.connector.pusher.connection.bind('connected', () => {
            console.log('WebSocket connected');
        });

        // Log all events for all channels
        echoInstance.connector.pusher.bind_global((eventName, data) => {
            console.log(`Event: ${eventName}`, data ?? '');
        });

        echoInstance.connector.pusher.connection.bind('ping', () => {
            console.log('Ping: Server sent ping request');
        });
        echoInstance.connector.pusher.connection.bind('pong', () => {
            console.log('Pong: Server sent pong response');
        });

        return echoInstance;
    } catch (error) {
        console.error('Error creating Echo instance:', error);
        return null;
    }
};