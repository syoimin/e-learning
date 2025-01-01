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


// ランダムな16進数の生成関数
const generateRandomHex = () => {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(4))
  ).map(b => b.toString(16).padStart(2, '0')).join('');
};

// 講義とレッスンを作成
app.post("/lectures", async (req, res) => {
  const { lectureTitle, category, lessons } = req.body;

  // リクエストのバリデーション
  if (!lectureTitle || !category || !Array.isArray(lessons)) {
    return res.status(400).json({
      error: "lectureTitle, category, and lessons array are required"
    });
  }

  try {
    // lectureIdを生成
    const lectureRandomHex = generateRandomHex();
    const lectureId = `LC${lectureRandomHex}`;

    // 現在の日付を指定のフォーマットで生成
    const today = new Date();
    const createdAt = today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');

    // 講義を登録
    const lectureParams = {
      TableName: USERS_TABLE,
      Item: {
        PK: "LECTURE",
        SK: `LECTURE#${lectureId}`,
        lectureId: lectureId,
        lectureTitle: lectureTitle,
        category: category,
        nuberOfLessons: lessons.length,
        createdAt: createdAt
      }
    };

    await docClient.send(new PutCommand(lectureParams));

    // レッスンを登録
    const lessonIds = [];
    for (const lesson of lessons) {
      // lessonIdを生成
      const lessonRandomHex = generateRandomHex();
      const lessonId = `LS${lessonRandomHex}`;

      // レッスンの選択肢にランダムなkeyを設定
      const questions = lesson.lessonQuestions.map(q => ({
        key: generateRandomHex(),
        value: q.value,
        correct: q.correct
      }));

      const lessonParams = {
        TableName: USERS_TABLE,
        Item: {
          PK: `LECTURE#${lectureId}`,
          SK: `LESSON#${lessonId}`,
          lectureId: lectureId,
          lessonId: lessonId,
          lessonTitle: lesson.lessonTitle,
          lessonContents: lesson.lessonContents,
          lessonQuestions: questions
        }
      };

      await docClient.send(new PutCommand(lessonParams));
      lessonIds.push({ lessonId });
    }

    // lectureIdとlessonIdsを返却
    res.json({
      lectureId,
      lessons: lessonIds
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Could not create lecture and lessons"
    });
  }
});
exports.handler = serverless(app);
