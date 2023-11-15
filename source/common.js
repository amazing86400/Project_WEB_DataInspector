/* 
유니코드 이스케이프 시퀀스 함수 정의
(\\u) 다음에 나오는 4자리의 16진수를 찾아, 해당 코드 포인트를 가진 문자로 변환
*/

/*
  이스케이프 시퀀스 to 한글 변환 함수 정의
*/
function decodeUnicodeEscapes(str) {
  const decodedString = eval(`"${str}"`);
  const koreanString = decodeURIComponent(escape(decodedString));
  return koreanString
}

/*
데이터 딕셔너리 변환 함수 정의
*/
function setData() {
  let inputTxt = document.getElementById('inputBox').value;

  let aa = inputTxt.split('event');
  for (i in aa) {
    if(i > 0) {
      let bb = aa[i].replaceAll('}','}^').trim();
      let cc = bb.split('^')
      for(j of cc){
        if(j.includes('param')){

        }
        let dd = j.split('value:')
        let ee = dd[1].slice(0,-6).replaceAll('"','').trim();
        console.log(ee);
      }
    }
  }



  let outPutTxt = document.getElementById('outPutBox');
  let arr = inputTxt.split('name');
  console.log(arr);
  let data = {};
  for (var i of arr) {
    let splitQuote = i.split('"');
    if (splitQuote.length > 2) {
      if (splitQuote[1] == '_sn') {
        if (splitQuote[3].includes('\\')) {
          var value = splitQuote[3];
          let decodeValue = decodeUnicodeEscapes(value);
          data['screen_name'] = decodeValue;
        } else {
          data['screen_name'] = splitQuote[3];
        }
      } else if (splitQuote[1] == '_sc') {
        data['screen_class'] = splitQuote[3];
      } else if (splitQuote[1].includes('ep_') || splitQuote[1].includes('up_') || splitQuote[1].includes('dimension')) {
        if (splitQuote[3].includes('\\')) {
          var value = splitQuote[3];
          let decodeValue = decodeUnicodeEscapes(value);
          data[splitQuote[1]] = decodeValue;
        } else {
          data[splitQuote[1]] = splitQuote[3];
        }
      } else if (splitQuote[1].includes('cm_') || splitQuote[1].includes('metric')) {
        data[splitQuote[1]] = splitQuote[3];
      }
    }
  }
  console.log(data);
  outPutTxt.value = JSON.stringify(data);
}


  // bundle =  {
  //   event: [
  //     {
  //       param: {

  //       },
  //       up:{

  //       },
  //       기타:{

  //       }
  //     },
  //   ]
  // }
