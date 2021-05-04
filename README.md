# NTUEE 109-2 電資入門設計與實作 指定題伺服器

## 前置作業

前往此網站：https://nodejs.org/en/ ，下載安裝node.js

檢查Node.js及npm是否正確安裝

```bash
node -v
npm -v

```

安裝npm套件yarn，並且檢查是否安裝成功

```bash
npm install -g yarn
yarn --version

```

## 使用說明

進入Server資料夾輸入yarn便會自動根據package.json在node_modules裡面下載所有程式需要的套件

```bash
cd Server
yarn

```

啟動伺服器

```
yarn dev

```

啟動成功後便可以打開瀏覽器，在網址列輸入：http://localhost::3000 ，即可看到運行中的伺服器

若 http://localhost::3000 沒有畫面，請至cmd中輸入ipconfig查詢ipv4，將localhost改成該ipv4即可

接著進入Python資料夾，main.py是完整的指定題code，需要連結車子的藍芽模組，並且透過車子的藍芽回傳RFID的UID才能夠使用

如果只是要測試伺服器的話不需要這麼麻煩，我們只需要使用score.py即可

請修改score.py第24行的ip位置，也請修改第125行的'隊伍名稱'為任意隊伍名稱

執行score.py

```bash
python score.py

```

在瀏覽器上應該可以看到右方出現一些資訊，並且時間開始倒數

不過score.py執行完畢後雖然結束連線了，但是倒計時並不會停止

此時需要執行TA.py來停止計時，請一樣先修改第6行的ip位置，再輸入以下指令

```bash
python TA.py stop

```

目前這部分還有一些小bug，在輸入上述指令之後會出現error，必須按ctrl-c強制終止程式，不過server端可以看到左方排行榜更新，右方資訊重置，代表該隊伍遊戲結束

最後，如果要清空排行榜並重新啟動server，也可以透過TA.py

```bash
python TA.py reset

```