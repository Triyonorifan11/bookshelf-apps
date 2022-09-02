const dataBuku = [];
const RENDER_EVENT = 'render-apps';

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const inputBookIsComplete = document.querySelector('#inputBookIsComplete');

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', function () {
  const submitNewBook = document.getElementById('inputBook');
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  inputBookIsComplete.addEventListener('change', function () {
    const buttonSubmit = document.getElementById('bookSubmit')
    if (this.checked) {
      buttonSubmit.innerHTML = `Masukkan Buku ke rak <span>Selesai dibaca</span>`
    } else {
      buttonSubmit.innerHTML = `Masukkan Buku ke rak <span>Belum selesai dibaca</span>`
    }
  })


  submitNewBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addDataBuku();
  });
});


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      dataBuku.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const bukuBelumDibaca = document.getElementById('incompleteBookshelfList');
  bukuBelumDibaca.innerHTML = '';

  const bukuDibaca = document.getElementById('completeBookshelfList');
  bukuDibaca.innerHTML = '';

  for (const todoItem of dataBuku) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      bukuBelumDibaca.append(todoElement);
    } else {
      bukuDibaca.append(todoElement);
    }
  }
});

function addDataBuku() {
  const inputBookTitle = document.getElementById('inputBookTitle').value;
  const inputBookAuthor = document.getElementById('inputBookAuthor').value;
  const inputBookYear = document.getElementById('inputBookYear').value;

  let isCompletedValue

  if (inputBookIsComplete.checked) {
    isCompletedValue = true
  } else {
    isCompletedValue = false;
  }

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, isCompletedValue);
  dataBuku.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  }
}

function makeTodo(todoObject) {
  // const dataBuku = document.getElementById("incompleteBookshelfList");
  const titleDataObjek = document.createElement('h3');
  titleDataObjek.innerText = todoObject.title;
  const authorText = document.createElement('p');
  authorText.innerText = 'Penulis: ' + todoObject.author;
  const year = document.createElement('p')
  year.innerText = 'Tahun: ' + todoObject.year;

  const action = document.createElement('div')
  action.classList.add('action');

  const container = document.createElement('article')
  container.classList.add('book_item');
  container.append(titleDataObjek, authorText, year, action)
  container.setAttribute('id', `book-${todoObject.id}`);


  if (todoObject.isCompleted) {
    const belumselesaiDibaca = document.createElement('button');
    belumselesaiDibaca.classList.add('green');
    belumselesaiDibaca.innerText = 'Belum selesai dibaca';
    belumselesaiDibaca.addEventListener('click', function () {
      undoBukuFromSelesaiDibaca(todoObject.id)
    })

    const deleteBuku = document.createElement('button');
    deleteBuku.classList.add('red');
    deleteBuku.innerText = 'Hapus buku';
    deleteBuku.addEventListener('click', function () {
      removeDataBuku(todoObject.id)
    })

    action.append(belumselesaiDibaca, deleteBuku)
  } else {
    const selesaiDibaca = document.createElement('button');
    selesaiDibaca.classList.add('green');
    selesaiDibaca.innerText = 'Selesai dibaca';

    selesaiDibaca.addEventListener('click', function () {
      addBookToSelesaiDibaca(todoObject.id)
    });

    const deleteBuku = document.createElement('button');
    deleteBuku.classList.add('red');
    deleteBuku.innerText = 'Hapus buku';
    deleteBuku.addEventListener('click', function () {
      removeDataBuku(todoObject.id)
    })

    action.append(selesaiDibaca, deleteBuku)
  }

  return container;
}

// save data to localStorage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(dataBuku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// remove data to complete (selesai dibaca)
function findTodo(todoId) {
  for (const todoItem of dataBuku) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}
function addBookToSelesaiDibaca(todoId) {
  const dataTarget = findTodo(todoId);

  if (dataTarget == null) return;

  dataTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// end remove data to complete (selesai dibaca)

// remove data buku to belum selesai dibaca
function undoBukuFromSelesaiDibaca(todoId) {
  const dataTarget = findTodo(todoId);

  if (dataTarget == null) return;

  dataTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// end remove data buku to belum selesai dibaca

// hapus data buku
function findTodoIndex(todoId) {
  for (const index in dataBuku) {
    if (dataBuku[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

function removeDataBuku(todoId) {
  const idBuku = findTodoIndex(todoId);

  if (idBuku === -1) return;

  dataBuku.splice(idBuku, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// end hapus data buku
