import React, { ComponentProps } from "react";

import { Story } from "@storybook/react";

import AudioVideo from "./AudioVideo";

export default {
  title: "AudioVideo",
  component: AudioVideo,
};

const Template: Story<ComponentProps<typeof AudioVideo>> = () => <AudioVideo />;

export const ShowAudioVideoRecorder = Template.bind({});
ShowAudioVideoRecorder.args = {};
