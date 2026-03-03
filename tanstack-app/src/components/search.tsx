import { X } from "lucide-react"

export default function Search({search , handleSearchChange , deleteSeacrh} : 
    {search? : string , handleSearchChange : (value : string) => void , deleteSeacrh : () => void}) {

    return (
        <div className='border-2 px-3 py-2 mx-auto w-full flex flex-row focus-within:border-ring'>
            <input type="text" placeholder="Search courses..." value={search ?? ""} onChange={(e) => handleSearchChange(e.target.value)}
                className="flex-1 outline-none"
            />
            {search && 
                <button onClick={deleteSeacrh} >
                    <X className="font-bold" strokeWidth={3}/>
                </button>
            }
        </div>
    )
}