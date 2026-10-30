const searchInput = document.querySelector("#tool-search");
const cards = Array.from(document.querySelectorAll(".software-card"));
const categoryButtons = Array.from(document.querySelectorAll(".category-button"));
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const catalogSection = document.querySelector("#catalog-section");
const toolWorkspace = document.querySelector("#tool-workspace");
const backToToolsButton = document.querySelector("#back-to-tools");
const searchBox = searchInput.closest(".search-box");
const toolMeta = document.querySelector("#tool-meta");
let activeCategory = "all";
let activeToolPanel = null;

const showToolPanel = (panel) => {
    toolWorkspace.hidden = false;
    catalogSection.hidden = true;
    searchBox.hidden = true;
    toolMeta.hidden = true;
    document.querySelectorAll(".tool-panel").forEach((toolPanel) => {
        toolPanel.hidden = toolPanel !== panel;
    });
    activeToolPanel = panel;
    backToToolsButton.textContent = panel.classList.contains("network-tool")
        ? "← 返回网络工具合集"
        : "← 返回工具列表";
    panel.querySelector("h2").focus();
};

const updateToolResults = () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
        const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
        const searchText = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase();
        const isVisible = matchesCategory && (!query || searchText.includes(query));
        card.hidden = !isVisible;
        visibleCount += isVisible ? 1 : 0;
    });

    resultsCount.textContent = `显示 ${visibleCount} 款工具`;
    emptyState.hidden = visibleCount > 0;
};

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        categoryButtons.forEach((categoryButton) => {
            const isActive = categoryButton === button;
            categoryButton.classList.toggle("active", isActive);
            categoryButton.setAttribute("aria-pressed", String(isActive));
        });
        updateToolResults();
    });
});

searchInput.addEventListener("input", updateToolResults);

document.querySelectorAll(".tool-launch").forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTool = document.querySelector(`#${button.dataset.tool}-tool`);
        if (!selectedTool) return;

        showToolPanel(selectedTool);
        if (button.dataset.tool === "network-hub") {
            refreshMyIpAddresses();
        }
    });
});

document.querySelectorAll(".network-subtool-card").forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTool = document.querySelector(`#${button.dataset.networkTool}-tool`);
        if (selectedTool) showToolPanel(selectedTool);
    });
});

backToToolsButton.addEventListener("click", () => {
    if (activeToolPanel?.classList.contains("network-tool")) {
        showToolPanel(document.querySelector("#network-hub-tool"));
        return;
    }

    toolWorkspace.hidden = true;
    catalogSection.hidden = false;
    searchBox.hidden = false;
    toolMeta.hidden = false;
    activeToolPanel = null;
    backToToolsButton.textContent = "← 返回工具列表";
    document.querySelector("#page-title").focus();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput && !event.ctrlKey && !event.metaKey && !event.altKey && !catalogSection.hidden) {
        event.preventDefault();
        searchInput.focus();
    }
});

updateToolResults();

const cameraFileInput = document.querySelector("#camera-file");
const cameraDropZone = document.querySelector("#camera-drop-zone");
const cameraFileSummary = document.querySelector("#camera-file-summary");
const cameraFileName = document.querySelector("#camera-file-name");
const cameraFileSize = document.querySelector("#camera-file-size");
const replaceCameraFileButton = document.querySelector("#replace-camera-file");
const cameraQueryButton = document.querySelector("#camera-query-button");
const cameraStatus = document.querySelector("#camera-status");
const cameraResult = document.querySelector("#camera-result");
const cameraMetadata = document.querySelector("#camera-metadata");
const cameraCount = document.querySelector("#camera-count");
const exifDetails = document.querySelector("#exif-details");
const exifGroups = document.querySelector("#exif-groups");
let cameraFile = null;
let exifToolModulePromise = null;

const loadExifToolModule = () => {
    if (!exifToolModulePromise) {
        let timeoutId;
        const importPromise = import("https://cdn.jsdelivr.net/npm/@colorhythm/exiftool-wasm@1.0.4/dist/esm/index.js");
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = window.setTimeout(
                () => reject(new Error("解析引擎加载超时，请检查网络后重试。")),
                30000
            );
        });

        exifToolModulePromise = Promise.race([importPromise, timeoutPromise])
            .catch((error) => {
                exifToolModulePromise = null;
                throw error;
            })
            .finally(() => window.clearTimeout(timeoutId));
    }

    return exifToolModulePromise;
};

