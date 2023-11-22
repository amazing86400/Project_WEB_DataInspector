function setData() {
  convertJson();
  viewList();
  const textArea = document.getElementById('inputBox')
  textArea.value = '';
  convertBtn.disabled = true
}

// 변환 후 이벤트 리스트를 출력해주는 함수
function viewList() {
  const eventTag = document.getElementById('eventList');
  eventTag.replaceChildren()
  for(i in events) {
    const timestamp = Number(events[i].remainDatas.start_timestamp_millis)
    const date = new Date(timestamp)
    const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);

    eventTag.insertAdjacentHTML('beforeend',
      `<div class="eventSummary" onclick="viewEvent(${i})">
        <div class="evnetNo">${Number(i)+1}</div>
        <div class="eventName">${events[i].eventName}</div>
        <div class="time">${formattedDate}</div>
      </div>`)
  }
}

// 발생한 이벤트 데이터 출력해주는 함수
function viewEvent(no) {
  const viewEvent = events[no];
  if(viewEvent.eventParams) {
    const epTbody = document.getElementById('epTbody');
    epTbody.replaceChildren()
    insertData(viewEvent.eventParams, epTbody)
  }

  // 사용자 속성 출력
  if(viewEvent.userProperties) {
    const upTbody = document.getElementById('upTbody');
    upTbody.replaceChildren()
    insertData(viewEvent.userProperties, upTbody)
  }

  // 거래 데이터 출력
  if(viewEvent.eventParams.transactions) {
    const transactionTbody = document.getElementById('transactionTbody');
    transactionTbody.replaceChildren()
    insertData(viewEvent.eventParams.transactions, transactionTbody)
  }

  // 상품 데이터 출력
  if(viewEvent.eventParams.items) {
    const items = viewEvent.eventParams.items
    const itemsTbody = document.getElementById('itemsTbody');
    itemsTbody.replaceChildren()
    for(i in items) {
      insertData(items[i], itemsTbody, i)
    }
  }

  // 기타 데이터 출력
  if(viewEvent.remainDatas) {
    const remainTbody = document.getElementById('remainTbody');
    remainTbody.replaceChildren()
    insertData(viewEvent.remainDatas, remainTbody)
  }
}

// 데이터를 HTML요소 추가해주는 함수
function insertData(data, tbody, i) {
  const blockList = ['firebase_screen_id','_c','realtime','ga_debug','firebase_event_origin','_fi','_fot','_sid','_sid','_sno','_lte','_se','items','transactions'];
  const isItem = i ? 'item'+(Number(i)+1)+'.' : ''
  for(const [key, value] of Object.entries(data)) {
    if(!blockList.includes(key)) {
      const valueType = typeof(value) == 'string' ? 'str' : 'num'
      if(isSearchValid(key, value, valueType)) {
        tbody.insertAdjacentHTML('beforeend',
          `<tr>
            <td>${isItem}${key}</td>
            <td>${value}</td>
            <td>
              <div class="${valueType}">${valueType}</div>
            </td>
          </tr>`)
      } else {
        tbody.insertAdjacentHTML('beforeend',
        `<tr class="error">
          <td>${isItem}${key}</td>
          <td>${value}</td>
          <td>
            <div class="${valueType}">${valueType}</div>
          </td>
        </tr>`)
      }
    }
  }
}

// 이벤트 리스트 초기화 함수
function clearList() {
  const eventList = document.getElementById('eventList');
  events = [];
  eventList.replaceChildren();
}

function dropDown() {
  const remainTbody = document.getElementById('remainTbody');
  remainTbody.classList.toggle('sum');
}

function isSearchValid(key, value, type) {
  const intValueKeys = ['tax', 'shipping', 'value', 'quantity', 'price', 'cm_', 'discount', 'index'];

  switch (true) {
    case intValueKeys.includes(key) && type === 'str':
    case key.includes('error'):
    case type === 'str' && value.includes('Error:'):
      return false;
    default:
      return true;
  }
}
