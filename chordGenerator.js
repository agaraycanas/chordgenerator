const keys = document.querySelectorAll('.white-key, .black-key, .right');
const bassKeys = document.querySelectorAll('.white-key, .black-key, .left');
const pressedLabel = document.getElementById('pressed-label');
let currentlyPressedTonalityButton = null;
let currentlyPressedModeButton = null
let currentlyPressedScaleButton = null;
let currentlyPressedRootKeyButton = null;
let currentlyPressedBassNoteButton = null;
let currentlyPressedTypeButton = null;
let currentlyPressedVoicingButton = null;
let currentlyPressedVoicingButtonTag = null;
let currentlyPressedTensionButtons = { 'triad': false, '9': -2, '11': -2, '13': -2 };
let currentlyPressedInversionButton = null;
let numberOfBars = 0;
let lastSongChordClickedIndex = 0;
let chordWithSpaces = '';
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
// ................................................
let currentlyPressedNoteButton = null;
let currentlyPressedSusButton = null;
let currentlyPressedNotedespButton = null;
let currentlyPressedOctavedespButton = null;
let chord = {
    '1': false, '2': false, '3': false, '4': false, '5': false,
    '6': false, '7': false, '9': false, '11': false, '13': false,
    'd1': 0, 'd2': 0, 'd3': 0, 'd4': 0, 'd5': 0,
    'd6': 0, 'd7': 0, 'd9': 0, 'd11': 0, 'd13': 0,
    's2': false, 's4': false
}
let chordButton = {
    '1': false, 'sus2': false, '2': false, 'b3': false, '3': false,
    'sus4': false, '4': false, 'b5': false, '5': false, 's5': false,
    '6': false, 'b7': false, '7': false,
    'b9': false, '9': false, 's9': false,
    'b11': false, '11': false, 's11': false,
    'b13': false, '13': false, 's13': false
}


initEnvironment();

function initEnvironment() {
    window.addEventListener('DOMContentLoaded', function () {
        handleTonalityButtonClick('c');
    });
    window.addEventListener('DOMContentLoaded', function () {
        handleModeButtonClick('major');
    });
    window.addEventListener('DOMContentLoaded', function () {
        handleScaleButtonClick('ionian');
    });
    window.addEventListener('DOMContentLoaded', function () {
        handleTensionButtonClick('jazz');
    });
    window.addEventListener('DOMContentLoaded', function () {
        handleInversionButtonClick('0');
    });
    window.addEventListener('DOMContentLoaded', function () {
        handleTypeButtonClick('major');
    });
    window.addEventListener('DOMContentLoaded', function () {
        handleRootKeyButtonClick('c');
    });
    window.addEventListener('DOMContentLoaded', function () {
        handleVoicingButtonClick('rootless');
    });
    document.addEventListener("DOMContentLoaded", function (event) {

        function handleKeyDown(event) {
            var myDiv = document.getElementById('songchords-id');
            if (numberOfBars != 0) {

                if (event.key === 'ArrowRight') {
                    if (lastSongChordClickedIndex <= myDiv.childElementCount) {
                        do {
                            inc = lastSongChordClickedIndex == myDiv.childElementCount - 1 ? 0 : 1;
                            lastSongChordClickedIndex += inc;
                            currentChild = myDiv.children[lastSongChordClickedIndex];
                        }
                        while (currentChild.getAttribute('comp') == 's' && lastSongChordClickedIndex + 1 != myDiv.childElementCount);
                        if (currentChild.getAttribute('comp') == 's' && lastSongChordClickedIndex + 1 == myDiv.childElementCount) {
                            lastSongChordClickedIndex--;
                        }
                    }
                } else {
                    if (event.key === 'ArrowLeft') {
                        do {
                            inc = lastSongChordClickedIndex == 0 ? 0 : -1;
                            lastSongChordClickedIndex += inc;
                            currentChild = myDiv.children[lastSongChordClickedIndex];
                        }
                        while (currentChild.getAttribute('comp') == 's' && lastSongChordClickedIndex - 1 >= 0);
                    }
                }

                if (currentChild.getAttribute('comp') == 's' && lastSongChordClickedIndex == 0) {
                    lastSongChordClickedIndex = 1;
                }

                if (currentChild.getAttribute('comp') == 'b') {
                    currentChild.click();
                }
            }
        }

        function setButtonListeners() {
            var myDiv = document.getElementById('songchords-id');

            for (var i = 0; i < myDiv.childElementCount; i++) {
                currentChild = myDiv.children[i];
                if (currentChild.getAttribute('comp') == 'b') {
                    currentChild.addEventListener('click', buttonClicked.bind(null, i));
                }
            }
        }

        setButtonListeners();
        document.addEventListener('keydown', handleKeyDown);
    });
}

function noteToStyle(note) {
    return note.length > 1 ? 'br-black' : 'br-white';
}

