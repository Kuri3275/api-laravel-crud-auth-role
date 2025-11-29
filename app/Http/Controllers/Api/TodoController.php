<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class TodoController extends Controller
{
    public function index() 

     { return Auth::user()
            ->todos()
            ->orderByDesc('id')
            ->get(); 
        }

   public function store(Request $request)
{
    $data = $request->validate([
        'title' => 'required|string|max:100',
        'completed' => 'boolean'
    ]);

    // Tambahkan user_id ke data yang akan disimpan
    $data['user_id'] = Auth::id();

    $todo = Todo::create($data);

    return response()->json($todo, 201);
}

    public function show(Todo $todo) { return $todo; }

    public function update(Request $request, Todo $todo)
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:100',
            'completed' => 'sometimes|boolean'
        ]);
        $todo->update($data);
        return $todo;
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return response()->noContent(); // 204
    }
}