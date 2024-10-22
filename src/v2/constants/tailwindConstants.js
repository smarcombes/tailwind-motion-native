/*
blur-none	filter:  ;
blur-sm	filter: blur(4px);
blur	filter: blur(8px);
blur-md	filter: blur(12px);
blur-lg	filter: blur(16px);
blur-xl	filter: blur(24px);
blur-2xl	filter: blur(40px);
blur-3xl	filter: blur(64px);
 */
const blur = {
    'none': 0,
    'sm': 4,
    'DEFAULT': 8,
    'md': 12,
    'lg': 16,
    'xl': 24,
    '2xl': 40,
    '3xl': 64,
};


/*
scale-0	transform: scale(0);
scale-x-0	transform: scaleX(0);
scale-y-0	transform: scaleY(0);
scale-50	transform: scale(.5);
scale-x-50	transform: scaleX(.5);
scale-y-50	transform: scaleY(.5);
scale-75	transform: scale(.75);
scale-x-75	transform: scaleX(.75);
scale-y-75	transform: scaleY(.75);
scale-90	transform: scale(.9);
scale-x-90	transform: scaleX(.9);
scale-y-90	transform: scaleY(.9);
scale-95	transform: scale(.95);
scale-x-95	transform: scaleX(.95);
scale-y-95	transform: scaleY(.95);
scale-100	transform: scale(1);
scale-x-100	transform: scaleX(1);
scale-y-100	transform: scaleY(1);
scale-105	transform: scale(1.05);
scale-x-105	transform: scaleX(1.05);
scale-y-105	transform: scaleY(1.05);
scale-110	transform: scale(1.1);
scale-x-110	transform: scaleX(1.1);
scale-y-110	transform: scaleY(1.1);
scale-125	transform: scale(1.25);
scale-x-125	transform: scaleX(1.25);
scale-y-125	transform: scaleY(1.25);
scale-150	transform: scale(1.5);
scale-x-150	transform: scaleX(1.5);
scale-y-150	transform: scaleY(1.5);
*/
const scale = {
    '0': 0,
    '50': .5,
    '75': .75,
    '90': .9,
    '95': .95,
    '100': 1,
    '105': 1.05,
    '110': 1.1,
    '125': 1.25,
    '150': 1.5,
}

// Rotate
/*
rotate-0	transform: rotate(0deg);
rotate-1	transform: rotate(1deg);
rotate-2	transform: rotate(2deg);
rotate-3	transform: rotate(3deg);
rotate-6	transform: rotate(6deg);
rotate-12	transform: rotate(12deg);
rotate-45	transform: rotate(45deg);
rotate-90	transform: rotate(90deg);
rotate-180	transform: rotate(180deg);
*/
const rotate = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '6': 6,
    '12': 12,
    '45': 45,
    '90': 90,
    '180': 180,
}

// Grayscale
/*
grayscale-0	filter: grayscale(0);
grayscale	filter: grayscale(100%);
*/
const grayscale = {
    '0': 0,
    'DEFAULT': 100,
}

// Opacity
/*
opacity-0	opacity: 0;
opacity-5	opacity: 0.05;
opacity-10	opacity: 0.1;
opacity-15	opacity: 0.15;
opacity-20	opacity: 0.2;
opacity-25	opacity: 0.25;
opacity-30	opacity: 0.3;
opacity-35	opacity: 0.35;
opacity-40	opacity: 0.4;
opacity-45	opacity: 0.45;
opacity-50	opacity: 0.5;
opacity-55	opacity: 0.55;
opacity-60	opacity: 0.6;
opacity-65	opacity: 0.65;
opacity-70	opacity: 0.7;
opacity-75	opacity: 0.75;
opacity-80	opacity: 0.8;
opacity-85	opacity: 0.85;
opacity-90	opacity: 0.9;
opacity-95	opacity: 0.95;
opacity-100	opacity: 1;
*/
const opacity = {
    '0': 0,
    '5': .05,
    '10': .1,
    '15': .15,
    '20': .2,
    '25': .25,
    '30': .3,
    '35': .35,
    '40': .4,
    '45': .45,
    '50': .5,
    '55': .55,
    '60': .6,
    '65': .65,
    '70': .7,
    '75': .75,
    '80': .8,
    '85': .85,
    '90': .9,
    '95': .95,
    '100': 1,
}

