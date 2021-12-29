import React from 'react'
import NumericField from './NumericField'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
    title: 'Atoms/Form/NumericField',
    parameters: {
        component: NumericField,
        docs: {
            // page: mdx
        }
        /*
        design: {
            type: 'figma',
            url:
                'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/%F0%9F%8D%8B%F0%9F%92%A7-Bubbles-SD-v2?node-id=3637%3A27251'
        }
        */
    },
    argTypes: {}
} as ComponentMeta<typeof NumericField>

const Template: ComponentStory<typeof NumericField> = ({ ...props }) => {
    return <NumericField {...props} />
}

export const Playground = Template.bind({})

Playground.args = {
    label: 'label'
}
