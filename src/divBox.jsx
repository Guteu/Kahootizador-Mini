import { useRef } from "react"

function DivBox(props){ // 1: componente tem inicial maiuscula. 2: fodase? 3: 
    const box = useRef()
    let hidden = props.hidden ?? false

    function onClick() {
        if(!props.toggleHideOnClick) return
        hidden = !hidden
        box.current.style = {
            display: hidden ? "none" : "box"
        }
    }

    return(
        <>
            <div className="divBox" style={{display: hidden ? "none" : "box"}} onClick={onClick} ref={box}>
                {props.text}
            </div>
        </>
    )
}

export default DivBox