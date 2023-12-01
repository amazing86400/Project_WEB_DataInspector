# DataInspector

iOS 및 Android GA4 데이터 검수를 보다 효율적으로 수행하기 위한 새로운 서비스를 개발하였습니다. 
기존의 Debug View 및 로그를 활용한 검수 방법은 기기를 찾는 번거로움과 데이터 확인의 불편함이라는 문제점이 있었습니다. 
이에 우리는 데이터를 쉽게 확인할 수 있고, 더 나아가 데이터 검수 작업을 효율적으로 수행할 수 있는 서비스를 제공하고자 합니다.
<br>
<br>
<br>


## 프로젝트 소개
 - 프로젝트명: DataInspector
 - 기간: 2023. 11. 13 ~ 2023. 12. 01
 - 기술: HTML, CSS, JavaScript
 - 멤버: 신기범, 홍성호
 - 프로젝트 배포 주소(URL): http://210.114.9.23/GA_part/shhong/workspace/TechProject/Project_DataInspector/source/main.html
<br>

## 프로젝트 기능
![그림1  메인페이지](https://github.com/amazing86400/Project_DataInspector/assets/96508771/23929c3c-8bb3-4c4a-a8b6-0f3be6f4d3a6)
기능은 매우 간단하고 쉽습니다.


1. "데이터 입력" 영역에 OS별 데이터 로그를 입력하고 "Convert" 버튼 클릭
2. "이벤트 목록" 영역에서 이벤트 이름 확인 및 확인하고자 하는 이벤트 클릭
3. "데이터" 영역에서 설정 데이터 확인
<br>


## 세부 구현 기능
1. OS별 데이터 설정
![그림2  OS 버튼](https://github.com/amazing86400/Project_DataInspector/assets/96508771/cdc58fdf-ed32-436c-9408-7224b7b8b283)

iOS와 Android의 데이터 로그가 달라, 버튼을 통해 각각의 로그 특징에 알맞게 설정할 수 있도록 구현했습니다.
버튼 클릭을 통해 OS가 변경되면 이전에 설정된 데이터를 모두 초기화해줬으며, Android의 경우 이벤트 매개변수와 사용자 속성 입력란을 분리하여 더 직관적인 UI를 나타냈습니다.
<br>
<br>

2. 이벤트 목록 Clear
![그림3  쓰레기통 버튼](https://github.com/amazing86400/Project_DataInspector/assets/96508771/73fdd417-cf13-4ab6-a1d8-b09d0ffd3f72)

이벤트 목록이 길어지는 것을 방지하고자 "이벤트 목록" 우측 상단에 위치한 쓰레기통 버튼을 클릭하면 이벤트 목록을 모두 지우는 기능을 구현했습니다. 버튼을 클릭하면 설정했던 모든 이벤트가 초기화됩니다.
<br>
<br>

3. 데이터 목록 Copy
![그림4  복사하기 버튼](https://github.com/amazing86400/Project_DataInspector/assets/96508771/59d56602-8119-4e9b-b577-96cecb5b420b)

데이터 검수 후 검수 확인서 작업을 좀 더 효율적으로 하고자 설정된 데이터를 복사할 수 있는 기능을 구현했습니다. 버튼을 클릭하면 설정된 데이터를 복사하여 활용할 수 있습니다.
<br>
<br>

4. 에러 발생 확인
![그림5  에러 발생](https://github.com/amazing86400/Project_DataInspector/assets/96508771/2bae1a28-fb7a-4804-9f22-53b28ff16161)

에러 발생 시 한눈에 확인하기 쉽도록 빨간색으로 표시하였고, 어디서 어떤 에러가 발생했는지 확인할 수 있도록 기능을 구현했습니다.
