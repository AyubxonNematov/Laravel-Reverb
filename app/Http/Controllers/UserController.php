<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController 
{
    public function users(Request $request)
    {
        $search = $request->input('search');
            
        $users = User::where('id', '!=', auth()->user()->id);
        if ($search) {
            $users->where('name', 'like', '%' . $search . '%');
        }
        $users = $users->get();
        return response()->json($users);
    }
}

