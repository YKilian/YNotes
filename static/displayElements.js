function list_Notes(json_file) {
    let jsonData;

    // Check if json_file is already parsed, if so, use it directly
    if (typeof json_file === 'object') {
        jsonData = json_file;
    } else {
        // Parse the JSON string
        try {
            jsonData = JSON.parse(json_file);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return; // Exit the function if parsing fails
        }
    }

    // Store the parsed JSON data
    localStorage.setItem('json_data_notes', JSON.stringify(jsonData));

    window.history.pushState(null, null, '?note=NEW*');
    document.getElementById('note-search').innerHTML = "";
    document.getElementById('note-search').appendChild(note_list_search());
    document.getElementById('note-new').innerHTML = "";
    document.getElementById('note-new').appendChild(note_new_button());
    document.getElementById('toggle-sidebar').innerHTML = "";
    document.getElementById('toggle-sidebar').appendChild(toggle_sidebar_button());
    document.getElementById('note-overview').innerHTML = "";
    for (var i = 0; i < jsonData.length; i++) {
        let id = i;
        let title = jsonData[i].title;
        let doctype = jsonData[i].document_type;
        let date = jsonData[i].date;
        let content = jsonData[i].content;
        document.getElementById('note-overview').appendChild(notes_List_Element(id, date, title, doctype, content));
    }
}

function note_list_search() {
    var div = document.createElement('div');
    div.className = 'note-search';
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search...';
    input.id = 'search';
    input.oninput = function () {
        var search = document.getElementById('search').value.toLowerCase();
        var notes = document.getElementsByClassName('note');
        for (var i = 0; i < notes.length; i++) {
            var title = notes[i].getElementsByClassName('note-title')[0].textContent.toLowerCase();
            var doc_type = notes[i].getAttribute('doctype').toLowerCase();
            var content = notes[i].getElementsByClassName('note-content')[0].textContent.toLowerCase();
            if (title.includes(search) || content.includes(search) || doc_type.includes(search)) {
                notes[i].style.display = 'block';
            } else {
                notes[i].style.display = 'none';
            }
        }
    }
    div.appendChild(input);
    return div;
}

function note_new_button() {
    var div = document.createElement('div');
    div.className = 'note-new';
    var button = document.createElement('button');
    button.id = 'new-note-button';
    button.innerHTML = 'New Note';
    button.onclick = function () {
        window.history.pushState(null, null, '?note=NEW*');
        clearEditor();
    }
    div.appendChild(button);
    return div;
}

function toggle_sidebar_button() {
    var div = document.createElement('div');
    div.className = 'toggle-sidebar';
    var button = document.createElement('button');
    button.id = 'toggle-sidebar-button';
    button.innerHTML = '&#171;';
    var sidebar = document.getElementById('note-sidebar');
    sidebar.style.width = '25vw';
    var search = document.getElementById('search');
    var new_note = document.getElementById('new-note-button');
    button.onclick = function () {
        if (sidebar.style.width === '25vw') {
            sidebar.style.minWidth = '0';
            sidebar.style.width = '0';
            search.style.display = 'none';
            new_note.style.display = 'none';
            button.innerHTML = '&#187;';
        } else {
            sidebar.style.minWidth = '160px';
            sidebar.style.width = '25vw';
            search.style.display = 'block';
            new_note.style.display = 'block';
            button.innerHTML = '&#171;';
        }
    }
    div.appendChild(button);
    return div;
}

function notes_List_Element(id, date, title, doctype, content) {
    var div = document.createElement('div');
    div.className = 'note';
    div.setAttribute('doctype', doctype);
    div.onclick = function () {
        window.history.pushState(null, null, '?note=' + id);
        load_note(id);
    }
    div.id = 'note-' + id;
    div.title = `${title}`;
    if (id % 2 === 0) {
        div.classList.add('even-Element');
    } else {
        div.classList.add('odd-Element');
    }

    var dateDiv = document.createElement('div');
    dateDiv.className = 'note-date';
    dateDiv.textContent = date;

    var titleDiv = document.createElement('div');
    let note_title_length = 20;
    titleDiv.className = 'note-title';
    titleDiv.textContent = title.substring(0, note_title_length) + ((title.length > note_title_length) ? '...' : '');

    var interactionDiv = document.createElement('div');
    interactionDiv.className = 'note-interaction';

    var deleteButton = document.createElement('button');
    deleteButton.className = 'note-delete';
    deleteButton.innerHTML = '<img src="/static/svg/delete.svg" alt="delete">';
    deleteButton.onclick = function (event) {
        deleteNote(id);
    }
    var sendButton = document.createElement('button');
    sendButton.className = 'note-send';
    sendButton.innerHTML = '<img src="/static/svg/download.svg" alt="download">';
    sendButton.onclick = function (event) {
        download_doc(id)
    }
    interactionDiv.appendChild(sendButton);
    interactionDiv.appendChild(deleteButton);
    titleDiv.appendChild(interactionDiv)

    var contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';
    let note_preview_length = 60;
    contentDiv.textContent = content.substring(0, note_preview_length) + ((content.length > note_preview_length) ? '...' : '');

    div.appendChild(titleDiv);
    div.appendChild(dateDiv);
    div.appendChild(contentDiv);

    return div;
}

