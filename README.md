# DataInspector

**DataInspector**는 iOS 및 Android GA4 데이터 검수를 보다 효율적으로 수행하기 위해 개발된 서비스입니다. 기존의 Debug View와 로그를 활용한 검수 방법에서 발생하는 번거로움을 해결하고, 데이터를 쉽게 확인할 수 있는 직관적인 UI와 효율적인 검수 프로세스를 제공합니다.

---

## 프로젝트 소개

- **프로젝트명**: DataInspector  
- **개발 기간**: 2023. 11. 13 ~ 2023. 12. 01 (약 2개월)  
- **사용 기술**: HTML, CSS, JavaScript  
- **개발 멤버**: 신기범, 홍성호  
- **프로젝트 배포 URL**: [DataInspector](http://210.114.9.23/GA_part/shhong/workspace/TechProject/Project_DataInspector/source/main.html)

---

## 주요 기능

![메인 페이지](https://github.com/amazing86400/Project_DataInspector/assets/96508771/23929c3c-8bb3-4c4a-a8b6-0f3be6f4d3a6)

DataInspector는 단순하고 직관적인 데이터 검수 프로세스를 제공합니다.  
아래의 간단한 단계를 통해 데이터를 확인하고 검수할 수 있습니다:

1. **데이터 입력**: OS별 데이터 로그를 입력한 뒤, "Convert" 버튼 클릭
2. **이벤트 확인**: "이벤트 목록"에서 이벤트 이름을 확인하고 원하는 이벤트를 클릭
3. **데이터 확인**: "데이터" 영역에서 선택한 이벤트의 설정 데이터 확인

---

## 세부 구현 기능

### 1. OS별 데이터 설정

<p align="center">
 <img src="https://github.com/amazing86400/Project_DataInspector/assets/96508771/cdc58fdf-ed32-436c-9408-7224b7b8b283" width="50%" />
</p>

- iOS와 Android의 데이터 로그 차이를 반영하여 OS에 따라 UI와 데이터를 자동으로 초기화합니다.
- **Android**의 경우, 이벤트 매개변수와 사용자 속성 입력란을 분리하여 직관적인 UI를 제공합니다.

---

### 2. 이벤트 목록 초기화

<p align="center">
 <img src="https://github.com/amazing86400/Project_DataInspector/assets/96508771/73fdd417-cf13-4ab6-a1d8-b09d0ffd3f72" width="50%" />
</p>

- "이벤트 목록" 상단의 **쓰레기통 버튼**을 클릭하면 모든 이벤트를 초기화할 수 있습니다.
- 긴 이벤트 목록을 효과적으로 관리하며, 검수 프로세스를 간소화합니다.

---

### 3. 데이터 복사 기능

<p align="center">
 <img src="https://github.com/amazing86400/Project_DataInspector/assets/96508771/59d56602-8119-4e9b-b577-96cecb5b420b" width="50%" />
</p>

- 검수 작업 완료 후, 설정된 데이터를 복사하여 검수 확인서 등 다른 작업에 활용할 수 있습니다.
- **복사 버튼** 클릭 시, 데이터가 클립보드에 저장됩니다.

---

### 4. 에러 확인

<p align="center">
 <img src="https://github.com/amazing86400/Project_DataInspector/assets/96508771/2bae1a28-fb7a-4804-9f22-53b28ff16161" width="50%" />
</p>

- 에러 발생 시 해당 항목을 **빨간색으로 표시**하여 한눈에 에러를 확인할 수 있도록 구현했습니다.
- 에러가 발생한 **위치와 원인**을 직관적으로 확인 가능합니다.

---

## 프로젝트의 의의

**DataInspector**는 단순히 데이터를 확인하는 도구를 넘어, 효율적인 GA4 데이터 검수 프로세스를 지원하는 강력한 도구입니다.
이 프로젝트를 통해 개발자와 비개발자 모두 손쉽게 데이터 검수를 수행할 수 있으며, 검수 과정에서 발생하는 오류와 시간을 크게 절감할 수 있습니다.
