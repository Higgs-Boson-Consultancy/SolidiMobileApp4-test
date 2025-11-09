# Google Play 封閉測試上傳指南

## 📦 您的 AAB 檔案已準備好！

### 檔案資訊
- **檔案名稱:** `SolidiMobileApp-v1.2.0-release-20251108.aab`
- **檔案大小:** 25 MB
- **檔案位置:** `/Users/henry/Solidi/SolidiMobileApp4/distribution/`
- **格式:** Android App Bundle (AAB) - Google Play 官方格式
- **建置日期:** 2025年11月8日

---

## 🚀 上傳到 Google Play Console 的步驟

### 步驟 1: 登入 Google Play Console
1. 前往 https://play.google.com/console
2. 使用您的 Google 開發者帳號登入
3. 選擇您的應用程式（如果還沒建立，需要先建立應用程式）

### 步驟 2: 建立新版本發布

#### 2.1 進入測試軌道
1. 在左側選單點選 **「測試」**
2. 選擇 **「封閉測試」**（內部測試或封閉測試）
3. 點擊 **「建立新版本」**

#### 2.2 上傳 AAB 檔案
1. 在「App Bundle」區塊，點擊 **「上傳」**
2. 選擇檔案: `SolidiMobileApp-v1.2.0-release-20251108.aab`
3. 等待上傳完成（約 1-2 分鐘）
4. Google Play 會自動驗證檔案

#### 2.3 填寫版本資訊
```
版本名稱: 1.2.0
版本代碼: (自動產生或手動輸入)

版本說明（繁體中文）:
- ✅ 完整的 API 文件整理
- ✅ 程式碼清理與優化
- ✅ 修復匯入錯誤
- ✅ Android 建置優化
- ✅ 持久登入功能
- ✅ 增強錯誤處理
- ✅ 生產環境優化

版本說明（英文）:
- ✅ Complete API documentation
- ✅ Code cleanup and optimization
- ✅ Fixed import errors
- ✅ Android build optimization
- ✅ Persistent login enabled
- ✅ Enhanced error handling
- ✅ Production optimization
```

#### 2.4 設定測試人員

**方法 1: 建立測試人員清單**
1. 點擊 **「測試人員」** 標籤
2. 點擊 **「建立清單」**
3. 輸入清單名稱（例如：「內部測試團隊」）
4. 新增測試人員的 Email 地址（必須是 Gmail 或 Google 帳號）
5. 儲存

**方法 2: 使用 Google 群組**
1. 建立 Google 群組（https://groups.google.com）
2. 將測試人員加入群組
3. 在 Play Console 中輸入群組 Email

#### 2.5 審核並發布
1. 檢查所有資訊是否正確
2. 點擊 **「審核版本」**
3. 確認無誤後，點擊 **「開始推出至封閉測試」**
4. 等待處理（通常 10-30 分鐘）

### 步驟 3: 分享測試連結

發布成功後：
1. 前往 **「測試」→「封閉測試」**
2. 複製 **「測試連結」**
3. 分享給測試人員

測試連結格式：
```
https://play.google.com/apps/testing/[您的套件名稱]
```

---

## 📋 首次上傳需要的設定

### 如果是第一次上傳，您需要：

#### 1. 建立應用程式
- 應用程式名稱: Solidi Mobile App
- 預設語言: 繁體中文或英文
- 應用程式類型: 應用程式
- 免費或付費: 免費

#### 2. 設定應用程式內容
- 隱私權政策網址
- 應用程式類別: 財經
- 內容分級問卷

#### 3. 設定商店資訊
- 簡短說明（80 字元）
- 完整說明（4000 字元）
- 應用程式圖示（512x512 px）
- 精選圖片（1024x500 px）
- 螢幕截圖（至少 2 張）

#### 4. 定價與發布國家/地區
- 選擇免費
- 選擇發布的國家/地區

---

## 🔐 應用程式簽署設定

### 選項 1: Google Play 應用程式簽署（推薦）
✅ **已自動設定**
- Google 會管理您的簽署金鑰
- 更安全且不會遺失金鑰
- 首次上傳時 Google 會自動設定

### 選項 2: 自行管理簽署金鑰
如果您想自行管理：
1. 生成 Keystore 檔案
2. 在 `android/gradle.properties` 設定
3. 重新建置並簽署 AAB

**注意：建議使用 Google Play 應用程式簽署**

---

## ✅ AAB vs APK 比較