const exifFieldGroups = [
    {
        title: "相机与镜头",
        fields: [
            { label: "镜头品牌", tags: ["LensMake"] },
            { label: "镜头型号", tags: ["LensModel"] },
            { label: "固件 / 软件", tags: ["Software"] }
        ]
    },
    {
        title: "曝光参数",
        fields: [
            { label: "快门速度", tags: ["ExposureTime"] },
            { label: "光圈", tags: ["FNumber"] },
            { label: "ISO", tags: ["ISO", "PhotographicSensitivity"] },
            { label: "焦距", tags: ["FocalLength"] },
            { label: "等效焦距", tags: ["FocalLengthIn35mmFormat"] },
            { label: "曝光补偿", tags: ["ExposureCompensation"] },
            { label: "曝光模式", tags: ["ExposureProgram", "ExposureMode"] },
            { label: "测光模式", tags: ["MeteringMode"] },
            { label: "闪光灯", tags: ["Flash"] },
            { label: "白平衡", tags: ["WhiteBalance"] }
        ]
    },
    {
        title: "拍摄时间",
        fields: [
            { label: "拍摄时间", tags: ["DateTimeOriginal"] },
            { label: "数字化时间", tags: ["CreateDate"] },
            { label: "修改时间", tags: ["ModifyDate"] }
        ]
    },
    {
        title: "图像信息",
        fields: [
            { label: "宽度", tags: ["ImageWidth", "ExifImageWidth"] },
            { label: "高度", tags: ["ImageHeight", "ExifImageHeight"] },
            { label: "方向", tags: ["Orientation"] },
            { label: "色彩空间", tags: ["ColorSpace"] },
            { label: "位深", tags: ["BitsPerSample"] },
            { label: "压缩方式", tags: ["Compression"] }
        ]
    },
    {
        title: "位置信息",
        fields: [
            { label: "GPS 坐标", tags: ["GPSPosition"] },
            { label: "纬度", tags: ["GPSLatitude"] },
            { label: "经度", tags: ["GPSLongitude"] },
            { label: "海拔", tags: ["GPSAltitude"] },
            { label: "GPS 时间", tags: ["GPSDateStamp"] }
        ]
    }
];

const shutterTagPriority = [
    "ShutterCount",
    "MechanicalShutterCount",
    "ShutterCount2",
    "ShutterCount3",
    "ShutterReleaseCount",
    "TotalShutterReleases",
    "ImageCount",
    "ExposureCount"
];

const getMetadataValue = (metadata, tagName) => {
    const entry = Object.entries(metadata).find(([key]) => key.split(":").pop() === tagName);
    return entry ? entry[1] : null;
};

const getMetadataField = (metadata, tags) => {
    for (const tag of tags) {
        const value = getMetadataValue(metadata, tag);
        if (value !== null && value !== undefined && value !== "") {
            return value;
        }
    }
    return null;
};

const formatExifFieldValue = (field, value) => {
    const formattedValue = formatMetadataValue(value);
    if (field.label === "快门速度" && !/[a-z]/i.test(formattedValue)) {
        return `${formattedValue} 秒`;
    }
    if (field.label === "光圈" && !formattedValue.toLowerCase().startsWith("f/")) {
        return `f/${formattedValue}`;
    }
    if (["焦距", "等效焦距"].includes(field.label) && !/mm$/i.test(formattedValue)) {
        return `${formattedValue} mm`;
    }
    if (["宽度", "高度"].includes(field.label) && !/px$/i.test(formattedValue)) {
        return `${formattedValue} px`;
    }
    return formattedValue;
};

const formatMetadataValue = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
};

const getShutterCount = (metadata) => {
    for (const tagName of shutterTagPriority) {
        const entry = Object.entries(metadata).find(([key, value]) => (
            key.split(":").pop() === tagName &&
            value !== "" &&
            value !== null &&
            value !== undefined
        ));
        if (entry) return entry;
    }
    return null;
};

const renderExifDetails = (metadata) => {
    exifGroups.replaceChildren();
    exifDetails.open = false;
    let visibleFieldCount = 0;

    exifFieldGroups.forEach((group) => {
        const fields = group.fields
            .map((field) => ({ ...field, value: getMetadataField(metadata, field.tags) }))
            .filter((field) => field.value !== null);
        if (!fields.length) return;

        const section = document.createElement("section");
        section.className = "exif-group";
        const heading = document.createElement("h4");
        heading.textContent = group.title;
        const list = document.createElement("dl");
        list.className = "exif-list";

        fields.forEach((field) => {
            const row = document.createElement("div");
            row.className = "exif-row";
            const label = document.createElement("dt");
            label.textContent = field.label;
            const value = document.createElement("dd");
            value.textContent = formatExifFieldValue(field, field.value);
            row.append(label, value);
            list.append(row);
        });

        visibleFieldCount += fields.length;
        section.append(heading, list);
        exifGroups.append(section);
    });

    exifDetails.hidden = visibleFieldCount === 0;
};

const setCameraFile = (file) => {
    if (!file) return;
    cameraFile = file;
    cameraFileName.textContent = file.name;
    cameraFileSize.textContent = formatBytes(file.size);
    cameraDropZone.hidden = true;
    cameraFileSummary.hidden = false;
    cameraQueryButton.disabled = false;
    cameraResult.hidden = true;
    cameraStatus.textContent = "文件已就绪。解析过程仅在本机进行。";
    cameraStatus.dataset.state = "info";
};

cameraFileInput.addEventListener("change", () => {
    setCameraFile(cameraFileInput.files[0]);
    cameraFileInput.value = "";
});

replaceCameraFileButton.addEventListener("click", () => cameraFileInput.click());

cameraDropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    cameraDropZone.classList.add("is-dragging");
});

cameraDropZone.addEventListener("dragleave", () => {
    cameraDropZone.classList.remove("is-dragging");
});

cameraDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    cameraDropZone.classList.remove("is-dragging");
    setCameraFile(event.dataTransfer.files[0]);
});

cameraQueryButton.addEventListener("click", async () => {
    if (!cameraFile) return;

    cameraQueryButton.disabled = true;
    cameraResult.hidden = true;
    cameraStatus.dataset.state = "info";
    cameraStatus.textContent = "正在本机解析文件。仅在使用此工具时才会从 jsDelivr CDN 加载约 8 MB 的 ExifTool 引擎；若加载失败，可检查网络后再次点击查询。";

    try {
        const { parseMetadata } = await loadExifToolModule();
        const result = await parseMetadata(cameraFile, {
            fetch: async (_input, init) => {
                const controller = new AbortController();
                const timeout = window.setTimeout(() => controller.abort(), 30000);
                try {
                    const response = await fetch(
                        "https://cdn.jsdelivr.net/npm/@colorhythm/exiftool-wasm@1.0.4/dist/esm/zeroperl-mqcadjqm.wasm",
                        { ...init, signal: controller.signal }
                    );
                    if (!response.ok) {
                        throw new Error(`解析引擎下载失败（HTTP ${response.status}），请稍后重试。`);
                    }
                    return response;
                } catch (error) {
                    if (error instanceof DOMException && error.name === "AbortError") {
                        throw new Error("解析引擎下载超时，请检查网络后重试。");
                    }
                    throw error;
                } finally {
                    window.clearTimeout(timeout);
                }
            },
            args: [
                "-json", "-a", "-G1", "-s", "-q", "-m",
                "-Make", "-Model", "-ShutterCount", "-ShutterCount2", "-ShutterCount3", "-MechanicalShutterCount",
                "-ShutterReleaseCount", "-TotalShutterReleases", "-ImageCount", "-ExposureCount",
                "-LensMake", "-LensModel", "-Software", "-ExposureTime", "-FNumber",
                "-ISO", "-PhotographicSensitivity", "-FocalLength", "-FocalLengthIn35mmFormat",
                "-ExposureCompensation", "-ExposureProgram", "-ExposureMode", "-MeteringMode",
                "-Flash", "-WhiteBalance", "-DateTimeOriginal", "-CreateDate", "-ModifyDate",
                "-ImageWidth", "-ImageHeight", "-ExifImageWidth", "-ExifImageHeight",
                "-Orientation", "-ColorSpace", "-BitsPerSample", "-Compression",
                "-GPSPosition", "-GPSLatitude", "-GPSLongitude", "-GPSAltitude", "-GPSDateStamp"
            ],
            transform: JSON.parse
        });

        if (!result.success) {
            throw new Error(result.error || "ExifTool 无法解析此文件。");
        }

        const metadata = Array.isArray(result.data) ? result.data[0] : null;
        if (!metadata || typeof metadata !== "object") {
            throw new Error("文件中没有可读取的相机元数据。");
        }

        renderExifDetails(metadata);
        cameraMetadata.replaceChildren();
        const make = getMetadataValue(metadata, "Make");
        const model = getMetadataValue(metadata, "Model");
        [[ "品牌", make ], [ "机型", model ]].forEach(([label, value]) => {
            if (value === null || value === undefined || value === "") return;
            const item = document.createElement("div");
            item.className = "camera-metadata-item";
            const name = document.createElement("span");
            name.textContent = label;
            const detail = document.createElement("strong");
            detail.textContent = formatMetadataValue(value);
            item.append(name, detail);
            cameraMetadata.append(item);
        });

        const shutterCount = getShutterCount(metadata);

        cameraCount.replaceChildren();
        if (shutterCount) {
            const [key, value] = shutterCount;
            const item = document.createElement("div");
            item.className = "camera-count-item";
            const label = document.createElement("span");
            label.textContent = "快门计数";
            const count = document.createElement("strong");
            count.textContent = formatMetadataValue(value);
            const source = document.createElement("small");
            source.textContent = `读取字段：${key}`;
            item.append(label, count, source);
            cameraCount.append(item);
            cameraStatus.textContent = "解析完成。不同相机记录的计数口径可能不同，请结合机型说明理解。";
        } else {
            const message = document.createElement("p");
            message.className = "camera-no-count";
            message.textContent = "未在这个文件中读取到已识别的快门计数。查不到不代表快门数为零；请尝试相机直出的 JPEG 或 RAW 原片。";
            cameraCount.append(message);
            cameraStatus.textContent = "文件解析成功，但没有找到支持的快门计数标签。";
        }
        cameraResult.hidden = false;
    } catch (error) {
        cameraStatus.dataset.state = "error";
        const detail = error instanceof TypeError && error.message === "Failed to fetch"
            ? "无法加载解析引擎，请检查网络、浏览器扩展或 CDN 连接后再次点击查询。"
            : error instanceof Error ? error.message : String(error);
        cameraStatus.textContent = `查询失败：${detail}`;
    } finally {
        cameraQueryButton.disabled = false;
    }
});

