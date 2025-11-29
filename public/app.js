// Simple frontend for Todo API
const listEl = document.getElementById('todo-list');
const form = document.getElementById('todo-form');
const titleInput = document.getElementById('title');
const msg = document.getElementById('message');
const API = window.API_BASE || 'http://127.0.0.1:8000/api';

async function showMessage(t, ok=true){
  msg.textContent = t;
  msg.style.color = ok ? '#b6f0b0' : '#ffb3b3';
  setTimeout(()=>{ msg.textContent = '' }, 3000);
}

async function fetchTodos(){
  try{
    const res = await fetch(API + '/todos');
    if(!res.ok) throw new Error('Failed to fetch todos: ' + res.status);
    const data = await res.json();
    renderTodos(data);
  }catch(e){
    showMessage('Error: ' + e.message, false);
    console.error(e);
  }
}

function renderTodos(todos){
  listEl.innerHTML = '';
  if(!Array.isArray(todos)) todos = [];
  todos.forEach(t => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    const left = document.createElement('div'); left.className='left';
    const cb = document.createElement('div'); cb.className='checkbox';
    cb.textContent = t.completed ? '✔' : '';
    cb.onclick = () => toggleCompleted(t);
    const tit = document.createElement('div'); tit.className='title';
    tit.textContent = t.title;
    left.appendChild(cb); left.appendChild(tit);

    const actions = document.createElement('div'); actions.className='actions';
    const edit = document.createElement('button'); edit.className='btn btn-edit'; edit.textContent='Edit';
    edit.onclick = () => editTodo(t);
    const del = document.createElement('button'); del.className='btn btn-delete'; del.textContent='hapus ';
    del.onclick = () => deleteTodo(t);
    actions.appendChild(edit); actions.appendChild(del);

    li.appendChild(left);
    li.appendChild(actions);
    listEl.appendChild(li);
  });
}

async function createTodo(title){
  try{
    const res = await fetch(API + '/todos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({title})
    });
    if(res.status === 201 || res.ok){
      const data = await res.json();
      showMessage('Created');
      fetchTodos();
      return data;
    } else {
      const err = await res.json().catch(()=>({message:'Bad response'}));
      throw new Error(err.message || 'Create failed: ' + res.status);
    }
  }catch(e){
    showMessage(e.message, false);
  }
}

async function toggleCompleted(todo){
  try{
    const res = await fetch(API + '/todos/' + todo.id, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({title: todo.title, completed: todo.completed ? 0 : 1})
    });
    if(!res.ok) throw new Error('Update failed: ' + res.status);
    showMessage('Updated');
    fetchTodos();
  }catch(e){
    showMessage(e.message, false);
  }
}

function editTodo(todo){
  const newTitle = prompt('Edit title', todo.title);
  if(newTitle === null) return;
  fetch(API + '/todos/' + todo.id, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({title:newTitle, completed: todo.completed})
  }).then(r=>{
    if(r.ok){ showMessage('Saved'); fetchTodos(); } else r.text().then(t=>showMessage(t, false));
  }).catch(e=>{ showMessage(e.message,false); });
}

async function deleteTodo(todo){
  if(!confirm('Delete this todo?')) return;
  try{
    const res = await fetch(API + '/todos/' + todo.id, { method: 'DELETE' });
    if(res.status === 204 || res.ok){
      showMessage('Deleted');
      fetchTodos();
    } else {
      const txt = await res.text();
      throw new Error('Delete failed: ' + txt);
    }
  }catch(e){
    showMessage(e.message, false);
  }
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const v = titleInput.value.trim();
  if(!v) return;
  createTodo(v);
  titleInput.value = '';
});

fetchTodos();
