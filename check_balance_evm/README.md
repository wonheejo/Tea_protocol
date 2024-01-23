# WEMIX 3.0 Check Balance
Address 별 balance 조회

## Configuration
.env 설정 파일 수정
```
    NETWORK=mainnet  # mainnet / testnet 중 선택 
    BLOCK=latest # 기준되는 블럭 번호, latest 또는 블럭 번호 입력 (latest: 최신블럭 기준으로 처리 )
    TO_WEI=false # balance를 wei로 표시 여부
    TO_CHECKSUM_ADDRESS=false # checksum address로 표시 여부
    LOG_BALANCE=false # balance 로그 출력 여부 
```

## Excution 
1. nodejs 설치
   - nvm 설치
        ``` 
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
        ``` 
        or
        ``` 
        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
        ```

   - node version 설치
        ```
        nvm install 14.21.1
        nvm use 14.21.1
        ```
2. 사용 모듈 설치 
    ```
    npm install
    ``` 

3. 실행

    - 일반적 케이스 (최신 블럭기준으로 처리)
        ```
        npm start {파일명}
        ex> npm start input/addresses_wl.csv
        ```
    - 특정 블럭으로 처리
        ```
        BLOCK={block_number} npm start {파일명}
        ex> BLOCK=950344 npm start input/addresses_wl.csv
        ```