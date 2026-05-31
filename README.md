# 🐱 貓咪圖鑑解析器

一個幫助《貓咪大戰爭》玩家快速整理**已擁有超激稀有**與**傳說稀有**貓咪的網頁工具。   
之後即可匯出 / 匯入 JSON 檔案，省去重複手打的麻煩。

<a href="https://nicholoasng72606-wq.github.io/battlecatlection/" target="_blank">點我開啟工具 🔗</a>
---

## ✨ 功能

- 📋 支援手動輸入的特定文字格式
- 📦 支援直接貼上先前匯出的 JSON 檔案內容
- 🖼️ 根據三階、四階／超本能狀態自動顯示對應圖片
- 🏷️ 以彩色標籤區分「已開四階/超本」「未開」「暫無」
- 💾 可將解析結果匯出為 JSON 備份，方便下次使用
- 📱 響應式網格，電腦、手機皆可瀏覽

---

## ⚠️ 使用前置說明

**這個工具不會自動從遊戲抓取資料**，也不會讀取任何遊戲存檔。  
你需要**先整理好自己的貓咪清單**（包含擁有狀態、進化狀態等），  
再將整理好的結果依照下方指定的文字格式貼入本工具。

如果你是進階使用者，也可以直接按照下方的 JSON 結構撰寫資料，跳過手打步驟。

---

## 📥 如何輸入資料

本工具接受兩種輸入格式，**直接全選貼入輸入框即可自動辨識**：

| 格式 | 適用情境 |
|------|----------|
| **文字格式** | 第一次使用 |
| **JSON 格式** | 已有備份檔，或想直接手寫 JSON 的進階玩家 |

---

### 一、文字格式（整理後貼上）

你的整理結果**必須包含**以下兩個區塊，順序不拘：

我的超激：
…
我的傳稀：

#### 📌 系列與貓咪格式

系列名稱：貓咪1 ， 貓咪2 ， 貓咪3 …


- 系列名稱後可接 **中文冒號「：」** 或英文冒號「:」
- 貓咪之間用 **「 ， 」**（半形空格 + 中文逗號 + 半形空格）或英文逗號「,」分隔
- **每隻貓咪的欄位必須使用中文分號「；」分隔**（❌ 不可用英文分號 `;`）

#### 🔹 貓咪欄位說明

根據是否有三階分成兩種寫法：

**有三階的貓咪（完整欄位）**

ID；一階名稱；三階名稱；擁有狀態；三階狀態；四階/超本狀態

| 欄位 | 說明 | 範例 |
|------|------|------|
| ID | 貓咪編號（數字） | 158 |
| 一階名稱 | 一階貓咪名稱 | 上杉謙信 |
| 三階名稱 | 三階貓咪名稱 | 亂爆武神・上杉謙信 |
| 擁有狀態 | `已擁有` 或 `未擁有` | 已擁有 |
| 三階狀態 | `已三階` 或 `未三階` | 已三階 |
| 四階/超本狀態 | `已四階`、`未四階`、`已超本`、`未超本` 或 `暫無四階/超本` | 已四階 |

**無三階的貓咪（簡化欄位）**

ID；一階名稱；暫無三階；擁有狀態

| 欄位 | 說明 | 範例 |
|------|------|------|
| ID | 貓咪編號（數字） | 763 |
| 一階名稱 | 一階貓咪名稱 | 噴火恐龍貓 |
| 暫無三階 | 固定文字「暫無三階」 | 暫無三階 |
| 擁有狀態 | `已擁有` 或 `未擁有` | 已擁有 |

> ⚠️ **無三階的貓咪不需填寫三階狀態與四階/超本狀態**，只要到「擁有狀態」即可。

#### 🖊️ 輸入範例（推薦使用最底的完整範例，自己再做出修改）
```text
我的超激：

傳說中的不明貓一族：34；不明貓；超人白骨貓；未擁有；未三階；未超本 ， 170；手甩貓；草帽長手白骨貓；已擁有；已三階；暫無四階/超本

超激烈爆彈：43；機器貓；機器貓・滅；已擁有；已三階；未超本 ， 763；噴火恐龍貓；暫無三階；已擁有

戰國武神巴薩拉斯：158；上杉謙信；亂爆武神・上杉謙信；已擁有；已三階；已四階


我的傳稀：

傳說中的不明貓一族：461；奇幻貓；暫無三階；未擁有

超破壞大帝龍皇因佩拉斯：450；天龍城巴比貓塔；天魔城龍巴比貓塔；已擁有；已三階；暫無四階/超本
```


---

### 二、JSON 格式（進階使用 / 匯入備份）

如果你已經匯出過 JSON，或想直接手寫結構，可以貼上符合以下格式的 JSON：

```json
{
  "super_rare": {
    "系列": [
      {
        "name": "傳說中的不明貓一族",
        "cats": [
          {
            "id": 34,
            "first_form": "不明貓",
            "third_form": "超人白骨貓",
            "owned": false,
            "is_third": false,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 170,
            "first_form": "手甩貓",
            "third_form": "草帽長手白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      }
    ]
  },
  "legend_rare": {
    "系列": [
      {
        "name": "傳說中的不明貓一族",
        "cats": [
          {
            "id": 461,
            "first_form": "奇幻貓",
            "third_form": null,
            "owned": false,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      }
    ]
  }
}
```

# 🧾 JSON 欄位定義

