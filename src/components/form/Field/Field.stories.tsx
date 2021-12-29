import React from 'react'
import Field from './Field'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
    title: 'Atoms/Form/Field',
    parameters: {
        component: Field,
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
} as ComponentMeta<typeof Field>

const Template: ComponentStory<typeof Field> = ({ ...props }) => {
    return <Field {...props}>dasdasda</Field>
}

export const Playground = Template.bind({})

Playground.args = {
    label: 'label'
}
