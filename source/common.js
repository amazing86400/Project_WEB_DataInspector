/*
  데이터 딕셔너리 변환 함수 정의
  protoBuf 타입으로 직렬화된 데이터를 JSON 구조로 변환하는 함수입니다.
*/
function setData() {
  const inputBox = document.getElementById('inputBox');
  const inputTxt = inputBox.value;
  const eventSections = inputTxt.split('bundle {\n  protocol_version: 1\n  '); // kb

  // 이벤트 이름을 매핑하는 객체
  const convertKey = {
    // 이벤트명
    _s: 'session_start',
    _e: 'user_engagement',
    _vs: 'screen_view',

    // 매개변수
    _si: 'firebase_screen_id',
    _sn: 'firebase_screen_name',
    _sc: 'firebase_screen_class',
    _et: 'engagement_time_msec',
    _o: 'firebase_event_origin',
    _pn: 'previous_screen_name',
    _pc: 'previous_view_controller',
    _err: 'error',
    _ev: 'error_parameter',
    _el: 'error_code',
    _r: 'realtime',
    _dbg: 'ga_debug',

    _sid: 'ga_session_id',
    _sno: 'ga_session_number',
  };

  // 최종 결과 배열
  const events = [];

  // 데이터 설정
  for (let i = 1; i < eventSections.length; i++) {
    // 이벤트 데이터 초기화
    let eventData = initializeEventData();

    const paramSection = eventSections[i].split('\n    }'); // kb

    for (let j = 0; j < paramSection.length; j++) {
      const param = paramSection[j];
      if (j !== paramSection.length - 1) {
        handleParam(param, convertKey, eventData);
      } else {
        eventData.eventName = param.split('"')[1];
        handleRemainData(param, eventData);
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
    remainDatas: {},
  };
}

/*
  이스케이프 시퀀스 to 한글 변환 함수 정의
  인코딩 된 한글 문자열을 디코딩 해주는 함수입니다.
*/
function decodeUnicodeEscapes(value, dataType) {
  if (dataType == 'string') {
    const decodedValue = eval(`"${value}"`);
    const koreanValue = decodeURIComponent(escape(decodedValue));

    return koreanValue;
  } else if (dataType == 'int') {
    const numberValue = Number(value);

    return numberValue;
  }
}

/*
  param 데이터 처리 함수
  이벤트 매개변수, 전자상거래 정보를 설정합니다.
*/
function handleParam(paramSection, convertKey, eventData) {
  if (!paramSection.includes('items')) {
    const key = paramSection.split('"')[1];
    const value = paramSection.split('value:')[1].replaceAll('"', '').trim();
    const transactionKey = ['currency', 'transaction_id', 'value', 'tax', 'shipping', 'affiliation', 'coupon'];

    const isInt = paramSection.includes('int_value');
    const isString = paramSection.includes('string_value');
    const type = isInt ? 'int' : isString ? 'string' : '';

    if (transactionKey.includes(key)) {
      if (!eventData.eventParams.transactions) {
        eventData.eventParams.transactions = {};
      }
      eventData.eventParams.transactions[convertKey[key] || key] = decodeUnicodeEscapes(value, type);
    } else {
      eventData.eventParams[convertKey[key] || key] = decodeUnicodeEscapes(value, type);
    }
  }
  //  else {
  // }
}

/*
  이 외 데이터 추출 함수
  이벤트 매개변수, 사용자 속성, 전자상거래 정보 외의 정보를 설정합니다.
*/
function handleRemainData(remainSection, eventData) {
  const userSection = remainSection.split('user_property {');
  for (let i = 1; i < userSection.length; i++) {
    const userProperty = userSection[i];
    if (i !== userSection.length - 1) {
      if (userProperty.includes('value:')) {
        handleUserProperty(userProperty, eventData.userProperties);
      }
    } else {
      if (userProperty.includes('user_property {')) {
        const lastUP = userProperty.split('\n  }\n')[0];
        if (lastUP.includes('value:')) {
          handleUserProperty(lastUP, eventData.userProperties);
        }
      }

      const remainData = userProperty.split('\n  }\n')[1].split('\n  ');
      for (let j of remainData) {
        const key = j.split(':')[0].trim();
        const value = j.split(':')[1].replace(/"/g, '').trim();
        if (key !== '') {
          eventData.remainDatas[key] = value;
        }
      }
    }
  }
}

/*
  user_property 데이터 처리 함수
  사용자 속성을 설정합니다.
*/
function handleUserProperty(userPropertySection, userProperties) {
  const key = userPropertySection.split('"')[1];
  const value = userPropertySection.split('value:')[1].replaceAll('"', '').split('\n')[0].trim();

  const isInt = userPropertySection.includes('int_value');
  const isString = userPropertySection.includes('string_value');
  const type = isInt ? 'int' : isString ? 'string' : '';

  if (key !== '') {
    userProperties[key] = decodeUnicodeEscapes(value, type);
  }
}

/*
  JSON 페이로드
*/
// bundle =  {
//   event: [
//     {
//       param: {
//         // 이벤트 매개변수 + 거래 + 상품 +
//       },
//       up:{
//         // 사용자 속성
//       },
//       기타:{
//         // 이벤트명
//       }
//     },
//   ]
// }
