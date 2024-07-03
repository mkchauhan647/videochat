'use client'
import { GoSearch } from "react-icons/go";
import { useRef, useState } from "react";
import { set } from "firebase/database";
export default function SearchBox({ onlineUsers }) {
    
    console.log('onlineusers', onlineUsers)

    const [search, setSearch] = useState(false);
    const searchRef = useRef(null);
    const searchResult = useRef(null);
    const [searchInput, setSearchInput] = useState('');

    const handleInput = (event) => {

        // console.log(event);
        if (event.type == 'focus') {
            
            event.target.setAttribute('placeholder', '');
            setSearch((prev) => !prev)
        }
        if (event.type == 'blur'){
            
            event.target.setAttribute('placeholder', '🔍 Search');
            setSearch((prev) => !prev)

        }

        if (event.type == 'change') {
            
            // console.log('change', searchRef.current);
            // searchInput = event.target.value;
            let found = false;
            onlineUsers.forEach((user) => {

                if (event.target.value == '') {
                    setSearchInput('');
                    return;
                }

                
                if (user.username.toLowerCase().includes(event.target.value.toLowerCase())) {
                    // console.log('user', user);
                    setSearchInput(user.username);

                    // return;
                    found = true;

                }
                
            }
            );

            // else {
            if (event.target.value == '') {
                setSearchInput('');
                return;
            }
            
            if (!found && event.target.value != '') {
                   
                setSearchInput(`No user found ! with this name ${event.target.value}`);
            }
            // return;
            // }
            
            
        }
    }
   
    return (
        // <h1 className={props.className}>Hello I am Search Box !</h1>
        <div className="relative flex flex-col basis-3/5 ">
            <input ref={searchRef} onChange={handleInput} type="tex" className="grow p-2 text-center text-xl border outline-none border-[#7e7878]" placeholder="🔍 Search" onBlur={(e)=>handleInput(e)} onFocus={(e)=> handleInput(e)} />
            {/* < */}
            {/* <h1>{searchRef.current.value}</h1> */}
            {
                search ? <div className="absolute top-10 left-0 bg-white w-[100%] h-[200px] border border-[#7e7878]">
                   {
                        searchInput ? <ul className="flex  flex-col gap-2 p-4 pl-16">
                        <li className="flex gap-2 items-center">
                            {/* <GoSearch /> */}
                                <p>{searchInput}</p>
                        </li>
                    </ul> : <ul className="flex flex-col gap-2 p-2">
                        <li className="flex gap-2 items-center">
                            <GoSearch />
                            <p>Search for users</p>
                        </li>
                    </ul>}
                </div> : null
            }
        </div>
    )
} 