function handleRootKeyButtonClick(actualKey) {
    const actualRoot = document.getElementById('root-' + actualKey);
    const actualBass = document.getElementById('bass-' + actualKey);
    let previousRoot = currentlyPressedRootKeyButton;
    let previousBass = currentlyPressedBassNoteButton;
    if (previousRoot && previousBass) {
        previousRoot.classList.remove('highlight');
        previousBass.classList.remove('highlightLeft');
        previousRoot.classList.add(noteToStyle(previousRoot.getAttribute('tag')));
        previousBass.classList.add(noteToStyle(previousBass.getAttribute('tag')));
    }
    currentlyPressedRootKeyButton = actualRoot;
    currentlyPressedRootKeyButton.classList.remove(noteToStyle(currentlyPressedRootKeyButton.getAttribute('tag')));
    currentlyPressedRootKeyButton.classList.add('highlight');
    currentlyPressedBassNoteButton = actualBass;
    currentlyPressedBassNoteButton.classList.remove(noteToStyle(currentlyPressedBassNoteButton.getAttribute('tag')));
    currentlyPressedBassNoteButton.classList.add('highlightLeft');
    updateChordnameAndHighlighth();
}

function handleBassNoteButtonClick(key) {
    const actualBass = document.getElementById('bass-' + key);

    if (currentlyPressedBassNoteButton) {
        currentlyPressedBassNoteButton.classList.remove('highlightLeft');
        currentlyPressedBassNoteButton.classList.add(noteToStyle(currentlyPressedBassNoteButton.getAttribute('tag')));
    }
    currentlyPressedBassNoteButton = actualBass;
    currentlyPressedBassNoteButton.classList.remove(noteToStyle(currentlyPressedBassNoteButton.getAttribute('tag')));
    currentlyPressedBassNoteButton.classList.add('highlightLeft');
    updateChordnameAndHighlighth();
}

function handleTypeButtonClick(type) {
    if (currentlyPressedTypeButton) {
        currentlyPressedTypeButton.classList.remove('highlight');
    }
    currentlyPressedTypeButton = document.getElementById('type-' + type);
    currentlyPressedTypeButton.classList.add('highlight');
    if (type == "major" && !currentlyPressedTensionButtons['triad']) {
        handleScaleButtonClick('lydian');
    }
    if (type == "minor" && !currentlyPressedTensionButtons['triad']) {
        handleScaleButtonClick('dorian');
    }
    if (type == "dominant" && !currentlyPressedTensionButtons['triad']) {
        handleScaleButtonClick('domdim');
    }
    updateChordnameAndHighlighth();
}

function handleVoicingButtonClick(type) {
    if (type != 'root' && currentlyPressedTypeButton && currentlyPressedTensionButtons['triad']) {
        handleTensionButtonClick('jazz');
    }
    if (currentlyPressedVoicingButton) {
        currentlyPressedVoicingButton.classList.remove('highlightVoicing');
    }
    currentlyPressedVoicingButton = document.getElementById('voicing-' + type);
    currentlyPressedVoicingButton.classList.add('highlightVoicing');
    updateChordnameAndHighlighth();
}

function saveSong() {
    const content = document.getElementById('songchords-id').innerHTML;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const temporaryLink = document.createElement('a');
    const tonality =
        (currentlyPressedTonalityButton.getAttribute('tag')) +
        (currentlyPressedModeButton.getAttribute('tag') == 'minor' ? 'm' : '');
    const songname = document.getElementById('songname-id').value + " (" + tonality + ").html";
    temporaryLink.href = url;
    temporaryLink.download = songname;
    temporaryLink.click();
}

function loadSong() {
    const inputFile = document.getElementById('inputFile');
    if (inputFile.files && inputFile.files[0]) {
        const file = inputFile.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            div = document.getElementById('songchords-id');
            div.innerHTML = content;
            const fileName = file.name;
            const filenameNoExt = fileName.substring(0, fileName.lastIndexOf('.'));
            document.getElementById('songname-id').value = filenameNoExt;
        };
        reader.readAsText(file);
    }
}

function simulateTensionButtonClick(tensions) {
    if (tensions['triad']) {
        handleTensionButtonClick('triad');
    }
    else {
        handleTensionButtonClick('jazz');
        ninth = tensions[9];
        eleventh = tensions[11];
        thirteenth = tensions[13];
        if (ninth != -2) {
            handleTensionButtonClick(tensionNumberToLetter(ninth) + '9');
        }
        if (eleventh != -2) {
            handleTensionButtonClick(tensionNumberToLetter(eleventh) + '11');
        }
        if (thirteenth != -2) {
            handleTensionButtonClick(tensionNumberToLetter(thirteenth) + '13');
        }
    }
}

function handleChordButtonClick(button, root, bass, type, tensions, voicing, inversion, rootTonality, modeTonality) {
    let buttons = document.getElementById('songchords-id').querySelectorAll('button');
    buttons.forEach(b => b.classList.remove('highlightSongChord'));
    button.classList.add('highlightSongChord');
    lastSongChordClickedIndex = Array.from(button.parentNode.children).indexOf(button);
    handleRootKeyButtonClick(root);
    handleBassNoteButtonClick(bass);
    handleTypeButtonClick(type);
    simulateTensionButtonClick(tensions);
    handleVoicingButtonClick(voicing);
    handleInversionButtonClick(inversion);
    handleTonalityButtonClick(rootTonality);
    handleModeButtonClick(modeTonality);
}

