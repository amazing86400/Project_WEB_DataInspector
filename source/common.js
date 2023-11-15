/*
  이스케이프 시퀀스 to 한글 변환 함수 정의
  인코딩 된 한글 문자열을 디코딩 해주는 함수입니다.
*/
function decodeUnicodeEscapes(str) {
  const decodedString = eval(`"${str}"`);
  const koreanString = decodeURIComponent(escape(decodedString));
  return koreanString;
}

/*
  데이터 딕셔너리 변환 함수 정의
  protoBuf 타입으로 직렬화된 데이터를 JSON 구조로 변환하는 함수입니다.
*/
function setData() {
  const inputBox = document.getElementById('inputBox');
  const inputTxt = inputBox.value;
  const eventSections = inputTxt.split('event');

  // 이벤트 이름을 매핑하는 객체
  const convertKey = {
    _s: 'session_start',
    _e: 'user_engagement',
    _vs: 'screen_view',
  };

  // 최종 결과 배열
  const events = [];

  // 데이터 설정
  for (let i = 1; i < eventSections.length; i++) {
    // 이벤트 데이터 초기화
    let eventData = initializeEventData();

    const cleanedSection = eventSections[i].replaceAll('}', '}^').trim();
    const subSections = cleanedSection.split('^');

    for (let j of subSections) {
      if (j.includes('param')) {
        handleParam(j, eventData);
      } else if (j.includes('user_property')) {
        handleUserProperty(j, eventData.userProperties);
      } else if (!j.includes('upload_timestamp_millis') && !j.includes('start_timestamp_millis') && !j == '') {
        handleEventName(j, convertKey, eventData);
      }
    }

    events.push(eventData);
    console.log(events);
  }
}

/*
  이벤트 데이터 초기화 함수
  이벤트 데이터를 모두 초기화 합니다.
*/
function initializeEventData() {
  return {
    eventName: '',
    eventParams: {},
    userProperties: {},
    transactions: {},
    items: [],
    remainDatas: {},
  };
}

/*
  param 데이터 처리 함수
  이벤트 매개변수, 전자상거래 정보를 설정합니다.
*/
function handleParam(paramSection, eventData) {
  const key = paramSection.split('"')[1];
  const value = paramSection.split('value:')[1].slice(0, -6).replaceAll('"', '').trim();

  if (key == '_sn') {
    eventData.remainDatas['screen_name'] = decodeUnicodeEscapes(value);
  } else if (key == '_sc') {
    eventData.remainDatas['screen_class'] = decodeUnicodeEscapes(value);
  } else if (key.includes('ep_') || key.includes('event_') || key.includes('dimension')) {
    eventData.eventParams[key] = decodeUnicodeEscapes(value);
  } else if (key.includes('cm_') || key.includes('metric')) {
    eventData.eventParams[key] = value;
  } else if (key.includes('currency') || key.includes('transaction_id') || key.includes('affiliation') || key.includes('coupon')) {
    eventData.transactions[key] = decodeUnicodeEscapes(value);
  } else if (key.includes('value') || key.includes('tax') || key.includes('shipping')) {
    eventData.transactions[key] = value;
  }
}

/*
  user_property 데이터 처리 함수
  사용자 속성을 설정합니다.
*/
function handleUserProperty(userPropertySection, userProperties) {
  const key = userPropertySection.split('"')[1];
  const value = userPropertySection.split('value:')[1].slice(0, -6).replaceAll('"', '').trim();

  if (key.includes('up_') || key.includes('user_') || key.includes('dimension')) {
    userProperties[key] = decodeUnicodeEscapes(value);
  }
}

/*
  이벤트 이름 추출 함수
  이벤트 이름을 설정합니다.
*/
function handleEventName(section, convertKey, eventData) {
  const key = section.split('"')[1];
  eventData.eventName = convertKey[key] || key;
}

/*
  JSON 페이로드
*/
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