| 路徑 | 型別 | 說明 |
|------|------|------|
| `super_rare` | object | 超激稀有資料 |
| `super_rare.系列` | array | 超激稀有系列陣列 |
| `legend_rare` | object | 傳說稀有資料 |
| `legend_rare.系列` | array | 傳說稀有系列陣列 |
| 系列物件中的 `name` | string | 系列名稱 |
| 系列物件中的 `cats` | array | 該系列的貓咪陣列 |
| 貓咪物件中的 `id` | number | 貓咪編號 |
| `first_form` | string | 一階名稱 |
| `third_form` | string / null | 三階名稱，無三階時為 null |
| `owned` | boolean | 是否已擁有（true / false） |
| `is_third` | boolean | 是否已三階（無三階的貓請填 false） |
| `fourth_path` | string / null | 四階或超本路徑，可能值："四階"、"超本"，若無則為 null |
| `is_fourth` | boolean | 是否已開啟該路徑（已四階或已超本為 true） |

> ⚠️ `owned`、`is_third`、`is_fourth` 必須是布林值（true 或 false），不能寫成字串。

---

## 🔄 建議使用流程

1. **第一次使用**：  
   整理好貓咪資料，按照「文字格式」貼入工具 → 解析 → 按下「💾 下載 JSON」備份。

2. **之後使用**：  
   直接貼上備份的 JSON 內容 → 解析，或修改 JSON 內容後再貼上。

3. **更新狀態**：  
   當獲得新貓或進化時，可以直接編輯 JSON 檔（改 `owned`、`is_third` 等欄位），再貼入工具重新生成圖鑑。

---

## 🖥️ 使用步驟

1. 用瀏覽器開啟 `index.html`
2. 將整理好的文字或 JSON 貼入輸入框
3. 點擊 「🔍 開始解析」
4. 下方會顯示「🐾 超激稀有」與「🌟 傳說稀有」的網格
5. 可使用 「📋 複製 JSON」 或 「💾 下載 JSON」 儲存當前資料

---