// Colors
/*
Slate
50
#f8fafc
100
#f1f5f9
200
#e2e8f0
300
#cbd5e1
400
#94a3b8
500
#64748b
600
#475569
700
#334155
800
#1e293b
900
#0f172a
950
#020617
Gray
50
#f9fafb
100
#f3f4f6
200
#e5e7eb
300
#d1d5db
400
#9ca3af
500
#6b7280
600
#4b5563
700
#374151
800
#1f2937
900
#111827
950
#030712
Zinc
50
#fafafa
100
#f4f4f5
200
#e4e4e7
300
#d4d4d8
400
#a1a1aa
500
#71717a
600
#52525b
700
#3f3f46
800
#27272a
900
#18181b
950
#09090b
Neutral
50
#fafafa
100
#f5f5f5
200
#e5e5e5
300
#d4d4d4
400
#a3a3a3
500
#737373
600
#525252
700
#404040
800
#262626
900
#171717
950
#0a0a0a
Stone
50
#fafaf9
100
#f5f5f4
200
#e7e5e4
300
#d6d3d1
400
#a8a29e
500
#78716c
600
#57534e
700
#44403c
800
#292524
900
#1c1917
950
#0c0a09
Red
50
#fef2f2
100
#fee2e2
200
#fecaca
300
#fca5a5
400
#f87171
500
#ef4444
600
#dc2626
700
#b91c1c
800
#991b1b
900
#7f1d1d
950
#450a0a
Orange
50
#fff7ed
100
#ffedd5
200
#fed7aa
300
#fdba74
400
#fb923c
500
#f97316
600
#ea580c
700
#c2410c
800
#9a3412
900
#7c2d12
950
#431407
Amber
50
#fffbeb
100
#fef3c7
200
#fde68a
300
#fcd34d
400
#fbbf24
500
#f59e0b
600
#d97706
700
#b45309
800
#92400e
900
#78350f
950
#451a03
Yellow
50
#fefce8
100
#fef9c3
200
#fef08a
300
#fde047
400
#facc15
500
#eab308
600
#ca8a04
700
#a16207
800
#854d0e
900
#713f12
950
#422006
Lime
50
#f7fee7
100
#ecfccb
200
#d9f99d
300
#bef264
400
#a3e635
500
#84cc16
600
#65a30d
700
#4d7c0f
800
#3f6212
900
#365314
950
#1a2e05
Green
50
#f0fdf4
100
#dcfce7
200
#bbf7d0
300
#86efac
400
#4ade80
500
#22c55e
600
#16a34a
700
#15803d
800
#166534
900
#14532d
950
#052e16
Emerald
50
#ecfdf5
100
#d1fae5
200
#a7f3d0
300
#6ee7b7
400
#34d399
500
#10b981
600
#059669
700
#047857
800
#065f46
900
#064e3b
950
#022c22
Teal
50
#f0fdfa
100
#ccfbf1
200
#99f6e4
300
#5eead4
400
#2dd4bf
500
#14b8a6
600
#0d9488
700
#0f766e
800
#115e59
900
#134e4a
950
#042f2e
Cyan
50
#ecfeff
100
#cffafe
200
#a5f3fc
300
#67e8f9
400
#22d3ee
500
#06b6d4
600
#0891b2
700
#0e7490
800
#155e75
900
#164e63
950
#083344
Sky
50
#f0f9ff
100
#e0f2fe
200
#bae6fd
300
#7dd3fc
400
#38bdf8
500
#0ea5e9
600
#0284c7
700
#0369a1
800
#075985
900
#0c4a6e
950
#082f49
Blue
50
#eff6ff
100
#dbeafe
200
#bfdbfe
300
#93c5fd
400
#60a5fa
500
#3b82f6
600
#2563eb
700
#1d4ed8
800
#1e40af
900
#1e3a8a
950
#172554
Indigo
50
#eef2ff
100
#e0e7ff
200
#c7d2fe
300
#a5b4fc
400
#818cf8
500
#6366f1
600
#4f46e5
700
#4338ca
800
#3730a3
900
#312e81
950
#1e1b4b
Violet
50
#f5f3ff
100
#ede9fe
200
#ddd6fe
300
#c4b5fd
400
#a78bfa
500
#8b5cf6
600
#7c3aed
700
#6d28d9
800
#5b21b6
900
#4c1d95
950
#2e1065
Purple
50
#faf5ff
100
#f3e8ff
200
#e9d5ff
300
#d8b4fe
400
#c084fc
500
#a855f7
600
#9333ea
700
#7e22ce
800
#6b21a8
900
#581c87
950
#3b0764
Fuchsia
50
#fdf4ff
100
#fae8ff
200
#f5d0fe
300
#f0abfc
400
#e879f9
500
#d946ef
600
#c026d3
700
#a21caf
800
#86198f
900
#701a75
950
#4a044e
Pink
50
#fdf2f8
100
#fce7f3
200
#fbcfe8
300
#f9a8d4
400
#f472b6
500
#ec4899
600
#db2777
700
#be185d
800
#9d174d
900
#831843
950
#500724
Rose
50
#fff1f2
100
#ffe4e6
200
#fecdd3
300
#fda4af
400
#fb7185
500
#f43f5e
600
#e11d48
700
#be123c
800
#9f1239
900
#881337
950
#4c0519
*/
const colors = {
    'slate': {
        '50': '#f8fafc',
        '100': '#f1f5f9',
        '200': '#e2e8f0',
        '300': '#cbd5e1',
        '400': '#94a3b8',
        '500': '#64748b',
        '600': '#475569',
        '700': '#334155',
        '800': '#1e293b',
        '900': '#0f172a',
        '950': '#020617',
    },
    'gray': {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
        '950': '#030712',
    },
    'zinc': {
        '50': '#fafafa',
        '100': '#f4f4f5',
        '200': '#e4e4e7',
        '300': '#d4d4d8',
        '400': '#a1a1aa',
        '500': '#71717a',
        '600': '#52525b',
        '700': '#3f3f46',
        '800': '#27272a',
        '900': '#18181b',
        '950': '#09090b',
    },
    'neutral': {
        '50': '#fafafa',
        '100': '#f5f5f5',
        '200': '#e5e5e5',
        '300': '#d4d4d4',
        '400': '#a3a3a3',
        '500': '#737373',
        '600': '#525252',
        '700': '#404040',
        '800': '#262626',
        '900': '#171717',
        '950': '#0a0a0a',
    },
    'stone': {
        '50': '#fafaf9',
        '100': '#f5f5f4',
        '200': '#e7e5e4',
        '300': '#d6d3d1',
        '400': '#a8a29e',
        '500': '#78716c',
        '600': '#57534e',
        '700': '#44403c',
        '800': '#292524',
        '900': '#1c1917',
        '950': '#0c0a09',
    },
    'red': {
        '50': '#fef2f2',
        '100': '#fee2e2',
        '200': '#fecaca',
        '300': '#fca5a5',
        '400': '#f87171',
        '500': '#ef4444',
        '600': '#dc2626',
        '700': '#b91c1c',
        '800': '#991b1b',
        '900': '#7f1d1d',
        '950': '#450a0a',
    },
    'orange': {
        '50': '#fff7ed',
        '100': '#ffedd5',
        '200': '#fed7aa',
        '300': '#fdba74',
        '400': '#fb923c',
        '500': '#f97316',
        '600': '#ea580c',
        '700': '#c2410c',
        '800': '#9a3412',
        '900': '#7c2d12',
        '950': '#431407',
    },
    'amber': {
        '50': '#fffbeb',
        '100': '#fef3c7',
        '200': '#fde68a',
        '300': '#fcd34d',
        '400': '#fbbf24',
        '500': '#f59e0b',
        '600': '#d97706',
        '700': '#b45309',
        '800': '#92400e',
        '900': '#78350f',
        '950': '#451a03',
    },
    'yellow': {
        '50': '#fefce8',
        '100': '#fef9c3',
        '200': '#fef08a',
        '300': '#fde047',
        '400': '#facc15',
        '500': '#eab308',
        '600': '#ca8a04',
        '700': '#a16207',
        '800': '#854d0e',
        '900': '#713f12',
        '950': '#422006',
    },
    'lime': {
        '50': '#f7fee7',
        '100': '#ecfccb',
        '200': '#d9f99d',
        '300': '#bef264',
        '400': '#a3e635',
        '500': '#84cc16',
        '600': '#65a30d',
        '700': '#4d7c0f',
        '800': '#3f6212',
        '900': '#365314',
        '950': '#1a2e05',
    },
    'green': {
        '50': '#f0fdf4',
        '100': '#dcfce7',
        '200': '#bbf7d0',
        '300': '#86efac',
        '400': '#4ade80',
        '500': '#22c55e',
        '600': '#16a34a',
        '700': '#15803d',
        '800': '#166534',
        '900': '#14532d',
        '950': '#052e16',
    },
    'emerald': {
        '50': '#ecfdf5',
        '100': '#d1fae5',
        '200': '#a7f3d0',
        '300': '#6ee7b7',
        '400': '#34d399',
        '500': '#10b981',
        '600': '#059669',
        '700': '#047857',
        '800': '#065f46',
        '900': '#064e3b',
        '950': '#022c22',
    },
    'teal': {
        '50': '#f0fdfa',
        '100': '#ccfbf1',
        '200': '#99f6e4',
        '300': '#5eead4',
        '400': '#2dd4bf',
        '500': '#14b8a6',
        '600': '#0d9488',
        '700': '#0f766e',
        '800': '#115e59',
        '900': '#134e4a',
        '950': '#042f2e',
    },
    'cyan': {
        '50': '#ecfeff',
        '100': '#cffafe',
        '200': '#a5f3fc',
        '300': '#67e8f9',
        '400': '#22d3ee',
        '500': '#06b6d4',
        '600': '#0891b2',
        '700': '#0e7490',
        '800': '#155e75',
        '900': '#164e63',
        '950': '#083344',
    },
    'sky': {
        '50': '#f0f9ff',
        '100': '#e0f2fe',
        '200': '#bae6fd',
        '300': '#7dd3fc',
        '400': '#38bdf8',
        '500': '#0ea5e9',
        '600': '#0284c7',
        '700': '#0369a1',
        '800': '#075985',
        '900': '#0c4a6e',
        '950': '#082f49',
    },
    'blue': {
        '50': '#eff6ff',
        '100': '#dbeafe',
        '200': '#bfdbfe',
        '300': '#93c5fd',
        '400': '#60a5fa',
        '500': '#3b82f6',
        '600': '#2563eb',
        '700': '#1d4ed8',
        '800': '#1e40af',
        '900': '#1e3a8a',
        '950': '#172554',
    },
    'indigo': {
        '50': '#eef2ff',
        '100': '#e0e7ff',
        '200': '#c7d2fe',
        '300': '#a5b4fc',
        '400': '#818cf8',
        '500': '#6366f1',
        '600': '#4f46e5',
        '700': '#4338ca',
        '800': '#3730a3',
        '900': '#312e81',
        '950': '#1e1b4b',
    },
    'violet': {
        '50': '#f5f3ff',
        '100': '#ede9fe',
        '200': '#ddd6fe',
        '300': '#c4b5fd',
        '400': '#a78bfa',
        '500': '#8b5cf6',
        '600': '#7c3aed',
        '700': '#6d28d9',
        '800': '#5b21b6',
        '900': '#4c1d95',
        '950': '#2e1065',
    },
    'purple': {
        '50': '#faf5ff',
        '100': '#f3e8ff',
        '200': '#e9d5ff',
        '300': '#d8b4fe',
        '400': '#c084fc',
        '500': '#a855f7',
        '600': '#9333ea',
        '700': '#7e22ce',
        '800': '#6b21a8',
        '900': '#581c87',
        '950': '#3b0764',
    },
    'fuchsia': {
        '50': '#fdf4ff',
        '100': '#fae8ff',
        '200': '#f5d0fe',
        '300': '#f0abfc',
        '400': '#e879f9',
        '500': '#d946ef',
        '600': '#c026d3',
        '700': '#a21caf',
        '800': '#86198f',
        '900': '#701a75',
        '950': '#4a044e',
    },
    'pink': {
        '50': '#fdf2f8',
        '100': '#fce7f3',
        '200': '#fbcfe8',
        '300': '#f9a8d4',
        '400': '#f472b6',
        '500': '#ec4899',
        '600': '#db2777',
        '700': '#be185d',
        '800': '#9d174d',
        '900': '#831843',
        '950': '#500724',
    },
    'rose': {
        '50': '#fff1f2',
        '100': '#ffe4e6',
        '200': '#fecdd3',
        '300': '#fda4af',
        '400': '#fb7185',
        '500': '#f43f5e',
        '600': '#e11d48',
        '700': '#be123c',
        '800': '#9f1239',
        '900': '#881337',
        '950': '#4c0519',
    },
};