function addChord() {
    var noOfElements = document.getElementById('songchords-id').childElementCount;
    if (noOfElements == 0) {
        addBarSeparator();
    }
    noOfElements++;
    const div = document.getElementById('songchords-id');
    const button = document.createElement('button');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const v = currentlyPressedVoicingButton.getAttribute('tag');
    const i = currentlyPressedInversionButton.getAttribute('tag');

    span1.setAttribute('class', 'button-big');
    span2.setAttribute('class', 'button-small');
    span1.innerHTML = document.getElementById('pressed-label').innerHTML;
    span2.textContent = vShort[v] + " " + iShort[i];

    button.id = "bchord" + noOfElements + "-id";
    button.setAttribute('pos', noOfElements - 1);
    button.setAttribute('comp', 'b');

    rootTonality = currentlyPressedTonalityButton.getAttribute('tag').toLowerCase();
    modeTonality = currentlyPressedModeButton.getAttribute('tag').toLowerCase();
    root = currentlyPressedRootKeyButton.getAttribute('tag').toLowerCase();
    bass = currentlyPressedBassNoteButton.getAttribute('tag').toLowerCase();
    type = currentlyPressedTypeButton.getAttribute('tag');
    voicing = currentlyPressedVoicingButton.getAttribute('tag');
    inversion = currentlyPressedInversionButton.getAttribute('tag');
    cp = currentlyPressedTensionButtons;

    tensions =
        "{ 'triad':" + cp['triad'] +
        ", '9': " + cp['9'] +
        ", '11': " + cp['11'] +
        ", '13': " + cp['13'] +
        " }";


    button.setAttribute('onclick', "handleChordButtonClick( " +
        "this," +
        "'" + root + "', " +
        "'" + bass + "', " +
        "'" + type + "', " +
        tensions + ", " +
        "'" + voicing + "', " +
        "'" + inversion + "', " +
        "'" + rootTonality + "', " +
        "'" + modeTonality +
        "' )"
    );
    button.appendChild(span1);
    button.appendChild(span2);

    div.appendChild(button);

}

function addBarSeparator() {
    var myDiv = document.getElementById('songchords-id');
    var noOfElements = myDiv.childElementCount;

    if (noOfElements == 0 || myDiv.children[(myDiv.childElementCount) - 1].getAttribute('comp') != 's') {
        noOfElements++;
        numberOfBars++;
        const div = document.getElementById('songchords-id');
        const sepDiv = document.createElement('div');
        sepDiv.id = "bchord" + noOfElements + "-id";
        sepDiv.setAttribute('pos', noOfElements - 1);
        sepDiv.setAttribute('class', 'barSeparator');
        sepDiv.setAttribute('comp', 's');
        sepDiv.innerHTML = '<span>' + numberOfBars + '</span>';
        div.appendChild(sepDiv);
    }

}

function deleteChord() {
    var myDiv = document.getElementById('songchords-id');
    var myElement = myDiv.children[(myDiv.childElementCount) - 1];
    var myType = myElement.getAttribute('comp');
    var myNumberOfElements = myDiv.childElementCount;

    if (myType == 's') {
        numberOfBars--;
    }

    if (lastSongChordClickedIndex + 1 >= myNumberOfElements) {
        lastSongChordClickedIndex = myNumberOfElements - 2;
    }

    if (lastSongChordClickedIndex != 0) {
        if (myDiv.children[lastSongChordClickedIndex].getAttribute('comp') == 's') {
            lastSongChordClickedIndex--;
        }

        myDiv.children[lastSongChordClickedIndex].click();
    }

    myElement.remove();

    if (myDiv.childElementCount == 1) {
        myDiv.children[0].remove();
        numberOfBars = 0;
    }
}

function handleSongChordButtonClick(operation) {
    var noOfElements = document.getElementById('songchords-id').childElementCount;
    if (operation == 'add') {
        addChord();
    }
    if (operation == 'sep') {
        addBarSeparator();
    }
    if (operation == 'remove' && noOfElements > 0) {
        deleteChord();
    }
    if (operation == 'removeall') {
        while (noOfElements > 0) {
            deleteChord();
        }
    }
    if (operation == 'save') {
        saveSong();
    }
    if (operation == 'load') {
        loadSong();
    }
}

function dimTensionButtons() {
    document.getElementById('tension-jazz').classList.remove('highlight');
    document.getElementById('tension-triad').classList.remove('highlight');

    document.getElementById('tension-b9').classList.remove('highlight');
    document.getElementById('tension-9').classList.remove('highlight');
    document.getElementById('tension-s9').classList.remove('highlight');

    document.getElementById('tension-b11').classList.remove('highlight');
    document.getElementById('tension-11').classList.remove('highlight');
    document.getElementById('tension-s11').classList.remove('highlight');

    document.getElementById('tension-b13').classList.remove('highlight');
    document.getElementById('tension-13').classList.remove('highlight');
    document.getElementById('tension-s13').classList.remove('highlight');
}

function tensionNumberToLetter(number, display = false) {
    var sol = '';
    if (number == -1) {
        sol = 'b';
    }
    if (number == 1) {
        sol = display ? '#' : 's';
    }
    return sol;
}

