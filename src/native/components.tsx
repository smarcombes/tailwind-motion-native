import {
  Image,
  ScrollView,
  Text,
  View,
  type ImageProps,
  type ScrollViewProps,
  type TextProps,
  type ViewProps,
} from "react-native";
import { motion, type MotionComponent } from "./motion.js";

export const MotionView: MotionComponent<ViewProps> = motion(
  View,
  "Motion.View"
);

export const MotionText: MotionComponent<TextProps> = motion(
  Text,
  "Motion.Text"
);

export const MotionImage: MotionComponent<ImageProps> = motion(
  Image,
  "Motion.Image"
);

export const MotionScrollView: MotionComponent<ScrollViewProps> = motion(
  ScrollView,
  "Motion.ScrollView"
);

/**
 * The primitives, grouped for a Framer-Motion-like feel:
 *
 * ```tsx
 * <Motion.View className="motion-preset-slide-up rounded-xl bg-white p-4" />
 * ```
 */
export const Motion = {
  View: MotionView,
  Text: MotionText,
  Image: MotionImage,
  ScrollView: MotionScrollView,
};
