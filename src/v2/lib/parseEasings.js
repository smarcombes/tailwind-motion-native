import { Easing } from "react-native-reanimated";

function parseCubicBezier(valueString) {
    if (typeof valueString !== "string") {
        throw new Error("parseCubicBezier requires a string value");
    }
    if (
        !valueString.startsWith("cubic-bezier(") ||
        !valueString.endsWith(")")
    ) {
        throw new Error(
            "parseCubicBezier requires a string value in the form of cubic-bezier(x1, y1, x2, y2)"
        );
    }
    valueString = valueString.slice("cubic-bezier(".length, -1);
    const values = valueString.split(",").map(parseFloat);
    if (values.length !== 4) {
        throw new Error("cubic-bezier requires 4 values");
    }

    return Easing.bezier(...values);
}

function linearValuesToKeyFrames(easingValues) {
    if (
        typeof easingValues !== "array" ||
        easingValues.some((value) => typeof value !== "string")
    ) {
        throw new Error("linearValuesToKeyFrames requires an array of strings");
    }

    const keyframes = [];
    let lastTime = 0; // Track last known percentage time
    let totalValues = easingValues.length;

    for (let i = 0; i < totalValues; i++) {
        const [value, percentage] = easingValues[i].trim().split(/\s+/);

        if (percentage) {
            // Explicit percentage provided, convert to decimal
            keyframes.push({
                value: parseFloat(value),
                time: parseFloat(percentage) / 100,
            });
            lastTime = parseFloat(percentage) / 100;
        } else {
            // No percentage provided, add it evenly spaced between last and 100%
            let nextKnownTime = 1; // Default to 100% if no further percentage is given
            for (let j = i + 1; j < totalValues; j++) {
                const [, nextPercentage] = easingValues[j].trim().split(/\s+/);
                if (nextPercentage) {
                    nextKnownTime = parseFloat(nextPercentage) / 100;
                    break;
                }
            }

            // Distribute missing percentages evenly
            let timeIncrement = (nextKnownTime - lastTime) / (totalValues - i);
            lastTime += timeIncrement;

            keyframes.push({
                value: parseFloat(value),
                time: lastTime,
            });
        }
    }

    return keyframes;
}

function parseLinear(valueString) {
    if (typeof valueString !== "string") {
        throw new Error("cubic-bezier requires a string value");
    }
    if (!valueString.startsWith("linear(") || !valueString.endsWith(")")) {
        throw new Error(
            "parseLinear requires a string value in the form of linear(...)"
        );
    }
    valueString = valueString.slice("linear(".length, -1);
    const values = valueString.split(",");
    if (values.length < 2) {
        throw new Error("linear requires at least 2 values");
    }
    const keyframes = linearValuesToKeyFrames(values);

    const inputRange = keyframes.map((frame) => frame.time);
    const outputRange = keyframes.map((frame) => frame.value);

    return Easing.interpolate({
        inputRange,
        outputRange,
    });
}

function parseSteps(valueString) {
    if (typeof valueString !== "string") {
        throw new Error("steps() requires a string value");
    }

    const stepValues = valueString.slice("steps(".length, -1).split(",");
    if (stepValues.length !== 2) {
        throw new Error("steps() requires 2 values");
    }
    if (isNaN(parseInt(stepValues[0]))) {
        throw new Error("steps() first value must be an integer");
    }
    if (!["start", "end", "both", "neither"].includes(stepValues[1].trim())) {
        throw new Error(
            "steps() second value must be one of 'start', 'end', 'both', or 'neither'"
        );
    }
    return Easing.step(parseInt(stepValues[0]), stepValues[1].trim());
}

export function parseCSSEasing(easing) {
    if (typeof easing !== "string") {
        throw new Error("Easing must be a string");
    }

    const trimmed = easing.trim();

    if (trimmed === "ease") {
        return Easing.bezier(0.25, 0.1, 0.25, 1);
    }
    if (trimmed === "ease-in") {
        return Easing.bezier(0.42, 0, 1, 1);
    }
    if (trimmed === "ease-out") {
        return Easing.bezier(0, 0, 0.58, 1);
    }
    if (trimmed === "ease-in-out") {
        return Easing.bezier(0.42, 0, 0.58, 1);
    }
    
    if (trimmed.startsWith("steps(")) {
        return parseSteps(trimmed);
    }
    if (trimmed === "step-start") {
        return Easing.step(1, "start");
    }
    
    if (trimmed === "step-end") {
        return Easing.step(1, "end");
    }

    if (trimmed.startsWith("cubic-bezier(")) {
        return parseCubicBezier(trimmed);
    }

    if (trimmed === 'linear') {
        return Easing.linear;
    }

    if (trimmed.startsWith("linear(")) {
        return parseLinear(trimmed);
    }

    throw new Error("Unsupported CSS easing value: "+trimmed);
}