| 特性 | AAB (您目前的檔案) | APK (之前的檔案) |
|------|-------------------|-----------------|
| Google Play 上傳 | ✅ 官方推薦格式 | ⚠️ 舊格式 |
| 檔案大小 | 優化（動態分發） | 較大 |
| 裝置相容性 | 自動最佳化 | 通用但較大 |
| 必需用於 | 新應用程式 | 僅限舊應用 |
| 側載安裝 | ❌ 無法直接安裝 | ✅ 可以 |

---

## 📊 上傳後的處理時間

1. **上傳檔案:** 1-2 分鐘
2. **Google 驗證:** 5-10 分鐘
3. **發布到測試軌道:** 10-30 分鐘
4. **測試人員可存取:** 發布後立即可用

---

## 🧪 測試人員如何安裝

### 測試人員的步驟：
1. 收到測試連結
2. 點擊連結（必須在手機上使用 Chrome）
3. 點擊「成為測試人員」
4. 前往 Google Play Store
5. 搜尋「Solidi Mobile App」
6. 安裝應用程式

### 測試人員會看到：
- 標示為「測試版」的應用程式
- 可以隨時提供意見回饋
- 自動接收更新

---

## 📝 版本更新流程

當您需要更新版本時：
1. 修改程式碼
2. 更新 `android/app/build.gradle` 中的 `versionCode` 和 `versionName`
3. 重新執行: `cd android && ./gradlew bundleRelease`
4. 上傳新的 AAB 到相同的測試軌道
5. 測試人員會自動收到更新通知

---

## ⚠️ 常見問題

### Q1: 上傳失敗 - 簽署問題
**解決方法:**
1. 確認已啟用 Google Play 應用程式簽署
2. 第一次上傳時，選擇「讓 Google 管理並保護您的應用程式簽署金鑰」

### Q2: 版本代碼衝突
**解決方法:**
更新 `android/app/build.gradle`:
```gradle
versionCode 2  // 增加數字
versionName "1.2.1"  // 更新版本
```

### Q3: 測試人員無法下載
**解決方法:**
- 確認測試人員的 Email 已加入清單
- 測試人員必須使用相同的 Google 帳號
- 測試人員需先「加入測試」

### Q4: 想要提供 APK 給無法使用 Play Store 的人
**解決方法:**
使用之前建立的 APK 檔案:
```
distribution/SolidiMobileApp-v1.2.0-release-20251108.apk
```

---

## 🎯 建議的測試流程

### 階段 1: 內部測試（1-3 天）
- 上傳到「內部測試」軌道
- 5-10 位內部團隊成員測試
- 快速迭代修復問題

### 階段 2: 封閉測試（1-2 週）
- 上傳到「封閉測試」軌道
- 20-100 位測試人員
- 收集詳細意見回饋

### 階段 3: 開放測試（選用）
- 上傳到「開放測試」軌道
- 任何人都可以加入
- 大規模測試

### 階段 4: 正式發布
- 上傳到「生產」軌道
- 全球發布
- 分階段推出（10% → 50% → 100%）

---

## 📞 需要協助？

### Google Play Console 說明文件
- 英文: https://support.google.com/googleplay/android-developer
- 中文: https://support.google.com/googleplay/android-developer?hl=zh-Hant

### 相關文件位置
- **封閉測試說明:** `distribution/README.md`
- **版本說明:** `distribution/RELEASE_NOTES.md`
- **測試檢查清單:** `RELEASE_CHECKLIST.md`

---

## ✅ 快速檢查清單

上傳前確認：
- [ ] AAB 檔案已建立（25 MB）
- [ ] Google Play Console 帳號已登入
- [ ] 應用程式已在 Console 中建立
- [ ] 商店資訊已填寫完整
- [ ] 測試人員清單已準備好
- [ ] 版本說明已準備好

上傳後確認：
- [ ] AAB 上傳成功
- [ ] 版本通過 Google 驗證
- [ ] 測試軌道已發布
- [ ] 測試連結已複製
- [ ] 測試人員已收到通知

---

## 🎉 您的檔案已準備就緒！

**AAB 檔案位置:**
```
/Users/henry/Solidi/SolidiMobileApp4/distribution/SolidiMobileApp-v1.2.0-release-20251108.aab
```

**檔案大小:** 25 MB

**現在可以上傳到 Google Play Console 了！** 🚀

---

**建置時間:** 2分17秒  
**建置狀態:** ✅ 成功  
**檔案格式:** ✅ AAB（Google Play 官方格式）
