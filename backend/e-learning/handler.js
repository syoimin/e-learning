const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  QueryCommand,
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

exports.handler = serverless(app);
