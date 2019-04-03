function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/:/g, '&colon;');
}

function toKey(...tokens) {
  return tokens.filter(p => p).map(escape).join(':');
}

export default toKey;



