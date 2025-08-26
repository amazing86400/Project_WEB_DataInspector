// 최종 데이터 Array
let events = [];

function convertJsonAOS() {
  try {
    // 이벤트 이름을 매핑하는 객체
    const convertKey = {
      //이벤트 명
      "screen_view(_vs)": "screen_view",

      // 매개변수
      "ga_error(_err)": "error_code",
      // 'ga_error_length(_el)': 'error',
      "ga_error_value(_ev)": "error_parameter",
    };

    // 이벤트데이터 초기화
    let eventData = initializeEventData();

    // 이벤트 매개변수 및 전자상거래 데이터 설정
    const eventInputBox = document.getElementById("inputBox");
    const eventInputTxt = eventInputBox.value.trim();
    const splitEventTxt = eventInputTxt.split(",params=Bundle");

    // 이벤트이름 설정
    const eventName = splitEventTxt[0].split("name=")[1];
    const convertEventName = convertKey[eventName] || eventName;
    eventData.eventName = convertEventName;
    eventData.eventParams.event_name = convertEventName;

    // 이벤트 매개변수 설정
    const transactionKey = [
      "currency",
      "transaction_id",
      "value",
      "tax",
      "shipping",
      "affiliation",
      "coupon",
      "payment_type",
      "shipping_tier",
    ];
    let paramSections = splitEventTxt[1].replace(/^\[\{|\}\]$/g, "");

    // 전자상거래 상품 정보 설정
    if (paramSections.includes("items=")) {
      // item 추출
      const startIndex = paramSections.indexOf("items=");
      const endIndex = paramSections.indexOf("}]]");
      const sliceTxt = paramSections.slice(startIndex, endIndex);
      const itemSections = sliceTxt.split("{");

      // items 변수 선언
      let items = [];
      eventData.eventParams.items = eventData.eventParams.items || [];

      // 상품 데이터 설정
      for (let i = 1; i < itemSections.length; i++) {
        let itemSection = itemSections[i];
        if (itemSection.includes("}], Bundle[")) {
          itemSection = itemSection.replace("}], Bundle[", "");
        }

        // (new) 상품 객체로 변환
        const keyValuePairs = itemSection.split(", ");
        const item = {};
        keyValuePairs.forEach((pair) => {
          const [key, value] = pair.split("=");
          const checkValue = value !== "" ? value : "Error: 값이 없습니다.";
          item[key] = checkValue;
        });
        items.push(item);
      }
      eventData.eventParams.items = items;

      // items 상품 제거
      paramSections = paramSections.replace(sliceTxt + "}]], ", "");
    }

    // 상품 정보 제외한 이 외 정보 설정

    // (new) 콤마로 구분된 키-값 쌍을 객체로 변환
    const keyValuePairs = paramSections.split(", ");
    const dataObject = {};
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      const checkValue = value !== "" ? value : "Error: 값이 없습니다.";
      dataObject[key] = checkValue;
    });

    for (let key in dataObject) {
      let value = dataObject[key];
      if (key == "ga_screen(_sn)") {
        eventData.eventParams["firebase_screen_name"] = value;
      } else if (key == "ga_screen_class(_sc)") {
        eventData.eventParams["firebase_screen_class"] = value;
      } else if (
        key.includes("ep_") ||
        key.includes("cm_") ||
        key.includes("dimension") ||
        key.includes("metric") ||
        key.includes("event_") ||
        key.includes("category") ||
        key.includes("action") ||
        key.includes("label")
      ) {
        eventData.eventParams[key] = value;
      } else if (transactionKey.includes(key)) {
        eventData.eventParams.transactions =
          eventData.eventParams.transactions || {};
        eventData.eventParams.transactions[key] = value;
      } else if (key.includes("error")) {
        const errorKey = convertKey[key] || key;
        eventData.eventParams[errorKey] = value;
      } else {
        eventData.remainDatas[key] = value;
      }
    }

    // 사용자 속성 설정
    const userInputBox = document.getElementById("userInputBox");
    if (userInputBox) {
      const userInputTxt = userInputBox.value.trim();
      const splitUserTxt = userInputTxt.split("Setting user property: ");

      for (let i in splitUserTxt) {
        const userProperty = splitUserTxt[i];
        if (userProperty.includes(",")) {
          const key = userProperty.split("\n")[0].split(",")[0].trim();
          const value = userProperty.split("\n")[0].split(",")[1].trim();
          eventData.userProperties[key] = value;
        }
      }
    }
    events.push(eventData);
    console.log(events);
  } catch (e) {
    console.log("convertJsonAOS 함수 ERROR");
    console.log(e.message);
  }
}