function updateTensionButtons() {

    dimTensionButtons();
    const t9 = currentlyPressedTensionButtons['9'];
    const t11 = currentlyPressedTensionButtons['11'];
    const t13 = currentlyPressedTensionButtons['13'];
    if (currentlyPressedTensionButtons['triad']) {
        document.getElementById('tension-triad').classList.add('highlight');
    }
    else {
        document.getElementById('tension-jazz').classList.add('highlight');
    }
    if (t9 != -2) {
        document.getElementById('tension-' + tensionNumberToLetter(t9) + '9').classList.add('highlight');
    }
    if (t11 != -2) {
        document.getElementById('tension-' + tensionNumberToLetter(t11) + '11').classList.add('highlight');
    }
    if (t13 != -2) {
        document.getElementById('tension-' + tensionNumberToLetter(t13) + '13').classList.add('highlight');
    }
}

function handleTensionButtonClick(tag) {

    if (tag == 'jazz') {
        currentlyPressedTensionButtons = { 'triad': false, '9': -2, '11': -2, '13': -2 };
    }
    if (tag == 'triad') {
        currentlyPressedTensionButtons = { 'triad': true, '9': -2, '11': -2, '13': -2 };
    }
    if (tag == '9' || tag == 'b9' || tag == 's9') {
        var ninth = tag == '9' ? 0 : (tag == 'b9' ? -1 : 1);
        currentlyPressedTensionButtons['triad'] = false;
        if (currentlyPressedTensionButtons['9'] == 0 && tag == '9') {
            currentlyPressedTensionButtons['9'] = -2;
        }
        else {
            currentlyPressedTensionButtons['9'] = ninth;
        }
    }
    if (tag == '11' || tag == 'b11' || tag == 's11') {
        var eleventh = tag == '11' ? 0 : (tag == 'b11' ? -1 : 1);
        currentlyPressedTensionButtons['triad'] = false;
        if (currentlyPressedTensionButtons['11'] == 0 && tag == '11') {
            currentlyPressedTensionButtons['11'] = -2;
        }
        else {
            currentlyPressedTensionButtons['11'] = eleventh;
        }
        /*
        if (currentlyPressedTensionButtons['9'] == -2) {
            currentlyPressedTensionButtons['9'] = 0;
        }
        */
    }
    if (tag == '13' || tag == 'b13' || tag == 's13') {
        var thirteenth = tag == '13' ? 0 : (tag == 'b13' ? -1 : 1);
        currentlyPressedTensionButtons['triad'] = false;
        if (currentlyPressedTensionButtons['13'] == 0 && tag == '13') {
            currentlyPressedTensionButtons['13'] = -2;
        }
        else {
            currentlyPressedTensionButtons['13'] = thirteenth;
        }
        /*
        if (currentlyPressedTensionButtons['9'] == -2) {
            currentlyPressedTensionButtons['9'] = 0;
        }
        if (currentlyPressedTensionButtons['11'] == -2) {
            currentlyPressedTensionButtons['11'] = 0;
        }
        */
    }
    updateTensionButtons();
    updateChordnameAndHighlighth();

    if (currentlyPressedVoicingButton &&
        currentlyPressedVoicingButton.getAttribute('tag') != 'root' &&
        tag == 'triad'
    ) {
        handleVoicingButtonClick('root');
    }
}

function handleInversionButtonClick(type) {
    if (currentlyPressedInversionButton) {
        currentlyPressedInversionButton.classList.remove('highlightInversion');
    }
    if (!(type == '3' && currentlyPressedTensionButtons['triad'])) {
        currentlyPressedInversionButton = document.getElementById('inversion-' + type);
    }
    currentlyPressedInversionButton.classList.add('highlightInversion');
    updateChordnameAndHighlighth();
}

function updateChordname() {
    let pressedKey = '';
    let root = '';
    let bass = '';
    let type = '';
    let triad = '';
    let tensions = {};
    let voicing = '';
    if (currentlyPressedRootKeyButton) {
        root = currentlyPressedRootKeyButton.getAttribute('tag');
    }
    if (currentlyPressedBassNoteButton) {
        bass = currentlyPressedBassNoteButton.getAttribute('tag');
    }
    if (currentlyPressedTensionButtons) {
        tensions = currentlyPressedTensionButtons;
        triad = tensions['triad'] ? 'triad' : 'jazz';
    }
    if (currentlyPressedTypeButton) {
        type = currentlyPressedTypeButton.getAttribute('tag').toLowerCase();
    }
    if (currentlyPressedVoicingButton) {
        voicing = currentlyPressedVoicingButton.getAttribute('tag').toLowerCase();
    }
    if (currentlyPressedRootKeyButton) {
        pressedKey = '' + root;
    }
    if (currentlyPressedRootKeyButton &&
        (type == 'minor' || type == 'minmaj' || type == 'sixthm')) {
        pressedKey += 'm';
    }
    if (currentlyPressedRootKeyButton &&
        type == 'augmented') {
        pressedKey += '+';
    }
    if (currentlyPressedTypeButton) {
        pressedKey += '<sup class="superindex">';
        if (voicing == 'root') {
            pressedKey += typeDisplay[triad][type];
        }
        if (voicing == 'rootless') {
            pressedKey += typeDisplay[voicing][type];
        }

        if (
            !tensions['triad'] && (
                tensions['9'] != -2 ||
                tensions['11'] != -2 ||
                tensions['13'] != -2
            )
        ) {
            pressedKey += ' ( ';
            if (tensions['9'] != -2) {
                pressedKey += tensionNumberToLetter(tensions['9'], true) + '9 ';
            }
            if (tensions['11'] != -2) {
                pressedKey += tensionNumberToLetter(tensions['11'], true) + '11 ';
            }
            if (tensions['13'] != -2) {
                pressedKey += tensionNumberToLetter(tensions['13'], true) + '13 ';
            }
            pressedKey += ')';
        }
        pressedKey += '</sup>';
    }
    if (currentlyPressedBassNoteButton && currentlyPressedRootKeyButton.getAttribute('tag') != currentlyPressedBassNoteButton.getAttribute('tag')) {
        pressedKey += ' / ' + currentlyPressedBassNoteButton.getAttribute('tag');
        //bass = ' / ' + currentlyPressedBassNoteButton.getAttribute('tag');
    }

    roman = getRomanNumeral();
    pressedLabel.innerHTML = pressedKey + '<span class="roman-label">'+roman+'</span>';
}

