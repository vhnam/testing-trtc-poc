import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Slider } from '@/components/ui/slider';

/**
 * An input where the user selects a value from within a given range.
 */
const meta = {
  title: 'ui/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the slider.
 */
export const Default: Story = {};

/**
 * Use the `dir="rtl"` prop to have the slider fill from right to left.
 */
export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
  },
};

/**
 * Use the `disabled` prop to disable the slider.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