const imageInput = document.querySelector("#image-file");
const dropZone = document.querySelector("#image-drop-zone");
const preview = document.querySelector("#image-preview");
const previewImage = document.querySelector("#image-preview-img");
const fileName = document.querySelector("#image-file-name");
const fileInfo = document.querySelector("#image-file-info");
const replaceImageButton = document.querySelector("#replace-image-button");
const formatSelect = document.querySelector("#output-format");
const maxWidthInput = document.querySelector("#max-width");
const maxHeightInput = document.querySelector("#max-height");
const qualityInput = document.querySelector("#image-quality");
const qualityValue = document.querySelector("#quality-value");
const convertButton = document.querySelector("#convert-button");
const imageStatus = document.querySelector("#image-status");
const textInput = document.querySelector("#text-input");
const copyTextButton = document.querySelector("#copy-text-button");

let currentFile = null;
let previewUrl = null;

const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const setImageStatus = (message, isError = false) => {
    imageStatus.textContent = message;
    imageStatus.dataset.state = isError ? "error" : "info";
};

const loadImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        setImageStatus("请选择有效的图片文件。", true);
        return;
    }
    if (file.size > 30 * 1024 * 1024) {
        setImageStatus("图片超过 30 MB，请选择较小的文件。", true);
        return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    currentFile = file;
    previewUrl = URL.createObjectURL(file);
    previewImage.src = previewUrl;
    fileName.textContent = file.name;
    preview.hidden = false;
    dropZone.hidden = true;
    convertButton.disabled = true;
    setImageStatus("正在读取图片…");

    previewImage.onload = () => {
        fileInfo.textContent = `${previewImage.naturalWidth} × ${previewImage.naturalHeight} · ${formatBytes(file.size)}`;
        convertButton.disabled = false;
        setImageStatus("图片已就绪，可以设置格式并转换。");
    };
    previewImage.onerror = () => {
        currentFile = null;
        convertButton.disabled = true;
        setImageStatus("无法读取此图片格式，请尝试 PNG、JPG 或 WebP。", true);
    };
};

imageInput.addEventListener("change", () => {
    loadImageFile(imageInput.files[0]);
    imageInput.value = "";
});

replaceImageButton.addEventListener("click", () => imageInput.click());

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-dragging");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
    loadImageFile(event.dataTransfer.files[0]);
});

qualityInput.addEventListener("input", () => {
    qualityValue.textContent = `${qualityInput.value}%`;
});

convertButton.addEventListener("click", () => {
    if (!currentFile || !previewImage.naturalWidth) return;

    const sourceWidth = previewImage.naturalWidth;
    const sourceHeight = previewImage.naturalHeight;
    const parseDimension = (input, original) => {
        if (!input.value.trim()) return original;
        const value = Number(input.value);
        return Number.isInteger(value) && value >= 1 && value <= 20000 ? value : null;
    };
    const requestedWidth = parseDimension(maxWidthInput, sourceWidth);
    const requestedHeight = parseDimension(maxHeightInput, sourceHeight);
    if (requestedWidth === null || requestedHeight === null) {
        setImageStatus("最大宽度和高度需为 1 到 20000 之间的整数。", true);
        return;
    }

    const scale = Math.min(1, requestedWidth / sourceWidth, requestedHeight / sourceHeight);
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const mimeType = formatSelect.value;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
        setImageStatus("当前浏览器无法创建图片画布，请更换浏览器后重试。", true);
        return;
    }
    if (mimeType === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
    }
    context.drawImage(previewImage, 0, 0, width, height);
    convertButton.disabled = true;
    setImageStatus("正在转换…");

    canvas.toBlob((blob) => {
        convertButton.disabled = false;
        if (!blob) {
            setImageStatus("图片转换失败，请尝试其他格式或较小的图片。", true);
            return;
        }
        if (blob.type !== mimeType) {
            setImageStatus("当前浏览器不支持所选输出格式，请更换格式后重试。", true);
            return;
        }

        const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1];
        const baseName = currentFile.name.replace(/\.[^.]+$/, "") || "image";
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${baseName}.${extension}`;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

        const sizeChange = blob.size <= currentFile.size
            ? `，比原图小 ${formatBytes(currentFile.size - blob.size)}`
            : `，比原图大 ${formatBytes(blob.size - currentFile.size)}`;
        setImageStatus(`转换完成：${width} × ${height}，${formatBytes(blob.size)}${sizeChange}。`);
    }, mimeType, Number(qualityInput.value) / 100);
});

const updateTextStats = () => {
    const text = textInput.value;
    const compactText = text.replace(/\s/g, "");
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

    document.querySelector("#char-count").textContent = text.length.toLocaleString();
    document.querySelector("#compact-count").textContent = compactText.length.toLocaleString();
    document.querySelector("#word-count").textContent = words.toLocaleString();
    document.querySelector("#line-count").textContent = lines.toLocaleString();
    copyTextButton.disabled = text.length === 0;
};

textInput.addEventListener("input", updateTextStats);

copyTextButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(textInput.value);
        document.querySelector("#text-status").textContent = "已复制到剪贴板。";
    } catch (error) {
        document.querySelector("#text-status").textContent = "复制失败，请检查浏览器剪贴板权限。";
    }
});

const runNetworkTest = async (button, output, test) => {
    button.disabled = true;
    output.dataset.state = "info";
    output.textContent = "检测中…";
    try {
        const message = await test();
        if (message) output.textContent = message;
        output.dataset.state = "success";
    } catch (error) {
        output.textContent = `检测失败：${error instanceof Error ? error.message : String(error)}`;
        output.dataset.state = "error";
    } finally {
        button.disabled = false;
    }
};

const fetchNetworkJson = async (url, options = {}, timeoutMs = 10000) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            ...options,
            cache: "no-store",
            signal: controller.signal
        });
        if (!response.ok) throw new Error(`服务返回 HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("连接超时，请检查网络后重试");
        }
        if (error instanceof TypeError) {
            throw new Error("无法连接服务，可能是网络或浏览器跨域策略限制");
        }
        if (error instanceof SyntaxError) {
            throw new Error("服务返回的数据无法识别");
        }
        throw error;
    } finally {
        window.clearTimeout(timeout);
    }
};