function show_editor() {
    let editor_area = document.getElementById('note-editor')
    let title = document.createElement('input');
    title.type = 'text';
    title.id = 'title';
    title.placeholder = 'Title';
    let document_type = document.createElement('input');
    document_type.type = 'text';
    document_type.id = 'document-type';
    document_type.placeholder = '.txt';
    let title_div = document.createElement('div');
    title_div.id = 'title_div';
    title_div.appendChild(title);
    title_div.appendChild(document_type);
    editor_area.appendChild(title_div);
    let lte = document.createElement('p');
    lte.id = 'lte';
    lte.innerHTML = `Last edit: `;
    editor_area.appendChild(lte);
    let editor = document.createElement('textarea');
    editor.type = 'text';
    editor.id = 'editor';
    editor_area.appendChild(editor);
}

function clearEditor() {
    let e_title = document.getElementById('title')
    let e_lte = document.getElementById('lte')
    let e_editor = document.getElementById('editor')

    e_title.value = '';
    e_lte.innerHTML = 'Last edit: ';
    e_editor.value = '';
}

function load_note(e_id) {
    let json_file = localStorage.getItem('json_data_notes');
    let jsonData = JSON.parse(json_file);
    let note = jsonData[e_id];
    console.log("Loaded note = " + note.id + " " + note.title + " " + note.date + " " + note.content);

    let e_title = document.getElementById('title')
    let e_doctype = document.getElementById('document-type')
    let e_lte = document.getElementById('lte')
    let e_editor = document.getElementById('editor')

    e_title.value = note.title;
    e_doctype.value = note.document_type;
    e_lte.innerHTML = 'Last edit: ' + note.date;
    e_editor.value = note.content;
}

function addKeyListener() {
    document.addEventListener('keydown', function (event) {
        // Check if the user is pressing Ctrl and 'S' key
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            // Prevent the default browser save action
            event.preventDefault();
            savePage();
        }
    });

    document.addEventListener('keydown', function (event) {
        // Check if the user is pressing Ctrl and 'del' key
        if ((event.ctrlKey || event.metaKey) && event.key === 'Delete') {
            event.preventDefault();
            deleteNote(new URLSearchParams(window.location.search).get('note'));
        }
    });

    document.addEventListener('keydown', function (event) {
        // Check if the user is pressing Ctrl and 'e' key
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            download_doc();
        }
    });
}

function deleteNote(index) {
    let open_file = new URLSearchParams(window.location.search).get('note');
    let json_file = localStorage.getItem('json_data_notes');
    let jsonData = JSON.parse(json_file);
    jsonData.splice(index, 1);
    localStorage.setItem('json_data_notes', JSON.stringify(jsonData));
    list_Notes(jsonData);
    fetch('/save_file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    }).then(
        response => response.json()
    ).then(
        data => {
            console.log('Success:', data);
            list_Notes(localStorage.getItem('json_data_notes'));
        }
    ).catch(
        (error) => {
            console.error('Error:', error);
        }
    )
    if (open_file.toString() === index.toString()) {
        clearEditor();
    }
}

function savePage() {
    // Save the page
    let e_title = document.getElementById('title').value;
    var e_doctype = document.getElementById('document-type').value;
    if (e_doctype === '') {
        e_doctype = '.txt';
    }
    let e_editor = document.getElementById('editor').value;
    let e_date = new Date().toLocaleString();
    let e_id = new URLSearchParams(window.location.search).get('note');

    let json_file = localStorage.getItem('json_data_notes');
    let jsonData = JSON.parse(json_file);

    // If id is 'NEW*', append a new object to jsonData
    if (e_id === 'NEW*') {
        let newNote = {
            title: e_title,
            document_type: e_doctype,
            content: e_editor,
            date: e_date
        };
        jsonData.push(newNote);
    } else {
        let note = jsonData[e_id];
        note.title = e_title;
        note.document_type = e_doctype;
        note.content = e_editor;
        note.date = e_date;
    }

    // Sort jsonData in descending order based on date
    jsonData.sort((a, b) => new Date(b.date) - new Date(a.date));

    localStorage.setItem('json_data_notes', JSON.stringify(jsonData));

    fetch('/save_file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    }).then(
        response => response.json()
    ).then(
        data => {
            console.log('Success:', data);
            list_Notes(localStorage.getItem('json_data_notes'));
            window.history.pushState(null, null, '?note=' + 0);
        }
    ).catch(
        (error) => {
            console.error('Error:', error);
        }
    )
}

function download_doc(id) {
    let json_file = localStorage.getItem('json_data_notes');
    let jsonData = JSON.parse(json_file);

    let title = jsonData[id]['title']
    let doctype = jsonData[id]['document_type']
    let content = jsonData[id]['content']

    // Erstellen eines Blob-Objekts aus dem Inhalt
    var blob = new Blob([content], {type: 'text/' + doctype});

    // Erstellen eines URL-Objekts für den Blob
    var url = URL.createObjectURL(blob);

    // Erstellen eines versteckten <a> -Tags zum Herunterladen
    var a = document.createElement('a');
    a.href = url;
    a.download = title + '.' + doctype;

    // Simulieren eines Klicks auf den Link
    document.body.appendChild(a);
    a.click();

    // Entfernen des <a> -Tags aus dem Dokument
    document.body.removeChild(a);

    // Freigabe des URL-Objekts
    URL.revokeObjectURL(url);
}

function download_doc_current() {
    let id = new URLSearchParams(window.location.search).get('note');
    if (id !== "NEW*") {
        download_doc(id)
    }
}

function delete_doc_current() {
    let id = new URLSearchParams(window.location.search).get('note');
    if (id === "NEW*") {
        clearEditor()
    } else {
        deleteNote(id)
        clearEditor()
    }

}

// start listening for keydown events
addKeyListener()