/*
  데이터 딕셔너리 변환 함수 정의
  protoBuf 타입으로 직렬화된 데이터를 JSON 구조로 변환하는 함수입니다.
*/
function convertJsoniOS() {
  try {
    // 이벤트 이름을 매핑하는 객체
    const convertKey = {
      // 이벤트명
      _s: "session_start",
      _e: "user_engagement",
      _vs: "screen_view",
      _ab: "app_background",
      _au: "app_update",

      // 매개변수
      _si: "firebase_screen_id",
      _sn: "firebase_screen_name",
      _sc: "firebase_screen_class",
      _et: "engagement_time_msec",
      _o: "firebase_event_origin",
      _pn: "previous_screen_name",
      _pc: "previous_view_controller",
      _err: "error_code",
      _ev: "error_parameter",
      _el: "error",
      _r: "realtime",
      _dbg: "ga_debug",
      _id: "user_id",

      _sid: "ga_session_id",
      _sno: "ga_session_number",
    };

    const inputBox = document.getElementById("inputBox");
    const inputTxt = inputBox.value.trim();
    const bundleSections = inputTxt.split(
      "bundle {\n  protocol_version: 1\n  "
    ); // 번들 기준 Array

    // 번들 기준으로 반복문
    for (let i = 1; i < bundleSections.length; i++) {
      if (bundleSections[i].includes("29: {")) {
        const startIndex = bundleSections[i].indexOf("29: {");
        const endIndex = bundleSections[i].indexOf('52: "G1--"');
        const sliceTxt = bundleSections[i].slice(startIndex, endIndex);
        bundleSections[i] = bundleSections[i].replace(sliceTxt, "");
      }
      const eventSections = bundleSections[i].split("event {"); // 이벤트 기준 Array

      let userNremain = {
        userProperties: {},
        remainDatas: {},
        eventDatas: {},
      };
      handleRemainData(eventSections[eventSections.length - 1], userNremain); // 사용자 속성 및 이 외 데이터 설정

      // 이벤트 기준으로 반복문: ""값일 경우 대비하여 가장 처음 조건문 실행
      for (let j in eventSections) {
        if (eventSections[j].length > 1) {
          let eventData = initializeEventData(); // 이벤트 데이터 초기화
          const paramSections = eventSections[j].split("\n    }"); // param 기준 Array
          // if (!paramSections.at(-1).includes("name:")) {
          //   paramSections.pop();
          // }

          // 매개변수 기준으로 반복문: 데이터 설정
          for (let k = 0; k < paramSections.length; k++) {
            const param = paramSections[k];
            if (k !== paramSections.length - 1) {
              handleParam(param, convertKey, eventData); // 이벤트 매개변수 및 전자상거래 데이터 설정
            } else {
              const eventNameKey = param.split('"')[1];
              const eventName = convertKey[eventNameKey] || eventNameKey;
              eventData.eventName = decodeUnicodeEscapes(eventName, "string"); // 이벤트명 설정
              eventData.eventParams.event_name = decodeUnicodeEscapes(
                eventName,
                "string"
              ); // 이벤트명 설정
            }
          }
          eventData.userProperties = userNremain["userProperties"];
          if (eventData.userProperties.hasOwnProperty('_id')) {
            eventData.userProperties.user_id = eventData.userProperties._id;
            delete eventData.userProperties._id
          }
          eventData.eventParams = {
            ...eventData.eventParams,
            ...userNremain.eventDatas,
          };
          eventData.remainDatas = userNremain["remainDatas"];
          events.push(eventData);
        }
      }
    }
    console.log(events);
  } catch (e) {
    console.log("convertJsoniOS 함수 ERROR");
    console.log(e.message);
  }
}

/*
  이벤트 데이터 초기화 함수
  이벤트 데이터를 모두 초기화 합니다.
*/
function initializeEventData() {
  return {
    eventName: "",
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
  if (dataType === "string" && value && !value.includes("Error:")) {

    // Optional(...) 내부 문자열 처리 + 일반 문자열 처리
    return value.replace(/(?:Optional\("([^"]*?)"\))|([^Optional"].*?)(?=Optional\(|$)/g, (_, optionalInner, normalInner) => {
      const target = optionalInner ?? normalInner;
      if (!target) return '';

      const fixedEscapes = target.replace(/\\\\/g, '\\');
      const decodedValue = eval(`"${fixedEscapes}"`);
      const koreanValue = decodeURIComponent(escape(decodedValue));

      // Optional 구조를 유지
      return optionalInner ? `Optional("${koreanValue}")` : koreanValue;
    });
  } else if (dataType == "int" || dataType == "double") {
    const numberValue = value.includes('0x') ? Number(hexToDouble(value.substring(2))) : Number(value);

    return numberValue;
  }
  return value;
}

function hexToDouble(hex) {
    // Create a buffer to hold the hex data
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);

    // Parse the hex string and store it in the buffer
    const highBits = parseInt(hex.slice(0, 8), 16);
    const lowBits = parseInt(hex.slice(8), 16);
    view.setUint32(0, highBits);
    view.setUint32(4, lowBits);

    // Use DataView to get the float64 value from the buffer
    return view.getFloat64(0);
}


