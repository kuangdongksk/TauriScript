import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const MyComposition = () => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const opacity = Math.min(1, frame / 60);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontSize: 60,
        backgroundColor: "white",
        opacity,
      }}
    >
      This {width}x{height}px video is {durationInFrames / fps} seconds long.
    </AbsoluteFill>
  );
};
