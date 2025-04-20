<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController
{
    public function getMessages($receiverId)
    {
        $messages = Message::where(function($query) use ($receiverId) {
            $query->where('sender_id', auth()->id())
                ->where('receiver_id', $receiverId);
        })->orWhere(function($query) use ($receiverId) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', auth()->id());
        })->orderBy('created_at', 'asc')
          ->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $message = Message::create([
            'sender_id' => auth()->user()->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json($message);
    }
}