const fetchPublicAddress = async (url) => {
    const result = await fetchNetworkJson(url);
    if (typeof result.ip !== "string" || !result.ip.trim()) {
        throw new Error("检测服务没有返回有效地址");
    }
    return result.ip;
};

const queryPublicAddress = async (url, familyName) => {
    try {
        return `${familyName}：${await fetchPublicAddress(url)}`;
    } catch (error) {
        if (familyName.startsWith("IPv6") && error instanceof Error && error.message.includes("无法连接")) {
            throw new Error("无法连接 IPv6 专用检测端点，当前网络可能没有 IPv6 连通性");
        }
        if (familyName.startsWith("IPv6") && error instanceof Error && error.message.includes("超时")) {
            throw new Error("IPv6 检测连接超时，当前网络可能没有可用 IPv6");
        }
        throw error;
    }
};

const ipv4TestButton = document.querySelector("#ipv4-test-button");
const ipv6TestButton = document.querySelector("#ipv6-test-button");
const natTestButton = document.querySelector("#nat-test-button");
const ipv4Result = document.querySelector("#ipv4-result");
const ipv6Result = document.querySelector("#ipv6-result");
const natResult = document.querySelector("#nat-result");

ipv4TestButton.addEventListener("click", () => {
    runNetworkTest(ipv4TestButton, ipv4Result, () => queryPublicAddress(
        "https://api4.ipify.org?format=json",
        "公网 IPv4"
    ));
});

ipv6TestButton.addEventListener("click", () => {
    runNetworkTest(ipv6TestButton, ipv6Result, () => queryPublicAddress(
        "https://api6.ipify.org?format=json",
        "IPv6 可用，公网地址"
    ));
});

const gatherIceCandidates = (iceServers, candidateTypes, timeoutMs = 9000) => {
    if (!window.RTCPeerConnection) {
        return Promise.reject(new Error("当前浏览器不支持 WebRTC"));
    }

    const peerConnection = new RTCPeerConnection({ iceServers });
    return new Promise((resolve, reject) => {
        const candidates = new Map();
        let settled = false;
        const finish = (error) => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeout);
            peerConnection.onicecandidate = null;
            peerConnection.onicegatheringstatechange = null;
            peerConnection.close();
            if (error) reject(error);
            else resolve(Array.from(candidates.values()));
        };
        const timeout = window.setTimeout(() => finish(), timeoutMs);

        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                finish();
                return;
            }
            const candidate = event.candidate;
            const parts = candidate.candidate.split(/\s+/);
            const type = candidate.type || parts[7];
            if (!candidateTypes.includes(type)) return;
            const address = candidate.address || parts[4];
            const port = candidate.port || parts[5];
            if (!address) return;
            const protocol = candidate.protocol || parts[2] || "udp";
            const key = `${type}|${protocol.toLowerCase()}|${address}|${port || ""}`;
            candidates.set(key, { address, port, protocol, type });
        };
        peerConnection.onicegatheringstatechange = () => {
            if (peerConnection.iceGatheringState === "complete") finish();
        };

        (async () => {
            try {
                peerConnection.createDataChannel("network-check");
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
            } catch (error) {
                finish(error);
            }
        })();
    });
};

const gatherStunCandidates = (stunUrl) => gatherIceCandidates(
    [{ urls: stunUrl }],
    ["srflx"]
);

const formatStunCandidates = (candidates) => candidates
    .map(({ address, port }) => `${address.includes(":") ? `[${address}]` : address}:${port}`)
    .join(", ");

