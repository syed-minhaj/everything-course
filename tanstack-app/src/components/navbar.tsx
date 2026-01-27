import { useTheme } from '@/components/theme-provider'
import { UserButton } from '@daveyplate/better-auth-ui';
import { Link } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react'


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
        <div className='flex flex-row h-12 shrink-0 px-8 items-center gap-4 bg-bg1 border border-b-black/50 '>
            <Link to="/app" className='text-2xl  font-irish-grover'>
                Everything Course
            </Link>
            <div className='ml-auto gap-4 flex items-center '>
                <ModeToggle />
                <UserButton size="icon" />
            </div>
        </div>
    )

}