function highlightChord() {
    // Generate and display the chord based on the selected options
    const rootKey = currentlyPressedRootKeyButton ? currentlyPressedRootKeyButton.textContent.toLowerCase() : '';
    const bassNote = currentlyPressedBassNoteButton ? currentlyPressedBassNoteButton.textContent.toLowerCase() : '';
    const type = currentlyPressedTypeButton ? currentlyPressedTypeButton.getAttribute('tag').toLowerCase() : '';

    if (currentlyPressedRootKeyButton &&
        currentlyPressedBassNoteButton &&
        currentlyPressedTypeButton &&
        currentlyPressedVoicingButton &&
        currentlyPressedInversionButton
    ) {
        const chord = generateChord(rootKey, type);
        highlightChordKeys(chord);
        highlightBassKey(bassNote);
        chordWithSpaces = bassNote + '0 ' + chord;
        document.getElementById('control-play-id').click();
    }
}

function updateVoicingAndInversionName() {

}

function displayScaleDegreesOnPiano(scaleTonality, scale = []) {
    let notes = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    notes.forEach(note => {
        for (let i = 0; i < 4; i++) {
            let k = document.getElementById(note.toLowerCase() + '' + i);
            k.innerHTML = '';
        }
    });
    let degree = 1;
    scaleTonality.forEach(note => {
        for (let i = 0; i < 4; i++) {
            let k = document.getElementById(note.toLowerCase() + '' + i);
            let spanTone = document.createElement('span');
            spanTone.classList.add("degreeformat");
            spanTone.textContent = degree;
            k.appendChild(spanTone);
        }
        degree++;
    });
    degree = 1;
    scale.forEach(note => {
        for (let i = 0; i < 4; i++) {
            let k = document.getElementById(note.toLowerCase() + '' + i);

            let spanScale = document.createElement('span');
            spanScale.classList.add("scaleformat");
            spanScale.textContent = degree;
            k.appendChild(spanScale);
        }
        degree++;
    });
}

function updateTonality() {
    let root = currentlyPressedTonalityButton ? currentlyPressedTonalityButton.getAttribute('tag') : null;
    let mode = currentlyPressedModeButton ? currentlyPressedModeButton.getAttribute('tag') : null;
    let scaleMode = currentlyPressedScaleButton ? currentlyPressedScaleButton.getAttribute('tag') : null;
    if (root && mode && scaleMode) {
        let i2n = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
        let n2i = { 'C': 0, 'C#': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11 };
        let intervals = {
            'none': [],
            'major': [0, 2, 4, 5, 7, 9, 11],
            'ionian': [0, 2, 4, 5, 7, 9, 11],
            'minor': [0, 2, 3, 5, 7, 8, 10],
            'aeolian': [0, 2, 3, 5, 7, 8, 10],
            'dorian': [0, 2, 3, 5, 7, 9, 10],
            'phrygian': [0, 1, 3, 5, 7, 8, 10],
            'lydian': [0, 2, 4, 6, 7, 9, 11],
            'mixolydian': [0, 2, 4, 5, 7, 9, 10],
            'locrian': [0, 1, 3, 5, 6, 8, 10],
            'domdim': [0, 1, 3, 4, 6, 7, 9, 10],
            'bluesmaj': [0, 2, 4, 7, 9],
            'gospelmaj': [0, 2, 3, 4, 7, 8, 9],
            'bluesmin': [0, 3, 5, 7, 10],
            'gospelmin': [0, 3, 5, 6, 7, 10, 11]
        };
        let tonalityScale = [];
        intervals[mode].forEach(interval => {
            tonalityScale.push(i2n[(n2i[root] + interval) % 12]);
        });
        let scale = [];
        intervals[scaleMode].forEach(interval => {
            scale.push(i2n[(n2i[root] + interval) % 12]);
        });
        displayScaleDegreesOnPiano(tonalityScale, scale);
    }
}

function updateChordnameAndHighlighth() {
    updateChordname();
    updateVoicingAndInversionName();
    updateTonality();
    highlightChord();
}

