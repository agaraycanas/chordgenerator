const chordTypes = {
    major: [0, 4, 7, 11],
    minor: [0, 3, 7, 10],
    dominant: [0, 4, 7, 10],
    seventh: [0, 4, 7, 10],
    halfdim: [0, 3, 6, 10],
    diminished: [0, 3, 6, 9],
    augmented: [0, 4, 8, 11],
    minmaj: [0, 3, 7, 11],
    sus2: [0, 2, 7, 10],
    sus4: [0, 5, 7, 10],
    sixth: [0, 4, 7, 9],
    sixthm: [0, 3, 7, 9],
};

//============================================================================
const vShort = {
    'root': '',
    'rootless': 'V-rs',
    'shell3': 'V-s3',
    'shell7': 'V-s7',
    'shell37': 'V-s37',
    'open3': 'V-o3',
    'open5': 'V-o5',
    'open3': 'V-o7',
    'kenny': 'V-kb',
    'fourth': 'V-4',
};

const iShort = {
    '0': '',
    '1': 'I-A',
    '2': 'I-2',
    '3': 'I-B',
};

//============================================================================

const typeDisplay = {
    'jazz': {
        'major': "&#9651;",
        'minor': '7',
        'dominant': '7',
        'seventh': '7',
        'halfdim': "&#x2205;",
        'diminished': 'o',
        'augmented': '   7',
        'minmaj': '&#9651;',
        'sixth':'6',
        'sixthm':'6',
        'sus2': 'sus2',
        'sus4': 'sus4'
    },
    'triad': {
        'major': "",
        'minor': '',
        'dominant': '',
        'seventh': '',
        'halfdim': "o",
        'diminished': 'o',
        'augmented': '',
        'minmaj': '',
        'sixth':'',
        'sixthm':'',
        'sus2': 'sus2',
        'sus4': 'sus4'
    },
    'rootless': {
        'major': '&#9651;9',
        'minor': '9',
        'dominant': '13',
        'seventh': '#9b13',
        'halfdim': '&#x2205;',
        'diminished': 'o',
        'augmented': '   7',
        'minmaj': '&#9651;',
        'sixth':'6',
        'sixthm':'6',
        'sus2': 'sus2',
        'sus4': 'sus4'
    }
};