natTestButton.addEventListener("click", () => {
    runNetworkTest(natTestButton, natResult, async () => {
        const stunServices = [
            { name: "Google", url: "stun:stun.l.google.com:19302" },
            { name: "Cloudflare", url: "stun:stun.cloudflare.com:3478" }
        ];
        const probes = await Promise.allSettled(stunServices.map(({ url }) => gatherStunCandidates(url)));
        const observed = probes.map((probe, index) => ({
            name: stunServices[index].name,
            probe
        }));
        const successes = observed.filter(({ probe }) => probe.status === "fulfilled");

        if (!successes.length) {
            const reason = observed
                .map(({ probe }) => probe.status === "rejected" && probe.reason instanceof Error ? probe.reason.message : "")
                .find(Boolean);
            throw new Error(reason || "STUN 服务未返回可用结果，UDP 可能受限或浏览器阻止了探测");
        }

        const resolved = successes.map(({ name, probe }) => ({
            name,
            candidates: probe.value
        }));
        const details = resolved
            .map(({ name, candidates }) => `${name}：${formatStunCandidates(candidates) || "无公网映射候选"}`)
            .join("；");
        const responding = resolved.filter(({ candidates }) => candidates.length > 0);

        if (responding.length === 0) {
            return `没有收到 STUN 公网映射候选。可能是 UDP/STUN 被阻止、网络不支持或浏览器隐私设置所致；无法判断 NAT 类型。${details}`;
        }
        if (responding.length < 2) {
            return `仅一个 STUN 端点返回公网映射，样本不足，无法判断 NAT 类型。${details}`;
        }

        const firstMappings = new Set(responding[0].candidates.map(
            ({ address, port, protocol }) => `${protocol.toLowerCase()}|${address}|${port}`
        ));
        const mappingsMatch = responding[1].candidates.some(
            ({ address, port, protocol }) => firstMappings.has(`${protocol.toLowerCase()}|${address}|${port}`)
        );
        if (mappingsMatch) {
            return `本次探测中两个 STUN 端点观察到相同的公网映射（映射一致），但这不能证明具体 NAT 类型。${details}`;
        }
        return `两个 STUN 端点观察到的公网映射不同，可能存在端点相关映射，也可能受服务端路径或多层 NAT 影响；无法据此确认具体 NAT 类型。${details}`;
    });
});

const isValidIPv4 = (value) => {
    const parts = value.split(".");
    return parts.length === 4 && parts.every((part) => (
        /^\d{1,3}$/.test(part) &&
        Number(part) >= 0 &&
        Number(part) <= 255 &&
        (part === "0" || !part.startsWith("0"))
    ));
};

const isValidIPv6 = (value) => {
    if (!value.includes(":") || value.includes("%") || !/^[0-9a-f:]+$/i.test(value)) return false;
    const halves = value.split("::");
    if (halves.length > 2) return false;
    const groups = halves.flatMap((half) => half ? half.split(":") : []);
    if (groups.some((group) => group.length > 4)) return false;
    return halves.length === 2 ? groups.length < 8 : groups.length === 8;
};

const isValidDomain = (value) => {
    const domain = value.trim().replace(/\.$/, "");
    if (!domain || domain.length > 253 || !domain.includes(".")) return false;
    return domain.split(".").every((label) => (
        label.length > 0 &&
        label.length <= 63 &&
        /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)
    ));
};

const createNetworkDefinitionList = (element, entries) => {
    element.replaceChildren();
    entries.forEach(([labelText, valueText]) => {
        if (valueText === null || valueText === undefined || valueText === "") return;
        const label = document.createElement("dt");
        label.textContent = labelText;
        const value = document.createElement("dd");
        value.textContent = String(valueText);
        element.append(label, value);
    });
    element.hidden = element.children.length === 0;
};

const myIpv4Value = document.querySelector("#my-ipv4-value");
const myIpv6Value = document.querySelector("#my-ipv6-value");
const myPrivateIpValue = document.querySelector("#my-private-ip-value");
const refreshMyIpButton = document.querySelector("#refresh-my-ip");

const getPrivateIpCandidates = async () => {
    const candidates = await gatherIceCandidates([], ["host"], 4000);
    return [...new Set(candidates
        .map(({ address }) => address)
        .filter((address) => isValidIPv4(address) && (
            address.startsWith("10.") ||
            address.startsWith("192.168.") ||
            /^172\.(1[6-9]|2\d|3[01])\./.test(address) ||
            address.startsWith("169.254.")
        ) || isValidIPv6(address) && /^(fc|fd|fe[89ab])/i.test(address)
    ))];
};

const refreshMyIpAddresses = async () => {
    refreshMyIpButton.disabled = true;
    myIpv4Value.textContent = "正在查询…";
    myIpv6Value.textContent = "正在查询…";
    myPrivateIpValue.textContent = "正在检测…";
    const addressChecks = await Promise.allSettled([
        fetchPublicAddress("https://api4.ipify.org?format=json"),
        fetchPublicAddress("https://api6.ipify.org?format=json")
    ]);
    myIpv4Value.textContent = addressChecks[0].status === "fulfilled"
        ? addressChecks[0].value
        : "不可用（可能无 IPv4 连通性）";
    myIpv6Value.textContent = addressChecks[1].status === "fulfilled"
        ? addressChecks[1].value
        : "不可用（可能无 IPv6 连通性）";

    try {
        const addresses = await getPrivateIpCandidates();
        myPrivateIpValue.textContent = addresses.length
            ? addresses.join(", ")
            : "浏览器未提供（可能由 mDNS 隐藏）";
    } catch (error) {
        myPrivateIpValue.textContent = error instanceof Error
            ? `无法检测：${error.message}`
            : "浏览器无法检测本机内网 IP";
    } finally {
        refreshMyIpButton.disabled = false;
    }
};

refreshMyIpButton.addEventListener("click", refreshMyIpAddresses);

