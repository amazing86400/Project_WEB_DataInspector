function setData() {
  convertJson();
  viewList();
  const textArea = document.getElementById('inputBox');
  textArea.value = '';
  convertBtn.disabled = true;
}

// 변환 후 이벤트 리스트를 출력해주는 함수
function viewList() {
  const eventTag = document.getElementById('eventList');
  eventTag.replaceChildren();
  for (i in events) {
    const timestamp = Number(events[i].remainDatas.start_timestamp_millis);
    const formattedDate = timestamp ? new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19) : '';
    eventTag.insertAdjacentHTML(
      'beforeend',
      `<div class="eventSummary" onclick="viewEvent(${i},this)">
        <div class="evnetNo">${Number(i) + 1}</div>
        <div class="eventName">${events[i].eventName}</div>
        <div class="time">${formattedDate}</div>
      </div>`
    );
  }
}

// 발생한 이벤트 데이터 출력해주는 함수
function viewEvent(no, clickDiv) {
  const viewEvent = events[no];
  clearTableContents();
  if (viewEvent.eventParams) {
    const epTbody = document.getElementById('epTbody');
    insertData(viewEvent.eventParams, epTbody);
  }

  // 사용자 속성 출력
  if (viewEvent.userProperties) {
    const upTbody = document.getElementById('upTbody');
    insertData(viewEvent.userProperties, upTbody);
  }

  // 거래 데이터 출력
  if (viewEvent.eventParams.transactions) {
    const transactionTbody = document.getElementById('transactionTbody');
    insertData(viewEvent.eventParams.transactions, transactionTbody);
  }

  // 상품 데이터 출력
  if (viewEvent.eventParams.items) {
    const items = viewEvent.eventParams.items;
    const itemsTbody = document.getElementById('itemsTbody');
    for (i in items) {
      insertData(items[i], itemsTbody, i);
    }
  }

  // 기타 데이터 출력
  if (viewEvent.remainDatas) {
    const remainTbody = document.getElementById('remainTbody');
    insertData(viewEvent.remainDatas, remainTbody);
  }

  // 클릭 시 배경색 입히기
  const divs = document.querySelectorAll('.eventSummary');
  divs.forEach(div => div.classList.remove('selected'));

  clickDiv.classList.add('selected');
}

// 데이터를 HTML요소 추가해주는 함수
function insertData(data, tbody, i) {
  const blockList = ['firebase_screen_id', '_c', 'realtime', 'ga_debug', 'firebase_event_origin', '_fi', '_fot', '_sid', '_sid', '_sno', '_lte', '_se', 'items', 'transactions', 'firebase_screen_name', 'firebase_screen_class','engagement_time_msec','_ltv_KRW','_mst'];
  const isItem = i ? 'item' + (Number(i) + 1) + '.' : '';

  // 화면 정보 설정(screen_name/screen_class)
  if (tbody == document.getElementById('epTbody')) {
    // screen_name 설정
    const screenNameValue = data.firebase_screen_name ? data.firebase_screen_name : 'Error: 값이 없습니다.';
    const screenNameValueType = typeof screenNameValue == 'string' ? 'str' : 'num';
    createTr('firebase_screen_name', screenNameValue, screenNameValueType, tbody, isItem);

    // screen_class 설정
    const screenClassValue = data.firebase_screen_class ? data.firebase_screen_class : 'Error: 값이 없습니다.';
    const screenClassValueType = typeof screenClassValue == 'string' ? 'str' : 'num';
    createTr('firebase_screen_class', screenClassValue, screenClassValueType, tbody, isItem);
  }

  // 상품 정보 설정
  if (tbody == document.getElementById('itemsTbody')) {
    let item = { ...data };
    const itemList = ['item_id', 'item_name', 'item_brand', 'item_category', 'item_category2', 'item_category3', 'item_category4', 'item_category5', 'item_variant', 'price', 'quantity', 'currency', 'index', 'affiliation', 'coupon', 'discount', 'item_list_id', 'item_list_name', 'location_id'];

    // item 추천 항목 설정
    for (let field of itemList) {
      if (item[field]) {
        const value = item[field];
        const valueType = typeof value == 'string' ? 'str' : 'num';
        createTr(field, value, valueType, tbody, isItem);
        delete item[field];
      }
    }

    // 맞춤 항목 범위 설정
    for (const key in item) {
      if (!blockList.includes(key)) {
        const value = item[key];
        const valueType = typeof value == 'string' ? 'str' : 'num';
        createTr(key, value, valueType, tbody, isItem);
      }
    }

    // 이 외 데이터 설정
  } else {
    for (const [key, value] of Object.entries(data)) {
      if (!blockList.includes(key)) {
        const valueType = typeof value == 'string' ? 'str' : 'num';
        createTr(key, value, valueType, tbody, isItem);
      }
    }
  }
}

