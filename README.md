# NTUEE 109-2 電資入門設計與實作 指定題伺服器

## 前置作業

前往此網站：https://nodejs.org/en/下載安裝node.js

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

啟動成功後便可以打開瀏覽器，在網址列輸入：http://localhost::3000，即可看到運行中的伺服器

若http://localhost::3000沒有畫面，請至cmd中輸入ipconfig查詢ipv4，將localhost改成該ipv4即可
