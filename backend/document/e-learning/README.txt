# e-learning バックエンド作成

## 1. Step1 設問一覧の取得

- 下記プロンプトを実行しコードを生成する
- テーブルを再作成する

```
sls remove

```

- serverless.yml にエンドポイントを追加する
- デプロイする

```
aws sso login
sls deploy
```

- データを投入する
```
{
 "PK": "LECTURE",
 "SK": "LECTURE#LC42394D34",
 "category": "BE",
 "createdAt": "2024/12/12",
 "lectureId": "LC42394D34",
 "lectureTitle": "GO 言語基礎",
 "nuberOfLessons": 5
}

{
 "PK": "LECTURE",
 "SK": "LECTURE#LC8f6011e9",
 "category": "FE",
 "createdAt": "2024/12/12",
 "lectureId": "LC8f6011e9",
 "lectureTitle": "HTML基礎",
 "nuberOfLessons": 5
}
```
- その後下記 curl で動作確認する

▼ 全件取得  
`curl -H 'Content-Type: application/json' -X GET "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures" | jq"`

▼ カテゴリ検索
`curl -H 'Content-Type: application/json' -X GET "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures?category=FE" | jq`

▼ タイトル検索
`curl -H 'Content-Type: application/json' -X GET "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures?title=HTML" | jq`


### プロンプト

#### Serverless.yml の DynamoDB テーブル作成用プロンプト
添付のテーブル構造を持つ DynamoDB を生成する serverless.yml の定義を作成してください。
ただし GSI は作成しなくてよいです。
※ step1 の画像を添付する
```
org: syoiminserver
app: e-learning
service: e-learning

stages:
  default:
    params:
      tableName: "main-table-${sls:stage}"

resources:
  Resources:
    MainTable:
  // ここにテーブル定義を追加
```


#### API 作成用プロンプト
※ step1 の画像を添付する

下記の条件を満たした設問一覧を DynamoDB から取得する処理を作成してください。
・設問一覧を取得する際には QuryCommand を利用してください
・DynamoDB のデータ構造は添付の画像の様になっています。SK が LECTURE# で始まる Lecture 一覧を取得してください。
・検索はフィルタ式を利用してクエリパラメータの下記を満たして検索できるようにしてください
　・GET: /lectures?category=<カテゴリ文字列>&title=<タイトル文字列>
　・カテゴリ文字列、タイトル文字列ともに部分一致検索に対応してください
　・レスポンスは下記 JSON フォーマットで返却してください

```json
  [
    {
        lectureId: string,
        lectureTitle: string,
        category: string,
        nuberOfLessons: number,
        createdAt: string
    }
  ]
```


・下記コードの 「// ここにコードを追加」 の部分に実装してください

```js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// ユーザ一覧の取得
app.get("/lectures", async (req, res) => {
  const params = {
    TableName: USERS_TABLE,
  };
  // CORS ヘッダーを設定
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  try {
    // ここにコードを追加
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
});
```


## 2. Step2 設問の作成



