/* 
유니코드 이스케이프 시퀀스 함수 정의
(\\u) 다음에 나오는 4자리의 16진수를 찾아, 해당 코드 포인트를 가진 문자로 변환
*/
function decodeUnicodeEscapes(str) {
  return str.replace(/\\[\dA-Fa-f]{4}/g, (match) => String.fromCharCode(parseInt(match.substr(2), 16)));
}

/*
데이터 딕셔너리 변환 함수 정의
*/
function setData() {
  let txt = document.getElementById('txtBox').value;
  let arr = txt.split('name');
  let data = {};
  for (var i of arr) {
    let splitQuote = i.split('"');
    if (splitQuote.length > 2) {
      if (splitQuote[1] == '_sn') {
        if (splitQuote[3].includes('\\')) {
          var value = splitQuote[3];
          var replaceValue = String(value.replace(/\\/g, '\\'));
          console.log(replaceValue);
          let decodeValue = decodeURIComponent(escape(replaceValue));
          console.log(decodeValue);
          data['screen_name'] = decodeValue;
        }
        data['screen_name'] = splitQuote[3];
      } else if (splitQuote[1] == '_sc') {
        data['screen_class'] = splitQuote[3];
      } else if (splitQuote[1].includes('ep_') || splitQuote[1].includes('up_') || splitQuote[1].includes('dimension')) {
        if (splitQuote[3].includes('\\')) {
          var value = splitQuote[3];
          var replaceValue = String(value.replace(/\\/g, '\\'));
          console.log(replaceValue);
          let decodeValue = decodeURIComponent(escape(replaceValue));
          console.log(decodeValue);
          data[splitQuote[1]] = decodeValue;
        }
        data[splitQuote[1]] = splitQuote[3];
      } else if (splitQuote[1].includes('cm_') || splitQuote[1].includes('metric')) {
        data[splitQuote[1]] = splitQuote[3];
      }
    }
  }
  console.log(data);
}
