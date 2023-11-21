function setData() {
  convertJson();
  viewList();
}

function viewList() {
  const eventTag = document.getElementById('eventList');

  for(i in events) {
    const timestamp = Number(events[i].remainDatas.start_timestamp_millis)

    const date = new Date(timestamp)
    const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);

    eventTag.insertAdjacentHTML('beforeend',
      `<div class="eventSummary" onclick="viewEvent(${i})">
       <div class="evnetNo">${Number(i+1)}</div>
       <div class="eventName">${events[i].eventName}</div>
       <div class="time">${formattedDate}</div>
       </div>`)
  }
}

function viewEvent(no) {
  
}