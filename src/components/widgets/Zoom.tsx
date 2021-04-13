import React from "react";
// import { useSelector } from "react-redux";
// import { State } from '../../redux';

// import { useDispatch } from "react-redux";


const Zoom: React.FC = () => {
    // const dispatch = useDispatch();

    const useToggleHandler = () => {
        // dispatch(toggleOpenMenu());
    }

    //const { colors } = useSelector((state: State) => state.settings);

    //console.log(colors);

    return (
        <>
            <button onClick={useToggleHandler}>Activar zoom</button>
        </>
    )
}


export default Zoom;