/*
  param 데이터 처리 함수
  이벤트 매개변수 및 전자상거래 정보를 설정합니다.
*/
function handleParam(paramSections, convertKey, eventData) {
  if (!paramSections.includes("items")) {
    // key, value 설정
    const key = paramSections.split('"')[1];
    var value;

    if (paramSections.includes('value:')) {
      value = paramSections.split("value:")[1]
      ? paramSections.split("value:")[1].replaceAll('"', "").trim()
      : "Error: 값이 없습니다.";
    } else if (paramSections.includes('5:')) {
      value = paramSections.split("5:")[1]
      ? paramSections.split("5:")[1].replaceAll('"', "").trim()
      : "Error: 값이 없습니다.";
    }
    
    const transactionKey = [
      "currency",
      "transaction_id",
      "value",
      "tax",
      "shipping",
      "affiliation",
      "coupon",
      "payment_type",
      "shipping_tier",
    ];

    // 데이터 타입 설정
    const isInt = paramSections.includes("int_value");
    const isString = paramSections.includes("string_value");
    const isDouble = paramSections.includes("5");
    const type = isInt ? "int" : isString ? "string" : isDouble ? "double" : "";

    const target = transactionKey.includes(key)
      ? (eventData.eventParams.transactions =
          eventData.eventParams.transactions || {})
      : eventData.eventParams;
    if (key == "_pn" || key == "_pc") {
      eventData.remainDatas[convertKey[key] || key] = decodeUnicodeEscapes(
        value,
        type
      );
    } else {
      target[convertKey[key] || key] = decodeUnicodeEscapes(value, type);
    }
  } else {
    const itemSections = paramSections.split("6: {\n        6: {\n          ");
    eventData.eventParams.items = eventData.eventParams.items || [];
    handleItems(itemSections, eventData.eventParams.items);
  }
}

/*
  이 외 데이터 추출 함수
  사용자 속성 및 이 외 정보를 설정합니다.
*/
function handleRemainData(remainSection, eventData) {
  const userSection = remainSection.split("user_property {");
  for (let i = 1; i < userSection.length; i++) {
    const userProperty = userSection[i];
    if (i !== userSection.length - 1) {
      if (userProperty.includes("value:")) {
        handleUserProperty(userProperty, eventData.userProperties);
      }
    } else {
      if (userProperty.includes("set_timestamp_millis:")) {
        const lastUP = userProperty.split("\n  }\n")[0];
        if (lastUP.includes("value:")) {
          handleUserProperty(lastUP, eventData.userProperties);
        }
      }

      const remainData = userProperty.split("\n  }\n")[1].split("\n  ");
      const exceptRemain = [
        "platform",
        "device_model",
        "app_version",
        "app_id",
        "app_instance_id",
      ];
      for (let k of remainData) {
        const key = k.split(":")[0].trim();
        const value = k.split(":")[1]
          ? k.split(":")[1].replace(/"/g, "").trim()
          : "Error: 값이 없습니다.";
        if (key !== "") {
          const target = exceptRemain.includes(key)
            ? eventData.eventDatas
            : eventData.remainDatas;
          target[key] = value;
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
  const value = userPropertySection.split("value:")[1]
    ? userPropertySection
        .split("value:")[1]
        .replaceAll('"', "")
        .split("\n")[0]
        .trim()
    : "Error: 값이 없습니다.";

  const isInt = userPropertySection.includes("int_value");
  const isString = userPropertySection.includes("string_value");
  const type = isInt ? "int" : isString ? "string" : "";

  if (key !== "") {
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
    const itemParamSections = itemSection[i].split("1:");
    for (let j = 0; j < itemParamSections.length; j++) {
      const paramSection = itemParamSections[j];

      if (paramSection.length < 2) continue;

      // item_name 기준으로 조건: 13(구분자)
      if (!paramSection.includes("13:")) {
        const key = paramSection.split('"')[1];
        if (paramSection.includes("2:")) {
          const value = paramSection.split('"')[3]
            ? paramSection.split('"')[3].trim()
            : "Error: 값이 없습니다.";
          item[key] = decodeUnicodeEscapes(value, "string");
        } else if (paramSection.includes("3:")) {
          const value = paramSection.split("3:")[1]
            ? paramSection.split("3:")[1].split("}")[0].trim()
            : "Error: 값이 없습니다.";
          item[key] = decodeUnicodeEscapes(value, "int");
        } else if (paramSection.includes("5:")) {
          const value = paramSection.split("5:")[1]
            ? paramSection.split("5:")[1].split("}")[0].trim()
            : "Error: 값이 없습니다.";
          item[key] = decodeUnicodeEscapes(value, "double");
        }
      } else {
        const value = paramSection.split('"')[1]
          ? paramSection.split('"')[1].trim()
          : "Error: 값이 없습니다.";
        item["item_name"] = decodeUnicodeEscapes(value, "string");
      }
    }
    items.push(item);
  }
}
