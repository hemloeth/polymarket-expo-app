import { useEffect, useRef } from "react";
import { Animated, View, Easing } from "react-native";
import Svg, { Path, Defs, ClipPath, Rect, G, Filter, FeGaussianBlur, FeOffset, FeColorMatrix, FeMerge, FeMergeNode } from "react-native-svg";
import iconPaths from "./IconPaths";



export default function TabIcon({ active, id, name }) {
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: active ? 1 : 0,
      duration: 600,
      easing: Easing.out(Easing.quad), // Gentler deceleration
      useNativeDriver: false,
    }).start();
  }, [active]);

  const iconData = iconPaths[name] || iconPaths.home;
  const isHome = name === 'home' || iconData.multiLayer;

  // Render Multi-layer Icon (i.e. Home)
  if (isHome) {
    return (
      <Animated.View style={{
        width: 24,
        height: 24,
      }}>
        {/* Shadow Layer: SVG Filter for True Drop Shadow (Behind everything) */}
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          opacity: reveal, // Fade in with active state
          zIndex: -1
        }}>
          <Svg width={24} height={24} viewBox={iconData.viewBox} style={{ overflow: 'visible' }}>
            <Defs>
              <Filter id={`shadow-${name}`} x="-50%" y="-50%" width="200%" height="200%">
                <FeGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <FeOffset in="blur" dx="0" dy="4" result="offsetBlur" />
                <FeColorMatrix in="offsetBlur" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              </Filter>
            </Defs>
            <Path d={iconData.path2} fill="black" filter={`url(#shadow-${name})`} />
          </Svg>
        </Animated.View>
        {/* Layer 1: Base Icon (Outline Foreground - Static Background) */}
        <Svg width={24} height={24} viewBox={iconData.viewBox} style={{ position: 'absolute', top: 0, left: 0 }}>
          <Path
            d={iconData.path1}
            fill="none"
            stroke="#6e6e6e"
            strokeWidth={1.5}
          />
        </Svg>

        {/* Layer 3: Clipping Rectangle (White Box equivalent) */}
        {/* This Animated.View acts as the mask/clipping rect that grows from 0 to 24px */}
        <Animated.View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 24,
          height: reveal.interpolate({ inputRange: [0, 1], outputRange: [0, 22] }),
          overflow: 'hidden',
        }}>
          <Svg width={24} height={24} viewBox={iconData.viewBox} style={{ position: 'absolute', bottom: 0 }}>
            {/* Black Fill Background */}
            <Path
              d={iconData.path2}
              fill="#202020"
              stroke="none"
            />
            {/* White Detail/Stroke Foreground */}
            <Path
              d={iconData.path1}
              fill="none"
              stroke="#202020" // Dark grey stroke to match fill
              strokeWidth={1.5}
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    );
  }

  // Legacy Logic for other icons
  const d = iconData.d;
  const strokeWidth = iconData.strokeWidth || 32;
  const viewBox = iconData.viewBox || "0 0 512 512";

  return (
    <Animated.View style={{
      width: 24,
      height: 24,
    }}>
      {/* Shadow Layer: SVG Filter for True Drop Shadow (Behind everything) */}
      <Animated.View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 24,
        height: 24,
        opacity: reveal, // Fade in with active state
        zIndex: -1
      }}>
        <Svg width={24} height={24} viewBox={viewBox} style={{ overflow: 'visible' }}>
          <Defs>
            <Filter id={`shadow-${name}`} x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <FeOffset in="blur" dx="0" dy="4" result="offsetBlur" />
              <FeColorMatrix in="offsetBlur" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            </Filter>
          </Defs>
          <Path d={d} fill="none" stroke="black" strokeWidth={strokeWidth} filter={`url(#shadow-${name})`} />
        </Svg>
      </Animated.View>
      {/* 1. Inactive Layer (Grey Stroke) - Always Visible Background */}
      <Svg width={24} height={24} viewBox={viewBox} style={{ position: 'absolute' }}>
        <Path
          d={d}
          fill="none"
          stroke="#6e6e6e"
          strokeWidth={strokeWidth}
        />
      </Svg>

      {/* 2. Active Layer (Animated Reveal) */}
      <Animated.View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 24,
        height: reveal.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }),
        overflow: 'hidden',
      }}>
        <Svg width={24} height={24} viewBox={viewBox} style={{ position: 'absolute', bottom: 0 }}>
          <Path
            d={d}
            fill="#202020"
            stroke="#202020" // Dark grey stroke for active
            strokeWidth={strokeWidth}
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
