// 최종 데이터 Array
let events = [];

/*
  데이터 딕셔너리 변환 함수 정의
  protoBuf 타입으로 직렬화된 데이터를 JSON 구조로 변환하는 함수입니다.
*/
function convertJson() {
  try {
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
      _err: 'error_code',
      _ev: 'error_parameter',
      _el: 'error',
      _r: 'realtime',
      _dbg: 'ga_debug',

      _sid: 'ga_session_id',
      _sno: 'ga_session_number',
    };

    const inputBox = document.getElementById('inputBox');
    const inputTxt = inputBox.value.trim();
    const bundleSections = inputTxt.split('bundle {\n  protocol_version: 1\n  '); // 번들 기준 Array

    // 번들 기준으로 반복문
    for (let i = 1; i < bundleSections.length; i++) {
      const eventSections = bundleSections[i].split('event {'); // 이벤트 기준 Array

      // 이벤트 기준으로 반복문: ""값일 경우 대비하여 가장 처음 조건문 실행
      for (let j in eventSections) {
        if (eventSections[j].length > 1) {
          let eventData = initializeEventData(); // 이벤트 데이터 초기화
          const paramSections = eventSections[j].split('\n    }'); // param 기준 Array

          // 매개변수 기준으로 반복문: 데이터 설정
          for (let k = 0; k < paramSections.length; k++) {
            const param = paramSections[k];
            if (k !== paramSections.length - 1) {
              handleParam(param, convertKey, eventData); // 이벤트 매개변수 및 전자상거래 데이터 설정
            } else {
              const eventNameKey = param.split('"')[1];
              eventData.eventName = convertKey[eventNameKey] || eventNameKey; // 이벤트명 설정
              handleRemainData(param, eventData); // 사용자 속성 및 이 외 데이터 설정
            }
          }
          events.push(eventData);
        }
      }
    }
    console.log(events);
  } catch (e) {
    console.log('setData 함수 ERROR');
    console.log(e.message);
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
  if (dataType == 'string' && !value.includes('Error:')) {
    const decodedValue = eval(`"${value}"`);
    const koreanValue = decodeURIComponent(escape(decodedValue));

    return koreanValue;
  } else if (dataType == 'int') {
    const numberValue = Number(value);

    return numberValue;
  }
  return value
}

/*
  param 데이터 처리 함수
  이벤트 매개변수 및 전자상거래 정보를 설정합니다.
*/
function handleParam(paramSections, convertKey, eventData) {
  if (!paramSections.includes('items')) {
    // key, value 설정
    const key = paramSections.split('"')[1];
    const value = paramSections.split('value:')[1] ? paramSections.split('value:')[1].replaceAll('"', '').trim() : 'Error: 값이 없습니다.';
    

    const transactionKey = ['currency', 'transaction_id', 'value', 'tax', 'shipping', 'affiliation', 'coupon', 'payment_type','shipping_tier'];

    // 데이터 타입 설정
    const isInt = paramSections.includes('int_value');
    const isString = paramSections.includes('string_value');
    const type = isInt ? 'int' : isString ? 'string' : '';

    const target = transactionKey.includes(key) ? (eventData.eventParams.transactions = eventData.eventParams.transactions || {}) : eventData.eventParams;
    target[convertKey[key] || key] = decodeUnicodeEscapes(value, type);
  } else {
    const itemSections = paramSections.split('6: {\n        6: {\n          ');
    eventData.eventParams.items = eventData.eventParams.items || [];
    handleItems(itemSections, eventData.eventParams.items);
  }
}

/*
  이 외 데이터 추출 함수
  사용자 속성 및 이 외 정보를 설정합니다.
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
      for (let k of remainData) {
        const key = k.split(':')[0].trim();
        const value = k.split(':')[1] ? k.split(':')[1].replace(/"/g, '').trim() : 'Error: 값이 없습니다.';
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
  const value = userPropertySection.split('value:')[1] ? userPropertySection.split('value:')[1].replaceAll('"', '').split('\n')[0].trim() : 'Error: 값이 없습니다.';

  const isInt = userPropertySection.includes('int_value');
  const isString = userPropertySection.includes('string_value');
  const type = isInt ? 'int' : isString ? 'string' : '';

  if (key !== '') {
    userProperties[key] = decodeUnicodeEscapes(value, type);
  }
}

/*
  상품 데이터 처리 함수
  전자상거래 상품 정보를 설정합니다.
*/
function handleItems(itemSection, items) {
  for (let i = 1; i < itemSection.length; i++) {
    const item = {};
    const itemParamSections = itemSection[i].split('1:');
    for (let j = 0; j < itemParamSections.length; j++) {
      const paramSection = itemParamSections[j];

      if (paramSection.length < 2) continue;

      // item_name 기준으로 조건: 13(구분자)
      if (!paramSection.includes('13:')) {
        const key = paramSection.split('"')[1];
        if (paramSection.includes('2:')) {
          const value = paramSection.split('"')[3] ? paramSection.split('"')[3].trim() : 'Error: 값이 없습니다.';
          item[key] = decodeUnicodeEscapes(value, 'string');
        } else if (paramSection.includes('3:')) {
          const value = paramSection.split('3:')[1] ? paramSection.split('3:')[1].split('}')[0].trim() : 'Error: 값이 없습니다.';
          item[key] = decodeUnicodeEscapes(value, 'int');
        }
      } else {
        const value = paramSection.split('"')[1] ? paramSection.split('"')[1].trim() : 'Error: 값이 없습니다.';
        item['item_name'] = decodeUnicodeEscapes(value, 'string');
      }
    }
    items.push(item);
  }
}