const ipLookupInput = document.querySelector("#ip-lookup-input");
const ipLookupButton = document.querySelector("#ip-lookup-button");
const ipLookupStatus = document.querySelector("#ip-lookup-status");
const ipLookupDetails = document.querySelector("#ip-lookup-details");
ipLookupButton.addEventListener("click", () => {
    runNetworkTest(ipLookupButton, ipLookupStatus, async () => {
        const address = ipLookupInput.value.trim();
        if (!isValidIPv4(address) && !isValidIPv6(address)) {
            throw new Error("请输入格式有效的 IPv4 或 IPv6 地址");
        }
        const data = await fetchNetworkJson(`https://ipwho.is/${encodeURIComponent(address)}`);
        if (!data.success) throw new Error(data.message || "归属地服务无法查询此地址");
        createNetworkDefinitionList(ipLookupDetails, [
            ["IP 地址", data.ip],
            ["IP 类型", data.type],
            ["国家 / 地区", [data.country, data.region, data.city].filter(Boolean).join(" / ")],
            ["邮政编码", data.postal],
            ["运营商", data.connection?.isp],
            ["组织", data.connection?.org],
            ["ASN", data.connection?.asn ? `AS${data.connection.asn}` : ""],
            ["时区", data.timezone?.id],
            ["经纬度（估算）", Number.isFinite(data.latitude) && Number.isFinite(data.longitude)
                ? `${data.latitude}, ${data.longitude}`
                : ""]
        ]);
        return "查询完成。IP 地理位置为数据库估算值。";
    });
});

const ipv4ToBigInt = (address) => address.split(".")
    .reduce((result, part) => (result << 8n) | BigInt(part), 0n);

const bigIntToIPv4 = (value) => [24n, 16n, 8n, 0n]
    .map((shift) => Number((value >> shift) & 255n))
    .join(".");

const subnetInput = document.querySelector("#subnet-input");
const subnetButton = document.querySelector("#subnet-button");
const subnetStatus = document.querySelector("#subnet-status");
const subnetDetails = document.querySelector("#subnet-details");
subnetButton.addEventListener("click", () => {
    runNetworkTest(subnetButton, subnetStatus, async () => {
        const input = subnetInput.value.trim();
        const match = input.match(/^([^/]+)(?:\/(\d{1,2}))?$/);
        if (!match || !isValidIPv4(match[1])) {
            throw new Error("请输入有效 IPv4 CIDR，例如 192.168.1.10/24");
        }
        const prefix = match[2] === undefined ? 32 : Number(match[2]);
        if (prefix < 0 || prefix > 32) throw new Error("CIDR 前缀必须在 0 到 32 之间");

        const address = ipv4ToBigInt(match[1]);
        const allBits = 0xffffffffn;
        const mask = prefix === 0 ? 0n : (allBits << BigInt(32 - prefix)) & allBits;
        const network = address & mask;
        const broadcast = network | (allBits ^ mask);
        const totalAddresses = 2 ** (32 - prefix);
        const usableHosts = prefix >= 31 ? totalAddresses : Math.max(0, totalAddresses - 2);
        const firstHost = prefix >= 31 ? network : network + 1n;
        const lastHost = prefix >= 31 ? broadcast : broadcast - 1n;
        createNetworkDefinitionList(subnetDetails, [
            ["网络地址", `${bigIntToIPv4(network)}/${prefix}`],
            ["子网掩码", bigIntToIPv4(mask)],
            ["通配符掩码", bigIntToIPv4(allBits ^ mask)],
            ["广播地址", prefix >= 31
                ? (prefix === 31 ? "不适用（/31 点对点网段）" : "不适用（/32 单地址网段）")
                : bigIntToIPv4(broadcast)],
            ["可用主机范围", usableHosts ? `${bigIntToIPv4(firstHost)} - ${bigIntToIPv4(lastHost)}` : "无（/32 单地址网段）"],
            ["总地址数", totalAddresses.toLocaleString()],
            ["可用主机数", usableHosts.toLocaleString()]
        ]);
        return "计算完成，输入内容仅在本地处理。";
    });
});

const dnsNameInput = document.querySelector("#dns-name-input");
const dnsTypeSelect = document.querySelector("#dns-type-select");
const dnsButton = document.querySelector("#dns-button");
const dnsStatus = document.querySelector("#dns-status");
const dnsAnswers = document.querySelector("#dns-answers");
dnsButton.addEventListener("click", () => {
    runNetworkTest(dnsButton, dnsStatus, async () => {
        const domain = dnsNameInput.value.trim().replace(/\.$/, "");
        if (!isValidDomain(domain)) throw new Error("请输入有效域名，例如 example.com");
        const type = dnsTypeSelect.value;
        const url = new URL("https://cloudflare-dns.com/dns-query");
        url.searchParams.set("name", domain);
        url.searchParams.set("type", type);
        const data = await fetchNetworkJson(url, {
            headers: { Accept: "application/dns-json" }
        });
        dnsAnswers.replaceChildren();
        const answers = Array.isArray(data.Answer) ? data.Answer : [];
        answers.forEach((answer) => {
            const item = document.createElement("li");
            item.textContent = answer.data || "(空记录)";
            dnsAnswers.append(item);
        });
        dnsAnswers.hidden = answers.length === 0;
        return answers.length
            ? `${domain} 的 ${type} 查询完成，共 ${answers.length} 条记录。`
            : `${domain} 没有返回 ${type} 记录（DNS 状态码 ${data.Status ?? "未知"}）。`;
    });
});