function updateChordTensions(chord) {
    t = currentlyPressedTensionButtons;
    if (t['triad']) {
        while (chord.length >= 4) {
            chord.pop();
        }
    }
    else {
        if (t['9'] != -2) {
            const note = 14 + t['9'];
            chord.push(note);
        }
        if (t['11'] != -2) {
            const note = 17 + t['11'];
            chord.push(note);
        }
        if (t['13'] != -2) {
            const note = 21 + t['13'];
            chord.push(note);
        }
    }
}

function updateChordInversions(chord) {
    inv = currentlyPressedInversionButton.getAttribute('tag');
    while (inv > 0) {
        firstNote = chord.shift();
        firstNote += 12;
        chord.push(firstNote);
        inv--;
    }
}

function updateChordVoicings(chord) {
    voicing = currentlyPressedVoicingButton.getAttribute('tag');
    type = currentlyPressedTypeButton.getAttribute('tag');
    switch (voicing) {
        case 'root': break;
        case 'shell3':
            chord.splice(3, 1); //7a
            chord.splice(2, 1); //5a
            break;
        case 'shell7':
            chord.splice(2, 1); //5a
            chord.splice(1, 1); //3a
            break;
        case 'shell37':
            chord.splice(2, 1); //5a
            chord.splice(0, 1); //1a
            break;
        case 'open3':
            chord[1] += 12; //3a
            break;
        case 'open5':
            chord[1] += 12; //3a
            chord[2] += 12; //5a
            break;
        case 'open7':
            chord[1] += 12; //3a
            chord[3] += 12; //7a
            break;
        case 'rootless':
            switch (type) {
                case 'major': ;
                case 'augmented': ;
                case 'minor': ;
                case 'minmaj':
                case 'sixth':
                case 'sixthm':
                case 'sus2':
                case 'sus4':
                    chord[0] += 2;  //1=>2
                    break;
                case 'dominant':
                    chord[0] += 2;  //1=>2 (9)
                    chord[2] += 2;  //5=>6
                    break;
                case 'seventh':
                    chord[0] += 3;  // 1=> #9
                    chord[2] += 1;  // 5=> b13
                    break;
                case 'diminished': ;
                case 'halfdiminished':
                case 'halfdiminished':
                    break;
            }
            break;
        case 'kenny':
            switch (type) {
                case 'major': ;
                case 'dominant': ;
                case 'seventh': ;
                case 'augmented': ;
                case 'sixth': ;
                case 'sixthm': ;
                case 'sus2': ;
                case 'sus4': ;
                case 'minor': ;
                case 'diminished': ;
                case 'halfdiminished': ;
                case 'minmaj':
                    chord[1] += 12; // 3=> up8
                    chord[3] += 12; // 7=> up8
                    chord[4] = chord[2] + 7; //9 added from 5th
                    chord[5] = chord[3] + 7; //#11 added from 7
                    break;
            }
            break;
        case 'fourth': // 7* 3* 6 9 5 1*
            switch (type) {
                case 'major': ;
                case 'dominant': ;
                case 'seventh': ;
                case 'augmented': ;
                case 'sixth': ;
                case 'sixthm': ;
                case 'sus2': ;
                case 'sus4': ;
                case 'minor': ;
                case 'diminished': ;
                case 'halfdiminished': ;
                case 'minmaj':
                    chord[0] += 36; // 1 => up8 x 2
                    chord[1] += 12; // 3 => up8
                    chord[2] += 24; // 5 => up8
                    chord[3] += 0 // 7 as is
                    chord[4] = chord[1] + 5; //6 added from 3th
                    chord[5] = chord[4] + 5; //9 added from 6th
                    break;
            }
            break;

    }
}

function transposeDown(chord, chordRootIndex) {
    if ((chord[0] + chordRootIndex) >= 12) {
        chord.forEach((interval, pos) => {
            chord[pos] -= 12;
            pos++;
        });
    }
}

function generateChord(rootKey, type) {

    const rootKeyIndex = {
        'c': 0, 'c#': 1, 'd': 2, 'eb': 3, 'e': 4, 'f': 5,
        'f#': 6, 'g': 7, 'ab': 8, 'a': 9, 'bb': 10, 'b': 11
    };

    const chordRootIndex = rootKeyIndex[rootKey.toLowerCase()];
    var chordIntervals = [].concat(chordTypes[type]);
    const chordNotes = [];

    updateChordTensions(chordIntervals);
    updateChordVoicings(chordIntervals);
    updateChordInversions(chordIntervals);
    transposeDown(chordIntervals, chordRootIndex);

    rootKey = rootKey.toLowerCase();
    chordIntervals.forEach(interval => {
        const noteIndex = (chordRootIndex + interval) % 12;
        var note = Object.keys(rootKeyIndex).find(key => rootKeyIndex[key] === noteIndex);
        var position = Math.trunc((chordRootIndex + interval) / 12) + 1;
        note += position;
        chordNotes.push(note);
    });
    return `${chordNotes.join(' ')}`;
}

function highlightChordKeys(chord) {
    const chordNotes = chord.split(' ');

    keys.forEach(key => key.classList.remove('highlight'));

    chordNotes.forEach(note => {
        const keyElement = document.getElementById(note); //AX
        if (keyElement) {
            keyElement.classList.add('highlight');
        }
    });
}

