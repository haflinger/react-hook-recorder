// YourComponent.stories.tsx

import React, { ComponentProps } from "react";

import { Story } from "@storybook/react";

import VideoRTC from "./VideoRTC";

export default {
  title: "VideoRTC",
  component: VideoRTC,
};

//👇 We create a “template” of how args map to rendering
const Template: Story<ComponentProps<typeof VideoRTC>> = (props) => (
  <VideoRTC />
);

export const ShowWebcam = Template.bind({});
ShowWebcam.args = {};
