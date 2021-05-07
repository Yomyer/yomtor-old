import React from 'react'
import { Block } from '../../containers'
import ButtonField from '../../fields/ButtonField'
import NumericField from '../../fields/NumericField'

const AligmentProperties: React.FC = () => {
    return (
        <Block>
            <NumericField multiple label='label' labelPosition='below' />
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