function highlightBassKey(key) {
    // Deselect all keys
    bassKeys.forEach(key => key.classList.remove('highlightLeft'));

    const keyElement = document.getElementById(key + '0'); //AX
    if (keyElement) {
        keyElement.classList.add('highlightLeft');
    }
}

// TONALITY

function handleTonalityButtonClick(key) {
    const actualBass = document.getElementById('tone-' + key);

    if (currentlyPressedTonalityButton) {
        currentlyPressedTonalityButton.classList.remove('highlighttonality');
        currentlyPressedTonalityButton.classList.add(noteToStyle(currentlyPressedTonalityButton.getAttribute('tag')));
    }
    currentlyPressedTonalityButton = actualBass;
    currentlyPressedTonalityButton.classList.remove(noteToStyle(currentlyPressedTonalityButton.getAttribute('tag')));
    currentlyPressedTonalityButton.classList.add('highlighttonality');
    updateChordnameAndHighlighth();
}

function handleModeButtonClick(key) {
    const actualMode = document.getElementById('mode-' + key);

    if (currentlyPressedModeButton) {
        currentlyPressedModeButton.classList.remove('highlighttonality');
    }
    currentlyPressedModeButton = actualMode;
    currentlyPressedModeButton.classList.add('highlighttonality');
    updateChordnameAndHighlighth();
}

function handleScaleButtonClick(key) {
    const actualScale = document.getElementById('scale-' + key);

    if (currentlyPressedScaleButton) {
        currentlyPressedScaleButton.classList.remove('highlighttonality');
    }
    currentlyPressedScaleButton = actualScale;
    currentlyPressedScaleButton.classList.add('highlighttonality');
    updateChordnameAndHighlighth();
}



function getRomanNumeral() {
    function toMm(type) {
        switch (type) {
            case 'major': ;
            case 'dominant': ;
            case 'seventh': ;
            case 'augmented': ;
            case 'sixth': ;
            case 'sus2': ;
            case 'sus4':
                return 'major';
            case 'minor': ;
            case 'halfdim': ;
            case 'diminished': ;
            case 'minmaj': ;
            case 'sixthm':
                return 'minor';
        }
    }
    const intervals = {'c':0,'c#':1,'d':2,'eb':3,'e':4,'f':5,'f#':6,'g':7,'ab':8,'a':9,'bb':10,'b':11};
    const rootTonality = intervals[currentlyPressedTonalityButton?.getAttribute('tag').toLowerCase()];
    const rootChord = intervals[currentlyPressedRootKeyButton?.getAttribute('tag').toLowerCase()];
    const distance = rootChord>=rootTonality ? rootChord-rootTonality : (rootChord+12)-rootTonality;
    //const mode = currentlyPressedModeButton.getAttribute('tag');
    const chordMode = toMm(currentlyPressedTypeButton?.getAttribute('tag'));
    return toRoman[chordMode][distance];
}

// CHORD PLAYING

function handlePlayButtonClick() {
    var frequencies = {};
    var chord = chordWithSpaces.split(' ');
    function initFrequencies() {
        var octaveRatio = 2;
        var baseFrequency = 880 + 440 + 440 + 440 + 440;
        for (var octave = 0; octave <= 3; octave++) {
            var octaveBaseFrequency = baseFrequency * Math.pow(octaveRatio, octave - 4);
            frequencies['c' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -9);
            frequencies['c#' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -8);
            frequencies['d' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -7);
            frequencies['eb' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -6);
            frequencies['e' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -5);
            frequencies['f' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -4);
            frequencies['f#' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -3);
            frequencies['g' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -2);
            frequencies['ab' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), -1);
            frequencies['a' + octave] = octaveBaseFrequency * Math.pow(2, 0);
            frequencies['bb' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), 1);
            frequencies['b' + octave] = octaveBaseFrequency * Math.pow(Math.pow(2, 1 / 12), 2);
        }
    }

    function play() {
        var oscillator = [];
        var type = 'sawtooth'; // 'sine', 'square', 'sawtooth', 'triangle' and 'custom'
        //var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var gain = audioContext.createGain();
        gain.gain.value = 0.005;

        for (var i = 0; i < chord.length; i++) {
            oscillator[i] = audioContext.createOscillator();
            oscillator[i].type = type;
            oscillator[i].frequency.value = frequencies[chord[i]];
            oscillator[i].connect(gain);
            gain.connect(audioContext.destination);
            oscillator[i].start();
            oscillator[i].stop(audioContext.currentTime + 0.4);
        }

    }

    initFrequencies();
    play();
}