### 完整範例
```text
我的超激：（格式為一階名稱/三階名稱(如有);是否三階(如有);是否四階/超本(如有)）
傳說中的不明貓一族：34；不明貓；超人白骨貓；已擁有；已三階；未超本 ， 168；踢腳貓；我打打打長腳白骨貓；已擁有；已三階；暫無四階/超本 ， 169；頭槌貓；E・長頸白骨貓；已擁有；已三階；暫無四階/超本 ， 170；手甩貓；草帽長手白骨貓；已擁有；已三階；暫無四階/超本 ， 171；異能貓；閃光異能白骨貓；已擁有；已三階；暫無四階/超本 ， 240；刺骨貓；山神白骨貓；已擁有；已三階；暫無四階/超本 ， 436；捲捲貓；頭巾捲捲白骨貓；已擁有；已三階；暫無四階/超本 ， 546；角擊貓；令牌棒打白骨貓；已擁有；已三階；暫無四階/超本 ， 625；怒髮貓；暴怒髮鞭白骨貓；已擁有；已三階；暫無四階/超本 ， 712；額頭貓；盔甲額頭白骨貓；已擁有；已三階；暫無四階/超本 ， 781；眼擊貓；暫無三階；已擁有
超激烈爆彈：42；冰雪貓；冰雪水晶貓；已擁有；已三階；未超本 ， 43；機器貓；機器貓・滅；已擁有；已三階；未超本 ， 44；惡鬼喵魔；獄炎鬼喵魔；已擁有；已三階；暫無四階/超本 ， 57；巨劍騎士貓；聖騎士貓；已擁有；已三階；未超本 ， 59；貓咪Baby；貓咪嬰兒車；已擁有；已三階；未四階 ， 143；貓護士；粉紅喜悅貓護士；已擁有；已三階；未超本 ， 427；貓咪鬥惡龍；貓咪鬥惡龍XI-2；已擁有；已三階；未四階 ， 519；拉斯沃斯；真・拉斯沃斯；已擁有；已三階；暫無四階/超本 ， 617；召喚少年小悟；惡魔獵人小悟；已擁有；已三階；暫無四階/超本 ， 668；天狗貓；大神仙天狗貓；已擁有；已三階；暫無四階/超本 ， 763；噴火恐龍貓；暫無三階；已擁有
戰國武神巴薩拉斯：71；真田幸村；飛翔武神・真田幸村；已擁有；已三階；暫無四階/超本 ， 72；前田慶次；憤怒武神・前田慶次；已擁有；已三階；未超本 ， 73；織田信長；天魔・織田信長；已擁有；已三階；未四階 ， 124；伊達政宗；邪眼龍武神・伊達政宗；已擁有；已三階；未超本 ， 125；武田信玄；猛牛武神・武田信玄；已擁有；已三階；未超本 ， 158；上杉謙信；亂爆武神・上杉謙信；已擁有；已三階；未四階 ， 338；今川義元；鬼火武神・今川義元；已擁有；已三階；未超本 ， 496；成田甲斐；豪炎姬武神・成田甲斐；已擁有；已三階；未四階 ， 618；天草四郎；怨恨魔神・天草四郎；已擁有；已三階；暫無四階/超本 ， 649；服部半藏；絕影忍神・服部半藏；已擁有；已三階；暫無四階/超本 ， 754；明智光秀；暫無三階；已擁有 ， 850；風魔小太郎；暫無三階；已擁有
電腦學園銀河美少女：75；風神溫蒂；疾風神溫蒂α；已擁有；已三階；未四階 ， 76；雷神珊迪亞；迅雷神珊迪亞β；已擁有；已三階；未四階 ， 105；猿帝・悟空貓；金猿帝・悟空貓γ；已擁有；已三階；未超本 ， 106；召喚・八戒貓；大召喚・八戒貓μ；已擁有；已三階；未超本 ， 107；寶杖使者・悟淨貓；光寶杖使者・悟淨貓κ；已擁有；已三階；未超本 ， 159；冥界卡莉法；冥界卡莉法ＸＸ；已擁有；已三階；暫無四階/超本 ， 351；雙掌星西兒＆小毬；雙輝星西兒＆小毬Φ；已擁有；已三階；未超本 ， 502；英雄令媛蜜斯；絢爛令媛蜜斯ξ；已擁有；已三階；暫無四階/超本 ， 619；妖賢女莉莉；大賢女莉莉π；已擁有；已三階；暫無四階/超本 ， 647；狩獵女孩媞倫；大狩獵女孩媞倫ζ；已擁有；已三階；暫無四階/超本 ， 733；鐵籠的姵卡薩；暫無三階；已擁有 ， 830；獅子番長拉克雷斯；暫無三階；已擁有
超破壞大帝龍皇因佩拉斯：83；地龍索多姆；地龍皇帝索多姆；已擁有；已三階；未超本 ， 84；聖龍梅基多拉；聖龍皇帝梅基多拉；已擁有；已三階；未超本 ， 85；龍騎士巴魯斯；龍騎士皇帝巴魯斯；已擁有；已三階；未超本 ， 86；神龍卡姆庫拉；神龍皇帝卡姆庫拉；已擁有；已三階；未超本 ， 87；龍戰機雷電；龍戰機皇帝雷電；已擁有；已三階；未超本 ， 177；霸龍迪歐拉姆斯；霸龍皇帝迪歐拉姆斯；已擁有；已三階；未四階 ， 396；古龍剛格利昂；古龍皇剛格利昂；已擁有；已三階；暫無四階/超本 ， 505；角龍格拉迪歐斯；角龍皇帝格拉迪歐斯；已擁有；已三階；暫無四階/超本 ， 620；邪龍赫維賈克；邪龍皇帝赫維賈克；已擁有；已三階；暫無四階/超本 ， 660；海龍達萊亞薩；海龍皇帝達萊亞薩；已擁有；已三階；暫無四階/超本 ， 760；砲龍剛多羅斯；暫無三階；已擁有 ， 861；嵐竜機ヴォルネード；暫無三階；已擁有
超古代勇者超級靈魂勇者：134；浦島太郎；龍宮超獸・變色龍王；已擁有；已三階；未超本 ， 135；白鶴貓；究極戰士・黃金小宇宙；已擁有；已三階；未四階 ， 136；桃太郎；爆走兄弟・桃色正義；已擁有；已三階；未超本 ， 137；斗笠地藏；地藏要塞・金甲神威；已擁有；已三階；未四階 ， 138；輝夜姬；破壞衛星・混沌之月；已擁有；已三階；未四階 ， 203；咔嚓咔嚓山崽子；豪炎狙擊車ㄛ一ㄛ一；已擁有；已三階；未超本 ， 322；猴蟹大戰貓；超音樂奏猴蟹天團；已擁有；已三階；暫無四階/超本 ， 525；金太郎；超槍戰隊金呷勇；已擁有；已三階；暫無四階/超本 ， 633；舌切雀；大妖怪結社沖沖衝；已擁有；已三階；暫無四階/超本 ， 692；一寸法師；鬼襲戰艇小槌號；已擁有；已三階；暫無四階/超本 ， 769；開花爺爺；暫無三階；已擁有
逆襲的戰士黑暗英雄：194；阿激拉；獄炎・阿激拉；已擁有；已三階；未超本 ， 195；西園寺機器子；航太博士Dr.機器子；已擁有；已三階；未超本 ， 196；貓俠大帝；雷霆貓俠；已擁有；已三階；暫無四階/超本 ， 212；白兔女俠；灰狐女俠；已擁有；已三階；未四階 ， 226；咒術師死亡小丑；奇術科學者狂G；已擁有；已三階；未超本 ， 261；天誅飛隼；滅殺飛隼；已擁有；已三階；未超本 ， 431；亡者偵探吳仲力；魔神偵探吳仲力；已擁有；已三階；未四階 ， 533；狙擊天才沙紀；爆破天才沙紀；已擁有；已三階；未超本 ， 634；白騎士庫克洛普斯；神魔騎士庫克洛普斯；已擁有；已三階；暫無四階/超本 ， 698；閃電傑克；電光傑克；已擁有；已三階；暫無四階/超本 ， 774；特命交警阿酷賽爾；暫無三階；已擁有
究極降臨巨神宙斯：257；天空神宙斯；G巨神宙斯；已擁有；已三階；未超本 ， 258；守護神阿努比斯；G無瑕神阿努比斯；已擁有；已三階；未超本 ， 259；美女神阿芙蘿黛蒂；G大女神美嘉蘿黛蒂；已擁有；已三階；未超本 ， 271；太陽神天照；G大御神天照；已擁有；已三階；未超本 ， 272；象頭神迦內薩；G睿智神迦內薩；已擁有；已三階；未超本 ， 316；海王神波塞頓；G海龍騎波塞頓；已擁有；已三階；暫無四階/超本 ， 439；時空神克羅諾絲；G時空之鑰克羅諾絲；已擁有；已三階；暫無四階/超本 ， 534；冥界神黑帝斯；G冥界之王黑帝斯；已擁有；已三階；未超本 ， 642；墮天神路西法；G崇高之神路西法；已擁有；已三階；暫無四階/超本 ， 723；光翼神伊西絲；G美翼神伊西絲；已擁有；已三階；暫無四階/超本 ， 811；護法神韋馱天；暫無三階；已擁有
革命軍隊鋼鐵戰團：304；帝國陸軍・石砲隊；超擊滅戰車・陸王砲；已擁有；已三階；未四階 ， 305；古代軍船・戰槳隊；超無敵艦隊・海皇錐；已擁有；已三階；未四階 ， 306；飛空襲擊・轟炸隊；超飛行戰艦・空帝雷；已擁有；已三階；未四階 ， 355；觀測兵器・探天隊；超時空基地・星隕爆；已擁有；已三階；暫無四階/超本 ， 417；溫泉天堂・浴場隊；超地底戰隊・土龍鑽；已擁有；已三階；暫無四階/超本 ， 594；空中商店・探險家；超運送兵團・文明組；已擁有；已三階；暫無四階/超本 ， 632；超龍戰機・毀滅團；超電磁戰機・殲滅團；已擁有；已三階；暫無四階/超本 ， 674；周遊藝團・雜耍隊；超奇襲怪光・幽浮隊；已擁有；已三階；暫無四階/超本 ， 715；建築兵團・運輸隊；超突擊部隊・卡車隊；已擁有；已三階；暫無四階/超本 ， 799；曲射砲台・砲擊團；暫無三階；已擁有
古靈精怪元素小精靈：359；火精靈梅拉；火焰精靈王猛火梅拉邦；已擁有；已三階；未四階 ， 360；水精靈密茲；流水精靈王激流密茲曼；已擁有；已三階；未四階 ， 361；風精靈艾爾；暴風精靈王艾爾方帝；已擁有；已三階；未四階 ， 401；雷精靈波特；天雷精靈王基加波特；已擁有；已三階；暫無四階/超本 ， 569；石精靈滾瓦；岩石精靈王強韌伊瓦；已擁有；已三階；暫無四階/超本 ， 631；闇精靈亞米；暗黑精靈王亞米諾瓦多；已擁有；已三階；暫無四階/超本 ， 655；冰精靈布莉茲；冰結精靈王布莉莎雷娜；已擁有；已三階；暫無四階/超本 ， 719；鐵精靈卡卿；鋼鐵精靈王鋼鐵卡卿；已擁有；已三階；暫無四階/超本 ， 817；樹精靈小魔麗；暫無三階；已擁有
絕命美少女怪物萌娘隊：334；俏狐娘百荷；豐穰的狐姬百荷；已擁有；已三階；未超本 ， 335；美人魚琉璃；龍宮人魚姬琉璃；已擁有；已三階；未超本 ， 336；木乃伊梨香；黃金法老姬梨香；已擁有；已三階；暫無四階/超本 ， 357；狼來妹迪兒；小丑女狼迪兒；已擁有；已三階；未超本 ， 358；不死女薇薇；滿腹新嫁娘薇薇；已擁有；已三階；暫無四階/超本 ， 607；冒險家佳奈；傳說的冒險少女佳奈；已擁有；已三階；暫無四階/超本 ， 682；闇女神蓓卡；虛影加持闇女神蓓卡；已擁有；已三階；暫無四階/超本 ， 725；忍者女孩多萌耶；暫無三階；已擁有 ， 824；魔導師希朵咪；暫無三階；已擁有
超級貓咪祭：269；幼獸加歐；暫無三階；已擁有 ， 318；巫女姬御靈；暫無三階；已擁有 ， 380；幼傑達太貓；暫無三階；已擁有 ， 529；災難少女凱斯莉；暫無三階；已擁有 ， 585；幼獸加爾；暫無三階；已擁有 ， 641；歡笑揮舞孃；暫無三階；已擁有 ， 690；命運之子佛諾；暫無三階；已擁有 ， 779；幼天女露娜；暫無三階；已擁有 ， 837；幼騎士路諾；暫無三階；已擁有
特級貓咪祭：333；黑獸牙王；暫無三階；已擁有 ， 378；黑無垢御靈；暫無三階；已擁有 ， 441；影傑漆黑達太貓；暫無三階；已擁有 ， 543；禍根魔女凱斯莉；暫無三階；已擁有 ， 609；黑獸加迪；暫無三階；已擁有 ， 657；悲嘆揮舞孃；暫無三階；已擁有 ， 705；非命之王佛挪；暫無三階；已擁有 ， 787；冥佑天女露娜夏；暫無三階；已擁有 ， 859；孤月騎士路諾斯；暫無三階；已擁有
女王祭：612；貓咪王女；暫無三階；已擁有
福音戰士合作轉蛋：412；EVA零號機；暫無三階；已擁有 ， 413；EVA初號機；決意的EVA初號機&貓咪；已擁有；已三階；暫無四階/超本 ， 415；真嗣貓；暫無三階；已擁有 ， 547；白夜姬零；暫無三階；已擁有 ， 549；第6使徒；暫無三階；已擁有 ， 550；第10使徒；暫無三階；已擁有 ， 814；EVA量產機；暫無三階；已擁有 ， 414；EVA2號機；EVA改2號機 Code 777；已擁有；已三階；暫無四階/超本 ， 416；通訊聯絡機零月；暫無三階；已擁有 ， 487；EVA8號機；暫無三階；已擁有 ， 488；空中戰艦貓咪Wunder；弒神之船喵喵Wunder；已擁有；已三階；暫無四階/超本 ， 548；第4使徒；暫無三階；已擁有 ， 551；第9使徒；暫無三階；已擁有 ， 709；獨眼少女明日香；暫無三階；已擁有 ， 710；EVA第13號機；暫無三階；已擁有
鬼滅之刃：840；竈門炭治郎；暫無三階；已擁有 ， 841；竈門禰󠄀豆子；暫無三階；已擁有 ， 842；我妻善逸；暫無三階；已擁有 ， 843；嘴平伊之助；暫無三階；已擁有 ， 844；冨岡義勇；暫無三階；已擁有 ， 845；胡蝶忍；暫無三階；已擁有 ， 846；煉獄杏壽郎；暫無三階；已擁有

我的傳稀：（格式為一階名稱/三階名稱(如有);是否三階(如有);是否四階/超本(如有)）
傳說中的不明貓一族：461；奇幻貓；暫無三階；已擁有
超激烈爆彈：455；花漾桃子；暫無三階；已擁有
戰國武神巴薩拉斯：448；宮本武藏；無雙劍神・宮本武藏；已擁有；已三階；暫無四階/超本
電腦學園銀河美少女：449；聖女貓會長貞德；神聖女貓會長貞德ψ；已擁有；已三階；暫無四階/超本
超破壞大帝龍皇因佩拉斯：450；天龍城巴比貓塔；天魔城龍巴比貓塔；已擁有；已三階；暫無四階/超本
超古代勇者超級靈魂勇者：451；貓若丸；暫無三階；已擁有
逆襲的戰士黑暗英雄：481；超越科學者天域博士；暫無三階；已擁有
究極降臨巨神宙斯：493；大地女神蓋婭；暫無三階；已擁有
革命軍隊鋼鐵戰團：463；終末兵器・異滅堂；暫無三階；已擁有
古靈精怪元素小精靈：478；奇幻精靈露米納；暫無三階；已擁有
絕命美少女怪物萌娘隊：544；京坂七穗；暫無三階；已擁有
超級貓咪祭：731；曉之伊邪那岐；暫無三階；已擁有
特級貓咪祭：738；宵之伊邪那美；暫無三階；已擁有
超國王祭：586；貓咪王子；暫無三階；已擁有
福音戰士合作轉蛋：815；月影少年薰；暫無三階；已擁有
```
```json
{
  "super_rare": {
    "不重複率": {
      "傳說中的不明貓一族": 0,
      "超激烈爆彈": 0,
      "戰國武神巴薩拉斯": 0,
      "電腦學園銀河美少女": 0,
      "超破壞大帝龍皇因佩拉斯": 0,
      "超古代勇者超級靈魂勇者": 0,
      "逆襲的戰士黑暗英雄": 0,
      "究極降臨巨神宙斯": 0,
      "革命軍隊鋼鐵戰團": 0,
      "古靈精怪元素小精靈": 0,
      "絕命美少女怪物萌娘隊": 0,
      "超級貓咪祭": 0,
      "特級貓咪祭": 0,
      "女王祭": 0,
      "福音戰士合作轉蛋": 0,
      "鬼滅之刃": 0
    },
    "系列": [
      {
        "name": "傳說中的不明貓一族",
        "cats": [
          {
            "id": 34,
            "first_form": "不明貓",
            "third_form": "超人白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 168,
            "first_form": "踢腳貓",
            "third_form": "我打打打長腳白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 169,
            "first_form": "頭槌貓",
            "third_form": "E・長頸白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 170,
            "first_form": "手甩貓",
            "third_form": "草帽長手白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 171,
            "first_form": "異能貓",
            "third_form": "閃光異能白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 240,
            "first_form": "刺骨貓",
            "third_form": "山神白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 436,
            "first_form": "捲捲貓",
            "third_form": "頭巾捲捲白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 546,
            "first_form": "角擊貓",
            "third_form": "令牌棒打白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 625,
            "first_form": "怒髮貓",
            "third_form": "暴怒髮鞭白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 712,
            "first_form": "額頭貓",
            "third_form": "盔甲額頭白骨貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 781,
            "first_form": "眼擊貓",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超激烈爆彈",
        "cats": [
          {
            "id": 42,
            "first_form": "冰雪貓",
            "third_form": "冰雪水晶貓",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 43,
            "first_form": "機器貓",
            "third_form": "機器貓・滅",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 44,
            "first_form": "惡鬼喵魔",
            "third_form": "獄炎鬼喵魔",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 57,
            "first_form": "巨劍騎士貓",
            "third_form": "聖騎士貓",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 59,
            "first_form": "貓咪Baby",
            "third_form": "貓咪嬰兒車",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 143,
            "first_form": "貓護士",
            "third_form": "粉紅喜悅貓護士",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 427,
            "first_form": "貓咪鬥惡龍",
            "third_form": "貓咪鬥惡龍XI-2",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 519,
            "first_form": "拉斯沃斯",
            "third_form": "真・拉斯沃斯",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 617,
            "first_form": "召喚少年小悟",
            "third_form": "惡魔獵人小悟",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 668,
            "first_form": "天狗貓",
            "third_form": "大神仙天狗貓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 763,
            "first_form": "噴火恐龍貓",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "戰國武神巴薩拉斯",
        "cats": [
          {
            "id": 71,
            "first_form": "真田幸村",
            "third_form": "飛翔武神・真田幸村",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 72,
            "first_form": "前田慶次",
            "third_form": "憤怒武神・前田慶次",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 73,
            "first_form": "織田信長",
            "third_form": "天魔・織田信長",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 124,
            "first_form": "伊達政宗",
            "third_form": "邪眼龍武神・伊達政宗",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 125,
            "first_form": "武田信玄",
            "third_form": "猛牛武神・武田信玄",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 158,
            "first_form": "上杉謙信",
            "third_form": "亂爆武神・上杉謙信",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 338,
            "first_form": "今川義元",
            "third_form": "鬼火武神・今川義元",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 496,
            "first_form": "成田甲斐",
            "third_form": "豪炎姬武神・成田甲斐",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 618,
            "first_form": "天草四郎",
            "third_form": "怨恨魔神・天草四郎",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 649,
            "first_form": "服部半藏",
            "third_form": "絕影忍神・服部半藏",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 754,
            "first_form": "明智光秀",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 850,
            "first_form": "風魔小太郎",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "電腦學園銀河美少女",
        "cats": [
          {
            "id": 75,
            "first_form": "風神溫蒂",
            "third_form": "疾風神溫蒂α",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 76,
            "first_form": "雷神珊迪亞",
            "third_form": "迅雷神珊迪亞β",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 105,
            "first_form": "猿帝・悟空貓",
            "third_form": "金猿帝・悟空貓γ",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 106,
            "first_form": "召喚・八戒貓",
            "third_form": "大召喚・八戒貓μ",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 107,
            "first_form": "寶杖使者・悟淨貓",
            "third_form": "光寶杖使者・悟淨貓κ",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 159,
            "first_form": "冥界卡莉法",
            "third_form": "冥界卡莉法ＸＸ",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 351,
            "first_form": "雙掌星西兒＆小毬",
            "third_form": "雙輝星西兒＆小毬Φ",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 502,
            "first_form": "英雄令媛蜜斯",
            "third_form": "絢爛令媛蜜斯ξ",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 619,
            "first_form": "妖賢女莉莉",
            "third_form": "大賢女莉莉π",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 647,
            "first_form": "狩獵女孩媞倫",
            "third_form": "大狩獵女孩媞倫ζ",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 733,
            "first_form": "鐵籠的姵卡薩",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 830,
            "first_form": "獅子番長拉克雷斯",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超破壞大帝龍皇因佩拉斯",
        "cats": [
          {
            "id": 83,
            "first_form": "地龍索多姆",
            "third_form": "地龍皇帝索多姆",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 84,
            "first_form": "聖龍梅基多拉",
            "third_form": "聖龍皇帝梅基多拉",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 85,
            "first_form": "龍騎士巴魯斯",
            "third_form": "龍騎士皇帝巴魯斯",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 86,
            "first_form": "神龍卡姆庫拉",
            "third_form": "神龍皇帝卡姆庫拉",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 87,
            "first_form": "龍戰機雷電",
            "third_form": "龍戰機皇帝雷電",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 177,
            "first_form": "霸龍迪歐拉姆斯",
            "third_form": "霸龍皇帝迪歐拉姆斯",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 396,
            "first_form": "古龍剛格利昂",
            "third_form": "古龍皇剛格利昂",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 505,
            "first_form": "角龍格拉迪歐斯",
            "third_form": "角龍皇帝格拉迪歐斯",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 620,
            "first_form": "邪龍赫維賈克",
            "third_form": "邪龍皇帝赫維賈克",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 660,
            "first_form": "海龍達萊亞薩",
            "third_form": "海龍皇帝達萊亞薩",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 760,
            "first_form": "砲龍剛多羅斯",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 861,
            "first_form": "嵐竜機ヴォルネード",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超古代勇者超級靈魂勇者",
        "cats": [
          {
            "id": 134,
            "first_form": "浦島太郎",
            "third_form": "龍宮超獸・變色龍王",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 135,
            "first_form": "白鶴貓",
            "third_form": "究極戰士・黃金小宇宙",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 136,
            "first_form": "桃太郎",
            "third_form": "爆走兄弟・桃色正義",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 137,
            "first_form": "斗笠地藏",
            "third_form": "地藏要塞・金甲神威",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 138,
            "first_form": "輝夜姬",
            "third_form": "破壞衛星・混沌之月",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 203,
            "first_form": "咔嚓咔嚓山崽子",
            "third_form": "豪炎狙擊車ㄛ一ㄛ一",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 322,
            "first_form": "猴蟹大戰貓",
            "third_form": "超音樂奏猴蟹天團",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 525,
            "first_form": "金太郎",
            "third_form": "超槍戰隊金呷勇",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 633,
            "first_form": "舌切雀",
            "third_form": "大妖怪結社沖沖衝",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 692,
            "first_form": "一寸法師",
            "third_form": "鬼襲戰艇小槌號",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 769,
            "first_form": "開花爺爺",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "逆襲的戰士黑暗英雄",
        "cats": [
          {
            "id": 194,
            "first_form": "阿激拉",
            "third_form": "獄炎・阿激拉",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 195,
            "first_form": "西園寺機器子",
            "third_form": "航太博士Dr.機器子",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 196,
            "first_form": "貓俠大帝",
            "third_form": "雷霆貓俠",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 212,
            "first_form": "白兔女俠",
            "third_form": "灰狐女俠",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 226,
            "first_form": "咒術師死亡小丑",
            "third_form": "奇術科學者狂G",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 261,
            "first_form": "天誅飛隼",
            "third_form": "滅殺飛隼",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 431,
            "first_form": "亡者偵探吳仲力",
            "third_form": "魔神偵探吳仲力",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 533,
            "first_form": "狙擊天才沙紀",
            "third_form": "爆破天才沙紀",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 634,
            "first_form": "白騎士庫克洛普斯",
            "third_form": "神魔騎士庫克洛普斯",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 698,
            "first_form": "閃電傑克",
            "third_form": "電光傑克",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 774,
            "first_form": "特命交警阿酷賽爾",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "究極降臨巨神宙斯",
        "cats": [
          {
            "id": 257,
            "first_form": "天空神宙斯",
            "third_form": "G巨神宙斯",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 258,
            "first_form": "守護神阿努比斯",
            "third_form": "G無瑕神阿努比斯",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 259,
            "first_form": "美女神阿芙蘿黛蒂",
            "third_form": "G大女神美嘉蘿黛蒂",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 271,
            "first_form": "太陽神天照",
            "third_form": "G大御神天照",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 272,
            "first_form": "象頭神迦內薩",
            "third_form": "G睿智神迦內薩",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 316,
            "first_form": "海王神波塞頓",
            "third_form": "G海龍騎波塞頓",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 439,
            "first_form": "時空神克羅諾絲",
            "third_form": "G時空之鑰克羅諾絲",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 534,
            "first_form": "冥界神黑帝斯",
            "third_form": "G冥界之王黑帝斯",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 642,
            "first_form": "墮天神路西法",
            "third_form": "G崇高之神路西法",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 723,
            "first_form": "光翼神伊西絲",
            "third_form": "G美翼神伊西絲",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 811,
            "first_form": "護法神韋馱天",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "革命軍隊鋼鐵戰團",
        "cats": [
          {
            "id": 304,
            "first_form": "帝國陸軍・石砲隊",
            "third_form": "超擊滅戰車・陸王砲",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 305,
            "first_form": "古代軍船・戰槳隊",
            "third_form": "超無敵艦隊・海皇錐",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 306,
            "first_form": "飛空襲擊・轟炸隊",
            "third_form": "超飛行戰艦・空帝雷",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 355,
            "first_form": "觀測兵器・探天隊",
            "third_form": "超時空基地・星隕爆",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 417,
            "first_form": "溫泉天堂・浴場隊",
            "third_form": "超地底戰隊・土龍鑽",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 594,
            "first_form": "空中商店・探險家",
            "third_form": "超運送兵團・文明組",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 632,
            "first_form": "超龍戰機・毀滅團",
            "third_form": "超電磁戰機・殲滅團",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 674,
            "first_form": "周遊藝團・雜耍隊",
            "third_form": "超奇襲怪光・幽浮隊",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 715,
            "first_form": "建築兵團・運輸隊",
            "third_form": "超突擊部隊・卡車隊",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 799,
            "first_form": "曲射砲台・砲擊團",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "古靈精怪元素小精靈",
        "cats": [
          {
            "id": 359,
            "first_form": "火精靈梅拉",
            "third_form": "火焰精靈王猛火梅拉邦",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 360,
            "first_form": "水精靈密茲",
            "third_form": "流水精靈王激流密茲曼",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 361,
            "first_form": "風精靈艾爾",
            "third_form": "暴風精靈王艾爾方帝",
            "owned": true,
            "is_third": true,
            "fourth_path": "四階",
            "is_fourth": false
          },
          {
            "id": 401,
            "first_form": "雷精靈波特",
            "third_form": "天雷精靈王基加波特",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 569,
            "first_form": "石精靈滾瓦",
            "third_form": "岩石精靈王強韌伊瓦",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 631,
            "first_form": "闇精靈亞米",
            "third_form": "暗黑精靈王亞米諾瓦多",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 655,
            "first_form": "冰精靈布莉茲",
            "third_form": "冰結精靈王布莉莎雷娜",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 719,
            "first_form": "鐵精靈卡卿",
            "third_form": "鋼鐵精靈王鋼鐵卡卿",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 817,
            "first_form": "樹精靈小魔麗",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "絕命美少女怪物萌娘隊",
        "cats": [
          {
            "id": 334,
            "first_form": "俏狐娘百荷",
            "third_form": "豐穰的狐姬百荷",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 335,
            "first_form": "美人魚琉璃",
            "third_form": "龍宮人魚姬琉璃",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 336,
            "first_form": "木乃伊梨香",
            "third_form": "黃金法老姬梨香",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 357,
            "first_form": "狼來妹迪兒",
            "third_form": "小丑女狼迪兒",
            "owned": true,
            "is_third": true,
            "fourth_path": "超本",
            "is_fourth": false
          },
          {
            "id": 358,
            "first_form": "不死女薇薇",
            "third_form": "滿腹新嫁娘薇薇",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 607,
            "first_form": "冒險家佳奈",
            "third_form": "傳說的冒險少女佳奈",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 682,
            "first_form": "闇女神蓓卡",
            "third_form": "虛影加持闇女神蓓卡",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 725,
            "first_form": "忍者女孩多萌耶",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 824,
            "first_form": "魔導師希朵咪",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超級貓咪祭",
        "cats": [
          {
            "id": 269,
            "first_form": "幼獸加歐",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 318,
            "first_form": "巫女姬御靈",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 380,
            "first_form": "幼傑達太貓",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 529,
            "first_form": "災難少女凱斯莉",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 585,
            "first_form": "幼獸加爾",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 641,
            "first_form": "歡笑揮舞孃",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 690,
            "first_form": "命運之子佛諾",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 779,
            "first_form": "幼天女露娜",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 837,
            "first_form": "幼騎士路諾",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "特級貓咪祭",
        "cats": [
          {
            "id": 333,
            "first_form": "黑獸牙王",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 378,
            "first_form": "黑無垢御靈",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 441,
            "first_form": "影傑漆黑達太貓",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 543,
            "first_form": "禍根魔女凱斯莉",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 609,
            "first_form": "黑獸加迪",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 657,
            "first_form": "悲嘆揮舞孃",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 705,
            "first_form": "非命之王佛挪",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 787,
            "first_form": "冥佑天女露娜夏",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 859,
            "first_form": "孤月騎士路諾斯",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "女王祭",
        "cats": [
          {
            "id": 612,
            "first_form": "貓咪王女",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "福音戰士合作轉蛋",
        "cats": [
          {
            "id": 412,
            "first_form": "EVA零號機",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 413,
            "first_form": "EVA初號機",
            "third_form": "決意的EVA初號機&貓咪",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 415,
            "first_form": "真嗣貓",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 547,
            "first_form": "白夜姬零",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 549,
            "first_form": "第6使徒",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 550,
            "first_form": "第10使徒",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 814,
            "first_form": "EVA量產機",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 414,
            "first_form": "EVA2號機",
            "third_form": "EVA改2號機 Code 777",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 416,
            "first_form": "通訊聯絡機零月",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 487,
            "first_form": "EVA8號機",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 488,
            "first_form": "空中戰艦貓咪Wunder",
            "third_form": "弒神之船喵喵Wunder",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 548,
            "first_form": "第4使徒",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 551,
            "first_form": "第9使徒",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 709,
            "first_form": "獨眼少女明日香",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 710,
            "first_form": "EVA第13號機",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "鬼滅之刃",
        "cats": [
          {
            "id": 840,
            "first_form": "竈門炭治郎",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 841,
            "first_form": "竈門禰󠄀豆子",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 842,
            "first_form": "我妻善逸",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 843,
            "first_form": "嘴平伊之助",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 844,
            "first_form": "冨岡義勇",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 845,
            "first_form": "胡蝶忍",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          },
          {
            "id": 846,
            "first_form": "煉獄杏壽郎",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      }
    ]
  },
  "legend_rare": {
    "系列": [
      {
        "name": "傳說中的不明貓一族",
        "cats": [
          {
            "id": 461,
            "first_form": "奇幻貓",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超激烈爆彈",
        "cats": [
          {
            "id": 455,
            "first_form": "花漾桃子",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "戰國武神巴薩拉斯",
        "cats": [
          {
            "id": 448,
            "first_form": "宮本武藏",
            "third_form": "無雙劍神・宮本武藏",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "電腦學園銀河美少女",
        "cats": [
          {
            "id": 449,
            "first_form": "聖女貓會長貞德",
            "third_form": "神聖女貓會長貞德ψ",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超破壞大帝龍皇因佩拉斯",
        "cats": [
          {
            "id": 450,
            "first_form": "天龍城巴比貓塔",
            "third_form": "天魔城龍巴比貓塔",
            "owned": true,
            "is_third": true,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超古代勇者超級靈魂勇者",
        "cats": [
          {
            "id": 451,
            "first_form": "貓若丸",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "逆襲的戰士黑暗英雄",
        "cats": [
          {
            "id": 481,
            "first_form": "超越科學者天域博士",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "究極降臨巨神宙斯",
        "cats": [
          {
            "id": 493,
            "first_form": "大地女神蓋婭",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "革命軍隊鋼鐵戰團",
        "cats": [
          {
            "id": 463,
            "first_form": "終末兵器・異滅堂",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "古靈精怪元素小精靈",
        "cats": [
          {
            "id": 478,
            "first_form": "奇幻精靈露米納",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "絕命美少女怪物萌娘隊",
        "cats": [
          {
            "id": 544,
            "first_form": "京坂七穗",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超級貓咪祭",
        "cats": [
          {
            "id": 731,
            "first_form": "曉之伊邪那岐",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "特級貓咪祭",
        "cats": [
          {
            "id": 738,
            "first_form": "宵之伊邪那美",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "超國王祭",
        "cats": [
          {
            "id": 586,
            "first_form": "貓咪王子",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      },
      {
        "name": "福音戰士合作轉蛋",
        "cats": [
          {
            "id": 815,
            "first_form": "月影少年薰",
            "third_form": null,
            "owned": true,
            "is_third": false,
            "fourth_path": null,
            "is_fourth": false
          }
        ]
      }
    ]
  }
}
```