const rdapInput = document.querySelector("#rdap-input");
const rdapButton = document.querySelector("#rdap-button");
const rdapStatus = document.querySelector("#rdap-status");
const rdapDetails = document.querySelector("#rdap-details");
const rdapFallbackLink = document.querySelector("#rdap-fallback-link");

const getRdapRegistrarNames = (entities = []) => {
    const names = [];
    const visit = (entity) => {
        if (!entity || typeof entity !== "object") return;
        if (Array.isArray(entity.roles) && entity.roles.includes("registrar")) {
            const vcard = entity.vcardArray?.[1];
            const formattedName = Array.isArray(vcard)
                ? vcard.find((field) => field[0] === "fn")?.[3]
                : "";
            if (formattedName) names.push(formattedName);
        }
        if (Array.isArray(entity.entities)) entity.entities.forEach(visit);
    };
    entities.forEach(visit);
    return [...new Set(names)].join(", ");
};

rdapButton.addEventListener("click", () => {
    runNetworkTest(rdapButton, rdapStatus, async () => {
        const query = rdapInput.value.trim();
        const isAddress = isValidIPv4(query) || isValidIPv6(query);
        if (!isAddress && !isValidDomain(query)) {
            throw new Error("请输入有效域名或 IP 地址");
        }
        const type = isAddress ? "ip" : "domain";
        const rdapUrl = `https://rdap.org/${type}/${encodeURIComponent(query)}`;
        rdapFallbackLink.href = rdapUrl;
        const data = await fetchNetworkJson(rdapUrl);
        const events = Array.isArray(data.events)
            ? data.events.map((event) => `${event.eventAction}: ${event.eventDate}`).join("；")
            : "";
        const nameservers = Array.isArray(data.nameservers)
            ? data.nameservers.map((server) => server.ldhName || server.unicodeName).filter(Boolean).join(", ")
            : "";
        createNetworkDefinitionList(rdapDetails, [
            ["查询对象", query],
            ["注册对象类型", data.objectClassName],
            ["名称", data.ldhName || data.name],
            ["注册机构", getRdapRegistrarNames(data.entities)],
            ["网络地址范围", data.startAddress && data.endAddress ? `${data.startAddress} - ${data.endAddress}` : ""],
            ["国家 / 地区", data.country],
            ["状态", Array.isArray(data.status) ? data.status.join(", ") : ""],
            ["注册 / 更新 / 到期", events],
            ["名称服务器", nameservers]
        ]);
        return "RDAP 查询完成。注册数据的完整度由相应注册机构决定。";
    });
});

rdapInput.addEventListener("input", () => {
    const query = rdapInput.value.trim();
    const type = isValidIPv4(query) || isValidIPv6(query) ? "ip" : "domain";
    rdapFallbackLink.href = `https://rdap.org/${type}/${encodeURIComponent(query)}`;
});

const latencyButton = document.querySelector("#latency-button");
const latencyStatus = document.querySelector("#latency-status");
const latencyResults = document.querySelector("#latency-results");
latencyButton.addEventListener("click", () => {
    runNetworkTest(latencyButton, latencyStatus, async () => {
        const targets = [
            { name: "Cloudflare DNS", url: "https://cloudflare-dns.com/dns-query?name=example.com&type=A", headers: { Accept: "application/dns-json" } },
            { name: "Google DNS", url: "https://dns.google/resolve?name=example.com&type=A", headers: {} }
        ];
        latencyResults.replaceChildren();
        const measurements = await Promise.all(targets.map(async (target) => {
            const durations = [];
            let failure = "";
            for (let attempt = 0; attempt < 3; attempt += 1) {
                const start = performance.now();
                try {
                    await fetchNetworkJson(target.url, { headers: target.headers }, 8000);
                    durations.push(performance.now() - start);
                } catch (error) {
                    failure = error instanceof Error ? error.message : String(error);
                    break;
                }
            }
            if (!durations.length) return { name: target.name, failure };
            const sorted = durations.slice().sort((left, right) => left - right);
            return {
                name: target.name,
                average: durations.reduce((sum, duration) => sum + duration, 0) / durations.length,
                median: sorted[Math.floor(sorted.length / 2)],
                samples: durations.length
            };
        }));

        measurements.forEach((measurement) => {
            const item = document.createElement("p");
            item.textContent = measurement.failure
                ? `${measurement.name}：失败（${measurement.failure}）`
                : `${measurement.name}：平均 ${measurement.average.toFixed(0)} ms，中位数 ${measurement.median.toFixed(0)} ms（${measurement.samples} 次）`;
            latencyResults.append(item);
        });
        latencyResults.hidden = false;
        if (!measurements.some((measurement) => measurement.samples)) {
            throw new Error("所有 DNS 测试端点均无法连接，请检查网络或浏览器跨域限制");
        }
        return "测试完成。数值包含 DNS over HTTPS 服务响应时间，不是 ICMP Ping。";
    });
});
