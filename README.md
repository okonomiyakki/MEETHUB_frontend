# 밋허브 - 중간 지점 추천 서비스 [Client]

---

## Frontend - v.3.1.0

> 수도권을 한정으로 서비스합니다. <br>
> 대중교통을 기준으로 중간 지점을 계산합니다.<br>
> 제공하는 중간 지점은 인근 지하철역입니다.

## 사용 기술

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=Sass&logoColor=white"/><img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>

## 주요 파일

-   src/components/map/searchPlace/`searchPlace.jsx`

    -   출발지 키워드 검색
    -   현재위치 검색

-   src/components/map/landingMap/`landingMap.jsx`

    -   출발지 정보로 Server에 요청
    -   응답받은 중간 지점 탐색 결과를 가공하여 화면에 표시

-   src/utils/`coordsHandler.jsx`

    -   좌표 변환 함수
    -   출발지 좌표 리스트 정렬 함수
    -   무게중심 계산 함수

-   src/utils/`generateCenter.jsx`
    -   출발지 좌표 리스트를 입력받고 가공하여 무게중심 좌표 생성

## 참고

-   CSR 프로젝트이며, Server 레포지토리는 [여기](https://github.com/okonomiyakki/MEETHUB_backend) 입니다.
-   본 서비스는 현재 배포 준비 중입니다.
-   Kakao Map API KEY를 발급받으시면, 로컬에서 사용 가능합니다.
-   [Kakao Maps API 홈페이지 바로가기](https://apis.map.kakao.com/web/)

## [Client] 로컬 환경 변수 설정

```bash
touch .env.development
```

```
/.env.development

REACT_APP_API_URL={http://localhost:서버포트}

REACT_APP_KAKAOMAP_KEY={카카오맵 API 키}

```

## [Client] 로컬 실행 방법

```bash
npm i

npm run start
```

---

## 서비스 목적

-   거리, 비용, 소요 시간을 기준으로 모임 인원 모두에게 동등한 모임 장소를 제공함으로써, <br>모임 장소를 찾는 시간을 절약합니다.

## 서비스 주요 기능

### 1. 키워드로 출발지 검색

![키워드검색](https://github.com/okonomiyakki/MEETHUB_frontend/assets/83577128/3ab78fef-72b9-400c-a4a3-66674b2b3980)

-   `키워드` 를 입력하여 원하는 출발지를 쉽게 찾을 수 있습니다.

          -  키워드 입력 시, 해당 키워드와 관련도가 높은 순으로 장소 목록이 반환됩니다.

          -  해당 목록에서 희망하는 출발지를 클릭하면, 해당 장소가 지도에 포커싱 됩니다.

### 2. 현재 위치 검색

-   버튼을 클릭하여 현재의 위치를 조회합니다.

        -  현재의 위치정보가 지도에 포커싱 됩니다.

### 3. 출발지 추가

![출발지 추가](https://github.com/okonomiyakki/MEETHUB_frontend/assets/83577128/3564b7a1-8122-4882-8695-a815b1398724)

-   `출발지 추가하기` 버튼을 클릭하여, 검색한 장소를 출발지로 지정합니다.

        -  장소 검색 결과 목록에서 원하는 출발지를 클릭 후, '출발지 추가하기' 버튼을 눌러 출발지를 추가합니다.

        -  추가할 수 있는 출발지의 최대 개수는 5개입니다.

        -  잘못 추가한 출발지는 'x' 버튼을 눌러 출발지 지정 목록에서 제외할 수 있습니다.

### 4. 중간 지점 탐색

![중간 지점 탐색](https://github.com/okonomiyakki/MEETHUB_frontend/assets/83577128/9b333efd-dc54-46dc-82c3-75fbc1b3ee74)

-   `중간 지점 찾기` 버튼을 클릭하여, 중간 지점으로 판단되는 지하철역을 알려드립니다.

        - 추천된 중간 지점 지하철역이 지도에 포커싱 되며, 각 출발지들과 함께 마커로 위치가 표시됩니다.

![역에서만나기](https://github.com/okonomiyakki/MEETHUB_frontend/assets/83577128/ba8b991b-72c8-4a10-95e2-b92aff86b8d5)

-   `(역이름)에서 만나기` 버튼을 클릭하여, 동시에 추가적으로 반환된 중간 지점 지하철역을 확인할 수 있습니다.

          - 반환되는 중간 지점 지하철역의 개수는 최대 4개이며, 클릭 시 개별적인 조회가 가능합니다.

### 5. 소요시간 표시

![소요시간](https://github.com/okonomiyakki/MEETHUB_frontend/assets/83577128/ad4929ff-4230-4946-9349-3b226ec00521)

-   각 출발지로부터 추천된 중간 지점까지의 소요시간을 알려드립니다.

        - 추천된 지하철역까지 최적의 경로로 계산된 소요시간을 반환합니다.