// CHORD BUILDER
/*
function handleBuilderButtonClick(tag) {
    const sus = tag.includes('sus') ? true : false;
    const note =
        ((tag.includes('b') || (tag.includes('s') && !tag.includes('sus'))) ?
            tag.substring(1) :
            (tag.includes('sus') ?
                tag.substring(3) :
                (tag.includes('+') ?
                    tag.split('+')[0] :
                    (tag.includes('-') ?
                        tag.split('-')[0] :
                        tag
                    )
                )
            )
        );
    const noteDesp = tag.includes('b') ? -1 : (tag.includes('s') && !tag.includes('sus') ? 1 : 0);
    const octaveDesp = tag.includes('+') ? 12 : (tag.includes('-') ? -12 : 0);

    //console.log(tag + " [" + sus + '] n' + note + " d" + noteDesp + " o" + octaveDesp);
    checkBuilderButtonRules(tag, note, sus, noteDesp, octaveDesp);
    updateBuilderButtons(tag, note, sus, noteDesp, octaveDesp);
    //console.log(chord);

}

function checkBuilderButtonRules(tag, note, sus, noteDesp, octaveDesp) {

    if (octaveDesp != 0 && !chordButton[note]) {
        return;
    }

    if (octaveDesp != 0) {
        if (note == '1') {
            chordButton['1'] = !chordButton['1'];
            chord['1'] = chordButton['1'];
            chord['d1'] = 0;
        }
        // --------------------------------

        if (note == '2') {
            if (note == tag) {
                chordButton[tag] = !chordButton[tag];
                chordButton['sus' + tag] = false;
            }
            if (sus) {
                chordButton[tag] = !chordButton[tag];
                chordButton[note] = chordButton[tag] ? true : chordButton[note];
                chordButton['3'] = false;
                chordButton['b3'] = false;
                chordButton['4'] = false;
                chordButton['sus4'] = false;
            }
            chord['2'] = chordButton['2'];
        }
        if (note == '4') {
            if (note == tag) {
                chordButton[tag] = !chordButton[tag];
                chordButton['sus' + tag] = false;
            }
            if (sus) {
                chordButton[tag] = !chordButton[tag];
                chordButton[note] = chordButton[tag] ? true : chordButton[note];
                chordButton['3'] = false;
                chordButton['b3'] = false;
                chordButton['2'] = false;
                chordButton['sus2'] = false;
            }
        }
        if (note == '3') {
            chordButton[tag] = !chordButton[tag];

            if ((tag == 'b3') && !chordButton['3']) {
                chordButton['3'] = true;
            }

            if (!chordButton['3']) {
                chordButton['b3'] = false;
            }

            if (chordButton['3'] && (chordButton['sus2'])) {
                chordButton['2'] = false;
                chordButton['sus2'] = false;
            }

            if (chordButton['3'] && (chordButton['sus4'])) {
                chordButton['4'] = false;
                chordButton['sus4'] = false;
            }
        }
        // --------------------------------

        if (note == '5') {
            chordButton[tag] = !chordButton[tag];

            if ((tag == 'b5' || tag == 's5') && !chordButton['5']) {
                chordButton['5'] = true;
            }

            if (tag == 'b5' && chordButton['s5']) {
                chordButton['s5'] = false;
            }
            if (tag == 's5' && chordButton['b5']) {
                chordButton['b5'] = false;
            }
            if (!chordButton['5']) {
                chordButton['b5'] = false;
                chordButton['s5'] = false;
            }
        }
        // --------------------------------

        if (note == '6') {
            chordButton[tag] = !chordButton[tag];
        }
        if (note == '6') {
            chordButton[tag] = !chordButton[tag];

            if (!chordButton['7']) {
                chordButton['b7'] = false;
            }
        }
        // --------------------------------

        if (note == '9') {
            chordButton[tag] = !chordButton[tag];

            if ((tag == 'b9' || tag == 's9') && !chordButton['9']) {
                chordButton['9'] = true;
            }

            if (tag == 'b9' && chordButton['s9']) {
                chordButton['s9'] = false;
            }
            if (tag == 's9' && chordButton['b9']) {
                chordButton['b9'] = false;
            }
            if (!chordButton['9']) {
                chordButton['b9'] = false;
                chordButton['s9'] = false;
            }
        }
        if (note == '11') {
            chordButton[tag] = !chordButton[tag];

            if ((tag == 'b11' || tag == 's11') && !chordButton['11']) {
                chordButton['11'] = true;
            }

            if (tag == 'b11' && chordButton['s11']) {
                chordButton['s11'] = false;
            }
            if (tag == 's11' && chordButton['b11']) {
                chordButton['b11'] = false;
            }
            if (!chordButton['11']) {
                chordButton['b11'] = false;
                chordButton['s11'] = false;
            }
        }
        if (note == '13') {
            chordButton[tag] = !chordButton[tag];

            if ((tag == 'b13' || tag == 's13') && !chordButton['13']) {
                chordButton['13'] = true;
            }

            if (tag == 'b13' && chordButton['s13']) {
                chordButton['s13'] = false;
            }
            if (tag == 's13' && chordButton['b13']) {
                chordButton['b13'] = false;
            }
            if (!chordButton['13']) {
                chordButton['b13'] = false;
                chordButton['s13'] = false;
            }
        }
    }
}

function altNote(desp) {
    var sol = '';
    if (desp < 0) {
        desp += ((desp / 12 | 0) * 12);
    }
    else {
        desp -= ((desp / 12 | 0) * 12);
    }
    if (desp == -1) {
        sol = 'b';
    }
    if (desp == 1) {
        sol = 's';
    }
    console.log("ALT =====> " + sol);
    return sol;
}

function updateBuilderButtons(tag) {

    for (id in chordButton) {
        document.getElementById('build-' + id).classList.remove('highlightDegree');
    }

    for (id in chordButton) {
        if (chordButton[id]) { document.getElementById('build-' + id).classList.add('highlightDegree'); }
    }

}

function generateChordFromBuilder() {

}
*/