export const flattenColorPalette = (colors) => {
    const result = {};
    Object.keys(colors).forEach(color => {
        Object.keys(colors[color]).forEach(weight => {
            result[`${color}-${weight}`] = colors[color][weight];
        });
    });
    return result;
}

const flatColorPalette = flattenColorPalette(colors);


/*
Class
Properties
duration-0	transition-duration: 0s;
duration-75	transition-duration: 75ms;
duration-100	transition-duration: 100ms;
duration-150	transition-duration: 150ms;
duration-200	transition-duration: 200ms;
duration-300	transition-duration: 300ms;
duration-500	transition-duration: 500ms;
duration-700	transition-duration: 700ms;
duration-1000	transition-duration: 1000ms;
*/
const transitionDuration = {
    '0': '0s',
    '75': '75ms',
    '100': '100ms',
    '150': '150ms',
    '200': '200ms',
    '300': '300ms',
    '500': '500ms',
    '700': '700ms',
    '1000': '1000ms',
};

/*
// animationTimingFunction
ease-linear	transition-timing-function: linear;
ease-in	transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
ease-out	transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
ease-in-out	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
*/
const animationTimingFunction = {
    'linear': 'linear',
    'in': 'cubic-bezier(0.4, 0, 1, 1)',
    'out': 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
}

/*
const theme = (prop) => {
    if (prop === 'blur') {
        return blur;
    }
    if (prop === 'scale') {
        return scale;
    }
    if (prop === 'rotate') {
        return rotate;
    }
    if (prop === 'grayscale') {
        return grayscale;
    }
    if (prop === 'opacity') {
        return opacity;
    }
    if (prop === 'colors') {
        return colors;
    }
    if (prop === 'transitionDuration') {
        return transitionDuration;
    }
    if (prop === 'transitionTimingFunction') {
        return animationTimingFunction;
    }
}*/

// Default tailwind theme
export const TAILWIND_DEFAULT_THEME = {
    blur,
    scale,
    rotate,
    grayscale,
    opacity,
    colors,
    transitionDuration,
    animationTimingFunction,
};
