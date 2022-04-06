import { languageCompilerList, languageAliasMap, prismLanguagePackgeName } from './constant.js'

const getExecutionResult = async (language, code, stdin = "") => {
  const compiler = __getCompiler(language)
  const data = {
    code,
    stdin,
    options: ``,
    compiler
  }
  const result = fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(response => response.json())
    .then(data => {
      return data
    });
  return result;
}

const __getCompiler = (language) => {
  return languageCompilerList[getStandardLanguageName(language)]['compiler'];
}

const getStandardLanguageName = (language) => {
  const value1 = languageAliasMap[language]
  const value2 = languageAliasMap[language.toLowerCase()];
  if (value1) {
    return value1;
  } else if (value2) {
    return value2;
  } else {
    return "";
  }
}


export { getExecutionResult, getStandardLanguageName}