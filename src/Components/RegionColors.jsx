const themeString = process.env.REACT_APP_THEME || '{}';

let colors = {};
try {
    colors = JSON.parse(themeString);
} catch (error) {
    console.error('Error parsing theme JSON:', error);
}

const RegionColors = {
    darkTextColor: colors.darkTextColor || 'text-blue-800',
    lightTextColor: colors.lightTextColor || 'text-blue-400',
    darkBgColor: colors.darkBgColor || 'bg-blue-800',
    lightBgColor: colors.lightBgColor || 'bg-blue-400',
    darkBorderColor: colors.darkBorderColor || 'border-blue-800',
    lightBorderColor: colors.lightBorderColor || 'border-blue-400',
    lightHoverColor: colors.lightHoverColor || 'hover:bg-blue-400',
    lightHoverShadowColor: colors.lightHoverShadowColor || 'hover:shadow-blue-400',
    lightHoverTextShadowColor: colors.lightHoverTextShadowColor || 'hover:text-blue-400',
    borderColor: colors.borderColor || 'border-blue-800',
    hoverBgColor: colors.hoverBgColor || 'bg-blue-800',
    hoverTextColor: colors.hoverTextColor || 'text-blue-400',
    hoverShadowColor: colors.hoverShadowColor || 'shadow-blue-400',
};

export default RegionColors;