import { useTheme } from '@/components/theme-provider'
import { UserButton } from '@daveyplate/better-auth-ui';
import { Link } from '@tanstack/react-router';
import { Moon, Sun , BookPlus } from 'lucide-react'


function ModeToggle() {
    const { theme, setTheme } = useTheme();

    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
    }

    return (
        <button onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Moon /> : <Sun />}
        </button>
    );
}

export default function Navbar() {

    return (
        <div className='flex flex-row h-12 shrink-0 px-6 md:px-8 items-center gap-4 bg-bg1 border border-b-black/50 '>
            <Link to="/app" className='text-2xl  font-irish-grover'>
                Everything Course
            </Link>
            <div className='ml-auto gap-4 flex items-center '>
                <Link to="/app/course/create" className='sm:flex gap-1 hidden '>
                    <BookPlus/>
                    Create Course
                </Link>
                <ModeToggle />
                <UserButton size="icon" 
                    additionalLinks={[{href : "/app/course/create" , label : "Create Course" , icon : <BookPlus/>}]} 
                />
            </div>
        </div>
    )

}