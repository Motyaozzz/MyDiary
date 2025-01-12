const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Вернуть обработку SVG как обычных ассетов
config.resolver.assetExts = [...config.resolver.assetExts, "svg"];

// Применение настроек для nativewind
module.exports = withNativeWind(config, { input: "./global.css" });