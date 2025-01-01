# e-learning バックエンド作成

## 1. Step1 講義（Lecture）一覧の取得

一度チュートリアル環境を削除します。

`sls remove`

プロンプトを参考にコードを作成します。


デプロイします。
```
aws sso login
sls deploy
```

データを投入して、動作確認を行います。
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
▼ 全件取得  
`curl -H 'Content-Type: application/json' -X GET "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures" | jq"`

▼ カテゴリ検索  
`curl -H 'Content-Type: application/json' -X GET "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures?category=FE" | jq`

▼ タイトル検索  
`curl -H 'Content-Type: application/json' -X GET "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures?title=HTML" | jq`


### プロンプト

#### Serverless.yml の DynamoDB テーブル作成用プロンプト

- 添付のテーブル構造を持つ DynamoDB を生成します。
- 下記コードサンプルに沿って serverless.yml に定義を作成してください。
- ただし GSI は作成しなくてよいです。

※ テーブル構造.png の画像を添付する

```yml
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
※ step2用 の画像を添付する

下記の条件を満たした講義一覧を DynamoDB から取得する処理を作成してください。

- 講義一覧を取得する際には QuryCommand を利用してください
- DynamoDB のデータ構造は添付の画像の様になっています。SK が LECTURE# で始まる Lecture 一覧を取得してください。
- 検索はフィルタ式を利用してクエリパラメータの下記を満たして検索できるようにしてください
  - `GET: /lectures?category=<カテゴリ文字列>&title=<タイトル文字列>`
  - カテゴリ文字列、タイトル文字列ともに部分一致検索に対応してください
  - レスポンスは下記 JSON フォーマットで返却してください

```json
[
  {
      "lectureId": string,
      "lectureTitle": string,
      "category": string,
      "nuberOfLessons": number,
      "createdAt": string
  }
]
```

- 下記コードの 「// ここにコードを追加」 の部分に実装してください

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


## 2. Step2 講義（Lecture）の作成
講義を DynamoDB へ登録する処理を作成する。作成後は curl で動作確認する。

▼ 講義の新規作成  
`curl -H 'Content-Type: application/json' -X POST "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures" -d '{"lectureTitle": "javascript 基礎", "category": "FE"}'`

### プロンプト

下記の条件を満たした講義（Lecture）を DynamoDB へ登録する処理を作成してください。
- 講義を作成する際には putCommand を利用してください
- DynamoDB のデータ構造は添付の画像の様になっています。 
  - PK には LECTURE を登録します。
  - SK には LECTURE#LC を Prefix とし、ランダムな 16進数の小文字 8桁 を連結したものを登録します。
  - このランダムな文字列は変数に保持しておきます。
  - lectureId には LC を Prefix につけた上記の変数の値を連結した値を登録します。
- リクエス URL は下記の用に定義します。
  - `POST: /lectures`
- 登録日の日付を "2024/12/12" のフォーマットで文字列として createdAt に登録します。 
- リクエストBodyは下記のようになります。

```json
{
  "lectureTitle": string,
  "category": string,
}
```

- レスポンスBodyは登録した lectureId を返却します。

```json
{
  "lectureId": string
}
```

- 下記コードの 「// ここにコードを追加」 の部分に実装してください。

```js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  putCommand
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// ユーザ一覧の取得
app.post("/lectures", async (req, res) => {
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

- 最終的に登録される DynamoDB のデータ構造は添付画像のとおりです。
※ Step2用の画像を貼り付ける


## 3. Step3 設問（Lesson）の作成
先程のコードを改修して、講義作成時に設問も一緒に作成できるようにします。

▼ 講義と設問の作成

```
curl -H 'Content-Type: application/json' -X POST \
     "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures" \
     -d '{
       "lectureTitle": "HTML 基礎",
       "category": "FE",
       "lessons": [
         {
           "lessonTitle": "Pタグとは",
           "lessonContents": "Pタグとは...",
           "lessonQuestions": [
             {
               "value": "選択肢1",
               "correct": false
             },
             {
               "value": "選択肢2",
               "correct": true
             }
           ]
         },
         {
           "lessonTitle": "aタグとは",
           "lessonContents": "aタグとは...",
           "lessonQuestions": [
             {
               "value": "選択肢1",
               "correct": false
             },
             {
               "value": "選択肢2",
               "correct": true
             }
           ]
         }
       ]
     }' | jq
```

### プロンプト

下記の条件を満たした設問（Lesson）を DynamoDB へ登録する処理を作成してください。

- 設問を作成する際には putCommand を利用してください。
- Lesson 情報は一度に複数登録されます。
- DynamoDB のデータ構造は添付の画像の様になっています。 
  - PK には `LECTURE#LC<lectureId>` を登録します。
  - SK には LESSON#LS を Prefix とし、ランダムな 16進数の小文字 8桁 を連結したものを登録します。
  - このランダムな文字列は変数に保持しておきます。
  - lessonId には LS を Prefix につけた上記の変数の値を連結した値を登録します。
  - lessonQuestions は配列で定義します。
  - lessonQuestions の key はランダムな 16進数の小文字 8 桁を登録します。
- numberOfLesson には 設問数（lessons の length ）を保存してください。
- リクエストBodyは下記のようになります。

```json
{
    "lecttureTitle": string,
    "category": string,
    "lessons": [
        {
            "lessonTitle": string,
            "lessonContents": string,
            "lessonQuestions": [
                {
                    "value": string,
                    "correct": boolean
                },
                {
                    "value": string,
                    "correct": boolean
                }
            ]
        }
    ]
}
```

- レスポンスBodyは登録した lessonId を返却します。

```json
{
    "lectureId": string
    [
        {
            "lessonId": string
        },
        {
            "lessonId": string
        }
    ]
}
```

- 下記コードを修正して実装してください

```js
// 講義を作成
app.post("/lectures", async (req, res) => {
  const { lectureTitle, category } = req.body;

  // リクエストのバリデーション
  if (!lectureTitle || !category) {
    return res.status(400).json({
      error: "lectureTitle and category are required"
    });
  }

  try {
    // ランダムな8桁の16進数を生成
    const randomHex = Array.from(
      crypto.getRandomValues(new Uint8Array(4))
    ).map(b => b.toString(16).padStart(2, '0')).join('');

    // 現在の日付を指定のフォーマットで生成
    const today = new Date();
    const createdAt = today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');

    // lectureIdを生成
    const lectureId = `LC${randomHex}`;

    const params = {
      TableName: USERS_TABLE,
      Item: {
        PK: "LECTURE",
        SK: `LECTURE#${lectureId}`,
        lectureId: lectureId,
        lectureTitle: lectureTitle,
        category: category,
        nuberOfLessons: 0,  // 初期値として0を設定
        createdAt: createdAt
      }
    };

    await docClient.send(new PutCommand(params));

    // 登録したlectureIdを返却
    res.json({
      lectureId: lectureId
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Could not create lecture"
    });
  }
});
```

- 最終的に登録される DynamoDB のデータ構造は添付の画像の様になっています。 

## 4. Step4 設問（Lesson）一覧の取得
講義（Lecture）に紐づく全ての設問一覧を取得します。

▼ 設問一覧の取得  

`curl -H 'Content-Type: application/json' -X GET "https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures/LCd75e78a0" | jq`

### プロンプト
下記の条件を満たした設問一覧を DynamoDB から取得する処理を作成してください。

- 設問一覧を取得する際には QuryCommand を利用してください。
- リクエストエンドポイント及びパスは下記のとおりです。
  - `GET: /lectures/:lectureId`
  - PK が LESSON#<lectureId> のデータを DynamoDB から取得してください。 

- レスポンスは下記の JSON を返却してください。

```json
    [
        {
            "lessonId": string,
            "lessonTitle": string,
            "lessonContents": string,
            "lessonQuestions": [
                {
                    "key": string,
                    "value": string,
                    "correct": boolean
                },
                {
                    "key": string,
                    "value": string,
                    "correct": boolean
                }
            ]
        }
    ]
```

- 下記コードの 「// ここにコードを追加」 の部分に実装してください

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
app.get("/lectures/:lectureId", async (req, res) => {
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
