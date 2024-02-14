# 중간 지점 추천 서비스 [밋허브]

---

## v.3.1.0

> 수도권을 한정으로 서비스합니다. <br>
> 대중교통을 기준으로 중간 지점을 계산합니다.<br>
> 제공하는 중간 지점은 인근 지하철역입니다.

## 서비스 목적

-   거리, 비용, 소요 시간 을 바탕으로 모임 인원 모두에게 동등한 모임 장소를 제공함으로써, <br>모임 장소를 찾는 시간을 절약합니다.

## 서비스 주요 기능

### 1. 키워드로 출발지 검색

![키워드검색](https://github.com/okonomiyakki/MEETHUB_frontend/assets/83577128/01d4270f-bb15-4a16-8456-1fd362d003b1)

-   `키워드` 를 입력하여 원하는 출발지를 쉽게 찾을 수 있습니다.

          -  키워드 입력 시, 해당 키워드와 관련도가 높은 순으로 장소 목록이 반환됩니다.

          -  해당 목록에서 희망하는 출발지를 클릭하면, 해당 장소가 지도에 포커싱 됩니다.

### 2. 현재위치 검색

-   버튼을 클릭하여 현재의 위치를 조회합니다.

        -  현재의 위치정보가 지도에 포커싱 됩니다.

### 3. 출발지 추가

-   `출발지 추가하기` 버튼을 클릭하여, 검색한 장소를 출발지로 지정합니다.

        -  장소 검색 결과 목록에서 원하는 출발지를 클릭 후, '출발지 추가하기' 버튼을 눌러 출발지를 추가합니다.

        -  추가할 수 있는 출발지의 최대 개수는 5개 입니다.

### 4. 중간 지점 탐색

-   `중간 지점 찾기` 버튼을 클릭하여, 중간 지점으로 판단되는 지하철역을 알려드립니다.

        - 추천된 지하철역이 지도에 포커싱되며, 각 출발지들과 함께 마커로 위치가 표시됩니다.

        - 반환되는 지하철역의 개수는 최대 4개 이며, 클릭하여 개별 조회가 가능합니다.

### 5. 소요시간 표시

-   각 출발지로부터 추천된 중간 지점까지의 소요시간을 알려드립니다.

        - 추천된 지하철역까지 최적의 경로로 계산된 소요시간을 반환합니다.
