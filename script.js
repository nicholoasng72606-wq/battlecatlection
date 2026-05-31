(function() {
    // ---------- 圖片網址規則 (根據四階/三階狀態) ----------
    function getCatImageUrl(catId, isThird, isFourth, fourthPath) {
        let version = 1;
        if (fourthPath === "四階" && isFourth === true) {
            version = 3;
        } 
        else if (isThird === true) {
            version = 2;
        }
        return `https://battlecatsinfo.github.io/img/u/${catId}/${version}.png`;
    }

    // ---------- 輔助函數：解析四階/超本字串 ----------
    function parseFourthStatus(raw) {
        if (!raw || raw === "暫無四階/超本" || raw === "") {
            return { is_fourth: false, fourth_path: null };
        }
        const match = raw.match(/(已|是|未|否)?\s*(四階|超本)?/);
        let status = null;
        let path = null;
        if (match) {
            status = match[1];
            path = match[2];
        }
        let isFourth = false;
        if (status === "已" || status === "是") {
            isFourth = true;
        } else if (status === "未" || status === "否") {
            isFourth = false;
        } else {
            if (raw.includes("四階") || raw.includes("超本")) {
                if (!raw.includes("未") && !raw.includes("否")) {
                    isFourth = true;
                }
            }
        }
        const fourthPath = path ? path : null;
        return { is_fourth: isFourth, fourth_path: fourthPath };
    }

    // ---------- 解析系列資料 (文字版) ----------
    function parseSeriesData(lines) {
        const seriesList = [];
        for (let rawLine of lines) {
            let line = rawLine.trim();
            if (line === "") continue;

            let seriesName = null;
            let catsStr = null;
            if (line.includes(": ")) {
                const idx = line.indexOf(": ");
                seriesName = line.substring(0, idx).trim();
                catsStr = line.substring(idx + 2).trim();
            } else if (line.includes("：")) {
                const idx = line.indexOf("：");
                seriesName = line.substring(0, idx).trim();
                catsStr = line.substring(idx + 1).trim();
            } else {
                continue;
            }

            if (!seriesName || !catsStr) continue;

            const entries = catsStr.split(/\s*[，,]\s*/);
            const cats = [];

            for (let entry of entries) {
                if (!entry.trim()) continue;
                let parts = entry.split("；").map(p => p.trim());
                if (parts.length === 0) continue;

                let catId = parseInt(parts[0], 10);
                if (isNaN(catId)) {
                    console.warn(`⚠️ 無效的 ID：${parts[0]}，跳過此條目`);
                    continue;
                }

                if (parts.length === 4 && parts[2] === "暫無三階") {
                    cats.push({
                        id: catId,
                        first_form: parts[1],
                        third_form: null,
                        owned: parts[3] === "已擁有",
                        is_third: false,
                        fourth_path: null,
                        is_fourth: false
                    });
                    continue;
                }

                if (parts.length >= 6) {
                    const owned = (parts[3] === "已擁有");
                    const isThird = (parts[4] === "已三階");
                    const { is_fourth, fourth_path } = parseFourthStatus(parts[5]);
                    cats.push({
                        id: catId,
                        first_form: parts[1],
                        third_form: parts[2],
                        owned: owned,
                        is_third: isThird,
                        fourth_path: fourth_path,
                        is_fourth: is_fourth
                    });
                    continue;
                }

                console.warn(`⚠️ 跳過無法解析的條目：${entry}`);
            }

            if (cats.length > 0) {
                seriesList.push({ name: seriesName, cats: cats });
            }
        }
        return seriesList;
    }

    // 主解析函數 (文字版)
    function parseFullText(fullText) {
        const allLines = fullText.split(/\r?\n/);
        const effectiveLines = [];
        let emptyStreak = 0;
        for (let line of allLines) {
            const trimmed = line.trim();
            if (trimmed === "") {
                emptyStreak++;
                if (emptyStreak >= 2) break;
            } else {
                emptyStreak = 0;
            }
            effectiveLines.push(line);
            if (emptyStreak >= 2) break;
        }

        let superLines = [], legendLines = [];
        let mode = null;
        for (let line of effectiveLines) {
            if (line.includes("我的超激")) { mode = "super"; continue; }
            if (line.includes("我的傳稀")) { mode = "legend"; continue; }
            if (line.includes("不重複率")) { mode = "ignore"; continue; }
            if (mode === "ignore") continue;
            if (mode === "super") superLines.push(line);
            else if (mode === "legend") legendLines.push(line);
        }

        const superSeries = parseSeriesData(superLines);
        const legendSeries = parseSeriesData(legendLines);

        const superRates = {};
        for (let s of superSeries) {
            const total = s.cats.length;
            const ownedCount = s.cats.filter(c => c.owned).length;
            const rate = total === 0 ? 0 : ((total - ownedCount) / total) * 100;
            superRates[s.name] = Math.round(rate * 100) / 100;
        }

        return {
            super_rare: { 不重複率: superRates, 系列: superSeries },
            legend_rare: { 系列: legendSeries }
        };
    }

    // ---------- 嘗試解析 JSON 輸入 ----------
    function tryParseAsJson(inputText) {
        try {
            const parsed = JSON.parse(inputText);
            if (parsed && typeof parsed === 'object') {
                const hasSuperSeries = parsed.super_rare && Array.isArray(parsed.super_rare.系列);
                const hasLegendSeries = parsed.legend_rare && Array.isArray(parsed.legend_rare.系列);
                if (hasSuperSeries || hasLegendSeries) {
                    return { success: true, data: parsed };
                }
            }
            return { success: false, reason: 'JSON 結構不符合貓咪資料格式' };
        } catch (e) {
            return { success: false, reason: e.message };
        }
    }

    // 產生網格 HTML (增強錯誤處理)
    function buildGridFromSeries(seriesArray, warningCollector) {
        let allCardsHtml = '';
        for (let series of seriesArray) {
            // 確保 series.cats 是陣列
            if (!series.cats || !Array.isArray(series.cats)) {
                if (warningCollector) warningCollector(`系列「${series.name}」的 cats 不是陣列，跳過`);
                continue;
            }
            const ownedCats = series.cats.filter(cat => cat.owned === true);
            for (let cat of ownedCats) {
                let statusText = "";
                let backgroundClass = "";
                let textColorClass = "";

                if (!cat.fourth_path && !cat.is_fourth) {
                    statusText = "暫無四階/超本";
                    backgroundClass = "na-bg";
                    textColorClass = "na";
                } else {
                    const prefix = cat.is_fourth ? "已" : "未";
                    const suffix = cat.fourth_path === "四階" ? "四階" : (cat.fourth_path === "超本" ? "超本" : "");
                    statusText = prefix + suffix;
                    textColorClass = cat.is_fourth ? "owned-text" : "not-owned-text";
                    if (cat.fourth_path === "超本") {
                        backgroundClass = "super";
                    } else if (cat.fourth_path === "四階") {
                        backgroundClass = "fourth";
                    } else {
                        backgroundClass = "na-bg";
                    }
                }

                const imgUrl = getCatImageUrl(cat.id, cat.is_third, cat.is_fourth, cat.fourth_path);
                const tooltipText = `${cat.first_form} (ID: ${cat.id})${cat.is_third ? ' · 已三階' : ' · 未三階'}`;
                allCardsHtml += `
                    <div class="cat-card" title="${escapeHtml(tooltipText)}">
                        <img src="${imgUrl}" alt="${escapeHtml(tooltipText)}" class="cat-img" loading="lazy" onerror="this.src='https://via.placeholder.com/100x100?text=Error'">
                        <div class="status ${textColorClass} ${backgroundClass}">${escapeHtml(statusText)}</div>
                    </div>
                `;
            }
        }
        return allCardsHtml;
    }

    function renderGridFromResult(result, addWarningMsg) {
        const superSeries = result.super_rare?.系列 || [];
        const legendSeries = result.legend_rare?.系列 || [];
        
        // 統計 owned 數量 (僅供除錯)
        let totalOwned = 0;
        const countOwned = (seriesArr) => {
            for (let s of seriesArr) {
                if (s.cats && Array.isArray(s.cats)) {
                    totalOwned += s.cats.filter(c => c.owned === true).length;
                }
            }
        };
        countOwned(superSeries);
        countOwned(legendSeries);
        if (addWarningMsg && totalOwned > 0) {
            addWarningMsg(`✅ 解析到 ${totalOwned} 隻已擁有的貓咪，正在顯示...`);
        } else if (addWarningMsg && totalOwned === 0) {
            addWarningMsg(`⚠️ 未找到任何 owned: true 的貓咪，請確認 JSON 中的 owned 欄位為 true (布林值)`);
        }

        const superCards = buildGridFromSeries(superSeries, addWarningMsg);
        const legendCards = buildGridFromSeries(legendSeries, addWarningMsg);

        let fullHtml = '';
        if (superCards) {
            fullHtml += `<div class="section-header">🐾 超激稀有</div>`;
            fullHtml += `<div class="cat-grid">${superCards}</div>`;
        } else {
            fullHtml += `<div class="section-header">🐾 超激稀有</div><div class="empty-tip">無已擁有的超激貓</div>`;
        }
        if (legendCards) {
            fullHtml += `<div class="section-header">🌟 傳說稀有</div>`;
            fullHtml += `<div class="cat-grid">${legendCards}</div>`;
        } else {
            fullHtml += `<div class="section-header">🌟 傳說稀有</div><div class="empty-tip">無已擁有的傳稀貓</div>`;
        }
        if (!superCards && !legendCards) {
            fullHtml = '<div class="empty-tip">✨ 沒有任何已擁有的貓咪</div>';
        }
        document.getElementById('gridOutput').innerHTML = fullHtml;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // UI 元素
    const textarea = document.getElementById('rawData');
    const parseBtn = document.getElementById('parseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const warningArea = document.getElementById('warningArea');
    const copyttBtn = document.getElementById('copyttBtn');
    const copytjBtn = document.getElementById('copytjBtn');

    let lastResult = null;
    let warningMessages = [];

    function addWarning(msg) {
        warningMessages.push(msg);
        console.warn(msg);
    }

    function resetWarnings() {
        warningMessages = [];
        warningArea.style.display = 'none';
        warningArea.innerHTML = '';
    }

    function showWarnings() {
        if (warningMessages.length === 0) {
            warningArea.style.display = 'none';
            return;
        }
        warningArea.style.display = 'block';
        warningArea.innerHTML = `<strong>⚠️ 解析訊息</strong><br>${warningMessages.map(m => `• ${m}`).join('<br>')}`;
    }

    function performParse() {
        resetWarnings();
        const rawText = textarea.value;
        if (!rawText.trim()) {
            document.getElementById('gridOutput').innerHTML = '<div class="empty-tip">⚠️ 請在輸入區貼上貓咪資料 (JSON格式 或 包含「我的超激」「我的傳稀」的文字格式)</div>';
            lastResult = null;
            return;
        }

        // 先嘗試當作 JSON 解析
        const jsonResult = tryParseAsJson(rawText);
        if (jsonResult.success) {
            lastResult = jsonResult.data;
            // 傳入 addWarning 函數，以便在 render 時顯示統計
            renderGridFromResult(lastResult, addWarning);
            showWarnings();
            return;
        }

        // 不是有效 JSON，使用原文字解析流程
        try {
            const originalWarn = console.warn;
            console.warn = function(...args) {
                addWarning(args.join(' '));
                originalWarn.apply(console, args);
            };

            const result = parseFullText(rawText);
            console.warn = originalWarn;
            lastResult = result;

            renderGridFromResult(result, addWarning);
            showWarnings();

            if ((result.super_rare.系列.length === 0 && result.legend_rare.系列.length === 0)) {
                addWarning('未解析到任何系列，請檢查格式是否包含「我的超激」與「我的傳稀」，且系列名稱後需有「:」或「：」');
                showWarnings();
            }
        } catch (err) {
            console.error(err);
            document.getElementById('gridOutput').innerHTML = `<div class="empty-tip">❌ 解析錯誤: ${escapeHtml(err.message)}<br>請檢查資料格式（JSON 或 標準文字格式）。</div>`;
            lastResult = null;
            warningArea.style.display = 'block';
            warningArea.innerHTML = `<strong>❌ 嚴重錯誤</strong><br>${escapeHtml(err.message)}`;
        }
    }

    function copyJson() {
        if (!lastResult) {
            alert('沒有可複製的 JSON 結果，請先解析資料。');
            return;
        }
        const jsonStr = JSON.stringify(lastResult, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
            alert('✅ 完整 JSON 資料已複製到剪貼簿');
        }).catch(() => {
            alert('❌ 複製失敗，可手動選取複製');
        });
    }

    function downloadJson() {
        if (!lastResult) {
            alert('沒有可下載的 JSON 結果，請先解析資料。');
            return;
        }
        const jsonStr = JSON.stringify(lastResult, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cat_data_${new Date().toISOString().slice(0,19)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function clearAll() {
        textarea.value = '';
        document.getElementById('gridOutput').innerHTML = '<div class="empty-tip">等待解析資料...</div>';
        warningArea.style.display = 'none';
        warningMessages = [];
        lastResult = null;
    }

    async function copytt() {
        try {
            const response = await fetch('./template/template.txt');
            
            if (!response.ok) {
                throw new Error('文件讀取失敗');
            }
            
            const tt = await response.text(); // 獲取文本內容
            await navigator.clipboard.writeText(tt);
            alert('✅ 完整範例輸入已複製到剪貼簿');
        } catch (error) {
            console.error(error);
            alert('❌ 複製失敗或檔案不存在');
        }
    }

    async function copytj() {
        try {
            const response = await fetch('./template/template.json');
            
            if (!response.ok) {
                throw new Error('文件讀取失敗');
            }
            
            const tt = await response.text(); // 獲取文本內容
            await navigator.clipboard.writeText(tt);
            alert('✅ 完整範例輸入已複製到剪貼簿');
        } catch (error) {
            console.error(error);
            alert('❌ 複製失敗或檔案不存在');
        }
    }

    parseBtn.addEventListener('click', performParse);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyJson);
    document.getElementById('downloadBtn').addEventListener('click', downloadJson);
    copyttBtn.addEventListener('click',copytt);
    copytjBtn.addEventListener('click',copytj);
})();
