<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ゆうぴろのリンク帳</title>
  <style>
    body {
      font-family: sans-serif;
      background-color: #f0f0f0;
      max-width: 600px;
      margin: auto;
      padding: 30px;
    }
    h1, h2, h3 {
      text-align: center;
    }
    input, textarea, button {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      font-size: 16px;
    }
    .entry {
      background: #fff;
      padding: 10px;
      margin: 10px 0;
      border-radius: 8px;
      box-shadow: 0 0 5px rgba(0,0,0,0.1);
    }
    .entry a {
      font-weight: bold;
      color: #007BFF;
      text-decoration: none;
    }
    #mainArea { display: none; }
    #loginMessage { color: red; }
  </style>
</head>
<body>
  <h1>🔐 ゆうぴろのリンク帳</h1>

  <div id="loginArea">
    <p>合言葉（ひらがな）を入力してください：</p>
    <input type="password" id="passwordInput" placeholder="ゆうぴろ">
    <button onclick="checkPassword()">ログイン</button>
    <p id="loginMessage"></p>
  </div>

  <div id="mainArea">
    <h2>📥 新しいリンクを追加</h2>
    <input type="text" id="urlInput" placeholder="https://example.com">
    <textarea id="memoInput" placeholder="メモを入力（任意）" rows="2"></textarea>
    <button onclick="saveLink()">保存する</button>

    <h3>📚 保存済みリンク</h3>
    <div id="linkList"></div>
  </div>

  <!-- Firebase SDK -->
  <script type="module">
    // ✅ あなたの Firebase 設定をここに貼ってください（↓はダミー）
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADnQfkOw1qO5LLPLt-TZg7pAKjXDuasa8",
  authDomain: "yuupro-links.firebaseapp.com",
  projectId: "yuupro-links",
  storageBucket: "yuupro-links.firebasestorage.app",
  messagingSenderId: "534635843972",
  appId: "1:534635843972:web:3b24079f063e82498ccdd1",
  measurementId: "G-0GKLWNP6KP"
};

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // ログイン処理
    const loginArea = document.getElementById("loginArea");
    const mainArea = document.getElementById("mainArea");
    const loginMessage = document.getElementById("loginMessage");
    const passwordInput = document.getElementById("passwordInput");

    function checkPassword() {
      const password = passwordInput.value.trim();
      if (password === "ゆうぴろ") {
        loginArea.style.display = "none";
        mainArea.style.display = "block";
        loadLinks();
      } else {
        loginMessage.textContent = "パスワードが間違っています。";
      }
    }

    // データ保存
    async function saveLink() {
      const url = document.getElementById("urlInput").value.trim();
      const memo = document.getElementById("memoInput").value.trim();
      if (!url) {
        alert("URLを入力してください");
        return;
      }

      await addDoc(collection(db, "links"), {
        url,
        memo,
        createdAt: serverTimestamp()
      });

      document.getElementById("urlInput").value = "";
      document.getElementById("memoInput").value = "";
      loadLinks();
    }

    // データ読み込み
    async function loadLinks() {
      const list = document.getElementById("linkList");
      list.innerHTML = "";

      const q = query(collection(db, "links"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `
          <a href="${data.url}" target="_blank">${data.url}</a><br>
          <small>${data.memo || "(メモなし)"}</small>
        `;
        list.appendChild(div);
      });
    }
  </script>
</body>
</html>
