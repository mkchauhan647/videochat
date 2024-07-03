// import Image from "next/image";


export default function Profile({ userInfo }) {
    
    console.log('this',userInfo.photoUrl)
    return (
        <div className="flex ">
            <img src={userInfo.photoUrl} alt="no image " className="h-[50px] w-[50px] rounded-full"/>
       </div>
    )
}