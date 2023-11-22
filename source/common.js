function setData() {
  convertJson();
  viewList();
}

//반목문으로 수정
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

function viewEvent(no) {
  const viewEvent = events[no];
  if(viewEvent.eventParams) {
    const epTbody = document.getElementById('epTbody');
    epTbody.replaceChildren()
    for(const [key, value] of Object.entries(viewEvent.eventParams)) {
      if(key == 'items' || key == 'transactions') {
      }else {
        const valueType = typeof(value) == 'string' ? 'str' : 'num'
        epTbody.insertAdjacentHTML('beforeend',
          `<tr>
            <td>${key}</td>
            <td>${value}</td>
            <td>
              <div class="${valueType}">${valueType}</div>
            </td>
          </tr>`)
      }
    }
  }
  if(viewEvent.userProperties) {
    const upTbody = document.getElementById('upTbody');
    upTbody.replaceChildren()
    insertData(viewEvent.userProperties, upTbody)
  }
  if(viewEvent.eventParams.transactions) {
    const transactionTbody = document.getElementById('transactionTbody');
    transactionTbody.replaceChildren()
    insertData(viewEvent.eventParams.transactions, transactionTbody)
  }
  if(viewEvent.eventParams.items) {
    const items = viewEvent.eventParams.items
    const itemsTbody = document.getElementById('itemsTbody');
    itemsTbody.replaceChildren()
    for(i in items) {
      insertData(items[i], itemsTbody, i)
    }
  }
  if(viewEvent.remainDatas) {
    const remainTbody = document.getElementById('remainTbody');
    remainTbody.replaceChildren()
    insertData(viewEvent.remainDatas, remainTbody)
  }
}

function insertData(data, tbody, i) {
  const isItem = i ? 'item'+(Number(i)+1)+'.' : ''
  for(const [key, value] of Object.entries(data)) {
    const valueType = typeof(value) == 'string' ? 'str' : 'num'
    tbody.insertAdjacentHTML('beforeend',
      `<tr>
        <td>${isItem}${key}</td>
        <td>${value}</td>
        <td>
          <div class="${valueType}">${valueType}</div>
        </td>
      </tr>`)
  }
}

function clearList() {
  const eventList = document.getElementById('eventList');
  events = [];
  eventList.replaceChildren();
}