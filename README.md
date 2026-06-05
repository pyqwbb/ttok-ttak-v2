# 💰 똑딱 (TTokTTak)

<p>
  <img src="https://img.shields.io/badge/Vue-3-F9D976?style=flat&logo=vue.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Pinia-Store-F9D976?style=flat&logo=pinia&logoColor=white"/>
  <img src="https://img.shields.io/badge/Axios-HTTP-F9D976?style=flat&logo=axios&logoColor=white"/>
  <img src="https://img.shields.io/badge/JSON--Server-Mock-F9D976?style=flat&logo=json&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS-Animation-F9D976?style=flat&logo=css3&logoColor=white"/>
</p>

**가계부 입문자를 위한 소비 기록 서비스**  
기록을 습관으로, 데이터를 인사이트로

> 📎 본 레포지토리는 팀 프로젝트 TTokTTak에서 기여한 부분만 추출하여 구성한 포트폴리오용 레포지토리입니다.  
> 👉 [팀 프로젝트 원본 레포지토리 바로가기](https://github.com/jeonsungwon9012/Skeleton-project)

---

## 📖 목차

- [📌 프로젝트 개요](#-프로젝트-개요)
- [🧩 담당 역할 및 구현 기능](#-담당-역할-및-구현-기능)
- [⚙️ 핵심 기능 상세](#️-핵심-기능-상세)
- [🛠 기술 스택](#-기술-스택)
- [🖼️ 실행 화면](#️-실행-화면)
- [🚀 실행 방법](#-실행-방법)
- [📂 문서화 및 협업](#-문서화-및-협업)
- [🧠 회고](#-회고)

---

## 📌 프로젝트 개요

**TTokTTak**은 사용자의 소비 흐름을 기록하고 분석하여 효율적인 소비 습관 형성을 돕는 가계부 서비스입니다.

단순한 수입/지출 기록에서 나아가, **사용자가 서비스를 지속적으로 사용하게 만드는 경험 설계**에 초점을 맞췄습니다. 소비 데이터를 분석해 반응 메시지와 뱃지로 돌려주는 피드백 구조를 통해, 기록 자체가 흥미로운 경험이 되도록 기획했습니다.

---

## 🧩 담당 역할 및 구현 기능

- 노션 관리 및 프로젝트 문서화 (명세서, README)
- 반응 메시지 · 이달의 요약 · 뱃지 시스템 등 핵심 기능 로직 설계
- 소비 데이터 시각화 (버블 차트, 프로그레스 바)
- 공통 레이아웃 (사이드바) 구현
- 유저 정보 조회 및 수정 기능 로직 설계

---

## ⚙️ 핵심 기능 상세

> 아래 화면은 [팀 프로젝트 완성본](https://github.com/jeonsungwon9012/Skeleton-project) 기준으로 촬영되었습니다.

### 🤩 반응 메시지

<img width="368" height="207" alt="image" src="https://github.com/user-attachments/assets/8cdd702c-b2e0-463a-889b-61fa0b4131b2" />
<br/>

거래 등록 시 해당 카테고리의 **월별 소비 횟수(count)** 를 계산하고, 카테고리 + count 조합으로 메시지를 조회합니다. 조건에 맞는 메시지가 없을 경우 fallback 메시지를 생성합니다.

> **핵심 포인트**  
> 단순 텍스트 출력이 아닌, **사용자 행동 기반의 동적 메시지 생성 구조**를 설계했습니다.

---

### 📅 이달의 요약

<img width="650" height="92" alt="image" src="https://github.com/user-attachments/assets/80709b53-e689-4036-8606-d8eaab77010f" />   
<br/>

이번 달 거래 데이터를 기반으로 카테고리별 소비 횟수를 집계하고, 가장 많이 소비한 카테고리를 기준으로 요약 메시지를 생성합니다.

> **핵심 포인트**  
> 수치 데이터를 단순 나열하는 대신, **사용자의 소비 패턴을 문장으로 풀어내는 방식**에 집중했습니다.

---

### 🥇 뱃지 시스템

<img width="410" height="186" alt="image" src="https://github.com/user-attachments/assets/738d4521-7fcd-4d8d-8769-aeff9fcb4058" />
<br/>

지난 달 소비 데이터를 분석해 최다 소비 카테고리를 도출하고, 해당 카테고리를 기반으로 뱃지를 생성 및 저장합니다. 생성된 뱃지는 대시보드에서 시각적으로 확인할 수 있습니다.

> **핵심 포인트**  
> 데이터 분석 결과를 **성취 요소로 연결**해 사용자의 지속적인 참여를 유도합니다.

---

## 🛠 기술 스택

| 구분           | 기술                          |
| -------------- | ----------------------------- |
| Frontend       | Vue 3, Pinia, Vue Router, CSS |
| HTTP 통신      | Axios                         |
| Backend (Mock) | JSON Server                   |

---

## 🖼️ 실행 화면

> 아래 화면은 현재 레포지토리에서 실행한 화면입니다.

<img width="100%" alt="ttokttak" src="https://github.com/user-attachments/assets/086c5589-d226-4b6b-8b17-f653954c4a4f" />

---

## 🚀 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/pyqwbb/ttok-ttak.git

# 2. 프로젝트 폴더로 이동
cd ttok-ttak

# 3. 의존성 설치
npm install

# 4. JSON Server 실행 (Mock API)
npx json-server db/db.json

# 5. 클라이언트 실행 (별도 터미널)
npm run dev
```

---

## 📂 문서화 및 협업

### README 작성

프로젝트의 주요 기능, 화면별 설명, 폴더 구조 등을 정리해 팀 프로젝트의 결과물을 체계화했습니다.

### 노션 관리 및 문서 구조 설계

요구사항 명세서, 기능 명세서, API 명세서 등 프로젝트 전 과정의 문서를 작성·관리하여 팀 내 협업 효율성을 높였습니다.

---

## 🧠 회고

혼자 개발할 때와 달리, 팀원들과 코드 스타일을 맞추고 기능을 분담하는 과정에서 협업의 무게를 실감했습니다.

특히 **"사용자가 왜 이 서비스를 계속 써야 하는가?"** 라는 질문에서 출발한 '재미 요소' 기획이 반응 메시지와 뱃지라는 실제 기능으로 구현되는 과정이 인상 깊었습니다. **기획 의도가 그대로 화면에서 동작하는 걸 직접 만들어낸 경험**은, 단순히 주어진 기능을 구현하는 것과는 달랐고 이는 개발자로서 한 단계 성장하는 계기가 됐습니다.
