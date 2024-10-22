import check from "check-types";

// Utility function to remove any unit and parse the number
const parseNumber = (value) => {
  if (check.string(value)) {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  }
  return value;
}

export const keyframes = {
  "motion-scale-in": (getVar) => ({
    from: {
      scaleX: parseNumber(getVar('--motion-origin-scale-x')),
      scaleY: parseNumber(getVar('--motion-origin-scale-y')),
    },
    animate: {
      scaleX: 1,
      scaleY: 1,
    },
  }),
  "motion-scale-out": (getVar) => ({
    from: {
      scaleX: 1,
      scaleY: 1,
    },
    animate: {
      scaleX: parseNumber(getVar('--motion-end-scale-x')),
      scaleY: parseNumber(getVar('--motion-end-scale-y')),
    },
  }),
  "motion-translate-in": (getVar) => ({
    from: {
      translateX: parseNumber(getVar('--motion-origin-translate-x')),
      translateY: parseNumber(getVar('--motion-origin-translate-y')),
    },
    animate: {
      translateX: 0,
      translateY: 0,
    },
  }),
  "motion-translate-out": (getVar) => ({
    from: {
      translateX: 0,
      translateY: 0,
    },
    animate: {
      translateX: parseNumber(getVar('--motion-end-translate-x')),
      translateY: parseNumber(getVar('--motion-end-translate-y')),
    },
  }),
  "motion-rotate-in": (getVar) => ({
    from: {
      rotate: `${parseNumber(getVar('--motion-origin-rotate'))}deg`,
    },
    animate: {
      rotate: "0deg",
    },
  }),
  "motion-rotate-out": (getVar) => ({
    from: {
      rotate: "0deg",
    },
    animate: {
      rotate: `${parseNumber(getVar('--motion-end-rotate'))}deg`,
    },
  }),
  "motion-filter-in": (getVar) => ({
    from: {
      blurRadius: parseNumber(getVar('--motion-origin-blur')),
      grayscale: parseNumber(getVar('--motion-origin-grayscale')),
    },
    animate: {
      blurRadius: 0,
      grayscale: 0,
    },
  }),
  "motion-filter-out": (getVar) => ({
    from: {
      blurRadius: 0,
      grayscale: 0,
    },
    animate: {
      blurRadius: parseNumber(getVar('--motion-end-blur')),
      grayscale: parseNumber(getVar('--motion-end-grayscale')),
    },
  }),
  "motion-opacity-in": (getVar) => ({
    from: {
      opacity: parseNumber(getVar('--motion-origin-opacity')),
    },
    animate: {
      opacity: 1,
    },
  }),
  "motion-opacity-out": (getVar) => ({
    animate: {
      opacity: parseNumber(getVar('--motion-end-opacity')),
    },
  }),
  "motion-background-color-in": (getVar) => ({
    from: {
      backgroundColor: getVar('--motion-origin-background-color'),
    },
    animate: {
      backgroundColor: getVar('--motion-end-background-color'),
    },
  }),
  "motion-background-color-out": (getVar) => ({
    animate: {
      backgroundColor: getVar('--motion-end-background-color'),
    },
  }),
  "motion-text-color-in": (getVar) => ({
    from: {
      color: getVar('--motion-origin-text-color'),
    },
    animate: {
      color: getVar('--motion-end-text-color'),
    },
  }),
  "motion-text-color-out": (getVar) => ({
    animate: {
      color: getVar('--motion-end-text-color'),
    },
  }),
};