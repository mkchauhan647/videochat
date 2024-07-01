'use client'
import { GoSearch } from "react-icons/go";
export default function SearchBox(props) {

    const handleInput = (event) => {

        // console.log(event);
        if (event.type == 'focus') {
            
            event.target.setAttribute('placeholder', '');
        }
        else {
            
            event.target.setAttribute('placeholder', '🔍 Search');
        }
    }
   
    return (
        // <h1 className={props.className}>Hello I am Search Box !</h1>
        <div className="flex basis-3/5">
            <input type="tex" className="grow p-2 text-center text-xl border outline-none border-[#7e7878]" placeholder="🔍 Search" onBlur={(e)=>handleInput(e)} onFocus={(e)=> handleInput(e)} />
            {/* < */}
        </div>
    )
} 