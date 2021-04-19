import React from 'react'
import { Block } from '../../containers'
import ButtonField from '../../fields/ButtonField'
import TextField from '../../fields/TextField'

const AligmentProperties: React.FC = () => {
    return (
        <Block>
            <TextField
                multiple
                label='label'
                labelPosition='below'
                onChange={(event) => console.log(event?.currentTarget.value)}
            />
            <ButtonField
                label='label'
                onChange={(event) => console.log(event?.currentTarget)}
            >
                a
            </ButtonField>
            <ButtonField>a</ButtonField>
            <ButtonField>a</ButtonField>
        </Block>
    )
}

export default AligmentProperties
