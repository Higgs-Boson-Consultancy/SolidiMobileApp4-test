# Version Code 36 + API 35 更新 (2024年11月8日)

## 問題描述

在嘗試上傳版本代碼 35 的 AAB 到 Google Play 控制台時，遇到了兩個錯誤：

1. **版本代碼衝突**：
   - 錯誤訊息：「版本代碼 33 的訊息：這個 APK 已由擁有更高版本代碼的一或多個 APK 完全覆蓋」
   - 原因：版本代碼 33、34、35 都已經在 Google Play 中使用過

2. **API 級別要求**：
   - 錯誤訊息：「版本代碼 35 的訊息：您的應用程式目前的目標 API 級別是 34，但目標 API 級別至少須為 35，才能確保應用程式採用最新的 API」
   - 原因：Google Play 要求新應用必須至少目標 API 級別 35 (Android 15)

## 解決方案

### 1. 更新 API 級別 (34 → 35)

修改 `android/build.gradle`：
```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 21
        compileSdkVersion = 35  // ✅ 從 34 更新到 35
        targetSdkVersion = 35   // ✅ 從 34 更新到 35
        ndkVersion = "25.1.8937393"
        kotlinVersion = "1.8.0"
    }
}
```

**影響**：
- ✅ 應用程式現在目標 Android 15 (API 35)
- ✅ 符合 Google Play 最新要求
- ✅ 可以使用 Android 15 的最新安全性和效能功能

### 2. 更新版本代碼 (35 → 36)

修改 `android/app/build.gradle`：
```gradle
defaultConfig {
    applicationId "com.solidimobileapp4test"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 36         // ✅ 從 35 更新到 36
    versionName "1.2.0"
}
```

**影響**：
- ✅ 避免與先前上傳的版本 (33, 34, 35) 衝突
- ✅ 提供唯一的版本標識符

### 3. 重新建置 AAB

執行命令：
```bash
cd android
./gradlew clean bundleRelease
```

建置詳情：
- ⏱️ 建置時間：9分45秒
- 📦 檔案大小：25 MB
- 🎯 目標 API：35 (Android 15)
- 🔢 版本代碼：36
- 📱 版本名稱：1.2.0

## 新 AAB 檔案

**檔案名稱**：`SolidiMobileApp-v1.2.0-versionCode36-API35-20251108.aab`

**完整路徑**：
```
/Users/henry/Solidi/SolidiMobileApp4/distribution/SolidiMobileApp-v1.2.0-versionCode36-API35-20251108.aab
```

**檔案資訊**：
- 大小：25 MB
- 建立時間：2024年11月8日 14:41
- 版本代碼：36
- 目標 API：35
- 版本名稱：1.2.0

## 上傳到 Google Play 控制台

### 步驟 1：登入 Google Play 控制台
1. 前往：https://play.google.com/console
2. 選擇應用程式：Solidi Mobile App

### 步驟 2：建立封閉測試版本
1. 在左側選單中選擇「測試」→「封閉測試」
2. 選擇測試軌道（或建立新的測試軌道）
3. 點擊「建立新版本」

### 步驟 3：上傳 AAB 檔案
1. 點擊「上傳」按鈕
2. 選擇檔案：`SolidiMobileApp-v1.2.0-versionCode36-API35-20251108.aab`
3. 等待上傳完成（可能需要幾分鐘）

### 步驟 4：填寫版本資訊
在「這個版本有什麼新功能？」欄位中填寫：

```
版本 1.2.0 (版本代碼 36, API 35)

✅ 更新至 Android 15 (API 35)
   - 符合 Google Play 最新要求
   - 提升安全性和效能
   
✅ 完整的 API 文件整理
   - 36+ API 端點完整記錄
   - 詳細的參數和回應說明
   
✅ 程式碼優化
   - 移除未使用的檔案
   - 改善應用程式結構
   
✅ Android 建置優化
   - 啟用 Hermes 引擎
   - 啟用 ProGuard/R8 優化
   - 減小應用程式大小
   
✅ 持久登入功能
   - 自動記住使用者登入狀態
   - 安全的憑證儲存
```

### 步驟 5：審查並發布
1. 檢查所有資訊是否正確
2. 確認版本代碼顯示為 **36**
3. 確認目標 API 級別為 **35**
4. 點擊「審查版本」
5. 點擊「開始向測試人員推出」

### 步驟 6：新增測試人員
1. 在測試軌道設定中新增測試人員
2. 建立測試人員清單或新增電子郵件地址
3. 產生並分享選擇加入連結

## 技術規格

### 建置配置
- **Build Tools**: 34.0.0
- **Min SDK**: 21 (Android 5.0)
- **Compile SDK**: 35 (Android 15) ⬅️ 更新
- **Target SDK**: 35 (Android 15) ⬅️ 更新
- **NDK**: 25.1.8937393
- **Kotlin**: 1.8.0
- **Gradle**: 8.5

### 應用程式資訊
- **Package Name**: com.solidimobileapp4test
- **Version Code**: 36 ⬅️ 更新
- **Version Name**: 1.2.0
- **Hermes**: Enabled
- **ProGuard/R8**: Enabled

### 已安裝的 Android SDK
建置過程中自動安裝：
- ✅ Android SDK Platform 35 (revision 2)

## 歷史版本對比

| 版本代碼 | 目標 API | 狀態 | 建立日期 | 檔案名稱 |
|---------|---------|------|---------|---------|
| 34 | 34 | ❌ 已使用 | 2024-11-08 13:58 | SolidiMobileApp-v1.2.0-release-20251108.aab |
| 35 | 34 | ❌ API不足 | 2024-11-08 14:16 | SolidiMobileApp-v1.2.0-versionCode35-20251108.aab |
| 36 | 35 | ✅ 準備上傳 | 2024-11-08 14:41 | SolidiMobileApp-v1.2.0-versionCode36-API35-20251108.aab |

## 預期結果

✅ **成功標準**：
- 版本代碼 36 是唯一的，沒有衝突
- 目標 API 級別 35 符合 Google Play 要求
- 上傳應該成功，沒有錯誤
- 測試人員可以存取和安裝應用程式

⚠️ **注意事項**：
- Google Play 處理上傳可能需要 10-30 分鐘
- 首次上傳到新軌道可能需要額外的審查時間
- 確保應用程式簽名配置正確

## 相關檔案

- 建置配置：`android/build.gradle`
- 應用程式配置：`android/app/build.gradle`
- AAB 檔案：`distribution/SolidiMobileApp-v1.2.0-versionCode36-API35-20251108.aab`
- 上傳指南：`distribution/GOOGLE_PLAY_UPLOAD_GUIDE_zh-TW.md`

## 下一步

1. ✅ **完成** - 更新 API 級別到 35
2. ✅ **完成** - 更新版本代碼到 36
3. ✅ **完成** - 重新建置 AAB
4. ⏳ **待辦** - 上傳到 Google Play 控制台
5. ⏳ **待辦** - 設定測試人員和分發

---

**建立日期**: 2024年11月8日 14:42
**建置時間**: 9分45秒
**狀態**: ✅ 準備上傳到 Google Play
