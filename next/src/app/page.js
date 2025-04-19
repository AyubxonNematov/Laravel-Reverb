'use client';

import { useState, useEffect } from 'react';
import { EchoInstance } from '../lib/echo';


export default function Home() {
	const [messages, setMessages] = useState([
		{ id: 1, text: 'Salom!', type: 'received' },
		{ id: 2, text: 'Qandaysiz?', type: 'sent' },
	]);
	const [newMessage, setNewMessage] = useState('');


	useEffect(() => {
		const echo = EchoInstance();
	}, []);

	const handleSend = (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		setMessages([
			...messages,
			{
				id: messages.length + 1,
				text: newMessage,
				type: 'sent'
			}
		]);
		setNewMessage('');
	};

	return (
		<div className="chat-container">
			<div className="chat-header">
				<h2>Chat</h2>
			</div>

			<div className="chat-messages">
				{messages.map((message) => (
					<div key={message.id} className={`message ${message.type}`}>
						{message.text}
					</div>
				))}
			</div>

			<form onSubmit={handleSend} className="chat-input">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Xabar yozing..."
				/>
				<button type="submit">Yuborish</button>
			</form>
		</div>
	);
}
