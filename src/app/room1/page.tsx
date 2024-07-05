'use client'
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
const Room1 = () => {
    const initialState = useMemo(() => ({ name: 'room' }), []);
    const router = useSearchParams();

    const [state, setState] = useState(initialState);

    useEffect(() => {
        console.log(router.get('token'));;
        console.log('fetching data');
    }, [state]);

    const addCity = () => {
        setState(prevState => ({ ...prevState })); // Update state without changing its reference
    };

    const handleOpenWindow = () => {
        const token = Date.now().toString(); // Or generate a more secure token
        window.localStorage.setItem("access_token", token);

         // Define window dimensions
        const width = 800;
        const height = 600;

    // Calculate position
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);


        const newWindow = window.open(
            `/videocall?token=${token}`,
            'callWindow',
            `width=${width},height=${height},left=${left},top=${top}`
          );
      
          if (newWindow) {
            newWindow.focus();
          } else {
            alert('Please allow popups for this website');
          }
      };
      

    return (
        <>
            <h1>Hello I am room One</h1>
            <h2>State: {state.name}</h2>
            <h2 onClick={addCity}>Add City</h2>
            <h2 onClick={handleOpenWindow}>Open Window</h2>
        </>
    );
};

export default Room1;
