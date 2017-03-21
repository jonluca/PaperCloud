// implemented from algorithm at http://snowball.tartarus.org/algorithms/english/stemmer.html

var exceptions = {
    skis: 'ski',
    skies: 'sky',
    dying: 'die',
    lying: 'lie',
    tying: 'tie',
    idly: 'idl',
    gently: 'gentl',
    ugly: 'ugli',
    early: 'earli',
    only: 'onli',
    singly: 'singl',
    sky: 'sky',
    news: 'news',
    howe: 'howe',
    atlas: 'atlas',
    cosmos: 'cosmos',
    bias: 'bias',
    andes: 'andes',
    together: 'together',

}, exceptions1a = {
    inning: 'inning',
    outing: 'outing',
    canning: 'canning',
    herring: 'herring',
    earring: 'earring',
    proceed: 'proceed',
    exceed: 'exceed',
    succeed: 'succeed'

}, extensions2 = {
    ization: 'ize',
    fulness: 'ful',
    iveness: 'ive',
    ational: 'ate',
    ousness: 'ous',
    tional: 'tion',
    biliti: 'ble',
    lessli: 'less',
    entli: 'ent',
    ation: 'ate',
    alism: 'al',
    aliti: 'al',
    ousli: 'ous',
    iviti: 'ive',
    fulli: 'ful',
    enci: 'ence',
    anci: 'ance',
    abli: 'able',
    izer: 'ize',
    ator: 'ate',
    alli: 'al',
    bli: 'ble',
    ogi: 'og',
    li: ''
};

var english = function (word) {
    if (word.length < 3) {
        return word;
    }
    if (exceptions[word]) {
        return exceptions[word];
    }

    var eRx = ['', ''],
        word = word.toLowerCase().replace(/^'/, '').replace(/[^a-z']/g, '').replace(/^y|([aeiouy])y/g, '$1Y'),
        R1, res;

    if (res = /^(gener|commun|arsen)/.exec(word)) {
        R1 = res[0].length;
    } else {
        R1 = ((/[aeiouy][^aeiouy]/.exec(' ' + word) || eRx).index || 1000) + 1;
    }

    var R2 = (((/[aeiouy][^aeiouy]/.exec(' ' + word.substr(R1)) || eRx).index || 1000)) + R1 + 1;


    // step 0
    word = word.replace(/('s'?|')$/, '');


    // step 1a
    rx = /(?:(ss)es|(..i)(?:ed|es)|(us)|(ss)|(.ie)(?:d|s))$/;
    if (rx.test(word)) {
        word = word.replace(rx, '$1$2$3$4$5');
    } else {
        word = word.replace(/([aeiouy].+)s$/, '$1');
    }

    if (exceptions1a[word]) {
        return exceptions1a[word];
    }

    // step 1b
    var s1 = (/(eedly|eed)$/.exec(word) || eRx)[1],
        s2 = (/(?:[aeiouy].*)(ingly|edly|ing|ed)$/.exec(word) || eRx)[1];

    if (s1.length > s2.length) {
        if (word.indexOf(s1, R1) >= 0) {
            word = word.substr(0, word.length - s1.length) + 'ee';
        }
    } else if (s2.length > s1.length) {
        word = word.substr(0, word.length - s2.length);
        if (/(at|bl|iz)$/.test(word)) {
            word += 'e';
        } else if (/(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/.test(word)) {
            word = word.substr(0, word.length - 1);
        } else if (!word.substr(R1) && /([^aeiouy][aeiouy][^aeiouywxY]|^[aeiouy][^aeiouy]|^[aeiouy])$/.test(word)) {
            word += 'e';
        }
    }


    // step 1c
    word = word.replace(/(.[^aeiouy])[yY]$/, '$1i');


    // step 2
    var sfx = /(ization|fulness|iveness|ational|ousness|tional|biliti|lessli|entli|ation|alism|aliti|ousli|iviti|fulli|enci|anci|abli|izer|ator|alli|bli|l(ogi)|[cdeghkmnrt](li))$/.exec(word);
    if (sfx) {
        sfx = sfx[3] || sfx[2] || sfx[1];
        if (word.indexOf(sfx, R1) >= 0) {
            word = word.substr(0, word.length - sfx.length) + extensions2[sfx];
        }
    }


    // step 3
    var sfx = (/(ational|tional|alize|icate|iciti|ative|ical|ness|ful)$/.exec(word) || eRx)[1];
    if (sfx && (word.indexOf(sfx, R1) >= 0)) {
        word = word.substr(0, word.length - sfx.length) + {
                ational: 'ate',
                tional: 'tion',
                alize: 'al',
                icate: 'ic',
                iciti: 'ic',
                ative: ((word.indexOf('ative', R2) >= 0) ? '' : 'ative'),
                ical: 'ic',
                ness: '',
                ful: ''
            }[sfx];
    }


    // step 4
    var sfx = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|[st](ion)|al|er|ic)$/.exec(word);
    if (sfx) {
        sfx = sfx[2] || sfx[1];
        if (word.indexOf(sfx, R2) >= 0) {
            word = word.substr(0, word.length - sfx.length);
        }
    }


    // step 5
    if (word.substr(-1) == 'e') {
        if (word.substr(R2) || (word.substr(R1) && !(/([^aeiouy][aeiouy][^aeiouywxY]|^[aeiouy][^aeiouy])e$/.test(word)))) {
            word = word.substr(0, word.length - 1);
        }

    } else if ((word.substr(-2) == 'll') && (word.indexOf('l', R2) >= 0)) {
        word = word.substr(0, word.length - 1);
    }

    return word.toLowerCase();
};
/*
 var stem = function(str) {
 var words = str.replace(/[^a-zA-Z0-9\u00C0-\u00FF]+/g, ' ').split(' ')
 for (var i=0, l=words.length; i<l; i++) {
 words[i] = english(words[i]).toLowerCase();
 }
 return words;
 }*/

var stems = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "b", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "cause", "causes", "certain", "certainly", "changes", "clearly", "co", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "d", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "et", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "f", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "g", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten", "greetings", "h", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "inc", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "j", "just", "k", "keep", "keeps", "kept", "know", "known", "knows", "l", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "m", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "r", "rather", "rd", "re", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "s", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t", "t's", "take", "taken", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "use", "used", "useful", "uses", "using", "usually", "uucp", "v", "value", "various", "very", "via", "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "y", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];

var stem = function (str) {
    return str.toLowerCase()
};
