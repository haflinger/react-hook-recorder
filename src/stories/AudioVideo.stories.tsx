// YourComponent.stories.tsx

import React, { ComponentProps } from "react";

import { Story } from "@storybook/react";

import AudioVideo from "./AudioVideo";

export default {
  title: "AudioVideo",
  component: AudioVideo,
};

//👇 We create a “template” of how args map to rendering
const Template: Story<ComponentProps<typeof AudioVideo>> = (props) => (
  <AudioVideo />
);

export const ShowAudioVideo = Template.bind({});
ShowAudioVideo.args = {};
