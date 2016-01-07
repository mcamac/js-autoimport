'use babel';

const _ = require('lodash');

export default class AutoSuggestProvider {

  constructor(exportIndex, importRepository) {
    this.exportIndex = exportIndex;
    this.importRepository = importRepository;
    this.selector = '.source.js,.source.jsx';
  }

  getSuggestions(suggestionRequest) {
    const prefix = suggestionRequest.prefix;

    // TODO: filter out suggestions from currently opened file
    if (prefix !== '') {
      var suggest = _.filter(this.exportIndex.getIndex(), (indexedExport) => {
        const upperCaseChars = this.extractUppercaseCharsFromText(indexedExport.text);

        return _.startsWith(indexedExport.text.toLowerCase(), prefix.toLowerCase()) ||
              (upperCaseChars !== '' && _.startsWith(upperCaseChars, prefix));
      })
      .map((suggestion) => {
        return {
          text: suggestion.text,
          type: suggestion.type,
          file: suggestion.file,
          def: suggestion.def
        };
      });
      return _.sortBy(suggest, suggestion => suggestion.file.length);
    } else {
      return [];
    }
  }

  extractUppercaseCharsFromText(text) {
    return _.filter(text, (character) => {
      return !_.isNumber(character) && character === character.toUpperCase();
    }).join('');
  }

  onDidInsertSuggestion(suggested) {
    this.importRepository.pushSuggestedImport(
      suggested.suggestion,
      suggested.editor.getPath()
    );
  }
}
