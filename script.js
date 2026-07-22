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
    function getPreviewImageUrl(catId, thirdForm, fourthPath) {
        let version = 1;
        if (fourthPath === "四階") {
            version = 3;
        } else if (thirdForm !== null) {
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
    function buildOwnedCardHtml(cat) {
        let statusText = "";
        let backgroundClass = "";
        let textColorClass = "";

        if (!cat.fourth_path && !cat.is_fourth) {
            statusText = "無lv60強化";
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
        return `
            <div class="cat-card" title="${escapeHtml(tooltipText)}">
                <img src="${imgUrl}" alt="${escapeHtml(tooltipText)}" class="cat-img" loading="lazy" onerror="this.src='https://via.placeholder.com/100x100?text=Error'">
                <div class="status ${textColorClass} ${backgroundClass}">${escapeHtml(statusText)}</div>
            </div>
        `;
    }

    function buildUnownedCardHtml(cat) {
        const imgUrl = getPreviewImageUrl(cat.id, cat.third_form, cat.fourth_path);
        const tooltipText = `${cat.first_form} (ID: ${cat.id}) · 未擁有`;
        return `
            <div class="cat-card unowned-card" title="${escapeHtml(tooltipText)}">
                <img src="${imgUrl}" alt="${escapeHtml(tooltipText)}" class="cat-img" loading="lazy" onerror="this.src='https://via.placeholder.com/100x100?text=Error'">
                <div class="status unowned">未擁有</div>
            </div>
        `;
    }

    function buildGridFromSeries(seriesArray, warningCollector) {
        let allCardsHtml = '';
        for (let series of seriesArray) {
            if (!series.cats || !Array.isArray(series.cats)) {
                if (warningCollector) warningCollector(`系列「${series.name}」的 cats 不是陣列，跳過`);
                continue;
            }
            // 已擁有優先排前，未擁有跟尾
            const sortedCats = [...series.cats].sort((a, b) => {
                if (a.owned === b.owned) return 0;
                return a.owned ? -1 : 1;
            });
            for (let cat of sortedCats) {
                allCardsHtml += cat.owned === true ? buildOwnedCardHtml(cat) : buildUnownedCardHtml(cat);
            }
        }
        return allCardsHtml;
    }
    function matchesFilters(cat, rarityOfCat) {
        if (!showUnowned && cat.owned !== true) return false;

        const rarityVal = filterRarity.value;
        if (rarityVal !== 'all' && rarityVal !== rarityOfCat) return false;

        const fourthVal = filterFourth.value;
        if (fourthVal !== 'all') {
            const hasPath = !!cat.fourth_path;
            if (fourthVal === 'fourth' && !(hasPath && cat.is_fourth === true)) return false;
            if (fourthVal === 'notFourth' && !(hasPath && cat.is_fourth === false)) return false;
            if (fourthVal === 'na' && hasPath) return false;
        }

        const thirdVal = filterThird.value;
        if (thirdVal !== 'all') {
            const hasThirdForm = cat.third_form !== null;
            if (thirdVal === 'third' && !(hasThirdForm && cat.is_third === true)) return false;
            if (thirdVal === 'notThird' && !(hasThirdForm && cat.is_third === false)) return false;
            if (thirdVal === 'noThird' && hasThirdForm) return false;
        }

        const seriesVal = filterSeries.value;
        // seriesVal 喺外層(getFilteredSeriesArrays)已經處理緊，呢度唔使再check

        return true;
    }
    function getFilteredSeriesArrays(result) {
        const seriesVal = filterSeries.value; // 'all' 或 純系列名
        const superSeriesRaw = result.super_rare?.系列 || [];
        const legendSeriesRaw = result.legend_rare?.系列 || [];

        function filterOne(seriesArr, rarityLabel) {
            const out = [];
            for (let s of seriesArr) {
                if (seriesVal !== 'all' && s.name !== seriesVal) continue;
                if (!s.cats || !Array.isArray(s.cats)) continue;
                const filteredCats = s.cats.filter(c => matchesFilters(c, rarityLabel));
                if (filteredCats.length > 0) {
                    out.push({ name: s.name, cats: filteredCats });
                }
            }
            return out;
        }

        return {
            superSeries: filterOne(superSeriesRaw, 'super'),
            legendSeries: filterOne(legendSeriesRaw, 'legend')
        };
    }
    function getSeriesForProgress(result) {
        const seriesVal = filterSeries.value; // 'all' 或 純系列名
        const rarityVal = filterRarity.value; // 'all' / 'super' / 'legend'
        const superSeriesRaw = result.super_rare?.系列 || [];

        if (rarityVal === 'legend') return [];

        const out = [];
        for (let s of superSeriesRaw) {
            if (seriesVal !== 'all' && s.name !== seriesVal) continue;
            if (!s.cats || !Array.isArray(s.cats)) continue;
            out.push(s);
        }
        return out;
    }
    function populateSeriesFilter(result) {
        const superSeries = result.super_rare?.系列 || [];
        const legendSeries = result.legend_rare?.系列 || [];

        const currentVal = filterSeries.value;
        filterSeries.innerHTML = '<option value="all">全部系列</option>';

        // 去重：用 Set 收集所有唯一系列名（超激+傳說混合）
        const allNames = new Set([
            ...superSeries.map(s => s.name),
            ...legendSeries.map(s => s.name)
        ]);

        for (let name of allNames) {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            filterSeries.appendChild(opt);
        }

        const stillExists = Array.from(filterSeries.options).some(o => o.value === currentVal);
        filterSeries.value = stillExists ? currentVal : 'all';
    }
    function renderGridFromResult(result, addWarningMsg) {
        const stats = computeStatistics(result);
        renderStatistics(stats);
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

        populateSeriesFilter(result);
        renderFilteredGrid();
    }

    function renderFilteredGrid() {
        if (!lastResult) return;

        const { superSeries, legendSeries } = getFilteredSeriesArrays(lastResult);

        const progressSeries = getSeriesForProgress(lastResult);
        renderSeriesProgress(progressSeries);

        const superCards = buildGridFromSeries(superSeries, null);
        const legendCards = buildGridFromSeries(legendSeries, null);

        let fullHtml = '';
        if (superCards) {
            fullHtml += `<div class="section-header">🐾 超激稀有</div>`;
            fullHtml += `<div class="cat-grid">${superCards}</div>`;
        } else {
            fullHtml += `<div class="section-header">🐾 超激稀有</div><div class="empty-tip">無符合條件的超激貓</div>`;
        }
        if (legendCards) {
            fullHtml += `<div class="section-header">🌟 傳說稀有</div>`;
            fullHtml += `<div class="cat-grid">${legendCards}</div>`;
        } else {
            fullHtml += `<div class="section-header">🌟 傳說稀有</div><div class="empty-tip">無符合條件的傳稀貓</div>`;
        }
        if (!superCards && !legendCards) {
            fullHtml = '<div class="empty-tip">😿 沒有符合條件的貓咪，試調整篩選條件</div>';
        }
        document.getElementById('gridOutput').innerHTML = fullHtml;
    }
    function toggleShowUnowned() {
        showUnowned = !showUnowned;
        if (showUnowned) {
            filterFourth.value = 'all';
            filterThird.value = 'all';
            filterFourth.disabled = true;
            filterThird.disabled = true;
            showUnownedBtn.textContent = '🙈 隱藏未擁有';
        } else {
            filterFourth.disabled = false;
            filterThird.disabled = false;
            showUnownedBtn.textContent = '👀 顯示未擁有';
        }
        renderFilteredGrid();
    }

    function handleSeriesFilterChange() {
        showUnowned = false;
        filterFourth.disabled = false;
        filterThird.disabled = false;
        showUnownedBtn.textContent = '👀 顯示未擁有';
        showUnownedWrap.style.display = (filterSeries.value !== '') ? 'flex' : 'none';
        renderFilteredGrid();
    }
    function renderSeriesProgress(superSeries) {
        const section = document.getElementById('seriesProgressSection');
        const listEl = document.getElementById('seriesProgressList');

        if (!superSeries || superSeries.length === 0) {
            section.style.display = 'none';
            listEl.innerHTML = '';
            return;
        }

        let html = '';
        for (let s of superSeries) {
            if (!s.cats || s.cats.length === 0) continue;
            const total = s.cats.length;
            const ownedCount = s.cats.filter(c => c.owned === true).length;
            const rate = total === 0 ? 0 : (ownedCount / total) * 100;
            const roundedRate = Math.round(rate * 10) / 10;

            let rateClass = 'rate-low';
            if (roundedRate === 100) rateClass = 'rate-complete';
            else if (roundedRate >= 60) rateClass = 'rate-high';
            else if (roundedRate >= 25) rateClass = 'rate-mid';

            html += `
                <div class="series-progress">
                    <span class="series-name" title="${escapeHtml(s.name)}">${escapeHtml(s.name)}</span>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill ${rateClass}" style="width: ${roundedRate}%;"></div>
                    </div>
                    <span class="series-progress-text">${ownedCount}/${total} (${roundedRate}%)</span>
                </div>
            `;
        }

        if (!html) {
            section.style.display = 'none';
            listEl.innerHTML = '';
            return;
        }

        listEl.innerHTML = html;
        section.style.display = 'block';
    }
    function computeGroupStats(seriesArr) {
        let fourthCount = 0, notFourthCount = 0, thirdCount = 0, notThirdCount = 0;
        for (let s of seriesArr) {
            if (!s.cats || !Array.isArray(s.cats)) continue;
            for (let cat of s.cats) {
                if (cat.owned !== true) continue;

                // 四階/超本統計 (排除「無lv60強化」)
                if (cat.fourth_path) {
                    if (cat.is_fourth === true) fourthCount++;
                    else notFourthCount++;
                }

                // 三階統計 (排除「暫無三階」)
                if (cat.third_form !== null) {
                    if (cat.is_third === true) thirdCount++;
                    else notThirdCount++;
                }
            }
        }
        const fourthRate = (fourthCount + notFourthCount) === 0 ? 0 : (fourthCount / (fourthCount + notFourthCount)) * 100;
        const thirdRate = (thirdCount + notThirdCount) === 0 ? 0 : (thirdCount / (thirdCount + notThirdCount)) * 100;
        return {
            fourthCount, notFourthCount, thirdCount, notThirdCount,
            fourthRate: Math.round(fourthRate * 10) / 10,
            thirdRate: Math.round(thirdRate * 10) / 10
        };
    }

    function computeStatistics(result) {
        const superSeries = result.super_rare?.系列 || [];
        const legendSeries = result.legend_rare?.系列 || [];
        return {
            super_rare: computeGroupStats(superSeries),
            legend_rare: computeGroupStats(legendSeries)
        };
    }

    function renderStatistics(stats) {
        document.getElementById('superFourthCount').textContent = stats.super_rare.fourthCount;
        document.getElementById('superNotFourthCount').textContent = stats.super_rare.notFourthCount;
        document.getElementById('superThirdCount').textContent = stats.super_rare.thirdCount;
        document.getElementById('superNotThirdCount').textContent = stats.super_rare.notThirdCount;
        document.getElementById('superFourthRate').textContent = stats.super_rare.fourthRate + '%';
        document.getElementById('superThirdRate').textContent = stats.super_rare.thirdRate + '%';

        document.getElementById('legendFourthCount').textContent = stats.legend_rare.fourthCount;
        document.getElementById('legendNotFourthCount').textContent = stats.legend_rare.notFourthCount;
        document.getElementById('legendThirdCount').textContent = stats.legend_rare.thirdCount;
        document.getElementById('legendNotThirdCount').textContent = stats.legend_rare.notThirdCount;
        document.getElementById('legendFourthRate').textContent = stats.legend_rare.fourthRate + '%';
        document.getElementById('legendThirdRate').textContent = stats.legend_rare.thirdRate + '%';

        statsCard.style.display = 'block';
    }

    let templateTextContent = null;
    let templateJsonContent = null;

    (async function preloadTemplates() {
        try {
            const res = await fetch('./template/template.txt');
            if (res.ok) templateTextContent = await res.text();
        } catch (e) {
            console.warn('預載 template.txt 失敗', e);
        }
        try {
            const res = await fetch('./template/template.json');
            if (res.ok) templateJsonContent = await res.text();
        } catch (e) {
            console.warn('預載 template.json 失敗', e);
        }

        // 載入完成後啟用按鈕
        if (copyttBtn) copyttBtn.disabled = false;
        if (copytjBtn) copytjBtn.disabled = false;
    })();
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
    const clearStorageBtn = document.getElementById('clearStorageBtn');
    const autoLoadTip = document.getElementById('autoLoadTip');
    const statsCard = document.getElementById('statsCard');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const filterRarity = document.getElementById('filterRarity');
    const filterFourth = document.getElementById('filterFourth');
    const filterThird = document.getElementById('filterThird');
    const filterSeries = document.getElementById('filterSeries');
    const exportImgBtn = document.getElementById('exportImgBtn');
    const showUnownedWrap = document.getElementById('showUnownedWrap');
    const showUnownedBtn = document.getElementById('showUnownedBtn');

    copyttBtn.disabled = true;
    copytjBtn.disabled = true;
    
    let lastResult = null;
    let showUnowned = false;
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
            saveToLocalStorage(rawText, lastResult);
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
            saveToLocalStorage(rawText, lastResult);

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
    async function exportImage() {
        const target = document.getElementById('gridOutput');
        if (!lastResult) {
            alert('未有資料，請先解析。');
            return;
        }
    
        const originalText = exportImgBtn.textContent;
        exportImgBtn.textContent = '⏳ 匯出中...';
        exportImgBtn.disabled = true;
    
        try {
            // ✅ 強制所有懶載入圖片立刻開始下載
            const allImages = target.querySelectorAll('img');
            allImages.forEach(img => {
                if (img.loading === 'lazy') {
                    img.loading = 'eager';   // 或 img.removeAttribute('loading')
                }
            });
    
            // ✅ 等待全部圖片載入完成（包含失敗的）
            const loadPromises = Array.from(allImages).map(img => {
                if (img.complete) {
                    return Promise.resolve();
                }
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;   // 即使載入失敗也要繼續
                });
            });
            await Promise.all(loadPromises);
    
            // 再擷取畫面
            const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-card').trim();
            const canvas = await html2canvas(target, {
                useCORS: true,
                backgroundColor: bgColor || null,
                scale: 2
            });
    
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert('❌ 匯出失敗，請改用瀏覽器截圖功能');
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const dateStr = formatDateTime(new Date()).replace(/[: ]/g, '-');
                a.download = `cat_collection_${dateStr}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/png');
        } catch (err) {
            console.error('匯出圖片失敗', err);
            alert('❌ 匯出圖片失敗，部分貓咪圖片可能無法讀取。\n可改用瀏覽器截圖功能：\nWindows: Win+Shift+S\nMac: Cmd+Shift+4');
        } finally {
            exportImgBtn.textContent = originalText;
            exportImgBtn.disabled = false;
        }
    }
    function clearAll() {
        textarea.value = '';
        document.getElementById('gridOutput').innerHTML = '<div class="empty-tip">等待解析資料...</div>';
        warningArea.style.display = 'none';
        warningMessages = [];
        lastResult = null;
        statsCard.style.display = 'none'; 
        document.getElementById('seriesProgressSection').style.display = 'none'; 
        document.getElementById('seriesProgressList').innerHTML = '';         
        filterRarity.value = 'all';     
        filterFourth.value = 'all'; 
        filterThird.value = 'all';     
        filterSeries.innerHTML = '<option value="all">全部系列</option>';
        showUnowned = false;
        filterFourth.disabled = false;
        filterThird.disabled = false;
        showUnownedBtn.textContent = '👀 顯示未擁有';
        showUnownedWrap.style.display = 'none';
    }   
    const STORAGE_KEY_RAW = 'catData_rawInput';
    const STORAGE_KEY_RESULT = 'catData_lastResult';
    const STORAGE_KEY_TIME = 'catData_savedAt';

    function saveToLocalStorage(rawText, result) {
        try {
            const now = new Date();
            const timeStr = formatDateTime(now);
            localStorage.setItem(STORAGE_KEY_RAW, rawText);
            localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result));
            localStorage.setItem(STORAGE_KEY_TIME, timeStr);
        } catch (e) {
            console.warn('localStorage 儲存失敗', e);
        }
    }

    function formatDateTime(date) {
        const pad = n => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function loadFromLocalStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_RAW);
            const resultStr = localStorage.getItem(STORAGE_KEY_RESULT);
            const time = localStorage.getItem(STORAGE_KEY_TIME);
            if (!raw || !resultStr) return false;

            textarea.value = raw;
            lastResult = JSON.parse(resultStr);
            renderGridFromResult(lastResult, addWarning);
            showWarnings();

            document.getElementById('autoLoadTipText').textContent = `📂 已自動載入上次解析資料（${time}）`;
            autoLoadTip.style.display = 'flex';
            return true;
        } catch (e) {
            console.warn('localStorage 讀取失敗', e);
            return false;
        }
    }
    const STORAGE_KEY_THEME = 'catData_theme';

    function applyTheme(theme) {
        document.body.dataset.theme = theme;
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    function initTheme() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_THEME);
            if (saved === 'light' || saved === 'dark') {
                applyTheme(saved);
                return;
            }
        } catch (e) {
            console.warn('讀取主題設定失敗', e);
        }
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    function toggleTheme() {
        const current = document.body.dataset.theme;
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
            localStorage.setItem(STORAGE_KEY_THEME, next);
        } catch (e) {
            console.warn('儲存主題設定失敗', e);
        }
    }
    function clearStorage() {
        try {
            localStorage.removeItem(STORAGE_KEY_RAW);
            localStorage.removeItem(STORAGE_KEY_RESULT);
            localStorage.removeItem(STORAGE_KEY_TIME);
            alert('✅ 已清除本機儲存記錄');
        } catch (e) {
            alert('❌ 清除失敗');
        }
    }
    async function copytt() {
        if (!templateTextContent) {
            alert('範例尚未載入，請稍後再試');
            return;
        }
        try {
            await navigator.clipboard.writeText(templateTextContent);
            alert('✅ 完整範例輸入已複製到剪貼簿');
        } catch (error) {
            console.error(error);
            alert('❌ 複製失敗');
        }
    }

    async function copytj() {
        if (!templateJsonContent) {
            alert('範例尚未載入，請稍後再試');
            return;
        }
        try {
            await navigator.clipboard.writeText(templateJsonContent);
            alert('✅ 完整範例 JSON 已複製到剪貼簿');
        } catch (error) {
            console.error(error);
            alert('❌ 複製失敗');
        }
    }

    parseBtn.addEventListener('click', performParse);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyJson);
    document.getElementById('downloadBtn').addEventListener('click', downloadJson);
    copyttBtn.addEventListener('click',copytt);
    copytjBtn.addEventListener('click',copytj);
    clearStorageBtn.addEventListener('click', clearStorage);
    clearStorageBtn.addEventListener('click', clearStorage);
    themeToggleBtn.addEventListener('click', toggleTheme);
    filterSeries.addEventListener('change', handleSeriesFilterChange);
    showUnownedBtn.addEventListener('click', toggleShowUnowned);
    filterFourth.addEventListener('change', renderFilteredGrid);
    filterThird.addEventListener('change', renderFilteredGrid);
    filterSeries.addEventListener('change', renderFilteredGrid);
    exportImgBtn.addEventListener('click', exportImage);
    document.getElementById('autoLoadTipClose').addEventListener('click', () => {autoLoadTip.style.display = 'none';});
    initTheme();
    loadFromLocalStorage();
})();