function createTr(key, value, valueType, tbody, isItem) {
  if (isSearchValid(key, value, valueType)) {
    tbody.insertAdjacentHTML(
      'beforeend',
      `<tr>
        <td>${isItem}${key}</td>
        <td>${value}</td>
        <td>
          <div class="${valueType}">${valueType}</div>
        </td>
      </tr>`
    );
  } else {
    tbody.insertAdjacentHTML(
      'beforeend',
      `<tr class="error">
      <td>${isItem}${key}</td>
      <td>${value}</td>
      <td>
        <div class="${valueType}">${valueType}</div>
      </td>
    </tr>`
    );
  }
}

// 매개변수 출력 초기화 함수
function clearTableContents() {
  const tableIds = ['epTbody', 'upTbody', 'transactionTbody', 'itemsTbody', 'remainTbody'];

  tableIds.forEach((tableId) => {
    const tbody = document.getElementById(tableId);
    tbody.replaceChildren();
  });
}

// 이벤트 리스트 초기화 함수
function clearList() {
  const eventList = document.getElementById('eventList');
  events = [];
  eventList.replaceChildren();
  clearTableContents();
}

// 드롭다운 함수
function dropDown(thead) {
  const tbody = thead.parentElement.parentElement.nextElementSibling;
  if (tbody.childElementCount > 0) {
    tbody.classList.toggle('sum');
  }
}

function isSearchValid(key, value, type) {
  const intValueKeys = ['tax', 'shipping', 'value', 'quantity', 'price', 'discount', 'index'];
  const stringValueKeys = ['screen_name', 'screen_class'];

  switch (true) {
    case key.includes('item_') && type === 'num':
    case key.includes('dimension') && type === 'num':
    case key.includes('ep_') && type === 'num':
    case stringValueKeys.includes(key) && type === 'num':
    case key.includes('metric') && type === 'str':
    case key.includes('cm_') && type === 'str':
    case intValueKeys.includes(key) && type === 'str':
    case key.includes('error'):
    case type === 'str' && value.includes('Error:'):
      return false;
    default:
      return true;
  }
}

function copyData() {
  const tables = ['epTbody', 'upTbody', 'transactionTbody', 'itemsTbody'];
  const formattedText = tables.map(tableId => {
    const table = document.getElementById(tableId);
    if (table && table.children.length > 0) {
      return formatTable(table);
    } else {
      return null;
    }
  }).filter(formatted => formatted !== null).join('\n\n');

  if (formattedText == '') {
    alert('복사할 데이터가 없습니다.')
    return false
  }
  copyTextToClipboard(formattedText);
}

function formatTable(table) {
  return Array.from(table.rows)
    .map(row => Array.from(row.cells).filter((_, index) => index !== 2).map(cell => cell.textContent).join('\t'))
    .join('\n');
}

function copyTextToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('클립보드에 복사되었습니다.');
}

// 페이지 새로고침시 alert창 출력해주는 함수
// window.onbeforeunload = function (e) {
//   let dialogText = 'Dialog text here';
//   e.returnValue = dialogText;
//   return dialogText;
// };
