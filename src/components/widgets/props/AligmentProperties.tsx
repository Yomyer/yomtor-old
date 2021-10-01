import React from 'react'
import Block from '../../containers/Block'
import ButtonField from '../../fields/ButtonField'
import { ArrageIcon, CenterIcon, DistributeIcon } from '../../icons/alignment'
import { MoreIcon } from '../../icons'
import { createUseStyles } from 'react-jss'
import { YomtorTheme } from '../../../styles/createTheme'

const useStyles = createUseStyles<'root', any, YomtorTheme>((theme) => ({
    root: {
        background: theme.palette.background.default,
        padding: '5px 0'
    }
}))

const AligmentProperties: React.FC = () => {
    const { root } = useStyles()

    return (
        <div className={root}>
            <Block gap={0} margin={0} padding={5}>
                <ButtonField>
                    <DistributeIcon />
                </ButtonField>
                <ButtonField>
                    <DistributeIcon rotate={1} />
                </ButtonField>
                <MoreIcon />
                <ButtonField>
                    <ArrageIcon />
                </ButtonField>
                <ButtonField>
                    <CenterIcon rotate={1} />
                </ButtonField>
                <ButtonField>
                    <ArrageIcon rotate={2} />
                </ButtonField>
                <ButtonField>
                    <ArrageIcon rotate={1} />
                </ButtonField>
                <ButtonField>
                    <CenterIcon />
                </ButtonField>
                <ButtonField>
                    <ArrageIcon rotate={3} />
                </ButtonField>
            </Block>
        </div>
    )
}

export default AligmentProperties
