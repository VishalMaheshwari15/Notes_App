document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    const categorySelect = document.getElementById('category-select');
    const prioritySelect = document.getElementById('priority-select');
    const colorSelect = document.getElementById('color-select');
    const searchInput = document.getElementById('search-input');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const exportNotesBtn = document.getElementById('export-notes-btn');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    function displayNotes(filteredNotes = notes) {
        notesList.innerHTML = '';
        const sortedNotes = filteredNotes.sort((a, b) => b.pinned - a.pinned);
        sortedNotes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.style.backgroundColor = note.color;
            noteElement.innerHTML = `
                <p>${note.text}</p>
                <div class="note-details">
                    <span>Category: ${note.category}</span> |
                    <span>Priority: ${note.priority}</span> |
                    <span>Date: ${new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <div class="note-btns">
                    <button class="edit-btn" onclick="editNote(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
                    <button class="save-btn" onclick="saveNote(${index})" style="display: none;">Save</button>
                    <button class="pin-btn" onclick="togglePin(${index})">${note.pinned ? 'Unpin' : 'Pin'}</button>
                    <button class="archive-btn" onclick="toggleArchive(${index})">${note.archived ? 'Unarchive' : 'Archive'}</button>
                </div>
            `;
            if (!note.archived) notesList.appendChild(noteElement);
        });
    }

    function addNote() {
        const noteText = noteInput.value.trim();
        const noteCategory = categorySelect.value;
        const notePriority = prioritySelect.value;
        const noteColor = colorSelect.value;
        if (noteText === '') return;

        const note = {
            text: noteText,
            category: noteCategory,
            priority: notePriority,
            color: noteColor,
            timestamp: Date.now(),
            pinned: false,
            archived: false
        };
        notes.push(note);
        noteInput.value = '';
        categorySelect.value = 'Work';
        prioritySelect.value = 'Medium';
        colorSelect.value = '#ffffff';
        updateLocalStorage();
        displayNotes();
    }

    function editNote(index) {
        const noteElement = notesList.children[index];
        const p = noteElement.querySelector('p');
        const editBtn = noteElement.querySelector('.edit-btn');
        const deleteBtn = noteElement.querySelector('.delete-btn');
        const saveBtn = noteElement.querySelector('.save-btn');

        p.contentEditable = true;
        p.focus();
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        saveBtn.style.display = 'inline';
    }

    function saveNote(index) {
        const noteElement = notesList.children[index];
        const p = noteElement.querySelector('p');
        const editBtn = noteElement.querySelector('.edit-btn');
        const deleteBtn = noteElement.querySelector('.delete-btn');
        const saveBtn = noteElement.querySelector('.save-btn');

        notes[index].text = p.innerText.trim();
        notes[index].timestamp = Date.now();
        p.contentEditable = false;
        updateLocalStorage();
        editBtn.style.display = 'inline';
        deleteBtn.style.display = 'inline';
        saveBtn.style.display = 'none';
        displayNotes();
    }

    function deleteNote(index) {
        notes.splice(index, 1);
        updateLocalStorage();
        displayNotes();
    }

    function togglePin(index) {
        notes[index].pinned = !notes[index].pinned;
        updateLocalStorage();
        displayNotes();
    }

    function toggleArchive(index) {
        notes[index].archived = !notes[index].archived;
        updateLocalStorage();
        displayNotes();
    }

    function updateLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function searchNotes() {
        const searchText = searchInput.value.toLowerCase();
        const filteredNotes = notes.filter(note => note.text.toLowerCase().includes(searchText));
        displayNotes(filteredNotes);
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    function exportNotes() {
        const dataStr = JSON.stringify(notes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'notes.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    addNoteBtn.addEventListener('click', addNote);
    searchInput.addEventListener('input', searchNotes);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    exportNotesBtn.addEventListener('click', exportNotes);

    displayNotes();
});

// Make functions globally available for inline event handlers
window.editNote = editNote;
window.saveNote = saveNote;
window.deleteNote = deleteNote;
window.togglePin = togglePin;
window.toggleArchive = toggleArchive;
