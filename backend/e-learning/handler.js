const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// 講義一覧の取得
app.get("/lectures", async (req, res) => {
  const { category, title } = req.query;
  // CORS ヘッダーを設定
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  try {
    // Query parameters
    const params = {
      TableName: USERS_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk_prefix)",
      ExpressionAttributeValues: {
        ":pk": "LECTURE",
        ":sk_prefix": "LECTURE#"
      }
    };

    // カテゴリとタイトルの検索条件を追加
    if (category || title) {
      const filterExpressions = [];
      
      if (category) {
        filterExpressions.push("contains(category, :category)");
        params.ExpressionAttributeValues[":category"] = category;
      }
      
      if (title) {
        filterExpressions.push("contains(lectureTitle, :title)");
        params.ExpressionAttributeValues[":title"] = title;
      }

      if (filterExpressions.length > 0) {
        params.FilterExpression = filterExpressions.join(" AND ");
      }
    }

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    // レスポンスデータを整形
    const lectures = response.Items.map(item => ({
      lectureId: item.lectureId,
      lectureTitle: item.lectureTitle,
      category: item.category,
      nuberOfLessons: parseInt(item.nuberOfLessons),
      createdAt: item.createdAt
    }));

    res.json(lectures);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
});


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

exports.handler = serverless(app);
