const GRAMMAR_PHRASES = [
  "'d like to ",
  "have been",
  "has been",
  "had been",
  "are being",
  "were being",
  "wasn't",
  "weren't",
  "didn't",
  "doesn't",
  "don't",
  "won't",
  "'m not",
  "going to",
  "will",
  "been",
  "being",
  "had",
  "has",
  "haven't",
  "have",
  "did",
  "does",
  "do",
  "'ll",
  "'m",
  "'ve",
  "aren't",
  "are",
  "wasn't",
  "was",
  "weren't",
  "were",
  "be ",
  "am "
];

const TENSE_MARKERS = [
  "for two hours by 11 o'clock",
  "for two hours",
  "for a while",
  "by 11 o'clock",
  "from 10 to 11 a.m.",
  "tomorrow",
  "yesterday",
  "by the time",
  "at 11 o'clock",
  "at that time",
  " now",
  "this weekend",
  "already",
  "how many",
  "yet",
  "just",
  "before",
  "usually",
  "often",
  "when"
];

const MULTI_WORD_IRREGULARS = [
  "gets wet",
];

const IRREGULAR_WORDS = new Set([
  "go",
  "went",
  "gone",
  "make",
  "made",
  "take",
  "taken",
  "see",
  "seen",
  "called",
  "call",
  "rains",
  "likes",
  "came",
  "comes",
  "misses",
  "starts",
]);

const SPEAKER_MAP = {
  "dima": "speaker-2",
  "stas": "speaker-2",
  "galya": "speaker-1"
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// сортировка: длинные фразы первыми
function sortByLength(arr) {
  return [...arr].sort((a, b) => b.length - a.length);
}

export function highlight(text) {
  if (!text) return "";

  let result = text;

  // 1. tense markers
  sortByLength(TENSE_MARKERS).forEach(phrase => {
    result = result.replace(
      new RegExp(escapeRegex(phrase), "gi"),
      m => `<span class="tense-marker">${m}</span>`
    );
  });

  // 2. multi-word irregulars
  sortByLength(MULTI_WORD_IRREGULARS).forEach(phrase => {
    result = result.replace(
      new RegExp(escapeRegex(phrase), "gi"),
      m => `<span class="grammar highlight-grammar">${m}</span>`
    );
  });

  // 3. grammar phrases
  sortByLength(GRAMMAR_PHRASES).forEach(phrase => {
    result = result.replace(
      new RegExp(escapeRegex(phrase), "gi"),
      m => `<span class="grammar">${m}</span>`
    );
  });

  // 4. -ing
  result = result.replace(
    /\b(\w+?)ing\b/gi,
    (_, root) => `${root}<span class="grammar">ing</span>`
  );

  // 5. irregular words
  result = result.replace(/\b(\w+)\b/gi, (match) => {
    const clean = match.toLowerCase();

    if (IRREGULAR_WORDS.has(clean)) {
      return `<span class="grammar highlight-grammar">${match}</span>`;
    }

    return match;
  });

  return result;
}


function extractSpeaker(text) {
  if (!text) return { speaker: null, cleanText: text };

  const match = text.match(/^([A-Za-z]+):\s*(.*)/);

  if (!match) {
    return { speaker: null, cleanText: text };
  }

  return {
    speaker: match[1],
    cleanText: match[2]
  };
}

export function getSpeakerClass(name) {
  if (!name) return "speaker-default";

  const key = name.trim().toLowerCase();
  return SPEAKER_MAP[key] || "speaker-default";
}

export function highlightSpeakerNameAndText(text) {
  if (!text) return "";

  const withName = text.replace(
    /^([A-Za-z]+):/,
    (match, name) => {
      const cls = getSpeakerClass(name);
      return `<span class="${cls}">${name}</span>:`;
    }
  );

  return highlight(withName);
}

export function highlightSpeakerName(text) {
  if (!text) return "";

  return text.replace(
    /^([A-Za-z]+):/,
    (match, name) => {
      const cls = getSpeakerClass(name);
      return `<span class="${cls}">${name}</span>:`;
    }
  );
}